"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"
import { CallLink, WhatsAppLink } from "./ContactLinks"
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "./icons"
import { SITE } from "@/lib/site"

const PRODUCTS = [
  {
    href: "/products/home-elevators",
    label: "Home lifts",
    note: "Up to 1,000 kg · G+4",
  },
  {
    href: "/products/passenger-elevators",
    label: "Passenger lifts",
    note: "4–33 persons · up to 4 m/s",
  },
  {
    href: "/products/freight-elevators",
    label: "Goods / freight lifts",
    note: "500–5,000 kg",
  },
  {
    href: "/products/hospital-elevators",
    label: "Hospital / bed lifts",
    note: "Up to 5,000 kg",
  },
  {
    href: "/products/hydraulic-elevators",
    label: "Hydraulic lifts",
    note: "Up to 26 persons · 5 floors",
  },
  {
    href: "/products/car-lifts",
    label: "Automatic car lifts",
    note: "3,000–5,000 kg",
  },
  {
    href: "/products/kitchen-lifts",
    label: "Kitchen lifts",
    note: "50–300 kg · SS 304",
  },
  {
    href: "/products/dumbwaiters",
    label: "Dumbwaiters & service lifts",
    note: "50 kg – 5 ton",
  },
  {
    href: "/products/escalators",
    label: "Escalators",
    note: "Malls & showrooms",
  },
]

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/service-areas", label: "Service areas" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Guides" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the mobile menu after navigation.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        {/* Top strip: always-visible contact for high-intent visitors */}
        <div className="hidden bg-ink text-paper md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
            <p>
              Lift installation, AMC &amp; repair in {SITE.cities.join(" · ")}
            </p>
            <div className="flex items-center gap-5">
              <CallLink
                source="topbar"
                className="inline-flex items-center gap-1.5 hover:text-copper"
              >
                <PhoneIcon className="h-3.5 w-3.5" /> {SITE.phoneDisplay}
              </CallLink>
              <WhatsAppLink
                source="topbar"
                className="inline-flex items-center gap-1.5 hover:text-copper"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
          <Link href="/" className="shrink-0" aria-label="Castle Elevator home">
            <Image
              src="/images/logo/TB_logo.svg"
              alt="Castle Elevator"
              width={150}
              height={52}
              className="h-11 w-auto dark:hidden"
              priority
            />
            <Image
              src="/images/logo/Db_logo.svg"
              alt="Castle Elevator"
              width={150}
              height={52}
              className="hidden h-11 w-auto dark:block"
              priority
            />
          </Link>

          <nav
            className="hidden items-center gap-7 text-[15px] font-medium lg:flex"
            aria-label="Main"
          >
            <div className="group relative">
              <Link
                href="/products"
                className="flex items-center gap-1 py-3 hover:text-copper"
              >
                Lifts
                <svg
                  className="h-4 w-4 transition-transform group-hover:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" d="M6 9l6 6 6-6" />
                </svg>
              </Link>
              <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 rounded-2xl border border-line bg-paper p-3 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="grid grid-cols-2 gap-1">
                  {PRODUCTS.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="rounded-xl px-3 py-2.5 hover:bg-ivory"
                    >
                      <span className="block text-sm font-semibold">
                        {p.label}
                      </span>
                      <span className="block text-xs text-muted">{p.note}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-copper ${pathname.startsWith(item.href) ? "text-copper" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden rounded-full bg-copper px-5 py-2.5 text-sm font-semibold text-white hover:bg-copper-strong sm:inline-block"
            >
              Free site survey
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: its backdrop-filter would contain fixed children. */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[64px] z-40 overflow-y-auto bg-paper px-4 pb-28 pt-4 lg:hidden"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Lifts
          </p>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {PRODUCTS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-xl border border-line px-4 py-3"
              >
                <span className="block font-semibold">{p.label}</span>
                <span className="block text-xs text-muted">{p.note}</span>
              </Link>
            ))}
          </div>
          <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-muted">
            Company
          </p>
          <div className="grid grid-cols-2 gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-line px-4 py-3 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 grid gap-2">
            <Link
              href="/contact"
              className="rounded-full bg-copper py-3.5 text-center font-semibold text-white"
            >
              Book a free site survey
            </Link>
            <WhatsAppLink
              source="mobile_menu"
              className="flex items-center justify-center gap-2 rounded-full bg-whatsapp py-3.5 font-semibold text-white"
            />
          </div>
        </div>
      )}
    </>
  )
}
