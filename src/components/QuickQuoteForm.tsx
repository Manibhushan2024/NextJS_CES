"use client"

import { useId, useState } from "react"
import { LEAD_NEEDS, LeadNeed, SITE, whatsappLink } from "@/lib/site"
import { track } from "@/lib/track"
import { readAttribution } from "./Attribution"
import { CheckIcon, WhatsAppIcon } from "./icons"

type Props = {
  source: string
  defaultNeed?: LeadNeed
  title?: string
  subtitle?: string
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; reference: string }
  | { kind: "failed"; message: string }

const CITIES = ["Delhi", "Gurugram", "Noida", "Other NCR"]

export function QuickQuoteForm({
  source,
  defaultNeed = "home-lift",
  title = "Get a free site survey & quote",
  subtitle = "Share 4 details. Our engineer calls you back to understand your site.",
}: Props) {
  const id = useId()
  const [form, setForm] = useState({
    need: defaultNeed as string,
    city: "Delhi",
    locality: "",
    floors: "",
    name: "",
    phone: "",
    consent: false,
    honeypot: "",
  })
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  const needLabel =
    LEAD_NEEDS.find((n) => n.value === form.need)?.label ?? form.need
  const summary =
    `Hi Castle Elevator, I'm ${form.name || "interested"}. ` +
    `Requirement: ${needLabel}. Location: ${[form.locality, form.city].filter(Boolean).join(", ")}.` +
    (form.floors ? ` Floors: ${form.floors}.` : "") +
    (form.phone ? ` Phone: ${form.phone}.` : "")

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const next =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : value
    setForm((prev) => ({ ...prev, [name]: next }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status.kind === "sending") return
    setStatus({ kind: "sending" })
    const isService = form.need === "service"
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          serviceType: isService ? "repair" : "installation",
          productType: form.need,
          city: form.locality ? `${form.locality}, ${form.city}` : form.city,
          message:
            `Quick quote request (${source}). Requirement: ${needLabel}.` +
            (form.floors ? ` Floors/stops: ${form.floors}.` : ""),
          consent: form.consent,
          honeypot: form.honeypot,
          attribution: readAttribution(),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "Could not send")
      track("generate_lead", { source, need: form.need, city: form.city })
      setStatus({ kind: "sent", reference: data.enquiryId || "" })
    } catch (err) {
      track("lead_failed", { source })
      setStatus({
        kind: "failed",
        message:
          err instanceof Error && err.message.includes("mobile")
            ? "Please enter a valid 10-digit Indian mobile number."
            : "We couldn't send the form right now. Tap WhatsApp below and your details will be sent instantly.",
      })
    }
  }

  if (status.kind === "sent") {
    return (
      <div
        className="rounded-3xl border border-line bg-paper p-6 shadow-xl sm:p-8"
        role="status"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp">
          <CheckIcon className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-semibold">
          Thank you, {form.name.split(" ")[0]}!
        </h3>
        <p className="mt-2 text-muted">
          Your request has reached our team. We&apos;ll call you on {form.phone}{" "}
          to understand your site and fix a survey time.
        </p>
        {status.reference && (
          <p className="mt-3 text-sm text-muted">
            Reference: {status.reference}
          </p>
        )}
        <a
          href={whatsappLink(
            summary + (status.reference ? ` Ref: ${status.reference}` : "")
          )}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track("click_whatsapp", { source: source + "_success" })
          }
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-whatsapp py-3.5 font-semibold text-white"
        >
          <WhatsAppIcon /> Share site photos on WhatsApp
        </a>
      </div>
    )
  }

  const field =
    "w-full rounded-xl border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:border-copper focus:outline-none"

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-line bg-paper p-6 shadow-xl sm:p-8"
    >
      <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

      <div hidden aria-hidden="true">
        <label htmlFor={`${id}-hp`}>Leave this blank</label>
        <input
          id={`${id}-hp`}
          name="honeypot"
          value={form.honeypot}
          onChange={update}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-1.5 text-sm font-medium">
          What do you need?
          <select
            name="need"
            value={form.need}
            onChange={update}
            className={field}
          >
            {LEAD_NEEDS.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5 text-sm font-medium">
            City
            <select
              name="city"
              value={form.city}
              onChange={update}
              className={field}
            >
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Floors / stops
            <input
              name="floors"
              value={form.floors}
              onChange={update}
              placeholder="e.g. G+3"
              maxLength={20}
              className={field}
            />
          </label>
        </div>
        <label className="grid gap-1.5 text-sm font-medium">
          Area / sector
          <input
            name="locality"
            value={form.locality}
            onChange={update}
            placeholder="e.g. Sector 57, South Delhi"
            maxLength={60}
            className={field}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Your name
            <input
              name="name"
              value={form.name}
              onChange={update}
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              placeholder="Full name"
              className={field}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Mobile number
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={update}
              required
              minLength={10}
              maxLength={16}
              autoComplete="tel"
              placeholder="98xxx xxxxx"
              className={field}
            />
          </label>
        </div>
        <label className="flex items-start gap-2.5 text-xs text-muted">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={update}
            required
            className="mt-0.5 h-4 w-4 accent-[var(--copper)]"
          />
          I agree to be contacted by Castle Elevator by phone, WhatsApp or email
          about this enquiry.
        </label>
      </div>

      {status.kind === "failed" && (
        <p
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="mt-5 w-full rounded-full bg-copper py-4 text-base font-semibold text-white hover:bg-copper-strong disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Get my free quote"}
      </button>

      <a
        href={whatsappLink(summary)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("click_whatsapp", { source: source + "_form" })}
        className={`mt-3 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold ${
          status.kind === "failed"
            ? "bg-whatsapp text-white"
            : "border border-line hover:border-whatsapp"
        }`}
      >
        <WhatsAppIcon
          className={`h-5 w-5 ${status.kind === "failed" ? "" : "text-whatsapp"}`}
        />
        <span className={status.kind === "failed" ? "text-white" : ""}>
          Prefer WhatsApp? Send these details
        </span>
      </a>
      <p className="mt-3 text-center text-xs text-muted">
        No spam. Or call{" "}
        <a className="underline" href={`tel:${SITE.phone}`}>
          {SITE.phoneDisplay}
        </a>
      </p>
    </form>
  )
}
