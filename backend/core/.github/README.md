# core/.github

Template for the **`.github`** folder at the project root. When you run **`npm run install:core`** (or **`install-core`**), the script copies these files to root and creates **`.github/skills/`** with symlinks to **`core/agent/skills/`**.

- **Skills and rules** are defined only in **`core/agent/`**; see **`core/agent/README.md`**.
- **`pull_request_template.md`** is symlinked to root so GitHub pre-fills new PR bodies (Summary, Type of change, How to test, Issue link, Checklist).
- **`workflows/`** is symlinked to root **`.github/workflows/`** so Actions in core run from the repo (e.g. **Create PR on push** — auto-creates a PR when pushing to a non-default branch if none exists; title from branch name, body from last commit).