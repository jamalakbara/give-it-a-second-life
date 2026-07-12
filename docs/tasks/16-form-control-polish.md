# 16 — Form control polish

## Goal
Refine admin ItemForm controls so native browser chrome stops clashing with the
dark-aurora theme: select dropdown arrows, number-input spinners, and checkbox.

## Scope
- In: `Select` chevron (custom, inset from edge), hide native number spinners,
  themed checkbox for "Mark as sold". Design-system doc sync.
- Out: other form fields, layout, colors of the panel itself.

## Checklist
- [x] Replace native select arrow with custom inset chevron (`components/form.tsx`)
- [x] Hide native number-input spin buttons (`app/globals.css`)
- [x] Themed checkbox for "Mark as sold" (`components/ItemForm.tsx`)
- [x] Sync `docs/DESIGN_SYSTEM.md` (form field tokens/patterns)
