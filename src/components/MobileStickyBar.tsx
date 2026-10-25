"use client"

import Link from "next/link"
import { CallLink, WhatsAppLink } from "./ContactLinks"
import { PhoneIcon, WhatsAppIcon } from "./icons"

// Mobile: three thumb-reach actions. Desktop: a floating WhatsApp button.
export function MobileStickyBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
          <CallLink
            source="sticky_mobile"
            className="flex items-center justify-center gap-1.5 rounded-full border border-line py-3"
          >
            <PhoneIcon className="h-4 w-4" /> Call
          </CallLink>
          <WhatsAppLink
            source="sticky_mobile"
            className="flex items-center justify-center gap-1.5 rounded-full bg-whatsapp py-3 text-white"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </WhatsAppLink>
          <Link
            href="/contact#quote"
            className="flex items-center justify-center rounded-full bg-copper py-3 text-white"
          >
            Get quote
          </Link>
        </div>
      </div>
      <WhatsAppLink
        source="float_desktop"
        className="fixed bottom-6 right-6 z-50 hidden items-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 font-semibold text-white shadow-xl hover:brightness-110 md:flex"
      >
        <WhatsAppIcon className="h-6 w-6" /> Chat on WhatsApp
      </WhatsAppLink>
    </>
  )
}
