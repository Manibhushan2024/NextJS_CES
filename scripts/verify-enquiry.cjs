// Isolated request tests: Resend is mocked; no real email or customer data is sent.
/* eslint-disable @typescript-eslint/no-require-imports -- This isolated harness runs directly in Node CommonJS. */
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")
const { NextRequest } = require("next/server")

process.env.RESEND_API_KEY = "test-key"
process.env.EMAIL_FROM = "Test <test@example.com>"
process.env.ADMIN_EMAIL = "admin@example.com"
process.env.RATE_LIMIT_REQUESTS = "5"
process.env.RATE_LIMIT_WINDOW_MS = "3600000"
let deliveries = []
let replies = []
let count = 0
const cache = new Map()
function load(file) {
  const filename = path.resolve(file)
  if (cache.has(filename)) return cache.get(filename).exports
  const compiled = { exports: {} }
  cache.set(filename, compiled)
  const javascript = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText
  const localRequire = (name) => {
    if (name === "resend")
      return {
        Resend: class {
          emails = {
            send: async (message, options) => {
              deliveries.push({ message, options })
              return replies.length
                ? replies.shift()
                : { data: { id: "mock-message" }, error: null }
            },
          }
        },
      }
    if (name.startsWith("."))
      return load(path.resolve(path.dirname(filename), name + ".ts"))
    return require(name)
  }
  new Function("require", "module", "exports", javascript)(
    localRequire,
    compiled,
    compiled.exports
  )
  return compiled.exports
}
const { handleEnquiry } = load("src/lib/enquiry-handler.ts")
const { GET: operationsGet, POST: operationsPost } = load(
  "src/app/api/operations/route.ts"
)
const valid = {
  name: "Test Customer",
  email: "customer@example.com",
  phone: "+91 98765 43210",
  service: "installation",
  city: "Gurugram",
  productType: "home-lift",
  message: "Please arrange a survey for a home lift.",
  consent: true,
}
function request(body, options = {}) {
  const headers = {
    "content-type": "application/json",
    "x-forwarded-for": String(++count),
    ...options.headers,
  }
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers,
  })
}
async function run() {
  let response = await handleEnquiry(request(valid))
  let result = await response.json()
  assert.equal(response.status, 201)
  assert.equal(result.confirmationSent, true)
  assert.match(result.enquiryId, /^ENQ-/)
  assert.equal(deliveries.length, 2)
  assert.match(deliveries[0].message.html, /Gurugram/)
  assert.match(deliveries[0].message.html, /home-lift/)

  deliveries = []
  response = await handleEnquiry(
    request({
      ...valid,
      name: "<img src=x onerror=alert(1)>",
      recordingUrl: "data:audio/webm;codecs=opus;base64,dGVzdA==",
      attribution: { utm_source: "google" },
    })
  )
  assert.equal(response.status, 201)
  assert.match(deliveries[0].message.html, /&lt;img/)
  assert.doesNotMatch(deliveries[0].message.html, /<img/)
  assert.equal(deliveries[0].message.attachments[0].content.toString(), "test")
  assert.equal(
    deliveries[0].message.attachments[0].filename,
    "voice-message.webm"
  )
  assert.equal(deliveries[1].message.attachments, undefined)
  assert.match(deliveries[0].message.html, /google/)

  for (const body of [
    { ...valid, consent: false },
    { ...valid, phone: "123" },
    { ...valid, email: "bad" },
    { ...valid, recordingUrl: "javascript:alert(1)" },
    { ...valid, recordingUrl: "data:audio/webm;base64,a" },
    [],
    null,
    "{",
  ]) {
    response = await handleEnquiry(request(body))
    assert.equal(response.status, 400)
  }
  response = await handleEnquiry(
    request(valid, { headers: { "content-type": "text/plain" } })
  )
  assert.equal(response.status, 415)
  response = await handleEnquiry(
    request(valid, { headers: { "content-length": String(9 * 1024 * 1024) } })
  )
  assert.equal(response.status, 413)
  deliveries = []
  response = await handleEnquiry(request({ ...valid, honeypot: "spam" }))
  assert.equal(response.status, 201)
  assert.equal(deliveries.length, 0)

  replies = [{ data: null, error: { message: "mock rejection" } }]
  response = await handleEnquiry(request(valid))
  assert.equal(response.status, 503)
  assert.equal(deliveries.length, 1)
  replies = [
    { data: { id: "accepted" }, error: null },
    { data: null, error: { message: "mock rejection" } },
  ]
  response = await handleEnquiry(request(valid))
  result = await response.json()
  assert.equal(response.status, 201)
  assert.equal(result.confirmationSent, false)
  assert.match(result.message, /confirmation email could not be sent/)

  const form = new FormData()
  for (const [key, value] of Object.entries({
    ...valid,
    serviceType: "emergency",
  }))
    form.set(key, String(value))
  form.set("voice", new File(["audio"], "recording.M4A", { type: "audio/mp4" }))
  response = await handleEnquiry(
    new NextRequest("http://localhost/api/enquiry", {
      method: "POST",
      body: form,
      headers: { "x-forwarded-for": String(++count) },
    })
  )
  assert.equal(response.status, 201)
  assert.match(deliveries.at(-2).message.subject, /URGENT/)
  assert.equal(
    deliveries.at(-2).message.attachments[0].filename,
    "voice-message.m4a"
  )

  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await handleEnquiry(
          request(
            { ...valid, honeypot: "spam" },
            { headers: { "x-forwarded-for": "rate-limit-test" } }
          )
        )
      ).status,
      201
    )
  response = await handleEnquiry(
    request(valid, { headers: { "x-forwarded-for": "rate-limit-test" } })
  )
  assert.equal(response.status, 429)
  assert.ok(Number(response.headers.get("retry-after")) > 0)
  assert.equal((await operationsGet()).status, 410)
  assert.equal((await operationsPost()).status, 410)
  console.log(
    "PASS: enquiry validation, consent, HTML escaping, voice attachments, provider failures, receipt semantics, multipart input, request limits, rate limits and retired operations."
  )
}
run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
