import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { SelectPart } from './types';

export function TubePath({
  points,
  radius,
  color,
  emissive = '#000000',
  opacity = 1,
  tubularSegments = 72,
}: {
  points: [number, number, number][];
  radius: number;
  color: string;
  emissive?: string;
  opacity?: number;
  tubularSegments?: number;
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    return new THREE.TubeGeometry(curve, tubularSegments, radius, 8, false);
  }, [points, radius, tubularSegments]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial color={color} emissive={emissive} emissiveIntensity={emissive === '#000000' ? 0 : 0.9} metalness={0.28} roughness={0.28} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

export function Callout({
  label,
  position,
  onClick,
  active = false,
}: {
  label: string;
  position: [number, number, number];
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Html position={position} distanceFactor={8} zIndexRange={[24, 0]}>
      <button
        className={`hotspot${active ? ' hotspot--active' : ''}`}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label={`Explore ${label}`}
      >
        <span className="hotspot__dot" />
        <span className="hotspot__label">{label}</span>
      </button>
    </Html>
  );
}

function buildTorsoGeometry() {
  const profile: [number, number, number][] = [
    [-2.08, 0.55, 0.34],
    [-1.7, 0.62, 0.37],
    [-1.15, 0.67, 0.39],
    [-0.5, 0.74, 0.42],
    [0.25, 0.91, 0.38],
    [0.9, 1.12, 0.34],
    [1.38, 1.06, 0.31],
    [1.68, 0.82, 0.27],
    [1.9, 0.45, 0.24],
  ];
  const rows = 54;
  const columns = 84;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= rows; row += 1) {
    const t = row / rows;
    const y = THREE.MathUtils.lerp(profile[0][0], profile.at(-1)![0], t);
    let lower = profile[0];
    let upper = profile[1];
    for (let i = 1; i < profile.length; i += 1) {
      if (profile[i][0] >= y) {
        lower = profile[i - 1];
        upper = profile[i];
        break;
      }
    }
    const blend = THREE.MathUtils.clamp((y - lower[0]) / (upper[0] - lower[0]), 0, 1);
    const width = THREE.MathUtils.lerp(lower[1], upper[1], blend);
    const depth = THREE.MathUtils.lerp(lower[2], upper[2], blend);
    for (let column = 0; column <= columns; column += 1) {
      const a = (column / columns) * Math.PI * 2;
      const rib = 1 + 0.014 * Math.cos(a * 6) * Math.sin(t * Math.PI);
      positions.push(Math.cos(a) * width * rib, y, Math.sin(a) * depth * rib);
    }
  }
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * (columns + 1) + column;
      const b = a + columns + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function TorsoShell({ breathing = true }: { breathing?: boolean }) {
  const torso = useRef<THREE.Group>(null);
  const geometry = useMemo(buildTorsoGeometry, []);
  useFrame(({ clock }) => {
    if (!torso.current || !breathing) return;
    const breath = 1 + Math.sin(clock.elapsedTime * 0.6) * 0.004;
    torso.current.scale.y = breath;
  });

  const ribPaths: [number, number, number][][] = useMemo(() => {
    const paths: [number, number, number][][] = [];
    for (let rib = 0; rib < 6; rib += 1) {
      const y = 0.93 - rib * 0.27;
      const width = 0.67 + rib * 0.035;
      paths.push([
        [-width, y + 0.14, 0.19],
        [-width * 0.78, y - 0.01, 0.35],
        [-width * 0.44, y - 0.12, 0.46],
        [0, y - 0.15, 0.49],
        [width * 0.44, y - 0.12, 0.46],
        [width * 0.78, y - 0.01, 0.35],
        [width, y + 0.14, 0.19],
      ]);
    }
    return paths;
  }, []);

  return (
    <group ref={torso} position={[0, 0.15, -0.08]}>
      <mesh geometry={geometry} renderOrder={1}>
        <meshPhysicalMaterial color="#7aa0b2" metalness={0.2} roughness={0.27} transparent opacity={0.12} transmission={0.36} thickness={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[-0.61, -0.02, 0.03]} scale={[0.43, 0.83, 0.24]}>
        <sphereGeometry args={[1, 36, 28]} />
        <meshPhysicalMaterial color="#173b4e" roughness={0.32} metalness={0.12} transparent opacity={0.35} transmission={0.28} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0.61, -0.02, 0.03]} scale={[0.43, 0.83, 0.24]}>
        <sphereGeometry args={[1, 36, 28]} />
        <meshPhysicalMaterial color="#173b4e" roughness={0.32} metalness={0.12} transparent opacity={0.35} transmission={0.28} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {ribPaths.map((path, index) => (
        <TubePath key={index} points={path} radius={0.012} color="#76c1cc" opacity={0.21} tubularSegments={42} />
      ))}
      <TubePath points={[[-0.92, 1.27, 0.1], [-0.55, 1.42, 0.25], [-0.16, 1.35, 0.33], [0.16, 1.35, 0.33], [0.55, 1.42, 0.25], [0.92, 1.27, 0.1]]} radius={0.025} color="#6aa2af" opacity={0.36} tubularSegments={48} />
    </group>
  );
}

function createMyocardiumGeometry() {
  const geometry = new THREE.SphereGeometry(1, 56, 40);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const taper = y < -0.12 ? THREE.MathUtils.lerp(1, 0.18, THREE.MathUtils.smoothstep(-y, 0.12, 1)) : 1;
    const topCleft = y > 0.48 ? Math.exp(-((x / 0.25) ** 2)) * 0.2 * ((y - 0.48) / 0.52) : 0;
    const sideBias = x > 0 ? 1.045 : 0.94;
    positions.setXYZ(index, x * 0.76 * taper * sideBias, y * 0.96 - topCleft, z * 0.52 * taper);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function MovingPulse({ curve, delay, color, paused }: { curve: THREE.CatmullRomCurve3; delay: number; color: string; paused: boolean }) {
  const marker = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!marker.current || paused) return;
    const t = (clock.elapsedTime * 0.14 + delay) % 1;
    marker.current.position.copy(curve.getPointAt(t));
  });
  return (
    <mesh ref={marker}>
      <sphereGeometry args={[0.035, 12, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

const heartLabels = {
  sa: 'SA Node',
  av: 'AV Node',
  conduction: 'Ventricular pathway',
};

export function HeartModel({
  position = [0, 0, 0],
  scale = 1,
  paused = false,
  conduction = true,
  showHotspots = true,
  onSelect,
}: {
  position?: [number, number, number];
  scale?: number;
  paused?: boolean;
  conduction?: boolean;
  showHotspots?: boolean;
  onSelect: SelectPart;
}) {
  const heart = useRef<THREE.Group>(null);
  const myocardium = useMemo(createMyocardiumGeometry, []);
  const paths = useMemo(() => [
    new THREE.CatmullRomCurve3([new THREE.Vector3(0.25, 0.56, 0.46), new THREE.Vector3(0.13, 0.27, 0.49), new THREE.Vector3(0.02, 0.06, 0.5), new THREE.Vector3(-0.27, -0.36, 0.44), new THREE.Vector3(-0.38, -0.7, 0.31)]),
    new THREE.CatmullRomCurve3([new THREE.Vector3(0.13, 0.27, 0.49), new THREE.Vector3(0.37, -0.08, 0.48), new THREE.Vector3(0.36, -0.45, 0.4), new THREE.Vector3(0.2, -0.78, 0.27)]),
    new THREE.CatmullRomCurve3([new THREE.Vector3(0.13, 0.27, 0.49), new THREE.Vector3(-0.12, 0.12, 0.52), new THREE.Vector3(-0.02, -0.25, 0.49), new THREE.Vector3(0.2, -0.7, 0.33)]),
  ], []);
  const conductionGeometries = useMemo(() => paths.map((path, index) => new THREE.TubeGeometry(path, 48, index === 0 ? 0.021 : 0.015, 7, false)), [paths]);
  useFrame(({ clock }) => {
    if (!heart.current || paused) return;
    const beat = 1 + Math.max(0, Math.sin(clock.elapsedTime * 5.1)) ** 10 * 0.035;
    heart.current.scale.setScalar(scale * beat);
  });

  const select = (id: string, key: keyof typeof heartLabels, focus: [number, number, number]) => {
    const content = key === 'sa'
      ? ['Sinoatrial node', 'A cluster of cells in the right atrium that normally initiates the heart’s electrical impulse.']
      : key === 'av'
        ? ['Atrioventricular node', 'The impulse passes through this junction before traveling into the ventricles.']
        : ['Ventricular conduction', 'Specialized pathways carry the impulse through the ventricles, coordinating contraction.'];
    onSelect(id, content[0], content[1], focus);
  };

  return (
    <group ref={heart} position={position} rotation={[0.02, -0.12, -0.24]} scale={scale}>
      <mesh
        geometry={myocardium}
        position={[0, -0.1, 0]}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onSelect('heart', 'Cardiac muscle', 'The heart’s chambers contract in a coordinated cycle to move blood through the body. The pathways shown here visualize the natural electrical conduction system.', [position[0], position[1] - 0.08, position[2] + 0.42]);
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }}
      >
        <meshPhysicalMaterial color="#a84952" roughness={0.42} metalness={0.08} clearcoat={0.24} clearcoatRoughness={0.24} />
      </mesh>
      <mesh position={[-0.3, 0.43, 0.05]} scale={[0.36, 0.35, 0.35]} castShadow>
        <sphereGeometry args={[1, 36, 28]} />
        <meshPhysicalMaterial color="#bd6264" roughness={0.4} clearcoat={0.18} />
      </mesh>
      <mesh position={[0.28, 0.43, 0.04]} scale={[0.34, 0.37, 0.35]} castShadow>
        <sphereGeometry args={[1, 36, 28]} />
        <meshPhysicalMaterial color="#c36a68" roughness={0.41} clearcoat={0.18} />
      </mesh>
      <mesh position={[-0.37, 0.59, 0.12]} scale={[0.22, 0.17, 0.22]} rotation={[0.2, 0, -0.5]}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshPhysicalMaterial color="#a64c55" roughness={0.4} />
      </mesh>
      <mesh position={[0.37, 0.57, 0.12]} scale={[0.21, 0.16, 0.21]} rotation={[0.2, 0, 0.42]}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshPhysicalMaterial color="#a64c55" roughness={0.4} />
      </mesh>
      <TubePath points={[[0.02, 0.48, -0.05], [0.03, 0.77, -0.08], [0.04, 1.05, -0.04], [0.29, 1.22, -0.03], [0.57, 1.12, -0.02], [0.62, 0.86, 0.02]]} radius={0.11} color="#b35456" tubularSegments={70} />
      <TubePath points={[[-0.24, 0.54, -0.03], [-0.32, 0.82, -0.04], [-0.25, 1.02, -0.08], [-0.03, 1.13, -0.08], [0.23, 1.09, -0.06]]} radius={0.075} color="#6e9da3" tubularSegments={58} />
      <TubePath points={[[0.29, 0.37, -0.08], [0.53, 0.52, -0.1], [0.7, 0.67, -0.12], [0.97, 0.66, -0.14], [1.14, 0.55, -0.13]]} radius={0.065} color="#62939d" tubularSegments={58} />
      <TubePath points={[[-0.55, 0.28, -0.13], [-0.78, 0.43, -0.14], [-0.99, 0.44, -0.12]]} radius={0.05} color="#678f99" tubularSegments={46} />
      <TubePath points={[[0.15, 0.31, 0.07], [0.41, 0.1, 0.28], [0.5, -0.14, 0.32], [0.37, -0.45, 0.28], [0.22, -0.71, 0.18]]} radius={0.045} color="#d5a37f" opacity={0.9} tubularSegments={46} />
      <TubePath points={[[0.03, 0.28, 0.13], [-0.2, 0.07, 0.34], [-0.38, -0.17, 0.34], [-0.4, -0.49, 0.23], [-0.33, -0.72, 0.13]]} radius={0.038} color="#b47167" opacity={0.95} tubularSegments={46} />
      <TubePath points={[[0.1, -0.02, 0.38], [0.02, -0.28, 0.4], [-0.1, -0.54, 0.33], [-0.18, -0.77, 0.2]]} radius={0.026} color="#e0b28d" opacity={0.9} tubularSegments={42} />

      {conductionGeometries.map((geometry, index) => (
        <mesh key={`conduction-${index}`} geometry={geometry} visible={conduction}>
          <meshBasicMaterial color={index === 0 ? '#7cf3e6' : '#f4d278'} toneMapped={false} />
        </mesh>
      ))}
      {!paused && paths.map((path, index) => <MovingPulse key={`pulse-${index}`} curve={path} delay={index * 0.29} color={index === 0 ? '#b7fff6' : '#ffe5a2'} paused={paused} />)}
      {showHotspots && (
        <>
          <Callout label={heartLabels.sa} position={[0.38, 0.51, 0.56]} onClick={() => select('sa', 'sa', [position[0] + 0.32, position[1] + 0.42, position[2] + 0.5])} />
          <Callout label={heartLabels.av} position={[-0.42, 0.02, 0.57]} onClick={() => select('av', 'av', [position[0] - 0.24, position[1] + 0.06, position[2] + 0.5])} />
          <Callout label={heartLabels.conduction} position={[0.51, -0.47, 0.42]} onClick={() => select('conduction', 'conduction', [position[0] + 0.2, position[1] - 0.38, position[2] + 0.35])} />
        </>
      )}
    </group>
  );
}

export function AtmosphericField({ count = 360, paused = false }: { count?: number; paused?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    let seed = 31;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (random() - 0.5) * 18;
      data[i * 3 + 1] = (random() - 0.5) * 10;
      data[i * 3 + 2] = -3 - random() * 7;
    }
    return data;
  }, [count]);
  useFrame(({ clock }) => {
    if (points.current && !paused) {
      points.current.rotation.y = Math.sin(clock.elapsedTime * 0.025) * 0.06;
      points.current.rotation.x = Math.cos(clock.elapsedTime * 0.02) * 0.03;
    }
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8ad7dc" size={0.018} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}
