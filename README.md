# NeuroKine Twin Studio UI Prototype (v0.4 Demo-Ready)

## Overview
NeuroKine Twin Studio v0.4 is a local-first UI prototype for configuring digital twin recipes, previewing mock results, running scenarios, and applying correction clips. The prototype is front-end only (mock data + local JSON) and designed for fast iteration with a complete Preview → Bake → Export demo loop.

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

## Demo Script (30 seconds)
1. Launch the app and confirm the auto Preview run populates the Timeline + 3D viewport.
2. Click **Bake** to generate high-fidelity results (watch progress + status).
3. Toggle GT/Twin/CI in the viewport and scrub the playhead on the Timeline.
4. Click **Export** to save a single JSON bundle (listed under Export & Reports).

## Build
```bash
npm run build
```

## Lint / Format
```bash
npm run lint
npm run format
```

## Export Output (v0.4)
Export emits a single JSON bundle:
- `twin_bundle_<trial>_<timestamp>.json`
- Includes: `recipe`, `run_result`, `provenance`, `macros`, `scenario_set` (if present), `correction` (if present)

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

## Mock TwinCore Engine
The mock engine lives in `src/mock/twinCore.ts` and produces deterministic outputs from:
`trial_id`, `mode`, `do_window`, `recipe`, `seed`, `runMode`, `calibrationVersion`.
- Same inputs + seed return identical outputs.
- `prediction.twin_pose` is generated with noise from `recipe.eeg.noise_sigma`.
- `ood_level` responds to noise + sync jitter.
- Timeline tracks are synthesized for QC/TwinScore/OOD.

## Engineering Conventions
- Feature components < 250 LOC.
- Zustand is the single source of UI state.
- Recipe is treated as first-class data (import/export + presets).
- Timeline and 3D viewport are mock implementations but interactive.
- Scenario Lab produces mock rollout results and variant comparison.
- Correction clips are stored as JSON for later API integration.

## v0.4 Additions
- Unified RunState with Preview/Bake/Rollout/Sweep/Export flows.
- Demo-ready layout with Side Rail navigation and Results Drawer tabs.
- Mock TwinCore engine with deterministic outputs + explainability.
- 3D viewport and Timeline share a unified playhead.
- Export bundles emitted as a single JSON artifact.

## Data Structures (v0.3)
- `Macro`: independent recipe patches with import/export support.
- `ScenarioSet`: base recipe + 2 variants with horizon/sample settings.
- `CorrectionClip`: per-time pose offsets with `local_fix` or `calibrate_hint` apply mode.
- `RunResult.provenance`: includes `raw_fingerprint` and `feature_snapshot_version`.

## Known Limitations
- Sweep panel is a basic heat table, not a true chart.
- No backend integrations (all mock + local state).

## Next Steps
- Replace mock RunResult with real inference API.
- Add charting for sweep heatmap + timeline overlays.
- Add validation and schema for recipe JSON.
