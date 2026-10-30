# Nawarra — The Energy Within

A real-time, English-language biomedical 3D exhibit translating the supplied reference video into **five connected, explorable chapters**. No scene relies on video playback or static images.

## Run locally

Use **Node.js 24** (validated with 24.19.0) and npm. Node.js 22.18+ also supports the source-level TypeScript mechanism tests.

```sh
cd /workspace/Nawarra
npm ci
npm run dev
```

Vite uses port 5173 by default. If occupied, it prints the next available port. The server binds to `0.0.0.0`; use your development platform's supported port access. Start a new server in each fresh cloud task because processes are not preserved in snapshots.

## Build and deploy

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

Deploy **`dist/`** to a static host. No server backend, API keys, third-party model service, runtime font service, or remote asset fetch is required. Use the generated relative asset paths unchanged. The original reference MP4 is retained under `docs/reference/` and is not included in the deployed app.

## Explore

1. **The living engine** — transparent torso, beating heart, SA/AV nodes, anatomical components, conduction highlight, heartbeat speed, focus and 360° exploration.
2. **A different source** — conventional internal battery versus an explicitly experimental TENG-assisted concept, visible pacemaker and lead, animated supply paths.
3. **Inside the material** — six detailed rounded sheets, conductive tabs and mounting details, assemble/explode, per-layer inspection, transparency, magnified real-geometry PVDF fiber network.
4. **Make energy move** — contact electrification, contact, separation, electrostatic induction; previous/next stages, replay, play/pause, speed, manual layer movement, opposing surface charges, external electron stream, field guides, meter, and synchronized schematic response.
5. **The complete circuit** — motion-coupled harvester, conditioning board, storage, electronics, and animated electrical paths; inspect and focus each major component; pulled-back closing view.

Scroll or use the five-part chapter bar. **Guided view** supplies camera choreography; **Free exploration** allows drag-to-orbit through the full 360°. Use the zoom buttons, reset, label toggle, global animation pause, scene replay, and low-power graphics mode. **Begin the journey** advances through the guided chapters on a timer; pause or select Free exploration to interrupt it. Native scrolling remains available.

On mobile, the information panel scrolls independently to keep all controls reachable while retaining a visible 3D viewport. Keyboard users can inspect every major component from the chapter controls and close dialogs with Escape. Reduced-motion preferences start autonomous animation paused. A non-WebGL explanation and fully usable teaching controls remain if rendering is unavailable.

## Technical stack

React 19 + TypeScript + Vite, Three.js + React Three Fiber, Drei OrbitControls, GSAP + ScrollTrigger, Tailwind CSS. Original procedural PBR geometry and tissue bump data; instanced signal particles; merged nanofiber mesh. Chapter-specific generator/system modules are lazy-loaded. DPR caps, low-power mode, RAF cleanup, and Three.js resource disposal limit cost.

## Scientific and asset limitations

**Educational visualization of an emerging concept, not a clinically validated device design.** All anatomy is a procedural approximation, not a medically reviewed anatomical asset. The magnified fibers and layer dimensions are not to scale. The layer stack and unspecified opposing surface are illustrative. The bipolar response is **unitless and schematic**, follows prescribed displacement, and does not predict measured voltage, power, or clinical performance. Existing pacemakers still require their validated power systems.

- [Reference timeline and interactive translation](docs/REFERENCE-ANALYSIS.md)
- [Asset provenance and scientific/performance limitations](docs/ASSETS-AND-LIMITATIONS.md)
- [Validation record](docs/VALIDATION.md)

## Source map

- `src/App.tsx`: chapter navigation, ScrollTrigger choreography, guided tour, simulation clock, shared HUD.
- `src/state.tsx`: React interaction state and shared animation samples.
- `src/Experience.tsx`: canvas, lighting, atmosphere, camera rig, graphics fallback.
- `src/scenes/`: heart/torso, layered generator, energy system.
- `src/models/geometry.ts`: original procedural geometry and materials.
- `src/components/`: projected scientific hotspots, context controls, inspector, waveform, icons.
- `src/simulation.ts`: unitless contact/separation motion and illustrative response.
- `src/data.ts`: centralized English content, component descriptions and chapter copy. Future localization can replace this catalogue and document direction without changing the physics/geometry modules.
- `tests/simulation.test.ts`: mechanism boundary, direction and clamping checks.
