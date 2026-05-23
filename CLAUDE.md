# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**MemeSense** — a React playground for an AI-driven meme generator (upload photo → AI captions → edit → share → reactions). The `package.json` name is still the Vite template default `react-playground`; the user-facing brand in `index.html` and `src/constants/app.js` is `MemeSense`. Much of the feature surface is scaffolded but unimplemented — see "WIP surface" below before assuming a feature works end-to-end.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built output
- `npm run lint` — ESLint flat config across `**/*.{js,jsx}`

No test runner is configured. JS only (no TypeScript), despite `@types/react` being installed.

## Architecture

### Routing — hand-rolled, not react-router
`src/app/router/AppRouter.jsx` matches routes off `window.location.pathname` and re-renders on `popstate`. **All navigation must go through `navigateTo(path)` in `src/app/router/navigation.js`**, which calls `history.pushState` and then dispatches a synthetic `PopStateEvent` to trigger the re-render. Calling `history.pushState` directly will silently fail to update the route. Routes: `/` Home, `/upload`, `/cooking`, `/results`, `/create`, `/editor/:id`, `/share/:id`, `/m/:id`, `/dashboard/:id`.

### Shared flow state — `MemeFlowContext`
The 4-step meme flow shares state through one React context in `src/state/`:
- `memeFlowContext.js` — bare `createContext` export
- `MemeFlowContext.jsx` — `MemeFlowProvider` with `useState` + memoised setters
- `useMemeFlow.js` — `useContext` hook that throws if used outside the provider

The split (context object / provider component / hook in separate files) exists so `react-refresh` Fast Refresh doesn't get confused by files that export both a component and non-component values. Preserve this split when extending.

Flow shape: `{ userName, uploadedImage, suggestions, imageSummary, funnySignals, currentDraft }`. `uploadedImage.previewUrl` is a `blob:` URL from `URL.createObjectURL` — revoke it before replacing (see `UploadPage.handleImageSelected`).

### Feature-folder layout
```
src/
  app/           providers, router (composition root)
  features/<x>/  page + components/ hooks/ services/ state/ utils/
  components/    ui/ (Button, Card, Input...) and shared/ (AppHeader, StepRail...)
  layouts/       AppLayout (header/main/footer shell)
  services/      app-wide API (apiClient, getName)
  state/         MemeFlowContext + hook
  constants/     api.js, app.js
  styles/        global.css (single file, ~34KB, imported once in main.jsx)
```
Cross-feature code lives outside `features/`. Feature code imports up to `components/ui` and `state/` but features should not import from each other.

### Step rail
`StepRail` (`src/components/shared/StepRail.jsx`) renders the "Step N of 4" indicator. Steps are hardcoded `["Alias", "Upload", "Cooking", "Results"]`. Pages pass `activeStep={1..4}`; keep this in sync if you reorder the flow.

### Styling
One global stylesheet (`src/styles/global.css`) with plain class names — no CSS Modules, no styled-components, no Tailwind. New components should reuse existing class conventions (`card`, `button button-{variant}`, `eyebrow`, `home-blob`, etc.) rather than introducing new styling systems.

### API
`src/constants/api.js` hardcodes `API_URL = "http://localhost:8080/app/v1/test"` (expects a local backend on :8080). `src/services/apiClient.js` is a stub (`{ baseUrl: "/api" }`) that isn't wired up. Only `services/getName.js` performs a real fetch; the per-feature service files (`memeSuggestionService.js`, `reactionService.js`, `shareService.js`) currently return empty stubs.

## WIP surface

Many feature files are <300-byte stubs (single import + empty component). Treat the following as scaffolding, not working features, unless you've opened the file and confirmed otherwise:

- `features/editor/` — most components are stubs; only `editorReducer.js` is implemented
- `features/suggestions/`, `features/share/`, `features/reactions/` — pages and components are stubs
- `features/cooking/CookingLoadingScreen.jsx` — implemented, but uses a hardcoded 5s `setTimeout` (no real backend call)

Fully implemented pages: `HomePage`, `UploadPage`, `ResultsPage`, `CookingLoadingScreen` (cosmetically).

## Conventions

- React 19 + `<StrictMode>` is on in `main.jsx` — effects run twice in dev; write idempotent effects.
- ESLint enforces `react-hooks/recommended` and `react-refresh/vite`. The Refresh plugin warns if a file exports both a component and non-component values — this is why the context module is split (see above).
- React Compiler is intentionally **not** enabled (see `README.md`).
- Vite plugin is `@vitejs/plugin-react` (Oxc-based), not the SWC variant.
