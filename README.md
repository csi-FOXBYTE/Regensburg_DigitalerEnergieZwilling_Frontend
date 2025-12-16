# Astro Starter Kit: Minimal

```sh
pnpm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Folder Structure

```
/src
  ├── /shared                  # Shared Kernel
  │   ├── /ui                  # STRICTLY "dumb" UI components (Buttons, Inputs). No business logic.
  │   ├── /lib                 # Generic utilities (formatting, date helpers)
  │   ├── /api                 # The configured Axios/Fetch wrapper (Section 3.4)
  │   ├── /auth                # Passive Auth Client (checkSession)
  │   └── /events              # Type definitions for the Window Event Bus (Section 3.5)
  │
  ├── /modules                 # The Core Business Logic
  │   ├── /cart                # Example Module "Island"
  │   │   ├── /components      # React components specific ONLY to Cart
  │   │   ├── /context         # React Context for Cart State (Section 3.3)
  │   │   ├── /hooks           # Business logic hooks (e.g., useCartCalculations)
  │   │   ├── /types           # TypeScript interfaces for this module
  │   │   ├── CartIsland.tsx   # The Entry Point (The component Astro loads)
  │   │   └── index.ts         # Public API (What parts of this module can be imported?)
  │   │
  │   └── /user-profile        # Another Module...
  │
  ├── /pages                   # Astro Routing
  │   ├── index.astro
  │   └── ...
  │
  ├── /layouts                 # Global Astro Layouts (HTML Shell)
  └── /locales                 # i18n Namespaces
```

## Create a new module

```
pnpm create:module <module_name>
```
