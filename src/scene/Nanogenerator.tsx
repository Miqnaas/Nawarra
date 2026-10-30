import { Html, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { components } from '../data';
import { AtmosphericField, Callout, TubePath } from './Shared3D';
import type { SceneProps, SelectPart } from './types';

const layerRows = [
  { id: 'cover', name: 'Protective polymer film', rest: 0.3, explode: 1.08 },
  { id: 'top-electrode', name: 'Top conductive electrode', rest: 0.15, explode: 0.62 },
  { id: 'pvdf', name: 'PVDF nanofiber layer', rest: 0.0, explode: 0.12 },
  { id: 'bottom-electrode', name: 'Bottom conductive electrode', rest: -0.15, explode: -0.53 },
  { id: 'substrate', name: 'Flexible polymer substrate', rest: -0.3, explode: -1.0 },
];

function buildFiberGeometry() {
  const geometries: THREE.BufferGeometry[] = [];
  let seed = 83;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 42; i += 1) {
    const x = (rand() - 0.5) * 1.76;
    const z = (rand() - 0.5) * 0.92;
    const length = 0.45 + rand() * 0.9;
    const angle = rand() * Math.PI;
    const points: THREE.Vector3[] = [];
    for (let j = 0; j <= 6; j += 1) {
      const t = j / 6 - 0.5;
      const bend = Math.sin(t * Math.PI * 2 + i) * 0.055;
      points.push(new THREE.Vector3(
        x + Math.cos(angle) * t * length + bend,
        Math.sin(t * Math.PI * 3 + i * 0.71) * 0.026,
        z + Math.sin(angle) * t * length - bend * 0.6,
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    geometries.push(new THREE.TubeGeometry(curve, 24, 0.006 + rand() * 0.003, 4, false));
  }
  const merged = mergeGeometries(geometries, false);
  geometries.forEach((geometry) => geometry.dispose());
  return merged;
}

function FiberNetwork({ highlighted = false, scale = 1 }: { highlighted?: boolean; scale?: number }) {
  const fibers = useMemo(buildFiberGeometry, []);
  return (
    <mesh geometry={fibers} position={[0, 0.043, 0]} scale={scale}>
      <meshStandardMaterial color={highlighted ? '#f0d9a0' : '#d3c7ae'} roughness={0.72} metalness={0.06} emissive={highlighted ? '#47351c' : '#0b1919'} emissiveIntensity={highlighted ? 0.5 : 0.14} />
    </mesh>
  );
}

function Layer({
  index,
  explode,
  paused,
  transparentLayers,
  selectedId,
  onSelect,
}: {
  index: number;
  explode: boolean;
  paused: boolean;
  transparentLayers: boolean;
  selectedId?: string | null;
  onSelect: SelectPart;
}) {
  const ref = useRef<THREE.Group>(null);
  const layer = layerRows[index];
  const active = selectedId === layer.id || (selectedId === 'pvdf' && layer.id === 'pvdf') || (selectedId === 'electrode' && layer.id.includes('electrode')) || (selectedId === 'substrate' && layer.id === 'substrate');
  useFrame((_, delta) => {
    if (!ref.current || paused) return;
    const y = layer.rest + (explode ? layer.explode : 0);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, y, 4.5, delta);
    const focusedScale = active ? 1.035 : 1;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, focusedScale, 5, delta));
  });

  const activate = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (layer.id.includes('electrode')) {
      onSelect('electrode', components.electrode.title, components.electrode.description, [0.05, layer.rest, 0]);
    } else if (layer.id === 'pvdf') {
      onSelect('pvdf', components.pvdf.title, components.pvdf.description, [0, layer.rest, 0]);
    } else {
      onSelect('substrate', components.substrate.title, components.substrate.description, [0, layer.rest, 0]);
    }
  };

  return (
    <group ref={ref} position={[0, layer.rest, 0]} onClick={activate} onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
      {index === 0 && (
        <RoundedBox args={[2.12, 0.065, 1.24]} radius={0.06} smoothness={5} castShadow receiveShadow>
          <meshPhysicalMaterial color={active ? '#d4e4df' : '#aebfbd'} metalness={0.24} roughness={0.3} transmission={transparentLayers ? 0.5 : 0.22} thickness={0.16} transparent opacity={transparentLayers ? 0.34 : 0.86} clearcoat={0.48} />
        </RoundedBox>
      )}
      {index === 1 && (
        <RoundedBox args={[1.94, 0.07, 1.08]} radius={0.035} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color={active ? '#e4ba75' : '#b98951'} metalness={0.88} roughness={0.25} clearcoat={0.45} transparent={transparentLayers} opacity={transparentLayers ? 0.52 : 1} emissive={active ? '#815d2b' : '#000000'} emissiveIntensity={active ? 0.35 : 0} />
        </RoundedBox>
      )}
      {index === 2 && (
        <group>
          <RoundedBox args={[1.94, 0.065, 1.08]} radius={0.06} smoothness={5} castShadow receiveShadow>
            <meshPhysicalMaterial color={active ? '#e2d3b0' : '#c5bda7'} metalness={0.08} roughness={0.62} transparent opacity={transparentLayers ? 0.32 : 0.76} transmission={0.18} />
          </RoundedBox>
          <FiberNetwork highlighted={active} />
        </group>
      )}
      {index === 3 && (
        <RoundedBox args={[1.94, 0.07, 1.08]} radius={0.035} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color={active ? '#dca96c' : '#99714d'} metalness={0.84} roughness={0.29} transparent={transparentLayers} opacity={transparentLayers ? 0.52 : 1} emissive={active ? '#714c23' : '#000000'} emissiveIntensity={active ? 0.34 : 0} />
        </RoundedBox>
      )}
      {index === 4 && (
        <RoundedBox args={[2.12, 0.085, 1.23]} radius={0.08} smoothness={5} castShadow receiveShadow>
          <meshPhysicalMaterial color={active ? '#8fc6c5' : '#6c9c9e'} metalness={0.28} roughness={0.31} transparent opacity={transparentLayers ? 0.32 : 0.83} transmission={transparentLayers ? 0.46 : 0.2} thickness={0.22} clearcoat={0.55} />
        </RoundedBox>
      )}
    </group>
  );
}

export function NanogeneratorScene({ paused, explode, transparentLayers, selectedId, onSelect }: SceneProps & { explode: boolean; transparentLayers: boolean; selectedId?: string | null }) {
  return (
    <>
      <AtmosphericField count={290} paused={paused} />
      <group position={[0.15, -0.03, 0]} rotation={[-0.28, -0.42, 0.02]}>
        {layerRows.map((layer, index) => (
          <Layer key={layer.id} index={index} explode={explode} paused={paused} transparentLayers={transparentLayers} selectedId={selectedId} onSelect={onSelect} />
        ))}
        <mesh position={[0.93, 0.12, 0.3]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.32, 0.012, 7, 56]} />
          <meshBasicMaterial color="#66d9d0" transparent opacity={0.68} toneMapped={false} />
        </mesh>
        <group position={[0.93, 0.12, 0.3]} scale={0.31}>
          <FiberNetwork highlighted scale={0.75} />
        </group>
      </group>
      <TubePath points={[[1.18, 0.2, 0.35], [1.55, 0.42, 0.38], [1.82, 0.45, 0.36]]} radius={0.007} color="#73d6d2" opacity={0.68} tubularSegments={26} />
      <Callout label="Nanofiber microstructure" position={[1.55, 0.58, 0.38]} onClick={() => onSelect('pvdf', components.pvdf.title, components.pvdf.description, [0.25, 0.05, 0])} />
      <pointLight position={[-2.1, 2.5, 2.3]} color="#d2e5dd" intensity={2.2} distance={7} />
      <pointLight position={[1.8, 0.7, 1.6]} color="#56d8d1" intensity={1.65} distance={4.5} />
      <spotLight position={[0, 4, 2]} color="#f2d69b" intensity={1.6} angle={0.52} penumbra={0.8} castShadow />
    </>
  );
}

function ChargeDots({ sign, y, gap, active }: { sign: 1 | -1; y: number; gap: number; active: boolean }) {
  const dots = useMemo(() => Array.from({ length: 20 }, (_, index) => {
    const column = index % 5;
    const row = Math.floor(index / 5);
    return [-0.68 + column * 0.34, -0.32 + row * 0.21] as const;
  }), []);
  return (
    <group>
      {dots.map(([x, z], index) => (
        <mesh key={index} position={[x, y + (gap < 0.18 ? sign * 0.016 : 0), z]} scale={active ? 1 : 0.88}>
          <sphereGeometry args={[0.026, 10, 8]} />
          <meshBasicMaterial color={sign === 1 ? '#ef9a7d' : '#73d9df'} toneMapped={false} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function FlowParticle({ curve, delay, reverse = false, speed = 0.1 }: { curve: THREE.CatmullRomCurve3; delay: number; reverse?: boolean; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const progress = (clock.elapsedTime * speed + delay) % 1;
    ref.current.position.copy(curve.getPointAt(reverse ? 1 - progress : progress));
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 12, 10]} />
      <meshBasicMaterial color="#ffe29a" toneMapped={false} />
    </mesh>
  );
}

function Voltmeter({ gap, active, paused }: { gap: number; active: boolean; paused: boolean }) {
  const needle = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (needle.current && !paused) {
      const target = (gap - 0.5) * 0.8 + Math.sin(clock.elapsedTime * 2.2) * 0.035;
      needle.current.rotation.z = THREE.MathUtils.damp(needle.current.rotation.z, target, 4, 0.016);
    }
  });
  return (
    <group position={[1.55, 0.2, 0.12]}>
      <RoundedBox args={[0.64, 0.78, 0.12]} radius={0.12} smoothness={5}>
        <meshPhysicalMaterial color="#18292f" metalness={0.62} roughness={0.29} />
      </RoundedBox>
      <mesh position={[0, 0.04, 0.071]}>
        <circleGeometry args={[0.23, 36]} />
        <meshStandardMaterial color="#b4c4bb" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.04, 0.08]}>
        <torusGeometry args={[0.174, 0.008, 5, 36, Math.PI]} />
        <meshStandardMaterial color="#465a5a" metalness={0.5} roughness={0.35} />
      </mesh>
      <group ref={needle} position={[0, -0.12, 0.089]}>
        <mesh position={[0, 0.13, 0]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.012, 0.29, 0.008]} />
          <meshBasicMaterial color={active ? '#e9c46e' : '#8aa7a1'} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.027, 12, 10]} />
          <meshStandardMaterial color="#e5e8db" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
      <RoundedBox position={[0, -0.27, 0.075]} args={[0.3, 0.09, 0.015]} radius={0.026} smoothness={3}>
        <meshBasicMaterial color="#233a40" />
      </RoundedBox>
    </group>
  );
}

export function TriboelectricSimulation({
  gap,
  stage,
  paused,
  onSelect: _onSelect,
}: {
  gap: number;
  stage: number;
  paused: boolean;
  onSelect?: SelectPart;
}) {
  const space = 0.105 + gap * 0.92;
  const upper = space / 2;
  const lower = -space / 2;
  const wire = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.83, upper, 0.36),
    new THREE.Vector3(1.05, upper + 0.1, 0.38),
    new THREE.Vector3(1.25, 0.63, 0.35),
    new THREE.Vector3(1.55, 0.59, 0.32),
    new THREE.Vector3(1.78, 0.52, 0.29),
    new THREE.Vector3(1.78, -0.3, 0.29),
    new THREE.Vector3(1.2, lower - 0.12, 0.35),
    new THREE.Vector3(0.83, lower, 0.36),
  ]), [upper, lower]);
  const wirePoints = useMemo(() => wire.points.map((p) => [p.x, p.y, p.z] as [number, number, number]), [wire]);

  return (
    <group position={[-0.12, 0.02, 0]} rotation={[-0.1, -0.2, 0]}>
      <AtmosphericField count={200} paused={paused} />
      <group position={[0, upper, 0]}>
        <RoundedBox args={[1.88, 0.105, 1.1]} radius={0.065} smoothness={5} castShadow receiveShadow>
          <meshPhysicalMaterial color="#c2a06c" metalness={0.86} roughness={0.26} clearcoat={0.4} />
        </RoundedBox>
        <RoundedBox position={[0, -0.055, 0]} args={[1.8, 0.038, 1.02]} radius={0.05} smoothness={4}>
          <meshPhysicalMaterial color="#e2d6bc" metalness={0.08} roughness={0.63} transparent opacity={0.85} />
        </RoundedBox>
        <ChargeDots sign={1} y={-0.07} gap={gap} active={stage >= 1} />
      </group>
      <group position={[0, lower, 0]}>
        <RoundedBox args={[1.88, 0.105, 1.1]} radius={0.065} smoothness={5} castShadow receiveShadow>
          <meshPhysicalMaterial color="#768f92" metalness={0.65} roughness={0.31} clearcoat={0.35} />
        </RoundedBox>
        <RoundedBox position={[0, 0.057, 0]} args={[1.8, 0.038, 1.02]} radius={0.05} smoothness={4}>
          <meshPhysicalMaterial color="#b6c4ba" metalness={0.1} roughness={0.67} transparent opacity={0.78} />
        </RoundedBox>
        <ChargeDots sign={-1} y={0.075} gap={gap} active={stage >= 1} />
      </group>
      <mesh position={[0, (upper + lower) / 2, -0.62]}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.88, 0, 0), new THREE.Vector3(-1.1, 0.05, 0), new THREE.Vector3(-1.27, 0.02, 0), new THREE.Vector3(-1.35, -0.03, 0), new THREE.Vector3(-1.52, 0, 0),
        ]), 20, 0.008, 6, false]} />
        <meshBasicMaterial color="#d4aa6c" toneMapped={false} />
      </mesh>
      <TubePath points={wirePoints} radius={0.015} color="#b6a06d" emissive="#54401d" tubularSegments={72} />
      {stage >= 2 && !paused && [0, 1, 2].map((index) => <FlowParticle key={index} curve={wire} delay={index * 0.33} reverse={stage === 3} speed={0.1 + gap * 0.13} />)}
      <Voltmeter gap={gap} active={stage >= 2} paused={paused} />
      <Html position={[0, 1.08, 0.25]} distanceFactor={8}>
        <div className="model-tag model-tag--warm">POSITIVE CHARGE</div>
      </Html>
      <Html position={[0, -1.08, 0.25]} distanceFactor={8}>
        <div className="model-tag model-tag--cyan">NEGATIVE CHARGE</div>
      </Html>
      <pointLight position={[0, 1.4, 1.6]} color="#e4c16e" intensity={1.6} distance={4} />
      <pointLight position={[0, -1.1, 1.5]} color="#65d8dc" intensity={1.55} distance={4} />
    </group>
  );
}

