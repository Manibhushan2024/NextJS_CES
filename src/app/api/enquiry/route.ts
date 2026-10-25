import { handleEnquiry } from "@/lib/enquiry-handler"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const POST = handleEnquiry
// Liveness only: this does not confirm email delivery or a database connection.
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Enquiry endpoint is running",
  })
}
