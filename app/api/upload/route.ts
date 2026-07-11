import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

// Returns a short-lived signature so the admin can upload directly to Cloudinary
// from the browser without the API secret ever leaving the server.
export async function POST() {
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

  const timestamp = Math.floor(Date.now() / 1000);

  // Signature = sha1 of the params to sign (sorted, joined) + api secret.
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
