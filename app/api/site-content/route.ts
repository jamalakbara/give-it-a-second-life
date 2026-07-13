import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, updateContent } from "@/lib/data/siteContent";
import { CONTENT_KEYS, type ContentKey } from "@/lib/content/defaults";
import { isAdmin } from "@/lib/adminAuth";

// Merged content (defaults + overrides). Admin-only: the forms read from here to
// prefill, and it exposes nothing sensitive, but it's an editor surface.
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getContent();
  return NextResponse.json(content);
}

// Which public routes to revalidate after editing a given content key.
const REVALIDATE_PATHS: Record<ContentKey, string[]> = {
  home: ["/"],
  about: ["/about"],
  item: ["/items/[id]"],
  seo: ["/", "/gallery", "/about"],
};

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { key?: string; value?: unknown };
    const key = body.key as ContentKey;
    if (!key || !CONTENT_KEYS.includes(key)) {
      return NextResponse.json(
        { error: "Invalid content key" },
        { status: 400 },
      );
    }
    if (body.value === undefined || body.value === null) {
      return NextResponse.json({ error: "Missing value" }, { status: 400 });
    }

    await updateContent(key, body.value);

    for (const path of REVALIDATE_PATHS[key]) {
      // Dynamic segment routes need the explicit "page" type.
      if (path.includes("[")) revalidatePath(path, "page");
      else revalidatePath(path);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
  }
}
