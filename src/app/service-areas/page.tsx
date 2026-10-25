import { Metadata } from "next"
import { SITE } from "@/lib/site"
import { QuickQuoteForm } from "@/components/QuickQuoteForm"
import { WhatsAppLink } from "@/components/ContactLinks"

export const metadata: Metadata = {
  title:
    "Lift Installation & Service Areas — Delhi, Gurugram, Noida | Castle Elevator",
  description:
    "Castle Elevator installs and services home lifts and elevators in Delhi, Gurugram (Gurgaon) and Noida. Book a free site survey.",
  alternates: { canonical: `${SITE.url}/service-areas` },
}

const AREAS = [
  {
    city: "Delhi",
    localities: [
      "South Delhi",
      "West Delhi",
      "North Delhi",
      "East Delhi",
      "Dwarka",
      "Rohini",
      "Janakpuri",
      "Greater Kailash",
      "Vasant Kunj",
      "Pitampura",
    ],
    note: "Home lifts for independent houses and builder floors, passenger lifts for societies and commercial buildings, AMC and repair.",
  },
  {
    city: "Gurugram (Gurgaon)",
    localities: [
      "Golf Course Road",
      "Sohna Road",
      "DLF Phase 1–5",
      "Sushant Lok",
      "South City",
      "Palam Vihar",
      "New Gurugram sectors",
      "MG Road",
    ],
    note: "Villa and builder-floor home lifts, commercial passenger and goods lifts, hospital and car lifts.",
  },
  {
    city: "Noida",
    localities: [
      "Noida sectors",
      "Greater Noida",
      "Noida Extension",
      "Sector 18",
      "Sector 62",
      "Sector 137",
      "Sector 150",
    ],
    note: "Home and passenger lifts, goods lifts for offices and warehouses, AMC and modernization.",
  },
]

export default function ServiceAreas() {
  return (
    <div className="bg-paper">
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-copper">
              Service areas
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
              Lift installation &amp; service across Delhi NCR
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              We currently serve {SITE.cities.join(", ")}. Share your locality
              and we&apos;ll confirm survey timing.
            </p>
            <div className="mt-8 grid gap-4">
              {AREAS.map((area) => (
                <div
                  key={area.city}
                  className="rounded-3xl border border-line bg-paper p-6"
                >
                  <h2 className="text-2xl font-semibold">{area.city}</h2>
                  <p className="mt-2 text-muted">{area.note}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {area.localities.map((l) => (
                      <span
                        key={l}
                        className="rounded-full bg-ivory px-3 py-1 text-xs font-medium"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <WhatsAppLink
                    source={`areas_${area.city.split(" ")[0].toLowerCase()}`}
                    text={`Hi Castle Elevator, I need a lift in ${area.city}. Please arrange a free site survey.`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-whatsapp"
                  >
                    WhatsApp for a survey in {area.city.split(" ")[0]} →
                  </WhatsAppLink>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start" id="quote">
            <QuickQuoteForm
              source="service_areas"
              title="Check coverage & get a quote"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
