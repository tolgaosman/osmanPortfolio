# Project Repository Visibility Rule

When adding a new project or updating an existing one in `data/projects.ts`:
- Always check whether the project's GitHub repository is **public** or **private** (e.g., via `https://api.github.com/repos/<owner>/<repo>` or `https://api.github.com/users/tolgaosman/repos`).
- If the repository is **public**, set `github` to its URL so the `Source` button is displayed on cards and modals.
- If the repository is **private** (or has no repo), set `github: null` so the `Source` button is NOT displayed anywhere. Never put a private GitHub URL into `github`.

