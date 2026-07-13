import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/adminAuth";
import { AdminDashboard } from "@/components/AdminDashboard";

// Non-public admin surface — keep it out of the index (robots also disallows it).
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const { userId, redirectToSignIn } = await auth();
  // Signed-out → Clerk hosted sign-in. Signed-in but not the owner → home.
  if (!userId) return redirectToSignIn();
  if (!(await isAdmin())) redirect("/");

  const { tab } = await searchParams;

  return (
    <div className="veil px-4 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-3xl">
        <AdminDashboard tab={tab ?? "items"} />
      </div>
    </div>
  );
}
