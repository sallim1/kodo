import "server-only"
import { z } from "zod"

const booleanFromString = z
  .enum(["true", "false"])
  .transform((value) => value === "true")

const databaseEnvSchema = z.object({
  DB_SERVER: z.string().trim().min(1),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(1433),
  DB_NAME: z.string().trim().min(1),
  DB_USER: z.string().trim().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_ENCRYPT: booleanFromString.default(true),
  DB_TRUST_SERVER_CERTIFICATE: booleanFromString.default(false),
})

export type DatabaseConfig = {
  server: string
  port: number
  database: string
  user: string
  password: string
  encrypt: boolean
  trustServerCertificate: boolean
}

// Empty strings (as in a copied .env.example) are treated as "not set".
function readVariable(name: string): string | undefined {
  const value = process.env[name]
  return value === undefined || value.trim() === "" ? undefined : value
}

/**
 * Returns the validated database configuration, or null when it is missing
 * or invalid. Validation details are intentionally not returned or logged,
 * because they could echo secret values.
 */
export function getDatabaseConfig(): DatabaseConfig | null {
  const parsed = databaseEnvSchema.safeParse({
    DB_SERVER: readVariable("DB_SERVER"),
    DB_PORT: readVariable("DB_PORT"),
    DB_NAME: readVariable("DB_NAME"),
    DB_USER: readVariable("DB_USER"),
    DB_PASSWORD: readVariable("DB_PASSWORD"),
    DB_ENCRYPT: readVariable("DB_ENCRYPT"),
    DB_TRUST_SERVER_CERTIFICATE: readVariable("DB_TRUST_SERVER_CERTIFICATE"),
  })

  if (!parsed.success) return null

  const env = parsed.data
  return {
    server: env.DB_SERVER,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    encrypt: env.DB_ENCRYPT,
    trustServerCertificate: env.DB_TRUST_SERVER_CERTIFICATE,
  }
}
