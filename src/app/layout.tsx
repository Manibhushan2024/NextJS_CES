import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ToastProvider } from "@/lib/hooks/useToast"
import { ToastContainer } from "@/components/ToastContainer"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { MobileStickyBar } from "@/components/MobileStickyBar"
import { AttributionCapture } from "@/components/Attribution"
import { SITE } from "@/lib/site"
import "./globals.css"

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export const viewport: Viewport = {
  themeColor: "#141820",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Home Lifts & Elevators in Delhi, Gurugram, Noida | Castle Elevator",
  description:
    "Home lifts, passenger, goods, hospital, hydraulic, car and kitchen lifts. Free site survey, written quotation, installation, AMC and repair in Delhi, Gurugram (Gurgaon) and Noida.",
  keywords:
    "home lift Delhi, home elevator Gurgaon, lift installation Noida, passenger lift, goods lift, hospital bed lift, hydraulic lift, car lift, kitchen lift, dumbwaiter, lift AMC Delhi NCR",
  icons: {
    icon: "/images/logo/ICON_logo.svg",
    shortcut: "/images/logo/ICON_logo.svg",
    apple: "/images/logo/ICON_logo.svg",
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: "Home Lifts & Elevators in Delhi NCR | Castle Elevator",
    description:
      "Free site survey and written quotation. Installation, AMC and repair in Delhi, Gurugram and Noida.",
    images: ["/images/editorial/home-lift-hero.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Lifts & Elevators in Delhi NCR | Castle Elevator",
    description:
      "Free site survey and written quotation. Installation, AMC and repair.",
    images: ["/images/editorial/home-lift-hero.webp"],
  },
  alternates: { canonical: SITE.url },
}

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  image: SITE.url + "/images/editorial/home-lift-hero.webp",
  areaServed: SITE.cities.map((name) => ({ "@type": "City", name })),
  priceRange: "₹₹",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className="bg-paper text-ink">
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <ToastProvider>
          <ThemeProvider>
            <AttributionCapture />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <MobileStickyBar />
            <ToastContainer />
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
