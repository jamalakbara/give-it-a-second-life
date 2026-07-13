import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";

// Lists images already uploaded to the Cloudinary folder so the admin can reuse
// them instead of re-uploading. Uses the Cloudinary Admin Search API (needs the
// API secret) — so this runs server-side and is gated behind Clerk admin auth.
export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "preloved";

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 501 },
    );
  }

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  // Basic auth with key:secret — never sent to the client.
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: `folder:${folder}`,
          sort_by: [{ created_at: "desc" }],
          max_results: 100,
          ...(cursor ? { next_cursor: cursor } : {}),
        }),
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to load media" },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      resources?: {
        secure_url: string;
        public_id: string;
        width: number;
        height: number;
      }[];
      next_cursor?: string;
    };

    // Trim to just what the picker needs — no keys/secrets leak to the client.
    const images = (data.resources ?? []).map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      width: r.width,
      height: r.height,
    }));

    return NextResponse.json({ images, nextCursor: data.next_cursor ?? null });
  } catch {
    return NextResponse.json({ error: "Failed to load media" }, { status: 502 });
  }
}
