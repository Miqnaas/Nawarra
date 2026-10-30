# Validation record — 2026-10-30

## Installed and built

- Node.js 24.19.0.
- `npm ci --no-audit --no-fund`: passed from the committed-format npm lockfile.
- `npm test`: **3 tests executed, 3 passed**, no skipped tests. Checks cover all four mechanism stages, cycle continuity, response direction, stationary manual input, and extreme-input clamping.
- `npm run build`: passed. Includes `tsc --noEmit`, then a complete Vite production build.
- `git diff --check`: passed.
- Vite development server started successfully. Production output was served with `npm run preview -- --port 4173` and tested separately from development.

Vite reports a size advisory for the bundled Three.js core (~704 kB before gzip; ~181 kB gzipped). It is not a build failure. Generator and energy-system scene modules are separate lazy-loaded chunks. No source MP4, poster, or contact sheet is copied into `dist/`.

## Browser journey

System Chromium with software WebGL (SwiftShader), desktop **1440 × 1000**, mobile **390 × 844**. Opening rendering was inspected with balanced graphics; extended interaction checks used low-power mode to keep software rendering practical.

Verified in the production build:

- All five chapters reached through the floating navigation and ScrollTrigger-driven document scrolling.
- English document language, English rendered content, and absence of any video player.
- 3D heart/torso canvas renders; conduction/anatomy toggle; SA node and anatomical explanations.
- **Direct 3D raycast picking** on the ventricular surface opens the corresponding inspector and focus action.
- **Actual drag rotation**, demonstrated by changed rendered anatomy while autonomous motion was paused.
- Camera focus, reset, zoom, labels on/off, free exploration, and global pause controls.
- Conventional versus TENG-assisted energy-source comparison and component inspection.
- Generator assemble/explode, individual layer inspection, transparency, and magnified fiber focus.
- Rendered assembly images change between assembled and exploded geometry while autonomous animation is paused.
- Four simulation stages, previous/next, replay, speed, cycle play/pause, and manual layer separation.
- Manual contact/separation changes the rendered geometry. Zero separation reaches the contact state; full separation reaches the separation state. The meter and schematic waveform share the displacement/response sample with the 3D charges and electron path.
- Final conditioning/storage/electronics explanations and complete-system camera reset.
- Guided tour automatically advances to the next chapter; scene navigation remains available.
- About dialog, native Escape closing, component inspector Escape closing.
- Mobile chapter navigation, assembly controls, manual separation, and no document horizontal overflow.
- Reduced-motion preference starts the global animation state paused.
- No browser page errors or console errors in the successful final production interaction checks.

A direct-picking check caught a narrative-overlay hit-testing issue after button-based checks had passed. The story container now ignores pointer events while interactive HUD panels explicitly accept them; direct surface selection and drag rotation were retested successfully. Tests also wait for the first projected 3D frame before sending a raycast click.

## Forced graphics fallback

A separate Chromium run disabled WebGL completely. The application showed its informative graphics fallback and retained English chapter descriptions, chapter navigation, material inspection, manual layer controls, stage stepping, and the unitless schematic waveform. Keyboard Escape closed component explanations. These checks passed.

## Evidence and limits

- [Desktop opening](screenshots/heart-desktop.png)
- [Exploded generator](screenshots/generator-desktop.png)
- [Mobile opening](screenshots/heart-mobile.png)

Mechanism tests are included in `tests/simulation.test.ts`. Browser automation was executed externally during implementation and is not an installed project test suite. Screenshots document inspected states rather than every animation frame.

No medical validation, anatomical expert review, calibrated electrical-output validation, real mobile-device benchmark, public hosting deployment, environment publication, or new-task snapshot restoration was performed. Procedural anatomical and scientific limitations are documented in `ASSETS-AND-LIMITATIONS.md` and in the exhibit itself.
