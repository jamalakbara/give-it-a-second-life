"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label, TextArea, TextInput } from "@/components/form";
import { Button } from "@/components/Button";
import type {
  AboutContent,
  AboutStep,
  HomeContent,
  ItemContent,
  SiteContent,
} from "@/lib/content/defaults";

type Section = "home" | "about" | "item";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "item", label: "Item page" },
];

// Small labelled inputs so every section reads the same.
function Text({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <TextInput value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <TextArea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

type SetField = (key: string, value: unknown) => void;

function HomeFields({ draft, set }: { draft: HomeContent; set: SetField }) {
  return (
    <div className="space-y-5">
      <Text label="Hero eyebrow" value={draft.heroEyebrow} onChange={(v) => set("heroEyebrow", v)} />
      <Text label="Hero heading" value={draft.heroHeading} onChange={(v) => set("heroHeading", v)} />
      <Area label="Hero subheading" value={draft.heroSub} onChange={(v) => set("heroSub", v)} />
      <Text label="Hero button" value={draft.heroCta} onChange={(v) => set("heroCta", v)} />
      <Text label="Arrivals label" value={draft.arrivalsLabel} onChange={(v) => set("arrivalsLabel", v)} />
      <Text label="Arrivals link" value={draft.arrivalsLink} onChange={(v) => set("arrivalsLink", v)} />
    </div>
  );
}

function AboutFields({ draft, set }: { draft: AboutContent; set: SetField }) {
  function setStep(i: number, patch: Partial<AboutStep>) {
    set(
      "steps",
      draft.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  }
  return (
    <div className="space-y-5">
      <Text label="Hero eyebrow" value={draft.heroEyebrow} onChange={(v) => set("heroEyebrow", v)} />
      <Text label="Hero heading" value={draft.heroHeading} onChange={(v) => set("heroHeading", v)} />
      <Area label="Hero intro" value={draft.heroIntro} onChange={(v) => set("heroIntro", v)} />
      <Area
        label="Mission (SEO / structured-data description)"
        value={draft.mission}
        onChange={(v) => set("mission", v)}
      />
      <Text label="Mission heading" value={draft.missionHeading} onChange={(v) => set("missionHeading", v)} />
      <Area
        label="Mission body (one paragraph per blank line)"
        rows={6}
        value={draft.missionBody.join("\n\n")}
        onChange={(v) => set("missionBody", v.split(/\n\n+/).map((p) => p.trim()).filter(Boolean))}
      />
      <div className="space-y-4">
        <Label>How it works — steps</Label>
        {draft.steps.map((step, i) => (
          <div key={i} className="glass grid grid-cols-1 gap-3 rounded-2xl p-4 md:grid-cols-[70px_1fr]">
            <TextInput
              value={step.n}
              onChange={(e) => setStep(i, { n: e.target.value })}
              placeholder="01"
            />
            <div className="space-y-3">
              <TextInput
                value={step.title}
                onChange={(e) => setStep(i, { title: e.target.value })}
                placeholder="Step title"
              />
              <TextArea
                rows={2}
                value={step.body}
                onChange={(e) => setStep(i, { body: e.target.value })}
                placeholder="Step description"
              />
            </div>
          </div>
        ))}
      </div>
      <Text label="Curator eyebrow" value={draft.curatorEyebrow} onChange={(v) => set("curatorEyebrow", v)} />
      <Text label="Curator heading" value={draft.curatorHeading} onChange={(v) => set("curatorHeading", v)} />
      <Area label="Curator body" value={draft.curatorBody} onChange={(v) => set("curatorBody", v)} />
      <Text label="CTA heading" value={draft.ctaHeading} onChange={(v) => set("ctaHeading", v)} />
      <Text label="CTA button" value={draft.ctaButton} onChange={(v) => set("ctaButton", v)} />
    </div>
  );
}

function ItemFields({ draft, set }: { draft: ItemContent; set: SetField }) {
  return (
    <div className="space-y-5">
      <Text label="Seller label" value={draft.sellerLabel} onChange={(v) => set("sellerLabel", v)} />
      <Text label="Seller name" value={draft.sellerName} onChange={(v) => set("sellerName", v)} />
      <Area label="Seller bio" value={draft.sellerBio} onChange={(v) => set("sellerBio", v)} />
    </div>
  );
}

// Content editor for the marketing copy on Home, About, and the item page.
// Loads the merged content once, edits one section at a time, and saves that
// section's blob back via PATCH /api/site-content.
export function AdminContentPanel() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [section, setSection] = useState<Section>("home");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/site-content")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data: SiteContent) => setContent(data))
      .catch((err) => setError(err.message));
  }, []);

  const set: SetField = (key, value) => {
    setContent((prev) =>
      prev ? { ...prev, [section]: { ...prev[section], [key]: value } } : prev,
    );
    setSuccess("");
  };

  async function save() {
    if (!content) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: section, value: content[section] }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save");
      }
      setSuccess("Saved. Public pages will reflect the change.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  if (!content) {
    return (
      <p className="text-[13px] text-fg-faint">
        {error || "Loading content…"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSection(s.id);
              setSuccess("");
              setError("");
            }}
            className={`tracked rounded-full px-4 py-2 text-[10px] transition ${
              section === s.id
                ? "bg-cream text-void"
                : "bg-glass text-fg-muted ring-1 ring-hairline hover:text-fg"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-[4px] border border-[#EF4444]/30 bg-[#EF4444]/5 p-4 text-[14px] text-[#EF4444]">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-[4px] border border-[#10B981]/30 bg-[#10B981]/5 p-4 text-[14px] text-[#10B981]">
          {success}
        </div>
      )}

      <div className="glass rounded-3xl p-8">
        {section === "home" && <HomeFields draft={content.home} set={set} />}
        {section === "about" && <AboutFields draft={content.about} set={set} />}
        {section === "item" && <ItemFields draft={content.item} set={set} />}
      </div>

      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
