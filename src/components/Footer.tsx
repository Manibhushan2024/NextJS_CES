import Link from "next/link"
import { SITE } from "@/lib/site"
import { CallLink, WhatsAppLink } from "./ContactLinks"

const LIFTS = [
  ["Home lifts", "/products/home-elevators"],
  ["Passenger lifts", "/products/passenger-elevators"],
  ["Goods / freight lifts", "/products/freight-elevators"],
  ["Hospital / bed lifts", "/products/hospital-elevators"],
  ["Hydraulic lifts", "/products/hydraulic-elevators"],
  ["Automatic car lifts", "/products/car-lifts"],
  ["Kitchen lifts", "/products/kitchen-lifts"],
  ["Dumbwaiters & service lifts", "/products/dumbwaiters"],
  ["Escalators", "/products/escalators"],
]

const COMPANY = [
  ["Installation", "/services/installation"],
  ["AMC", "/services/amc"],
  ["CMC", "/services/cmc"],
  ["Repair & maintenance", "/services/maintenance"],
  ["Modernization", "/services/modernization"],
  ["Service areas", "/service-areas"],
  ["About", "/about"],
  ["Guides", "/blog"],
  ["Contact", "/contact"],
]

export function Footer() {
  return (
    <footer className="bg-[#101318] pb-24 text-[#e9e6e0] md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-semibold">
            Castle<span className="text-[#dd8d58]">Elevator</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/60">
            Lift installation, AMC, repair and modernization for homes and
            buildings in {SITE.cities.join(", ")}.
          </p>
          <div className="mt-6 grid max-w-xs gap-2.5">
            <WhatsAppLink
              source="footer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#1a9e4f] py-3 font-semibold text-white"
            />
            <CallLink
              source="footer"
              className="flex items-center justify-center gap-2 rounded-full border border-white/25 py-3 font-semibold"
            />
          </div>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-4 inline-block text-sm text-white/60 hover:text-white"
          >
            {SITE.email}
          </a>
        </div>
        <div>
          <p className="font-semibold">Lifts</p>
          <ul className="mt-4 grid gap-2 text-sm text-white/60">
            {LIFTS.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Services &amp; company</p>
          <ul className="mt-4 grid gap-2 text-sm text-white/60">
            {COMPANY.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-5 text-xs text-white/50">
          <p>
            &copy; {new Date().getFullYear()} Castle Elevator. All rights
            reserved.
          </p>
          <p>
            Specifications are indicative ranges; final details are confirmed in
            your written quotation.
          </p>
        </div>
      </div>
    </footer>
  )
}
