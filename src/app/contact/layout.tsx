import { Metadata } from "next"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact Castle Elevator — Free Lift Site Survey in Delhi NCR",
  description:
    "Call, WhatsApp or send an enquiry for home lifts, elevators, AMC and repair in Delhi, Gurugram and Noida.",
  alternates: { canonical: `${SITE.url}/contact` },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
