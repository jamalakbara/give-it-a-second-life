import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/data/subscribers";

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

    const result = await addSubscriber(normalized);

    if (result === "exists") {
      return NextResponse.json({
        success: true,
        message: "You're already on the list!",
      });
    }

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
