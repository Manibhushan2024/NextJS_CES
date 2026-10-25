import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProductBySlug, getProducts } from "@/lib/content"
import { LeadNeed, SITE } from "@/lib/site"
import { QuickQuoteForm } from "@/components/QuickQuoteForm"
import { CallLink, WhatsAppLink } from "@/components/ContactLinks"
import { ArrowIcon, CheckIcon } from "@/components/icons"

// Maps product pages to the lead form's "need" value.
const NEED_BY_SLUG: Record<string, LeadNeed> = {
  "home-elevators": "home-lift",
  "passenger-elevators": "passenger-elevator",
  "freight-elevators": "freight-elevator",
  "hospital-elevators": "hospital-elevator",
  "hydraulic-elevators": "hydraulic-elevator",
  "car-lifts": "car-lift",
  "kitchen-lifts": "kitchen-lift",
  dumbwaiters: "kitchen-lift",
  escalators: "escalator",
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: "Lift not found" }
  const specs = product.keySpecs?.join(", ")
  return {
    title: `${product.name} in Delhi, Gurugram & Noida | Castle Elevator`,
    description: `${product.shortDesc} ${specs ? specs + "." : ""} Free site survey and written quotation.`,
    alternates: { canonical: `${SITE.url}/products/${product.slug}` },
    openGraph: { images: [product.imagePath] },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const others = getProducts()
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
  const waText = `Hi Castle Elevator, I'm interested in ${product.name}. Please share details and arrange a site survey.`

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.overview,
    image: SITE.url + product.imagePath,
    brand: { "@type": "Brand", name: SITE.name },
    additionalProperty: Object.entries(product.specifications).map(
      ([k, v]) => ({
        "@type": "PropertyValue",
        name: k,
        value: v,
      })
    ),
  }

  return (
    <div className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:py-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <nav className="mb-5 text-sm text-muted" aria-label="Breadcrumb">
              <Link href="/products" className="hover:text-copper">
                Lifts
              </Link>
              <span className="mx-2">/</span>
              <span>{product.name}</span>
            </nav>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {product.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              {product.shortDesc}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {product.keySpecs?.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-3xl bg-paper">
              <Image
                src={product.imagePath}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppLink
                source={`product_${slug}`}
                text={waText}
                className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 font-semibold text-white"
              />
              <CallLink
                source={`product_${slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold"
              />
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start" id="quote">
            <QuickQuoteForm
              source={`product_${slug}`}
              defaultNeed={NEED_BY_SLUG[slug] ?? "other"}
              title={`Get a ${product.name.toLowerCase()} quote`}
              subtitle="Free site survey in Delhi, Gurugram & Noida. Written quotation before any work."
            />
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Specifications
            </h2>
            <p className="mt-2 text-sm text-muted">
              Ranges we supply. Final capacity, speed and cabin size are
              confirmed after the site survey and shown in your quotation.
            </p>
            <dl className="mt-6 divide-y divide-line overflow-hidden rounded-3xl border border-line">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div
                  key={k}
                  className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-4"
                >
                  <dt className="text-sm font-semibold text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
            <p className="mt-4 text-muted">{product.overview}</p>
            <h3 className="mt-8 text-lg font-semibold">
              Safety &amp; features
            </h3>
            <ul className="mt-3 grid gap-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-copper" />{" "}
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
          <div className="rounded-3xl border border-line bg-paper p-6">
            <h3 className="text-lg font-semibold">Why customers choose it</h3>
            <ul className="mt-3 grid gap-2 text-muted">
              {product.benefits.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-paper p-6">
            <h3 className="text-lg font-semibold">Where it&apos;s used</h3>
            <ul className="mt-3 grid gap-2 text-muted">
              {product.applications.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-paper p-6">
            <h3 className="text-lg font-semibold">
              Warranty &amp; maintenance
            </h3>
            <p className="mt-3 text-muted">{product.warranty}</p>
            <p className="mt-3 text-muted">{product.maintenance}</p>
          </div>
        </div>
      </section>

      {product.faq && product.faq.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Common questions
            </h2>
            <div className="mt-6 divide-y divide-line rounded-3xl border border-line">
              {product.faq.map((f) => (
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
      )}

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-semibold tracking-tight">Other lifts</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group flex items-center gap-4 rounded-3xl border border-line p-4 hover:shadow-lg"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={p.imagePath}
                    alt={p.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-muted">
                    {p.keySpecs?.slice(0, 2).join(" · ")}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-copper">
                    View <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
