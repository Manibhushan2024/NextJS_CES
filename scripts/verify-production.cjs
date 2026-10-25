/* eslint-disable @typescript-eslint/no-require-imports -- Direct Node HTTP smoke test. */
const assert = require("node:assert/strict")
const products = require("../src/lib/products.json")
const root = "http://127.0.0.1:3109"

async function run() {
  const contact = await fetch(root + "/contact")
  const html = await contact.text()
  assert.equal(contact.status, 200)
  for (const text of [
    "Kitchen lift / dumbwaiter",
    "City / locality",
    "consent",
    "not monitored for emergencies",
    "wa.me/",
  ])
    assert.ok(html.includes(text), text)
  const sitemap = await (await fetch(root + "/sitemap.xml")).text()
  for (const product of products)
    assert.ok(sitemap.includes("/products/" + product.slug))
  assert.equal((await fetch(root + "/api/operations")).status, 410)
  const invalid = await fetch(root + "/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  })
  assert.equal(invalid.status, 400)
  assert.equal(
    (await fetch(root + "/products/" + products[0].slug)).status,
    200
  )
  const blog = await fetch(root + "/blog")
  assert.equal(blog.status, 200)
  assert.ok((await blog.text()).includes("Search Articles"))
  console.log(
    "PASS: production contact fields, dynamic product, product sitemap, blog, retired operations and invalid enquiry. No emails sent."
  )
}
run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
