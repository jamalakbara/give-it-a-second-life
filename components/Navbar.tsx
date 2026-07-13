"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { StarIcon, SearchIcon, MenuIcon, CloseIcon } from "@/components/icons";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/about", label: "About" },
];

function SearchField({ onDone }: { onDone?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) params.set("q", value.trim());
        else params.delete("q");
        // Search always lands on the gallery, from any page.
        const qs = params.toString();
        router.push(qs ? `/gallery?${qs}` : "/gallery", {
          transitionTypes: ["nav-forward"],
        });
        onDone?.();
      }}
    >
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search the gallery"
        aria-label="Search items"
        className="w-full rounded-full bg-glass py-2 pl-9 pr-3 text-[13px] text-fg placeholder:text-fg-faint outline-none ring-1 ring-hairline transition focus:ring-fg-muted"
      />
    </form>
  );
}

function NavbarInner() {
  const pathname = usePathname();
  const { count } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <header
        className="glass-nav mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-4 rounded-full px-4 md:h-16 md:px-7 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]"
        // Own steady view-transition group so the navbar never blinks during a
        // page change. Safe to name now: the frosted `backdrop-filter` was traded
        // for a solid aurora-tinted `.glass-nav` bg, so there's no backdrop-root
        // to break (which is what would kill the blur / snapshot a square).
        style={{ viewTransitionName: "site-header" }}
      >
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="font-logo text-[19px] font-medium tracking-tight text-fg md:text-[22px]"
        >
          Second Life&deg;
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={link.href === "/" ? ["nav-back"] : ["nav-forward"]}
              className={`tracked text-[11px] transition-colors duration-200 hover:text-fg ${
                pathname === link.href ? "text-fg" : "text-fg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden w-[200px] lg:block">
            <SearchField />
          </div>
          <Link
            href="/wishlist"
            transitionTypes={["nav-forward"]}
            aria-label={`Wishlist (${count} items)`}
            className="relative p-2 text-fg-muted transition-colors duration-200 hover:text-fg"
          >
            <StarIcon className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="cursor-pointer p-2 text-fg-muted md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="glass-nav backdrop-blur-sm backdrop-saturate-150 mx-auto mt-2 max-w-[1240px] rounded-3xl p-5 md:hidden">
          <div className="mb-4">
            <SearchField onDone={() => setMenuOpen(false)} />
          </div>
          <nav className="flex flex-col divide-y divide-hairline" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                transitionTypes={link.href === "/" ? ["nav-back"] : ["nav-forward"]}
                onClick={() => setMenuOpen(false)}
                className={`tracked py-3 text-[12px] ${
                  pathname === link.href ? "text-fg" : "text-fg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-20" />}>
      <NavbarInner />
    </Suspense>
  );
}
