import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import type { SelectPart } from './types';

const HeartChapterScene = lazy(() => import('./Scenes').then((module) => ({ default: module.HeartChapterScene })));
const ComparisonScene = lazy(() => import('./Scenes').then((module) => ({ default: module.ComparisonScene })));
const IntegratedSystemScene = lazy(() => import('./Scenes').then((module) => ({ default: module.IntegratedSystemScene })));
const NanogeneratorScene = lazy(() => import('./Nanogenerator').then((module) => ({ default: module.NanogeneratorScene })));
const TriboelectricSimulation = lazy(() => import('./Nanogenerator').then((module) => ({ default: module.TriboelectricSimulation })));

const cameraViews: { position: [number, number, number]; target: [number, number, number] }[] = [
  { position: [0.22, 0.32, 7.65], target: [0, 0.04, 0.42] },
  { position: [0.05, 0.52, 6.55], target: [0.1, 0.08, 0.47] },
  { position: [0.1, 1.32, 7.15], target: [0.1, 0.02, 0] },
  { position: [0.28, 1.42, 7.3], target: [0.08, 0.02, 0] },
  { position: [0.14, 0.52, 8.05], target: [0.06, -0.12, 0.55] },
];

function CameraChoreography({
  chapter,
  focus,
  controls,
  resetKey,
  paused,
  reducedMotion,
}: {
  chapter: number;
  focus: [number, number, number] | null;
  controls: RefObject<OrbitControlsImpl | null>;
  resetKey: number;
  paused: boolean;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const transition = useRef(true);
  const desired = useMemo(() => {
    const preset = cameraViews[chapter] ?? cameraViews[0];
    if (!focus) return preset;
    return {
      target: focus,
      position: [focus[0] + 0.14, focus[1] + 0.16, focus[2] + 3.05] as [number, number, number],
    };
  }, [chapter, focus, resetKey]);

  useEffect(() => {
    transition.current = true;
  }, [desired]);

  useFrame((_, delta) => {
    if (reducedMotion) {
      camera.position.set(...desired.position);
      if (controls.current) controls.current.target.set(...desired.target);
      else camera.lookAt(...desired.target);
      transition.current = false;
      return;
    }
    if (!transition.current || paused) return;
    const alpha = 1 - Math.exp(-Math.min(delta, 0.08) * (focus ? 2.1 : 1.7));
    camera.position.lerp(new THREE.Vector3(...desired.position), alpha);
    if (controls.current) {
      controls.current.target.lerp(new THREE.Vector3(...desired.target), alpha);
      controls.current.update();
    } else {
      camera.lookAt(...desired.target);
    }
    if (camera.position.distanceTo(new THREE.Vector3(...desired.position)) < 0.025) {
      camera.position.set(...desired.position);
      if (controls.current) controls.current.target.set(...desired.target);
      transition.current = false;
    }
  });
  return null;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.52} color="#a8bdc3" />
      <hemisphereLight args={['#94c7d1', '#11151d', 0.82]} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} color="#e8e6d7" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0003} />
      <directionalLight position={[-5, 1, 3]} intensity={1.2} color="#3d9da6" />
      <directionalLight position={[0, -4, -2]} intensity={0.8} color="#285a77" />
    </>
  );
}

function KeyboardSceneControls({ enabled, controls }: { enabled: boolean; controls: RefObject<OrbitControlsImpl | null> }) {
  const { camera } = useThree();
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!enabled) return;
      const targetElement = event.target;
      if (targetElement instanceof HTMLElement && targetElement.closest('button, input, textarea, select, a, [contenteditable="true"]')) return;
      const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      const zoom = ['+', '=', '-', '_'];
      if (![...arrows, ...zoom].includes(event.key)) return;
      event.preventDefault();
      const orbitTarget = controls.current?.target ?? new THREE.Vector3(0, 0, 0);
      const offset = camera.position.clone().sub(orbitTarget);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      if (event.key === 'ArrowLeft') spherical.theta -= 0.12;
      if (event.key === 'ArrowRight') spherical.theta += 0.12;
      if (event.key === 'ArrowUp') spherical.phi = Math.max(Math.PI * 0.22, spherical.phi - 0.08);
      if (event.key === 'ArrowDown') spherical.phi = Math.min(Math.PI * 0.8, spherical.phi + 0.08);
      if (event.key === '+' || event.key === '=') spherical.radius = Math.max(3.2, spherical.radius - 0.28);
      if (event.key === '-' || event.key === '_') spherical.radius = Math.min(10.5, spherical.radius + 0.28);
      spherical.makeSafe();
      camera.position.copy(orbitTarget).add(new THREE.Vector3().setFromSpherical(spherical));
      controls.current?.update();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [camera, controls, enabled]);
  return null;
}

export type ExperienceProps = {
  chapter: number;
  mode: 'guided' | 'explore';
  paused: boolean;
  resetKey: number;
  selectedFocus: [number, number, number] | null;
  selectedId: string | null;
  conduction: boolean;
  exploded: boolean;
  layersTransparent: boolean;
  reducedMotion: boolean;
  comparisonMode: 'conventional' | 'experimental';
  gap: number;
  simulationStage: number;
  onSelect: SelectPart;
};

export default function Experience(props: ExperienceProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;
  const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, isMobile ? 1.15 : 1.65) : 1;

  return (
    <Canvas
      className="experience-canvas"
      shadows={!isMobile}
      dpr={[1, pixelRatio]}
      camera={{ position: cameraViews[0].position, fov: isMobile ? 43 : 34, near: 0.1, far: 70 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.setClearColor('#050b11');
      }}
      fallback={<div className="webgl-fallback"><span className="fallback-orbit" aria-hidden="true">◌</span><strong>3D rendering is unavailable</strong><span>Enable WebGL or open this experience in a supported browser to explore the scientific models.</span></div>}
    >
      <color attach="background" args={['#050b11']} />
      <fog attach="fog" args={['#050b11', 10, 28]} />
      <SceneLights />
      <CameraChoreography chapter={props.chapter} focus={props.selectedFocus} controls={controls} resetKey={props.resetKey} paused={props.paused} reducedMotion={props.reducedMotion} />
      <KeyboardSceneControls enabled={props.mode === 'explore'} controls={controls} />
      <OrbitControls
        ref={controls}
        makeDefault
        enabled={props.mode === 'explore'}
        enablePan={false}
        enableDamping
        dampingFactor={0.085}
        minDistance={3.2}
        maxDistance={10.5}
        rotateSpeed={0.58}
        zoomSpeed={0.62}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.22}
      />
      <Suspense fallback={null}>
        {props.chapter === 0 && <HeartChapterScene paused={props.paused || props.reducedMotion} conduction={props.conduction} onSelect={props.onSelect} />}
        {props.chapter === 1 && <ComparisonScene paused={props.paused || props.reducedMotion} comparisonMode={props.comparisonMode} onSelect={props.onSelect} />}
        {props.chapter === 2 && <NanogeneratorScene paused={props.paused || props.reducedMotion} explode={props.exploded} transparentLayers={props.layersTransparent} selectedId={props.selectedId} onSelect={props.onSelect} />}
        {props.chapter === 3 && <TriboelectricSimulation gap={props.gap} stage={props.simulationStage} paused={props.paused || props.reducedMotion} />}
        {props.chapter === 4 && <IntegratedSystemScene paused={props.paused || props.reducedMotion} onSelect={props.onSelect} />}
      </Suspense>
    </Canvas>
  );
}
