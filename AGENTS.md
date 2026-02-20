# Repository Guidelines

## Core Principles (Non‑Negotiable)
- **No overengineering**: ship the simplest working change. Avoid new abstractions, frameworks, or “future-proofing” unless there is a clear, current need.
- **Best-practice structure**: keep pages thin, push logic into feature modules, and keep shared UI reusable and dumb.
- **Clean Architecture**: dependencies must point inward (UI → features/use-cases → data/infrastructure). Never invert this.

## Project Structure & Clean Architecture Boundaries
- `src/app/`: Next.js App Router (routes/layouts). Pages should mainly compose features.
  - `(auth)`: `/login`, `/signup`
  - `(app)`: `/map`, `/feed`, `/chat`, `/chat/[roomId]`, `/mypage`
- `src/features/<domain>/`: domain slices (components + hooks + types). Example: `src/features/auth/`.
- `src/components/`: shared presentation-only components (`ui/`, `layout/`). **No data fetching here.**
- `src/lib/`: infrastructure helpers (API clients, auth storage, utils, mocks). Example: `src/lib/api.ts`, `src/lib/api/auth.ts`, `src/lib/auth.ts`.
- Rule of imports:
  - `app` can import `features`, `components`, `lib`
  - `features` can import `components`, `lib`
  - `lib` **must not** import `features` or `app`

## Development Commands
- `npm ci`: clean install (uses `package-lock.json`).
- `npm run dev`: local dev server (`http://localhost:3000`).
- `npm run lint`: ESLint (try `npm run lint -- --fix`).
- `npm run build`: production build sanity check.
- `npm run start`: run the built app.

## Coding Style & Naming
- TypeScript + React. Use alias `@/*` → `src/*` (see `tsconfig.json`).
- ESLint: `eslint.config.mjs` (underscore-prefixed unused vars/args allowed).
- Naming: components `PascalCase.tsx`, hooks `useXxx.ts`, utilities `camelCase`.
- Keep changes scoped: don’t reformat unrelated files.

## Testing & Verification
- No automated tests configured yet. Minimum before merging:
  - `npm run lint` and `npm run build`
  - manual smoke: `/login` → `/map` and `/feed`, `/chat`, `/mypage`

## API Contract & Sync (Backend is Source of Truth)
- Backend wire format is wrapped:
  - success: `{ data: payload }`
  - error: `{ error: { code, message, details? } }`
- Parse/unwrap in one place only: `src/lib/api.ts` (do not re-parse in pages/features).
- Do **not** copy backend contract docs into this repo. Keep frontend docs as:
  - binding notes (which screen calls which endpoint)
  - checklists for required fields/UI mapping
- Canonical contract docs live in the backend repo under `docs/`.
  - In this workspace: `dog-walk_backend/dog-walk_back/docs/API_RESPONSE_FORMAT.md`, `dog-walk_backend/dog-walk_back/docs/AUTH_API.md`

## Docs Workflow (AI Collaboration)
- Document index: `docs/README.md` (entry point).
- Long-term sequence and phase goals: `docs/PLAN_FRONTEND.md`.
- Frontend-backend API binding checklist: `docs/API_CHECKLIST_FRONTEND.md`.
- Active execution status (single source of truth): `docs/TASK_BOARD.md`.
- Review snapshot and pre-release checks: `docs/REVIEW_CHECKLIST_FRONTEND.md`.
- Architecture/onboarding reference: `docs/PROJECT_STRUCTURE.md`.
- Avoid duplicate content across docs. Keep one owner doc per topic and link from others.
- Progress updates belong only in `docs/TASK_BOARD.md`; do not track status inside roadmap/API docs.

### Required Input for AI Task Requests
- For implementation tasks, provide these docs explicitly:
  1) `docs/PLAN_FRONTEND.md`
  2) `docs/API_CHECKLIST_FRONTEND.md`
  3) `docs/TASK_BOARD.md`
- For review/inspection tasks, also include:
  4) `docs/REVIEW_CHECKLIST_FRONTEND.md`
- `docs/README.md` alone is not enough; include the actual working docs above.

## PR / Docs / Config
- Commits are short and descriptive (Korean/English mixed in history).
- PRs: summary + verification steps + screenshots for UI changes.
- Don’t commit secrets. `.env` should use **no spaces**: `NEXT_PUBLIC_API_URL=http://localhost:3001`.
- `docs/API_CHECKLIST_FRONTEND.md` is a frontend checklist (not a contract source of truth). Keep it aligned with backend behavior.
