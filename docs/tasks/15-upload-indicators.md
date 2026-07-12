# 15 — Upload indicators & image position badges

## Goal
Give the admin image uploader clear visual feedback: numbered position badges on
every thumbnail, and a spinner (not a plain shimmer card) on in-flight upload
placeholders.

## Scope
- In: numbered position badge on each thumbnail; spinner + numbered badge on
  uploading placeholder tiles.
- Out: any change to upload logic, reorder logic, or the API.

## Checklist
- [x] Add 1-based position badge to each thumbnail in `SortableImageGrid`
- [x] Add spinner to uploading placeholder tiles in `ItemForm`
- [x] Number the uploading placeholders continuing from existing image count
- [x] Sync `docs/DESIGN_SYSTEM.md` (§2.6 image upload, version bump to v2.4)
