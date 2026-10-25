// Pushes conversion events to Google Tag Manager / GA4 / Meta when present.
type DataLayerWindow = Window & {
  dataLayer?: Record<string, unknown>[]
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}

export type LeadEvent =
  | "click_call"
  | "click_whatsapp"
  | "generate_lead"
  | "lead_failed"

export function track(event: LeadEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return
  const w = window as DataLayerWindow
  w.dataLayer?.push({ event, ...params })
  w.gtag?.("event", event, params)
  if (event === "generate_lead") w.fbq?.("track", "Lead", params)
  if (event === "click_whatsapp" || event === "click_call")
    w.fbq?.("track", "Contact", params)
}
