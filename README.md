# AI Design System v1

A starter repo for building with a **design system that lives inside your project** — not as an npm package. Built for AI-assisted design and code generation workflows where the AI has direct access to components, tokens, and theme definitions.

Used in [AI Design Workflow](https://aidesignworkflow.com) classes.

## Why This Approach?

Some of you might have this setup. If you do, this is for you. There is another repository (coming soon) that demonstrates use of an npm package for the design system.

## What's Included

### Design Tokens (`src/tokens/tokens.css`)

CSS custom properties organized as semantic tokens:

- **Colors** — primitive scales (gray, blue, red, green, amber, teal, purple) mapped to semantic roles (background, text, border, icon)
- **Spacing** — 4px base scale (`--ds-spacing-1` through `--ds-spacing-24`)
- **Typography** — sizes, weights, line heights, font families (Geist Sans & Mono)
- **Sizing** — component heights, icon sizes, container widths
- **Borders, Shadows, Motion, Z-index** — all tokenized

### Components (`src/components/`)

21 production-ready components, all using `forwardRef`, accepting `className`, and built with Tailwind CSS + semantic tokens:

| Category | Components |
|---|---|
| **Form** | Button, TextInput, Checkbox, Toggle, Select, Dropdown, DatePicker, Search |
| **Display** | Tag, Modal, DataTable, Pagination, Tabs |
| **Navigation** | Header, SideNav, Breadcrumb, OverflowMenu |
| **Notification** | Notification, Toast, Banner |
| **Loading** | Spinner, Skeleton |

### Theming (`src/context/ThemeProvider.js`)

Runtime theme switching with three built-in themes:

- **Light** (default)
- **Dark**
- **High Contrast** (WCAG AA accessible)

Themes persist to `localStorage` and are applied via `data-theme` attribute on `<html>`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the component showcase page.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Lucide React** (icons)

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Tailwind + token imports
│   ├── layout.js          # Root layout with Geist fonts
│   ├── page.js            # Component showcase (replace with your app)
│   └── providers.js       # ThemeProvider wrapper
├── components/            # All design system components
│   ├── Button/
│   ├── DataTable/
│   ├── Modal/
│   ├── ...
│   └── index.js           # Barrel export
├── context/
│   └── ThemeProvider.js   # Theme context + hook
└── tokens/
    └── tokens.css         # All design tokens
```

## Using with AI Tools

Point your AI tool at this repo and it can:

1. **Generate new pages** using existing components and tokens
2. **Create new components** that follow the established patterns (forwardRef, semantic tokens, Tailwind arbitrary values)
3. **Extend the theme** by adding token values to `tokens.css`
4. **Build layouts** using the Header + SideNav shell pattern

Reference `DESIGN_SYSTEM.md` in the repo root for a comprehensive guide to all tokens, components, and conventions — useful both for developers and AI context.

## Customization

- **Add components** — create a folder in `src/components/` and export from `index.js`
- **Add tokens** — extend `src/tokens/tokens.css` with new custom properties
- **Add themes** — add a new `[data-theme="your-theme"]` block in `tokens.css` and register it in `ThemeProvider.js`
- **Replace the showcase** — swap out `src/app/page.js` with your actual application

## Learn More

- [AI Design Workflow](https://aidesignworkflow.com/learn) — classes on AI-assisted design and development
- [AI Design System Blog](https://aidesignworkflow.com/blog) — articles on design systems, and AI tools
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
