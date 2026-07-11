import { NextResponse } from "next/server";

// Mock storage: in-memory until the database task. Swap for a
// newsletter_subscribers table alongside the Neon migration.
const store = globalThis as unknown as { __subscribers?: Set<string> };
store.__subscribers ??= new Set<string>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const normalized = email?.trim().toLowerCase();

    if (!normalized || !EMAIL_RE.test(normalized)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    if (store.__subscribers!.has(normalized)) {
      return NextResponse.json({
        success: true,
        message: "You're already on the list!",
      });
    }

    store.__subscribers!.add(normalized);
    return NextResponse.json(
      { success: true, message: "You're on the list! Watch for new drops." },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
