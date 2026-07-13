import { Suspense } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { AdminTabs } from "@/components/AdminTabs";

// Dedicated seller-studio chrome. Lives outside the app/(site) route group, so
// it inherits none of the public navbar / newsletter / footer — just a slim top
// bar with the brand, section tabs, and the Clerk account button.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="stage relative z-10 flex min-h-[calc(100vh-20px)] flex-col">
      <div className="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
        <header className="glass-nav mx-auto grid h-14 max-w-[760px] grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full px-4 md:h-16 md:px-7 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]">
          <Link
            href="/"
            className="justify-self-start font-logo text-[19px] font-medium tracking-tight text-fg md:text-[22px]"
          >
            Second Life&deg;
          </Link>
          <Suspense fallback={<div className="h-4" />}>
            <AdminTabs />
          </Suspense>
          <div className="flex h-full items-center justify-self-end">
            <UserButton />
          </div>
        </header>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
