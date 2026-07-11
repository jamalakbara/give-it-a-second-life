"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("success");
      setMessage(data.message ?? "You're on the list!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="tracked text-[11px] text-fg-faint">Newsletter</p>
      <h2 className="mt-4 font-serif text-h2 font-medium text-fg">
        Get notified when new items drop
      </h2>
      <p className="mt-3 text-[14px] text-fg-muted">
        No algorithms. Just a quiet note when something beautiful arrives.
      </p>
      <form
        onSubmit={handleSubmit}
        className="glass mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full p-1.5"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          className="flex-1 bg-transparent px-4 py-2 text-[14px] text-fg placeholder:text-fg-faint outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="tracked shrink-0 rounded-full bg-cream px-5 py-2.5 text-[11px] text-void transition hover:bg-white disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
      <p
        aria-live="polite"
        className={`mt-3 min-h-5 text-[12px] ${
          status === "error" ? "text-aurora-rose" : "text-fg-muted"
        }`}
      >
        {status === "success" || status === "error" ? message : ""}
      </p>
    </div>
  );
}
