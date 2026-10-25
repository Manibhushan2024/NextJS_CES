"use client"

import { useState } from "react"
import { VoiceRecorder } from "@/components/VoiceRecorder"
import { CallLink, WhatsAppLink } from "@/components/ContactLinks"
import { readAttribution } from "@/components/Attribution"
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons"
import { LEAD_NEEDS, SITE, whatsappLink } from "@/lib/site"
import { track } from "@/lib/track"

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  service: "installation",
  message: "",
  city: "",
  productType: "home-lift",
  honeypot: "",
  consent: false,
}

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [recordingKey, setRecordingKey] = useState(0)
  const [receipt, setReceipt] = useState<string | null>(null)
  const [formData, setFormData] = useState(EMPTY)

  const needLabel =
    LEAD_NEEDS.find((n) => n.value === formData.productType)?.label ?? ""
  const waSummary =
    `Hi Castle Elevator, I'm ${formData.name || "interested"}. Requirement: ${needLabel} (${formData.service}).` +
    (formData.city ? ` Location: ${formData.city}.` : "") +
    (formData.message ? ` Details: ${formData.message}` : "")

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    const nextValue =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : value
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setReceipt(null)
    setError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          message:
            formData.message.trim().length >= 10
              ? formData.message
              : `Enquiry for ${needLabel} (${formData.service}). ${formData.message}`.trim(),
          recordingUrl,
          attribution: readAttribution(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok)
        throw new Error(data.error || "Failed to submit enquiry")

      track("generate_lead", {
        source: "contact_page",
        need: formData.productType,
      })
      setReceipt(data.message)
      setFormData(EMPTY)
      setRecordingUrl(null)
      setRecordingKey((value) => value + 1)
    } catch (err) {
      track("lead_failed", { source: "contact_page" })
      const message = err instanceof Error ? err.message : ""
      setError(
        message.includes("mobile")
          ? "Please enter a valid 10-digit Indian mobile number."
          : message.includes("email")
            ? "Please check your email address, or leave it blank."
            : "We couldn't send the form right now. Use the WhatsApp button below — your details are already filled in."
      )
    } finally {
      setLoading(false)
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink placeholder:text-muted/70 focus:border-copper focus:outline-none"

  return (
    <div className="bg-paper">
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-copper">
            Contact
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            Book a free site survey
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            The fastest way to reach us is WhatsApp or a call. Or send the form
            and an engineer will call you back.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <WhatsAppLink
              source="contact_card"
              className="flex items-center gap-3 rounded-2xl bg-whatsapp p-5 text-white"
            >
              <WhatsAppIcon className="h-8 w-8" />
              <span>
                <span className="block font-semibold">WhatsApp</span>
                <span className="text-sm opacity-90">
                  Send photos of your site
                </span>
              </span>
            </WhatsAppLink>
            <CallLink
              source="contact_card"
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-5"
            >
              <PhoneIcon className="h-8 w-8 text-copper" />
              <span>
                <span className="block font-semibold">{SITE.phoneDisplay}</span>
                <span className="text-sm text-muted">
                  Call for sales or breakdowns
                </span>
              </span>
            </CallLink>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-5"
            >
              <span className="text-3xl" aria-hidden="true">
                ✉
              </span>
              <span>
                <span className="block font-semibold">Email</span>
                <span className="text-sm text-muted">{SITE.email}</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" id="quote">
        <div className="mx-auto max-w-2xl scroll-mt-24 px-4">
          {receipt ? (
            <div
              className="rounded-3xl border border-line p-8 text-center"
              role="status"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp">
                <CheckIcon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Enquiry received</h2>
              <p className="mt-2 text-muted">{receipt}</p>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="mt-6 font-semibold text-copper"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-line p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-2xl font-semibold">
                Tell us about your project
              </h2>
              <p className="mt-1 text-sm text-muted">
                Lift stuck or urgent breakdown? Please{" "}
                <a className="underline" href={`tel:${SITE.phone}`}>
                  call {SITE.phoneDisplay}
                </a>{" "}
                instead — forms are not monitored for emergencies.
              </p>

              <div hidden aria-hidden="true">
                <label htmlFor="contact-website">Leave this blank</label>
                <input
                  id="contact-website"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium">
                  Lift type *
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className={field}
                  >
                    {LEAD_NEEDS.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Service *
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className={field}
                  >
                    <option value="installation">New installation</option>
                    <option value="maintenance">AMC / maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="modernization">Modernization</option>
                    <option value="inspection">Inspection</option>
                    <option value="consultation">Need advice</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Full name *
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    className={field}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Mobile number *
                  <input
                    type="tel"
                    inputMode="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    minLength={10}
                    maxLength={16}
                    autoComplete="tel"
                    placeholder="98xxx xxxxx"
                    className={field}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  City / locality *
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="e.g. Sector 57, Gurugram"
                    className={field}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Email (optional)
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={field}
                  />
                </label>
              </div>

              <label className="mt-4 grid gap-1.5 text-sm font-medium">
                Project details
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={5000}
                  placeholder="Floors, building type, shaft available or not, timeline…"
                  className={`${field} resize-none`}
                />
              </label>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">
                  Or record a voice note (optional)
                </p>
                <VoiceRecorder
                  key={recordingKey}
                  onRecordingComplete={setRecordingUrl}
                />
              </div>

              <label className="mt-5 flex items-start gap-3 text-sm text-muted">
                <input
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4"
                />
                I agree to be contacted by Castle Elevator by phone, WhatsApp or
                email about this enquiry.
              </label>

              {error && (
                <p
                  className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-full bg-copper py-4 font-semibold text-white hover:bg-copper-strong disabled:opacity-60"
              >
                {loading ? "Sending…" : "Request my free site survey"}
              </button>
              <a
                href={whatsappLink(waSummary)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("click_whatsapp", { source: "contact_form" })
                }
                className="mt-3 flex items-center justify-center gap-2 rounded-full border border-line py-3.5 text-sm font-semibold hover:border-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5 text-whatsapp" /> Send these
                details on WhatsApp instead
              </a>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
