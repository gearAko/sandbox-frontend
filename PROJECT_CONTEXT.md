# Project Context — sandbox-frontend

This file records project conventions and architectural decisions so a **future
session** can continue without additional input. It is not session-specific; it
is the project reference.

## Component directory structure

Every component lives in its own directory under `src/components/<Component>/`
with at most these files:

```
src/components/<Component>/
  index.ts              — barrel: exports everything from this component
  <Component>.tsx       — component implementation
  <Component>.module.scss — SCSS module styles
  <Component>.types.ts  — TypeScript types/interfaces (optional, if props exist)
```

Example:

```
src/components/Container/
  index.ts
  Container.tsx
  Container.module.scss
  Container.types.ts
```

Every importable directory has a barrel `index.ts`. The `src/styles/` directory
has `src/styles/index.scss` (SCSS barrel, not `.ts` since styles are SCSS).

## Path aliases

`tsconfig.json` defines one alias:

```json
"paths": { "@/*": ["./src/*"] }
```

All **JS/TS local imports** must use the `@/` alias. External packages
(`react`, `next/link`, `lucide-react`, `next/font/google`) stay as bare
specifiers.

**SCSS imports:** Sass does not understand the `@/` path alias in `@use` /
`@forward` directives, so SCSS uses **relative file paths** instead.

## Import grouping rule (JS/TS)

**Each module path is imported once per file.** All named bindings from the
same module are grouped into a single import statement. Do not split imports
from the same source into multiple lines.

**Local vs alias usage (JS/TS):**
- Same directory → relative `./` import (styles, types, barrel within the
  same component folder).
- Different component directory or outside `src/components/` → `@/` alias.

Examples:

```tsx
// Same directory — relative import
import styles from "./Container.module.scss";
import type { ContainerProps } from "./Container.types";

// Different component directory — alias import
import { Container } from "@/components/Container";
import { useTheme } from "@/components/ThemeContext";

// External package — bare specifier
import Link from "next/link";
import { useState } from "react";
```

Barrel files (`index.ts`) use relative `./` imports since they re-export from
files in their own directory:

```tsx
// src/components/Container/index.ts
export { Container } from "./Container";
export type { ContainerProps } from "./Container.types";
```

A top-level `src/components/index.ts` re-exports from each component directory:

```tsx
import { Navbar, Footer, ThemeProvider } from "@/components";
import { Container, Subheader } from "@/components";
```

Components re-exported by the top-level barrel **must not import from the
barrel itself** (circular import). They import their direct sub-path instead:

```tsx
// Navbar.tsx (barrel member) — imports ThemeContext directly, not from @/components
import { useTheme } from "@/components/ThemeContext";
```

## SCSS import conventions

- Every `.module.scss` begins with `@use "../../styles/variables" as *;`
  (relative path from `src/components/<Component>/` up to `src/styles/`).
- Files in `src/app/` use `@use "../styles/variables" as *;` (relative from
  `src/app/` to `src/styles/`).
- Mixins are imported without a namespace:
  `@use "../../styles/mixins";` then `@include mixins.breakpoint(...)`.
- The `src/styles/index.scss` barrel forwards only module-safe partials
  (`variables`, `mixins`, `animations`). It does **not** forward `reset` or
  `fonts` because those contain global styles that cannot be used inside CSS
  Modules.
- Components import `variables` and `mixins` directly, never the full barrel,
  to avoid pulling global reset selectors into CSS Modules.

Color values come from CSS custom properties set in `src/app/globals.scss`:
`var(--bg)`, `var(--fg)`, `var(--primary)`, `var(--muted)`, `var(--border)`,
plus `var(--primary-hover)`, `var(--shadow-color)`.

Spacing tokens live in `src/styles/_variables.scss`: `$space-xs`, `$space-sm`,
`$space-md`, `$space-lg`, `$space-xl`. Breakpoints: `$bp-sm` (640px),
`$bp-md` (768px), `$bp-lg` (1024px), `$bp-xl` (1280px).

## Type and interface naming

All types are prefixed with `T`, all interfaces with `I`. Interface names do not
include redundant suffixes like `Type` — the `I` prefix already indicates an interface.

- Types: `TContainerProps`, `TTheme`
- Interfaces: `IThemeContext` (not `IThemeContextType`)

This applies to declarations, imports, and barrel exports:

```tsx
export type TContainerProps = { ... };
export interface IThemeContext { ... };
import type { TContainerProps } from "./Container.types";
export type { TTheme, IThemeContext } from "./ThemeContext";
```

Mixins live in `src/styles/_mixins.scss` (e.g.
`@include mixins.breakpoint($bp-sm)`).

## Container component (`src/components/Container/`)

Every section uses `Container`, which is now **full width**:

- Outer `.container`: `width: 100%`, `background-color: red` (intentional — red
  stripe so full-width vs block is visually distinct).
- Inner `.block`: `max-width: 1200px`, `margin: 0 auto`,
  `background-color: var(--bg)`, `color: var(--fg)`.
- Usage: `<Container id="about" className={styles.section}>{children}</Container>`.
  The `className` prop applies to the **inner block**, so existing section
  styling (padding, borders) still works.

## Layout shell (`src/app/layout.tsx`)

Shared shell lives here so it persists across route changes (not remounted):

```
ThemeProvider
  Navbar           (global sticky nav, Home link + theme toggle)
  main > children  (page-specific content)
  Footer           (separate component, rendered directly, not wrapped in Container)
```

`Navbar` no longer contains About/Projects/Contact — those are homepage-only and
live in `Subheader`. `Footer` is its own component (`src/components/Footer/`).

## Homepage-specific pieces (`src/app/page.tsx`)

- `Subheader` (`src/components/Subheader/`): About / Projects / Contact
  anchor links, rendered inside the hero section only.
- All sections (`hero`, `about`, `projects`, `contact`) are `<Container>`
  instances → full-width red stripes with centered `var(--bg)` blocks.

## Theme system (`src/components/ThemeContext/`)

- `ThemeProvider` wraps `children` in `layout.tsx`.
- Initial theme is `"light"` on the server to avoid hydration mismatch; stored
  preference / OS preference applied in `useEffect` after hydration.
- `document.documentElement.setAttribute("data-theme", theme)` drives dark mode.
- `useTheme()` hook throws if used outside `ThemeProvider`.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build (includes TypeScript check)
- `pnpm start` — start production server
- `pnpm lint` — run ESLint

## Files of note

- `src/styles/_variables.scss` — color palette, spacing, breakpoints, transitions
- `src/styles/_reset.scss` — box-sizing, margins, base body styles (global, not module-safe)
- `src/styles/_mixins.scss` — reusable SCSS mixins
- `src/styles/_fonts.scss` — font imports (global, not module-safe)
- `src/styles/_animations.scss` — animations (module-safe)
- `src/styles/index.scss` — barrel forwarding module-safe partials only
- `src/app/globals.scss` — sets CSS custom properties (`--bg`, `--fg`, etc.) per
  color mode, imports reset/fonts/animations globally
- `src/app/page.module.scss` — page-specific styles (hero, section, buttons,
  cards)
- `next.config.ts` — minimal Next.js config

## Recent decisions (do not revert without discussion)

1. Every `Container` is full width with a red outer background.
2. Inner block is `max-width: 1200px` with `background-color: var(--bg)`.
3. Navbar and Footer live in `layout.tsx`; page.tsx holds only page content.
4. About/Projects/Contact links moved from Navbar → `Subheader` (homepage only).
5. Footer is a standalone `Footer` component, rendered directly in layout
   (not wrapped in Container).
6. All local JS/TS imports use `@/` alias; each module path imported once,
   grouped.
7. Each component has its own directory
   (`src/components/<Component>/`) with `index.ts`, `<Component>.tsx`,
   `<Component>.module.scss`, and optionally `<Component>.types.ts`.
8. Same-directory JS/TS imports use relative `./`; cross-directory use `@/`.
9. SCSS does **not** support `@/` aliases — use relative paths. Components
   import `variables`/`mixins` directly, never the full styles barrel, to avoid
   pulling global reset selectors into CSS Modules.
10. Barrel files (`index.ts`) re-export from their own directory using `./`.
    Barrel members do not import from the barrel itself.
