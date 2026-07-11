import { neon } from "@neondatabase/serverless";

// Neon serverless HTTP client. Present only when DATABASE_URL is configured;
// the data layer falls back to the in-memory mock otherwise.
const connectionString = process.env.DATABASE_URL;

export const hasDatabase = Boolean(connectionString);

export const sql = connectionString ? neon(connectionString) : null;
