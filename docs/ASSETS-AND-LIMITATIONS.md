# Asset provenance and model limitations

## Original geometry

Every displayed primary object is real geometry authored for this project: torso shell, ribs, lungs, heart surface, atrial forms, major vessels, coronary guides, conduction nodes, leads, pacemaker shell, battery, generator layers, nanofiber mesh, circuit traces, storage and schematic meter.

No third-party GLTF/GLB anatomical asset was downloaded. A suitably licensed, medically reviewed anatomical asset was not available in the supplied materials. The feasible alternative is procedural anatomy, openly identified in the exhibit and here. The heart is recognizable but not a high-fidelity anatomical reconstruction. The torso is a simplified upper-body shell without a head or full arms; internal structures are contextual approximations. These models must not be used for clinical planning, implant design, or medical training requiring anatomical precision.

- Procedural tissue bump data: original generated grayscale texture.
- Nanofibers: original seeded curve geometry, deliberately magnified; not microscopy data.
- Geometry and shading use Three.js, React Three Fiber and Drei; see installed package licenses for their terms.
- UI icons: original inline SVG paths. Fonts: local system sans-serif and monospace; no font service or external asset request.
- Reference MP4: user-supplied WhatsApp video, preserved solely for project reference. Ownership and redistribution permissions were not independently established. It is not copied into `dist/` or used as an application scene.
- Timeline and poster: extracted from the user-supplied reference for internal documentation.

## Physical and scientific limits

The heart beat is a visual deformation rather than a biomechanical model. Cardiac conduction is projected on the exterior for visibility; real activation is a complex three-dimensional process. No blood flow, tissue electrophysiology, mechanical loading, biocompatibility, encapsulation validation, or safe fixation is simulated.

The generator surface pairing and layer architecture are illustrative. The signed, unitless response curve follows normalized motion; it does not solve triboelectric charge transfer, electrostatic fields, load impedance, or circuit dynamics. Field guides and charge signs are qualitative. Clinical viability and sufficient usable energy are not established. Conventional pacemakers continue to depend on their validated power systems.

## Performance and accessibility

Chapter-specific generator and system code is loaded on demand. Geometry is reused within each model; nanofibers are merged into one geometry. Signal particles are instanced. Device pixel ratio is capped at 1.75 desktop and 1.35 mobile; low-power mode uses DPR 1, fewer atmospheric points, and no real-time shadows. The scene uses bounded geometry and no external textures, HDR environments, model downloads, audio, or video at runtime.

The main renderer uses one canvas. Models release geometry, material, and procedural texture resources on unmount. ScrollTrigger instances, RAF loops, event listeners and timers have cleanup. No React state is updated every 3D frame; simulation readouts update at a throttled rate. The pause control halts beats, signal particles, the simulation clock and guided-tour advancement. Camera changes caused by deliberate selection remain available while paused.

Reduced motion starts autonomous animation and cycle playback paused; camera transitions jump to their targets. Controls and explanation buttons are keyboard accessible. Non-WebGL operation retains all chapter text, the component inspector, manual controls, and the schematic waveform alongside an informative graphics fallback. Mobile uses a shorter 3D viewport, compact chapter controls, and a scrollable information panel rather than shrinking the desktop layout.
