import "server-only"
import { getDatabaseConfig } from "@/lib/server/env"

export type DatabaseStatus = "not_configured" | "configured_not_connected"

/**
 * Reports configuration state only. No SQL Server driver is installed yet,
 * so this never opens a connection and never proves that one would succeed.
 */
export function getDatabaseStatus(): DatabaseStatus {
  return getDatabaseConfig() === null
    ? "not_configured"
    : "configured_not_connected"
}
