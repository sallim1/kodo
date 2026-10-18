import { getDatabaseStatus } from "@/lib/server/db/status"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// No connection layer exists yet, so every answer is 503 by design.
export async function GET() {
  return Response.json(
    { status: getDatabaseStatus() },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  )
}
