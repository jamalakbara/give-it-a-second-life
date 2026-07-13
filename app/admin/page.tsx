import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { isAdmin } from "@/lib/adminAuth";
import { AdminDashboard } from "@/components/AdminDashboard";

// Non-public admin surface — keep it out of the index (robots also disallows it).
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const { userId, redirectToSignIn } = await auth();
  // Signed-out → Clerk hosted sign-in. Signed-in but not the owner → home.
  if (!userId) return redirectToSignIn();
  if (!(await isAdmin())) redirect("/");

  return (
    <div className="veil px-4 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="tracked text-[10px] text-fg-faint">Seller studio</p>
            <h1 className="mt-3 font-serif text-h2 font-medium text-fg">
              Manage Items
            </h1>
          </div>
          <UserButton />
        </div>
        <AdminDashboard />
      </div>
    </div>
  );
}
