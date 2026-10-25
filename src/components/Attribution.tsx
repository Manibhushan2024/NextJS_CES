"use client"

import { useEffect } from "react"

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const
const STORAGE_KEY = "castle_attribution"

// Keeps first-touch campaign parameters for the session so a lead submitted
// on any page is still credited to the ad that brought the visitor.
export function AttributionCapture() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return
      const params = new URLSearchParams(window.location.search)
      const found = Object.fromEntries(
        KEYS.flatMap((key) => {
          const value = params.get(key)
          return value ? [[key, value.slice(0, 200)]] : []
        })
      )
      if (Object.keys(found).length)
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    } catch {
      /* Storage can be blocked; attribution is best-effort. */
    }
  }, [])
  return null
}

export function readAttribution(): Record<string, string> {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}")
    const params = new URLSearchParams(window.location.search)
    const current = Object.fromEntries(
      KEYS.flatMap((key) => {
        const value = params.get(key)
        return value ? [[key, value.slice(0, 200)]] : []
      })
    )
    // The server schema accepts UTM + gclid; fbclid is folded into utm_content.
    const merged: Record<string, string> = { ...current, ...stored }
    if (merged.fbclid && !merged.utm_content)
      merged.utm_content = "fbclid:" + merged.fbclid.slice(0, 180)
    delete merged.fbclid
    return merged
  } catch {
    return {}
  }
}
