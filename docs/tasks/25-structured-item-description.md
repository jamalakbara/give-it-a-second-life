# 25 — Structured item description

## Goal

Render item descriptions with real structure — blank-line paragraphs, `HEADER:`
section titles, and `•` bullet lists — instead of one flat `<p>` that collapses
all whitespace into a single run-on block.

## Scope

- In: new `ItemDescription` parser component; wire it into item detail page;
  update PRD + design-system docs.
- Out: rich-text editing in the admin form (description is still authored as
  plain text with newlines/bullets), markdown support, DB schema changes.

## Context

Not a save bug. Stored description already keeps its `\n` and `•` (verified in
Neon). The old `<p>{item.description}` collapsed newlines per HTML whitespace
rules, so it only ever *looked* flat.

## Checklist

- [x] Add `components/ItemDescription.tsx` parsing paragraphs / `HEADER:` /
  `•`,`-`,`*` bullets from plain text.
- [x] Replace flat `<p>` in `app/items/[id]/page.tsx` with `<ItemDescription>`.
- [x] Update `docs/DESIGN_SYSTEM.md` (item detail description block).
- [x] Update `docs/PRD.md` item-detail description acceptance.
- [x] Collapse long descriptions to 320px with a `mask-image` fade + "Read full
  description" / "Show less" toggle (client component; toggle only when it
  overflows).
