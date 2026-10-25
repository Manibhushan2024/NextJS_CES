"use client"

import { SITE, DEFAULT_WHATSAPP_TEXT, whatsappLink } from "@/lib/site"
import { track } from "@/lib/track"
import { PhoneIcon, WhatsAppIcon } from "./icons"

type LinkProps = {
  className?: string
  children?: React.ReactNode
  source: string
}

export function CallLink({ className, children, source }: LinkProps) {
  return (
    <a
      href={`tel:${SITE.phone}`}
      onClick={() => track("click_call", { source })}
      className={className}
    >
      {children ?? (
        <>
          <PhoneIcon /> {SITE.phoneDisplay}
        </>
      )}
    </a>
  )
}

export function WhatsAppLink({
  className,
  children,
  source,
  text = DEFAULT_WHATSAPP_TEXT,
}: LinkProps & { text?: string }) {
  return (
    <a
      href={whatsappLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("click_whatsapp", { source })}
      className={className}
    >
      {children ?? (
        <>
          <WhatsAppIcon /> WhatsApp us
        </>
      )}
    </a>
  )
}
