# sandbox-frontend

A personal portfolio frontend built with [Next.js](https://nextjs.org) 16, React 19, TypeScript, and SCSS.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org) 5 (strict)
- [Sass](https://sass-lang.com) (CSS modules + design tokens)

## Getting Started

First, install dependencies (this repo uses [pnpm](https://pnpm.io)):

```bash
pnpm install
```

Then run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Available scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |

## Project structure

```
src/
├── app/              # Next.js App Router (layout, page, globals)
├── components/       # React client components (ThemeProvider, Navbar, Container)
└── styles/           # SCSS design tokens, reset, mixins, fonts, animations
```

## Theming

A light/dark theme toggle persists to `localStorage` and follows the OS color scheme via `matchMedia`. The active theme is reflected in a `data-theme` attribute on `<html>`, and colors are exposed as CSS custom properties defined in `src/app/globals.scss`.

## Deploy

The easiest way to deploy is on [Vercel](https://vercel.com/new).
