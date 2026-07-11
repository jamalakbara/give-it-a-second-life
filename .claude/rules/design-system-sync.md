# Design System Sync Rule

`docs/DESIGN_SYSTEM.md` is the single source of truth for the UI. Keep it in sync
with the code — a UI change is not done until the design system reflects it.

## When this applies

Whenever a UI change touches something the design system documents, update
`docs/DESIGN_SYSTEM.md` in the **same task**. This includes:

- Design tokens — colors, typography, spacing, radius, shadows/blur (`app/globals.css` `@theme`)
- Shared/signature components — Aurora, Navbar, ItemCard/CardMedia, FilterBar, Button,
  form fields, Badge, Footer, item detail
- Layout & geometry — grid columns, gaps, stagger offsets, container widths, breakpoints
- Motion — animations, transitions, easing, durations (and whether a library is used)
- New reusable component or pattern, or removal of one
- Any value measured/matched from the design reference (jackwatkins.co/works)

## What to do

1. Make the UI change.
2. Edit the matching section of `docs/DESIGN_SYSTEM.md` so it describes what the code
   now does (real values, real class names, real file paths). Bump the version note at
   the top if the change is notable.
3. Update the **Implementation Map** if files were added/removed/renamed.
4. Follow the task-workflow rule too (`docs/tasks/NN-*.md` checklist).

## What does NOT need a design-system update

- Pure logic / data / API changes with no visual outcome
- One-off copy tweaks, bug fixes that don't change tokens/patterns
- Content edits (item data, text) that don't introduce a new UI pattern

When unsure whether a change is "design-system-relevant," it is — err toward updating.
