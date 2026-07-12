# Requirement Intake Rule

`docs/` is the single source of truth for **what** this product does. A requirement that
lives only in a chat message or in code does not exist yet. Whenever the user asks for
something new, capture it in `docs/` **in the same task** — before the work is considered
done.

## When this applies

Any time a request introduces or changes a requirement that `docs/` does not already cover:

- A new feature or capability (e.g. "admins can edit items")
- A change to existing scope or behavior (moving something from Phase 2 into MVP, changing
  a flow, changing an acceptance rule)
- A new API surface, auth rule, or data change users can observe
- Resolving an open question already parked in the docs (e.g. `docs/PRD.md` open questions)

If you are unsure whether a request is a "requirement," it is — err toward documenting.

## What to do

1. **Write the requirement into the docs first**, then build. Put each piece where it belongs:
   - **Feature / scope** → `docs/PRD.md` (§3 Product Scope) — feature name + one-line
     description + capability bullets, and whether it is MVP or deferred.
   - **Technical design / API** → `docs/TECH_SETUP.md` — a new `## Part X.Y` section with
     routes, request/response shape, auth, and data effects.
   - **Implementation** → `docs/tasks/NN-*.md` with Goal / Scope / Checklist (follow the
     [[task-workflow]] rule).
   - **UI patterns / tokens** → `docs/DESIGN_SYSTEM.md` (follow the [[design-system-sync]] rule).
2. **Capture, at minimum:** feature name + one-line description, acceptance criteria as
   bullets, affected API routes / file paths, and in/out scope (MVP vs deferred).
3. If the request resolves or contradicts an existing doc line (an open question, a
   "deferred to Phase 2" note), **update that line** — don't leave the docs self-contradictory.

## What does NOT apply

- Pure refactors, bug fixes, or perf work with no change to behavior or scope
- One-off copy/content tweaks that introduce no new capability
- Internal implementation details a user can't observe and no doc documents

A requirement is not "done" until the relevant `docs/` files describe it and its
`docs/tasks/NN-*.md` checklist is updated.
