import { Resend } from "resend"

export interface ContactFormData {
  enquiryId: string
  name: string
  email?: string
  phone: string
  service: string
  message: string
  city?: string
  state?: string
  productType?: string
  isEmergency?: boolean
  attribution?: Record<string, string>
  recording?: { content: Buffer; filename: string; contentType: string }
}

export function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }
  return value.replace(/[&<>"']/g, (character) => entities[character])
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  data: ContactFormData,
  admin: boolean
) {
  const apiKey = process.env.RESEND_API_KEY
  // Resend's shared sender only reaches the account owner's inbox; set
  // EMAIL_FROM to a verified domain to also email customers.
  const from =
    process.env.EMAIL_FROM ||
    process.env.SMTP_FROM ||
    "Castle Elevator <onboarding@resend.dev>"
  if (!apiKey || !from || !to) return { success: false }
  try {
    // Request-time initialization permits builds without production credentials.
    const response = await new Resend(apiKey).emails.send(
      {
        from,
        to,
        subject,
        html,
        ...(admin && data.email ? { replyTo: data.email } : {}),
        ...(admin && data.recording ? { attachments: [data.recording] } : {}),
      },
      { idempotencyKey: data.enquiryId + (admin ? "/admin" : "/customer") }
    )
    // Provider rejections are returned in error without necessarily throwing.
    if (response.error || !response.data?.id) {
      console.error("Enquiry email rejected", {
        enquiryId: data.enquiryId,
        audience: admin ? "admin" : "customer",
      })
      return { success: false }
    }
    return { success: true }
  } catch {
    console.error("Enquiry email unavailable", {
      enquiryId: data.enquiryId,
      audience: admin ? "admin" : "customer",
    })
    return { success: false }
  }
}

export async function sendAdminNotification(data: ContactFormData) {
  const rows = {
    Reference: data.enquiryId,
    Name: data.name,
    Email: data.email || "Not supplied",
    Phone: data.phone,
    Service: data.service,
    City: data.city || "Not supplied",
    State: data.state || "Not supplied",
    Product: data.productType || "Not supplied",
    Priority: data.isEmergency ? "Urgent — call customer" : "Standard",
    ...data.attribution,
  }
  const table = Object.entries(rows)
    .map(
      ([key, value]) =>
        '<tr><th style="text-align:left;padding:8px">' +
        escapeHtml(key) +
        "</th><td>" +
        escapeHtml(value) +
        "</td></tr>"
    )
    .join("")
  const html =
    "<h1>New Castle Elevator enquiry</h1><table>" +
    table +
    '</table><h2>Customer message</h2><p style="white-space:pre-wrap">' +
    escapeHtml(data.message) +
    "</p>" +
    (data.recording ? "<p>Voice message attached to this email.</p>" : "")
  return sendEmail(
    process.env.ADMIN_EMAIL || "",
    "Castle Elevator " + data.enquiryId + (data.isEmergency ? " — URGENT" : ""),
    html,
    data,
    true
  )
}

export async function sendCustomerConfirmation(data: ContactFormData) {
  if (!data.email) return { success: false, skipped: true }
  const html =
    "<h1>Thank you, " +
    escapeHtml(data.name) +
    "</h1><p>Your enquiry has been sent to our team.</p><p>Reference: <strong>" +
    escapeHtml(data.enquiryId) +
    "</strong></p><p>Service: " +
    escapeHtml(data.service) +
    '</p><p>We will contact you to confirm your requirements and arrange a site survey where needed. A quotation must be agreed before chargeable work starts.</p><p>For urgent breakdown assistance, call <a href="tel:+918285266082">+91 8285266082</a>. This form does not dispatch an emergency technician.</p>'
  return sendEmail(
    data.email,
    "Castle Elevator enquiry " + data.enquiryId,
    html,
    data,
    false
  )
}
