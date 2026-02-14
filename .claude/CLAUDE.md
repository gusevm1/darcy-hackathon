# darcy-hackathon — Project Instructions

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Package Manager:** pnpm
- **Node Version:** 22
- **Deployment:** Vercel
- **Linting:** ESLint + Prettier

## Project Structure
- `src/app/` — App Router pages, layouts, and route handlers
- `src/components/ui/` — shadcn/ui components (managed by CLI, do not edit directly)
- `src/components/shared/` — Custom reusable components
- `src/lib/` — Utility functions and helpers
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions
- `src/config/` — App configuration constants

## Branching Strategy
- `main` — Production. Protected. Deploy on push.
- `develop` — Integration branch. CI runs on push.
- `feature/*` — New features. Branch from `develop`.
- `fix/*` — Bug fixes. Branch from `develop`.
- `chore/*` — Maintenance tasks. Branch from `develop`.

## Conventions
- Use Server Components by default; add `'use client'` only when needed (event handlers, hooks, browser APIs)
- Use functional components with TypeScript
- Prefer named exports over default exports
- Use `async`/`await` over `.then()` chains
- Keep components small and focused (< 150 lines)
- Co-locate tests next to source files (`*.test.ts`)
- Use the `cn()` helper from `@/lib/utils` for conditional class names
- Import from path aliases: `@/components/...`, `@/lib/...`, `@/hooks/...`
- Follow the existing Prettier configuration (no semicolons, single quotes)
- Use `pnpm` for all package management commands

## Adding shadcn/ui Components
This project has the shadcn MCP server configured. You can:
- Browse available components by asking about the shadcn registry
- Install components with: `pnpm dlx shadcn@latest add <component-name>`
- Components are installed to `src/components/ui/`
- Do NOT manually edit files in `src/components/ui/` — use the CLI to update them

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

## Key Commands
- `pnpm dev` — Start development server (Turbopack)
- `pnpm build` — Production build
- `pnpm lint` — Run ESLint
- `pnpm format` — Format code with Prettier
