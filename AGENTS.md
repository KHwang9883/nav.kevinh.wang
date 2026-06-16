# AGENTS.md

## Project

Chinese-language navigation/bookmark site built with Nuxt 4 + Tailwind CSS. Static site generated via Nitro prerender. Deployed at https://nav.kevinh.wang/.

## Commands

- **Dev server:** `bun run dev`
- **Build:** `bun run build`
- **Static generate:** `bun run generate`
- **Preview production:** `bun run preview`
- **Install deps:** `bun install`
- **Postinstall (auto):** `nuxt prepare` — regenerates `.nuxt/` types

No lint, test, or typecheck scripts are configured. Run `nuxt typecheck` manually if needed (not in package.json).

## Package Manager

Bun 1.3.14 (declared in `packageManager` field). Do not use npm/yarn.

## Architecture

### Data-driven navigation

All site content comes from YAML files in `data/`. The server API (`server/api/data.ts`) reads them at request time:

1. `data/webstack.yml` — defines menu structure, site metadata (favicon, banner, logos), and about page config. Each menu item has a `config` key referencing a YAML filename (without `.yml`).
2. Other `data/*.yml` files — category data (e.g., `aiChat.yml`, `gamePlatforms.yml`). Each is an array of `NavItem` objects.

The API assembles the full nav tree by matching `config` keys to YAML files. To add/rename/reorder categories, edit `webstack.yml`. To add/remove items, edit the corresponding category YAML.

### Data model (`composables/useNavData.ts`)

```typescript
interface NavItem {
  name: string
  url: string
  img: string           // path under /public/images/
  description: string
  foss?: boolean        // free/open-source tag
  paid?: boolean        // paid tag
  affiliate?: boolean   // affiliate link tag
  require_proxy?: 'required' | 'optional'  // proxy indicator
  hot?: boolean         // hot badge on name
  abandoned?: boolean   // abandoned badge on name
  winget?: string       // Windows winget package ID (e.g., "ZhipuAI.ChatGLM")
}
```

### Component flow

`app.vue` → `NuxtPage` → `pages/index.vue` (fetches via `useNavData()`) → `layouts/default.vue` → `Sidebar` + `CategorySection` → `LinkCard`.

### Image assets

All item images live in `public/images/` and are referenced as `/images/<name>.png` in YAML `img` fields.

### About page

Markdown content loaded from `data/about.md` via `marked`. Rendered server-side in the API handler.

## Conventions

- **Chinese UI text** throughout — all user-facing strings are in Simplified Chinese.
- **Dark mode** uses `@nuxtjs/color-mode` with class strategy (`darkMode: 'class'` in Tailwind). The `classSuffix` is `''` (empty), so the class is literally `dark`.
- **Color palette** is custom-defined in `tailwind.config.ts` under `theme.extend.colors` — sidebar, card, and dark-mode semantic tokens. Do not use Tailwind defaults for these; use the custom tokens.
- **Font:** Arimo (loaded via CSS `font-family` in `main.css`, not via Nuxt module).
- **Icons:** Font Awesome 6.5.1 loaded from CDN (in `nuxt.config.ts` head link). Use `fab fa-*` / `fas fa-*` / `far fa-*` classes.
- **CSS approach:** Extensive custom component classes in `assets/css/main.css` with `@layer components`. Light/dark mode handled via `.dark` prefix selectors. Tailwind utility classes used in templates.

## Gotchas

- Adding a new category requires TWO changes: create the YAML data file AND add a `config` entry in `webstack.yml` menu.
- The `bun.lock` file is committed; `bun.lockb` is gitignored. Use `bun install` to restore from lockfile.
- Nuxt devtools are disabled (`devtools: { enabled: false }`).
- Prerender only crawls `/` and its links (`crawlLinks: true` in `nitro.prerender`).
