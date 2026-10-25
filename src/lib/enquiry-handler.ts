import { randomUUID } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  ContactFormData,
  sendAdminNotification,
  sendCustomerConfirmation,
} from "./email-service"
import { checkRateLimit, getRateLimitInfo } from "./rate-limit"
import { EnquirySchema, MAX_VOICE_BYTES, VoiceFileSchema } from "./validation"

const MAX_REQUEST_BYTES = 8 * 1024 * 1024
class RequestError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}
async function readBody(request: NextRequest) {
  if (Number(request.headers.get("content-length")) > MAX_REQUEST_BYTES)
    throw new RequestError("Request is too large", 413)
  if (!request.body) throw new RequestError("Request body is required", 400)
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_REQUEST_BYTES) {
        await reader.cancel()
        throw new RequestError("Request is too large", 413)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks)
}

export function decodeRecording(value: unknown): ContactFormData["recording"] {
  if (value === undefined || value === null || value === "") return undefined
  if (typeof value !== "string")
    throw new RequestError("Invalid voice message", 400)
  const match =
    /^data:(audio\/[\w.+-]+)(?:;codecs=[\w.-]+)?;base64,([A-Za-z0-9+/]+={0,2})$/.exec(
      value
    )
  if (!match) throw new RequestError("Invalid voice message", 400)
  const content = Buffer.from(match[2], "base64")
  if (content.toString("base64") !== match[2])
    throw new RequestError("Invalid voice message encoding", 400)
  const extensions: Record<string, string> = {
    "audio/webm": "webm",
    "audio/mp4": "m4a",
    "audio/x-m4a": "m4a",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
  }
  const filename = "voice-message." + (extensions[match[1]] || "invalid")
  VoiceFileSchema.parse({
    name: filename,
    size: content.length,
    type: match[1],
  })
  return { content, filename, contentType: match[1] }
}

export async function handleEnquiry(request: NextRequest) {
  try {
    // Trust this only behind a proxy that overwrites client-supplied IP headers.
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
    if (!checkRateLimit(ip)) {
      const retryAfter = Math.max(
        1,
        Math.ceil((getRateLimitInfo(ip).resetTime - Date.now()) / 1000)
      )
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please call us or try again later.",
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      )
    }
    const contentType = request.headers.get("content-type") || ""
    if (
      !contentType.includes("application/json") &&
      !contentType.includes("multipart/form-data")
    )
      throw new RequestError("Use JSON or multipart form data", 415)
    const body = await readBody(request)
    let raw: unknown
    let recording: ContactFormData["recording"]
    if (contentType.includes("application/json")) {
      raw = JSON.parse(body.toString("utf8"))
    } else {
      const form = await new Response(body, {
        headers: { "content-type": contentType },
      }).formData()
      const fields: Record<string, unknown> = {}
      for (const [key, value] of form) {
        if (typeof value === "string") fields[key] = value
        else {
          if (recording || value.size > MAX_VOICE_BYTES)
            throw new RequestError(
              "Upload one voice message of at most 5MB",
              400
            )
          const type = value.type.split(";")[0]
          VoiceFileSchema.parse({ name: value.name, size: value.size, type })
          recording = {
            content: Buffer.from(await value.arrayBuffer()),
            filename:
              "voice-message." + value.name.split(".").pop()!.toLowerCase(),
            contentType: type,
          }
        }
      }
      raw = fields
    }
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw new RequestError("Invalid enquiry", 400)
    const fields = raw as Record<string, unknown>
    const enquiryId = "ENQ-" + randomUUID()
    if (typeof fields.honeypot === "string" && fields.honeypot.trim())
      return NextResponse.json({ success: true, enquiryId }, { status: 201 })
    const validated = EnquirySchema.parse({
      ...fields,
      serviceType: fields.serviceType ?? fields.service,
      consent: fields.consent === true || fields.consent === "true",
      isEmergency:
        fields.isEmergency === true ||
        fields.isEmergency === "true" ||
        fields.serviceType === "emergency" ||
        fields.service === "emergency",
    })
    recording ||= decodeRecording(fields.recordingUrl)
    const data: ContactFormData = {
      ...validated,
      service: validated.serviceType,
      enquiryId,
      recording,
    }
    // Until CRM persistence exists, the admin email is the intake record.
    const admin = await sendAdminNotification(data)
    if (!admin.success)
      throw new RequestError(
        "We could not send your enquiry to our team. Please call +91 8285266082 or try again later.",
        503
      )
    const customer = await sendCustomerConfirmation(data)
    return NextResponse.json(
      {
        success: true,
        enquiryId,
        confirmationSent: customer.success,
        message:
          "Your enquiry has been sent to our team. Reference: " +
          enquiryId +
          "." +
          (customer.success || !data.email
            ? ""
            : " Your confirmation email could not be sent; please keep this reference."),
      },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        {
          success: false,
          error: error.issues
            .map((issue) => issue.path.join(".") + ": " + issue.message)
            .join("; "),
        },
        { status: 400 }
      )
    if (error instanceof RequestError)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      )
    if (error instanceof SyntaxError || error instanceof TypeError)
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      )
    console.error("Enquiry request failed")
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process your enquiry. Please call +91 8285266082.",
      },
      { status: 500 }
    )
  }
}
