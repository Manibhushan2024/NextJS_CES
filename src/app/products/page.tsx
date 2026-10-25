import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { getProducts } from "@/lib/content"
import { SITE } from "@/lib/site"
import { WhatsAppLink } from "@/components/ContactLinks"
import { ArrowIcon } from "@/components/icons"

export const metadata: Metadata = {
  title:
    "Lifts & Elevators — Home, Passenger, Goods, Hospital, Car & Kitchen Lifts | Castle Elevator",
  description:
    "Compare home lifts (up to 1,000 kg), passenger lifts (4–33 persons, up to 4 m/s), goods lifts (500–5,000 kg), hospital, hydraulic, car and kitchen lifts in Delhi, Gurugram and Noida.",
  alternates: { canonical: `${SITE.url}/products` },
}

export default function Products() {
  const products = getProducts()

  return (
    <div className="bg-paper">
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-copper">
            Our lifts
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            Lifts &amp; elevators we install
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Capacities and speeds are the ranges we supply. Your engineer
            recommends the exact model after a free site survey.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="overflow-x-auto rounded-3xl border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-ivory text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Lift</th>
                  <th className="px-5 py-3 font-semibold">Capacity</th>
                  <th className="px-5 py-3 font-semibold">Speed</th>
                  <th className="px-5 py-3 font-semibold">Best for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr key={p.slug}>
                    <td className="px-5 py-3.5 font-semibold">
                      <Link
                        href={`/products/${p.slug}`}
                        className="hover:text-copper"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">{p.keySpecs?.[0]}</td>
                    <td className="px-5 py-3.5">{p.keySpecs?.[1]}</td>
                    <td className="px-5 py-3.5 text-muted">
                      {p.applications.slice(0, 2).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3">
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
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold">{p.name}</h2>
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
        <div className="mx-auto mt-12 max-w-7xl px-4 text-center">
          <p className="text-muted">Not sure which lift fits your building?</p>
          <WhatsAppLink
            source="products_index"
            text="Hi Castle Elevator, I'm not sure which lift I need. Can an engineer advise?"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-white"
          >
            Ask an engineer on WhatsApp
          </WhatsAppLink>
        </div>
      </section>
    </div>
  )
}
