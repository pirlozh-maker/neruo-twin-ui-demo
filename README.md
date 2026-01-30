# NeuroKine Twin Studio UI Prototype

## Overview
NeuroKine Twin Studio v0.3 is a local-first UI prototype for configuring digital twin recipes, previewing mock results, running scenarios, and applying correction clips. The prototype is front-end only (mock data + local JSON) and designed for fast iteration.

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

## Export Output
Export will emit:
- `provenance.json`
- `recipe.json`
- `macros.json`
- `scenario_set.json` (if present)
- `correction.json` (if present)
- `run_result.json` (if available)

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
- Scenario Lab produces mock rollout results and variant comparison.
- Correction clips are stored as JSON for later API integration.

## v0.3 Additions
- Macro Dock (JSON import/export + apply macros).
- Scenario Lab with Base + 2 variants, horizon/sample config, and mock rollout results.
- Correction Mode for editing twin pose and generating `CorrectionClip` JSON.
- Extended provenance with `raw_fingerprint` and `feature_snapshot_version`.
- Job queue with cancel for Bake/Scenario/Sweep.

## Data Structures (v0.3)
- `Macro`: independent recipe patches with import/export support.
- `ScenarioSet`: base recipe + 2 variants with horizon/sample settings.
- `CorrectionClip`: per-time pose offsets with `local_fix` or `calibrate_hint` apply mode.
- `RunResult.provenance`: includes `raw_fingerprint` and `feature_snapshot_version`.

## Known Limitations
- Three.js canvas is a placeholder with simple point cloud + knot animation.
- Sweep panel is a basic heat table, not a true chart.
- Export emits multiple JSON files instead of a zip bundle.

## Next Steps
- Replace mock RunResult with real inference API.
- Add charting for sweep heatmap + timeline overlays.
- Add validation and schema for recipe JSON.
