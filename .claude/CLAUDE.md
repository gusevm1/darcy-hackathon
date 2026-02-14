# Project: darcy-hackathon

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Node Version**: 22
- **Deployment**: Vercel

## Branching Strategy
- `main` — Production. Protected. Deploy on push.
- `develop` — Integration branch. CI runs on push.
- `feature/*` — New features. Branch from `develop`.
- `fix/*` — Bug fixes. Branch from `develop`.
- `chore/*` — Maintenance tasks. Branch from `develop`.

## Coding Conventions
- Use functional components with TypeScript
- Prefer named exports over default exports
- Use `async`/`await` over `.then()` chains
- Keep components small and focused (< 150 lines)
- Co-locate tests next to source files (`*.test.ts`)
- Use absolute imports via `@/` path alias

## Git Conventions
- Write concise commit messages in imperative mood
- Reference issue numbers in commits when applicable
- Keep PRs focused — one feature/fix per PR
- Squash merge feature branches into develop
- Rebase develop onto main before release

## Before Committing
- Run `pnpm lint` — no warnings or errors
- Run `pnpm tsc --noEmit` — no type errors
- Run `pnpm test` — all tests pass
- Run `pnpm build` — build succeeds
