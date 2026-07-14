import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Footer() {
  return (
    <footer className="veil px-6 pb-12 pt-24">
      <div className="mx-auto max-w-[1240px]">
        <NewsletterForm />
        <div className="mt-20 flex flex-col items-center gap-5 border-t border-hairline pt-10 text-center">
          <p className="font-logo text-[20px] font-medium text-fg">
            Give It a Second Life&deg;
          </p>
          <nav className="flex gap-4 sm:gap-7" aria-label="Footer">
            {[
              { href: "/", label: "Home" },
              { href: "/gallery", label: "Gallery" },
              { href: "/wishlist", label: "Wishlist" },
              { href: "/about", label: "About" },
              { href: "/admin", label: "Sell" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="tracked text-[10px] text-fg-muted transition-colors hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-[11px] text-fg-faint">
            © {new Date().getFullYear()} — curated with care. Every good thing
            deserves another chapter.
          </p>
        </div>
      </div>
    </footer>
  );
}
