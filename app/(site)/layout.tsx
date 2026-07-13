import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Public storefront chrome. Wraps every page except /admin (which lives outside
// this route group and provides its own slim chrome). The `(site)` folder is a
// route group, so it adds no path segment — URLs stay `/`, `/gallery`, etc.
// Page transitions are scoped by app/(site)/template.tsx (Next inserts it
// between this layout and each page).
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="stage relative z-10 flex min-h-[calc(100vh-20px)] flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
