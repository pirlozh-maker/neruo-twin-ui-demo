# NeuroKine Twin Studio UI Prototype

## Overview
NeuroKine Twin Studio is a local-first UI prototype for configuring digital twin recipes, previewing mock results, and exploring timeline windows. The prototype is front-end only (mock data + local JSON) and designed for fast iteration.

## Requirements
- Node.js 18+
- npm (or pnpm/yarn, but scripts below use npm)

## Install
```bash
npm install
```

## Run (dev)
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Lint / Format
```bash
npm run lint
npm run format
```

## Project Structure
```
src/
  components/   # Shared UI atoms
  features/     # Feature-level UI panels
  pages/        # Route-level pages
  state/        # Zustand store
  mock/         # Mock data generators
  types/        # TypeScript types
  utils/        # Helpers (exporters, presets)
```

## Mock API Replacement
- Replace `src/mock/*.ts` with API calls.
- Wire API client functions in `src/utils/`.
- Keep `RunResult`/`Recipe` types intact to avoid UI refactors.

## Engineering Conventions
- Feature components < 250 LOC.
- Zustand is the single source of UI state.
- Recipe is treated as first-class data (import/export + presets).
- Timeline and 3D viewport are mock implementations but interactive.

## Known Limitations
- Three.js canvas is a placeholder with simple point cloud + knot animation.
- Sweep panel is a basic heat table, not a true chart.
- Export uses a single JSON bundle (zip can be added later).

## Next Steps
- Replace mock RunResult with real inference API.
- Add charting for sweep heatmap + timeline overlays.
- Add validation and schema for recipe JSON.
