import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/content"
import { SITE } from "@/lib/site"
import { QuickQuoteForm } from "@/components/QuickQuoteForm"
import { CallLink, WhatsAppLink } from "@/components/ContactLinks"
import { ArrowIcon, CheckIcon } from "@/components/icons"

const STEPS = [
  {
    title: "Tell us your need",
    text: "Call, WhatsApp or fill the 30-second form. Share photos of the space if you have them.",
  },
  {
    title: "Free site survey",
    text: "An engineer measures the shaft or space, pit, headroom, power supply and access.",
  },
  {
    title: "Written quotation",
    text: "You get the recommended lift, cabin options, timeline and price in writing — before any work starts.",
  },
  {
    title: "Installation & handover",
    text: "Installation, load and safety testing, then a walkthrough of how to use and care for your lift.",
  },
  {
    title: "AMC & breakdown support",
    text: "Scheduled maintenance visits and a direct line for breakdowns keep your lift running.",
  },
]

const FAQS = [
  {
    q: "How much does a lift cost in Delhi NCR?",
    a: "Price depends on lift type, capacity, number of floors, drive type, doors and cabin finish. A compact home lift costs far less than a 13-person passenger lift. We give an exact written quotation after a free site survey, so you only pay for what your building needs.",
  },
  {
    q: "Can you install a lift in my existing house?",
    a: "In most homes, yes. We check stairwell voids, courtyards or an external glass/steel structure, along with pit depth, headroom and power supply, and recommend a lift that fits.",
  },
  {
    q: "How long does installation take?",
    a: "Once the shaft or structure is ready and equipment is delivered, a home lift typically takes a few weeks to install and test. Your quotation includes a timeline for your specific site.",
  },
  {
    q: "Do you service lifts installed by other companies?",
    a: "Yes, we take up repair, AMC and modernization for many existing lifts after an inspection confirms the equipment and spare-parts availability.",
  },
  {
    q: "Which areas do you cover?",
    a: "Delhi, Gurugram (Gurgaon) and Noida. Share your locality and we'll confirm coverage and survey timing.",
  },
  {
    q: "What safety features do your lifts include?",
    a: "Typical configurations include an automatic rescue device for power cuts, overload sensors, door safety curtains or interlocks, emergency alarm and intercom. Exact features depend on the model and are listed in your quotation.",
  },
]

export default function Home() {
  const products = getProducts()

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <div className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#17130f]">
        <Image
          src="/images/editorial/home-lift-hero.webp"
          alt="Glass and bronze home lift beside a staircase in a modern Indian home"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17130f]/95 via-[#17130f]/70 to-[#17130f]/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
              Serving {SITE.cities.join(" · ")}
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Home lifts &amp; elevators, installed right and kept running.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Home, passenger, goods, hospital, hydraulic, car and kitchen
              lifts. Free site survey, written quotation, installation and AMC
              from one local team.
            </p>
            <ul className="mt-6 grid max-w-xl gap-2.5 text-white/90 sm:grid-cols-2">
              {[
                "Free site survey by an engineer",
                "Clear written quotation, no surprises",
                "Lifts for G+1 up to high-rise",
                "AMC, repair & modernization",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 shrink-0 text-[#e9a272]" />{" "}
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppLink
                source="hero"
                className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-white hover:brightness-110"
              />
              <CallLink
                source="hero"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 font-semibold text-white hover:bg-white/10"
              />
            </div>
          </div>
          <div id="quote" className="scroll-mt-24">
            <QuickQuoteForm source="home_hero" />
          </div>
        </div>
      </section>

      {/* Quick facts strip */}
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-6 text-center md:grid-cols-4">
          {[
            ["9 lift types", "Home to 5-ton goods"],
            ["Up to 4 m/s", "Passenger lift speeds"],
            ["3 cities", "Delhi · Gurugram · Noida"],
            ["Free", "Site survey & quote"],
          ].map(([big, small]) => (
            <div key={big} className="px-2 py-2">
              <p className="text-2xl font-semibold text-copper md:text-3xl">
                {big}
              </p>
              <p className="text-sm text-muted">{small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-copper">
                Choose your lift
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                A lift for every building
              </h2>
              <p className="mt-3 max-w-2xl text-muted">
                Capacities and speeds below are the ranges we supply. Your
                engineer confirms the right size after the survey.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 font-semibold text-copper hover:gap-2.5"
            >
              Compare all lifts <ArrowIcon />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group overflow-hidden rounded-3xl border border-line bg-paper transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory">
                  <Image
                    src={p.imagePath}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {p.category && (
                    <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-ink">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                    {p.shortDesc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.keySpecs?.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-ivory px-2.5 py-1 text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-copper">
                    Specs &amp; quote <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Home lift feature */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/editorial/home-lift-detail.webp"
              alt="Bronze-finish home lift entrance with stone wall cladding"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-copper">
              Home lifts
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Every floor of your home, easy for every generation
            </h2>
            <p className="mt-4 text-muted">
              Designed for independent houses, builder floors, villas and
              duplexes. Fits a new shaft, an existing stairwell void or a glass
              structure outside the house.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              {[
                ["Capacity", "250–1,000 kg"],
                ["Speed", "Up to 1.5 m/s"],
                ["Stops", "Up to 5 (G+4)"],
                ["Power cut", "Auto rescue to nearest floor"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-2xl border border-line bg-paper p-4"
                >
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    {k}
                  </dt>
                  <dd className="mt-1 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products/home-elevators"
                className="rounded-full bg-ink px-6 py-3.5 font-semibold text-paper hover:opacity-90"
              >
                Explore home lifts
              </Link>
              <WhatsAppLink
                source="home_lift_section"
                text="Hi Castle Elevator, I want a home lift. Can you arrange a free site survey?"
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold hover:border-whatsapp"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-copper">
            How it works
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            From first call to a running lift — in five clear steps
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-3xl border border-line p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-copper text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Service for existing lifts */}
      <section className="bg-ink py-16 text-paper md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-copper">
              Already have a lift?
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Repair, AMC and modernization
            </h2>
            <p className="mt-4 opacity-75">
              Frequent breakdowns, jerky rides or old controllers? We inspect,
              repair and maintain lifts, and upgrade old ones with new
              controllers, doors, cabins and rescue devices.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["AMC", "/services/amc", "Scheduled preventive maintenance"],
                ["CMC", "/services/cmc", "Comprehensive cover incl. parts"],
                [
                  "Repair",
                  "/services/maintenance",
                  "Breakdown visits & fault fixing",
                ],
                [
                  "Modernization",
                  "/services/modernization",
                  "Upgrade old lifts",
                ],
              ].map(([t, href, d]) => (
                <Link
                  key={t}
                  href={href}
                  className="rounded-2xl border border-white/15 p-4 hover:border-copper"
                >
                  <p className="font-semibold">{t}</p>
                  <p className="text-sm opacity-70">{d}</p>
                </Link>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <CallLink
                source="service_section"
                className="inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3.5 font-semibold text-white"
              >
                Lift stuck or down? Call now
              </CallLink>
              <WhatsAppLink
                source="service_section"
                text="Hi Castle Elevator, I need service / AMC for an existing lift."
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-semibold"
              />
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/editorial/lift-service.webp"
              alt="Lift technician inspecting a passenger lift in a residential lobby"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-copper">
            Service areas
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Local teams across Delhi NCR
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [
                "Delhi",
                "South, West, North & East Delhi, Dwarka, Rohini and nearby",
              ],
              [
                "Gurugram (Gurgaon)",
                "Golf Course Road, Sohna Road, DLF phases, New Gurugram sectors",
              ],
              ["Noida", "Noida sectors, Greater Noida and Noida Extension"],
            ].map(([city, note]) => (
              <div
                key={city}
                className="rounded-3xl border border-line bg-ivory p-6"
              >
                <h3 className="text-xl font-semibold">{city}</h3>
                <p className="mt-2 text-sm text-muted">{note}</p>
                <WhatsAppLink
                  source="areas"
                  text={`Hi Castle Elevator, I need a lift in ${city}. Please arrange a site survey.`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-copper"
                >
                  Book a survey in {city.split(" ")[0]} <ArrowIcon />
                </WhatsAppLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
            Questions buyers ask us
          </h2>
          <div className="mt-10 divide-y divide-line rounded-3xl border border-line bg-paper">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="text-2xl text-copper transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-[2rem] bg-copper px-6 py-12 text-center text-white md:px-12">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Get your free site survey this week
            </h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              Tell us the building, floors and lift you have in mind. We&apos;ll
              recommend the right lift and send a written quote.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <WhatsAppLink
                source="final_cta"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-[#14532d]"
              />
              <CallLink
                source="final_cta"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3.5 font-semibold"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
