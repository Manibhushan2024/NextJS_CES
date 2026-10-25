// Single source for public contact details and click-to-chat links.
export const SITE = {
  name: "Castle Elevator",
  url: "https://www.castelelevator.com",
  phone: "+918285266082",
  phoneDisplay: "+91 82852 66082",
  // Confirm this number is registered on WhatsApp Business before campaigns.
  whatsapp: "918285266082",
  email: "support@castelelevator.com",
  cities: ["Delhi", "Gurugram (Gurgaon)", "Noida"],
} as const

export function whatsappLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
}

export const DEFAULT_WHATSAPP_TEXT =
  "Hi Castle Elevator, I'd like a free site survey and quotation for a lift."

export const LEAD_NEEDS = [
  { value: "home-lift", label: "Home lift" },
  { value: "passenger-elevator", label: "Passenger lift (apartment / office)" },
  { value: "freight-elevator", label: "Goods / freight lift" },
  { value: "hospital-elevator", label: "Hospital / bed lift" },
  { value: "hydraulic-elevator", label: "Hydraulic lift" },
  { value: "car-lift", label: "Car lift" },
  { value: "kitchen-lift", label: "Kitchen lift / dumbwaiter" },
  { value: "escalator", label: "Escalator" },
  { value: "service", label: "Repair / AMC for existing lift" },
  { value: "other", label: "Not sure — need advice" },
] as const

export type LeadNeed = (typeof LEAD_NEEDS)[number]["value"]
