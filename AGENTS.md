# AGENTS.md — Dhutanga Practice project entry

> Agent entrypoint for this repository. **Read [docs/README.md](docs/README.md)** for the game vision and indexed source map. **Read [docs/AGENTS.md](docs/AGENTS.md)** for exact document authoring, ownership, naming, review and link rules.

## Before acting

1. Check the user's scope: **review only**, **docs only**, or **coding**. Do not commit for review-only, and do not touch gameplay when asked for docs only.
2. The code and root README still include **legacy fixed-character story**. The current **design direction** is player-created names and roles, with Sư Tịnh, Ông Tư, Bà Sáu as separate NPCs. **Design docs are not proof of implementation.**
3. For a domain change, first read its owner doc from [docs/README.md](docs/README.md#4-danh-mục-tài-liệu-theo-nhóm) and the relevant episode spec. If claiming feature behavior, verify the actual source and tests on the branch.
4. Preserve **per-character story/quest/memory/spoiler isolation**; guest/account saves and legacy progress require explicit migration when code changes.
5. For docs work, keep relative Markdown links valid, update the docs index **in the same PR** and avoid duplicate overlapping documents.
6. Prefer PRs into `develop`. **Do not modify `experiment/qls-ideas` (active deployment branch), auto-merge PRs, or remove existing save data.**

## Developer quick paths

- Architecture and running: [README.md](README.md), `package.json`.
- User vision/requirements: [docs/README.md](docs/README.md).
- Agent instructions: [docs/AGENTS.md](docs/AGENTS.md).
- Design rules: [docs/game-design-principles.md](docs/game-design-principles.md).
- Identity and story ownership: [docs/player-character-narrative-model.md](docs/player-character-narrative-model.md).
- Story, maps and systems: follow the topic-based table in [docs/README.md](docs/README.md#4-danh-mục-tài-liệu-theo-nhóm).

**Only mark a design as implemented when the corresponding code and tests confirm it.**
