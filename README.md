# Heartbeat Lab — Self-Powered Pacemaker

An interactive, English-language scientific visualization based on the supplied 10-second reference clip. The experience translates its visual sequence into five explorable chapters with a procedurally modeled heart, a layered triboelectric nanogenerator (TENG), and a hands-on contact/separation simulation.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

## Explore

- Scroll through the five chapters or choose one from the chapter rail.
- Select **Free explore** to rotate the 3D scene by dragging or touch and zoom with the wheel or pinch gesture. Arrow keys rotate and `+` / `−` zoom while the scene is focused.
- Select the heart or an anatomical callout to focus the view and open an explanation.
- Compare the conventional battery-powered system with the experimental TENG concept.
- Explode or assemble the device layers, adjust their transparency, and select a layer to inspect its role.
- Step through the four TENG stages or play the cycle. Move the layer-separation control to update the gap, charge visualization, circuit particles, meter needle and schematic waveform.
- Use **Replay scene**, **Pause animations** and **Reset view** at any point.

## Reference-video reconstruction

The video sequence and its translation into the website are documented in [`docs/reference-video-analysis.md`](docs/reference-video-analysis.md).

## 3D model scope and scientific limits

The project uses procedural Three.js geometry rather than downloaded anatomical or device meshes. This keeps the visualization self-contained and makes the interactive models easy to inspect, but the heart is an anatomically inspired educational approximation rather than a clinical or surgical model. The nanofiber mesh is illustrative rather than a measured micrograph or material specification. The waveform and meter are schematic; no voltage, power, safety, longevity or clinical-performance claims are encoded.

Conventional pacemakers are established medical devices. TENG-assisted self-powering is presented only as an emerging research concept, not as an approved replacement or a clinically validated device design.

## Implementation

- React, TypeScript, Vite
- Three.js, React Three Fiber and Drei
- GSAP ScrollTrigger for chapter detection and transitions
- Tailwind CSS (Vite plugin) with a custom responsive scientific-visualization theme
- No external 3D assets or image substitutes are used

Third-party library credits: [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [Drei](https://drei.docs.pmnd.rs/), [GSAP](https://gsap.com/), and [Tailwind CSS](https://tailwindcss.com/).
