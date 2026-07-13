import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-h2 font-medium text-fg">Not found</h1>
      <p className="mt-4 text-[15px] text-fg-muted">
        This piece may have found a new home already.
      </p>
      <Link
        href="/"
        className="glass tracked mt-8 rounded-full px-6 py-3 text-[11px] text-fg transition hover:bg-glass-strong"
      >
        Back to the gallery
      </Link>
    </div>
  );
}
