# Task Workflow Rule

Every task in this project MUST follow this workflow:

1. **Before starting a task:** create a task file at `docs/tasks/NN-task-name.md` where `NN` is the next sequential number (01, 02, ...). The file must contain:
   - **Goal** — one or two sentences on what the task delivers
   - **Scope** — what is in and out of scope
   - **Checklist** — subtasks as markdown checkboxes (`- [ ]`)

2. **While working:** keep the checklist as the source of truth for progress.

3. **After finishing the task:** check off every completed item (`- [x]`) in the task file. If an item was skipped or deferred, leave it unchecked and add a short note explaining why.

4. A task is not considered done until its `docs/tasks/` file checklist is updated.
