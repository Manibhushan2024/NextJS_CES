import { NextResponse } from "next/server"

// Retire the public, in-memory logger until authenticated, durable operations exist.
// It previously exposed arbitrary records and claimed actions had executed.
function retired() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Operations API is unavailable. Authenticated service operations have not been configured.",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  )
}
export const GET = retired
export const POST = retired
