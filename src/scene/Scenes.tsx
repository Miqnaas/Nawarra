import { Html, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { components } from '../data';
import { AtmosphericField, HeartModel, TorsoShell, TubePath } from './Shared3D';
import type { SceneProps, SelectPart } from './types';

export function HeartChapterScene({ paused, onSelect, conduction = true }: SceneProps) {
  return (
    <>
      <AtmosphericField count={340} paused={paused} />
      <TorsoShell />
      <HeartModel position={[-0.06, -0.02, 0.42]} scale={1.08} paused={paused} conduction={conduction} onSelect={onSelect} />
      <pointLight position={[0.1, 0.3, 2.1]} color="#56d8d0" intensity={2.5} distance={6} />
      <pointLight position={[-1.8, 0.8, 1.2]} color="#285d80" intensity={1.3} distance={7} />
    </>
  );
}

function DeviceCan({ onClick, onSelect, visible }: { onClick: () => void; onSelect: SelectPart; visible: boolean }) {
  return (
    <group visible={visible} position={[-1.38, 0.45, 0.65]} rotation={[0.05, 0.18, -0.17]} onClick={(event) => {
      event.stopPropagation();
      onClick();
      onSelect('battery', components.battery.title, components.battery.description, [-1.32, 0.38, 0.7]);
    }}>
      <RoundedBox args={[0.58, 0.82, 0.2]} radius={0.16} smoothness={5} castShadow receiveShadow>
        <meshPhysicalMaterial color="#b6c5c6" metalness={0.82} roughness={0.23} clearcoat={0.7} />
      </RoundedBox>
      <RoundedBox position={[0, -0.05, 0.105]} args={[0.36, 0.46, 0.018]} radius={0.09} smoothness={5}>
        <meshStandardMaterial color="#34434a" metalness={0.55} roughness={0.28} />
      </RoundedBox>
      <RoundedBox position={[0, -0.05, 0.12]} args={[0.21, 0.1, 0.025]} radius={0.035} smoothness={4}>
        <meshStandardMaterial color="#d9e0da" metalness={0.8} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, -0.05, 0.143]}>
        <boxGeometry args={[0.08, 0.027, 0.008]} />
        <meshBasicMaterial color="#eac766" toneMapped={false} />
      </mesh>
      <Html position={[0.35, -0.08, 0.16]} distanceFactor={6}>
        <div className="model-tag model-tag--warm">BATTERY CELL</div>
      </Html>
      <mesh position={[0, 0.31, 0.12]}>
        <cylinderGeometry args={[0.045, 0.045, 0.03, 28]} />
        <meshStandardMaterial color="#edf1eb" metalness={0.82} roughness={0.25} />
      </mesh>
      <Html position={[0, -0.54, 0.15]} distanceFactor={7}>
        <div className="model-tag">PULSE GENERATOR</div>
      </Html>
    </group>
  );
}

function SignalPulse({ curve, color, offset, paused }: { curve: THREE.CatmullRomCurve3; color: string; offset: number; paused: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current || paused) return;
    ref.current.position.copy(curve.getPointAt((clock.elapsedTime * 0.13 + offset) % 1));
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

export function ComparisonScene({ paused, onSelect, comparisonMode = 'conventional' }: SceneProps) {
  const lead = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.1, 0.2, 0.73),
    new THREE.Vector3(-0.73, -0.08, 0.83),
    new THREE.Vector3(-0.43, -0.35, 0.96),
    new THREE.Vector3(-0.26, -0.13, 1.0),
    new THREE.Vector3(-0.1, 0.42, 1.02),
  ]), []);

  return (
    <>
      <AtmosphericField count={290} paused={paused} />
      <TorsoShell breathing={false} />
      <HeartModel position={[0.48, -0.1, 0.37]} scale={0.82} paused={paused} conduction={false} showHotspots={false} onSelect={onSelect} />
      <DeviceCan visible={comparisonMode === 'conventional'} onClick={() => undefined} onSelect={onSelect} />
      <mesh visible={comparisonMode === 'conventional'}>
        <tubeGeometry args={[lead, 70, 0.026, 8, false]} />
        <meshPhysicalMaterial color="#d2d9d5" metalness={0.34} roughness={0.3} />
      </mesh>
      {comparisonMode === 'conventional' && <>
        <SignalPulse curve={lead} color="#f6cf75" offset={0} paused={paused} />
        <SignalPulse curve={lead} color="#fff0bb" offset={0.48} paused={paused} />
        <Html position={[-0.54, -0.42, 1.04]} distanceFactor={7}>
          <div className="model-tag model-tag--warm">ELECTRICAL STIMULATION</div>
        </Html>
      </>}
      <group visible={comparisonMode === 'experimental'}>
        <TubePath points={[[0.98, 0.46, 0.8], [1.27, 0.7, 0.62], [1.56, 0.73, 0.35], [1.77, 0.48, 0.12]]} radius={0.035} color="#5dd8cf" emissive="#318b86" />
        <RoundedBox position={[1.46, 0.38, 0.48]} rotation={[0.05, 0.3, -0.3]} args={[0.62, 0.23, 0.13]} radius={0.09} smoothness={5}>
          <meshPhysicalMaterial color="#61959a" metalness={0.42} roughness={0.25} />
        </RoundedBox>
        <RoundedBox position={[1.46, 0.38, 0.558]} args={[0.2, 0.065, 0.016]} radius={0.025} smoothness={3}>
          <meshBasicMaterial color="#eacb79" toneMapped={false} />
        </RoundedBox>
      </group>
      {comparisonMode === 'experimental' && <Html position={[1.47, 0.05, 0.58]} distanceFactor={7}>
        <div className="model-tag model-tag--warm">TENG CONCEPT</div>
      </Html>}
      <pointLight position={[-1.3, 0.45, 1.7]} color="#d1bd85" intensity={1.8} distance={3.5} />
      <pointLight position={[0.4, 0.15, 2]} color="#55e4d8" intensity={2.2} distance={4.5} />
    </>
  );
}

function EnergyNode({
  title,
  subtitle,
  position,
  color,
  type,
  onSelect,
  active = false,
}: {
  title: string;
  subtitle: string;
  position: [number, number, number];
  color: string;
  type: 'harvester' | 'storage' | 'electronics';
  onSelect: () => void;
  active?: boolean;
}) {
  return (
    <group position={position} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      {type === 'harvester' && (
        <group rotation={[0.18, 0.1, -0.28]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.12, 40]} />
            <meshPhysicalMaterial color="#c1d1cb" metalness={0.74} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.035, 40]} />
            <meshPhysicalMaterial color="#b78155" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )}
      {type === 'storage' && (
        <>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.48, 36]} />
            <meshPhysicalMaterial color="#5b8583" metalness={0.56} roughness={0.24} clearcoat={0.35} />
          </mesh>
          <mesh position={[0, 0.255, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 24]} />
            <meshStandardMaterial color="#b1c4bd" metalness={0.75} roughness={0.22} />
          </mesh>
        </>
      )}
      {type === 'electronics' && (
        <>
          <RoundedBox args={[0.92, 0.55, 0.12]} radius={0.1} smoothness={5} castShadow>
            <meshPhysicalMaterial color="#1b423e" metalness={0.48} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.071]}>
            <boxGeometry args={[0.78, 0.4, 0.012]} />
            <meshStandardMaterial color="#1a312e" roughness={0.65} />
          </mesh>
          {[-0.24, 0, 0.22].map((x) => (
            <mesh key={x} position={[x, 0, 0.09]}>
              <boxGeometry args={[0.14, 0.14, 0.025]} />
              <meshPhysicalMaterial color="#829d86" metalness={0.5} roughness={0.32} />
            </mesh>
          ))}
          <mesh position={[0.34, 0.12, 0.1]}>
            <sphereGeometry args={[0.038, 16, 12]} />
            <meshBasicMaterial color="#f0c865" toneMapped={false} />
          </mesh>
        </>
      )}
      <pointLight position={[0, 0.25, 0.4]} color={color} intensity={active ? 1.8 : 0.65} distance={1.9} />
      <Html position={[0, -0.52, 0.04]} distanceFactor={8}>
        <div className="model-tag">{subtitle}</div>
      </Html>
      <mesh position={[0, 0, 0.14]}>
        <sphereGeometry args={[active ? 0.32 : 0.28, 18, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.001} depthWrite={false} />
      </mesh>
      <Html position={[0, 0.52, 0.05]} distanceFactor={8}>
        <div className="system-node-title">{title}</div>
      </Html>
    </group>
  );
}

export function IntegratedSystemScene({ paused, onSelect }: SceneProps) {
  const flowCurves = useMemo(() => [
    new THREE.CatmullRomCurve3([new THREE.Vector3(-0.25, 0.2, 0.83), new THREE.Vector3(-1.03, -0.55, 0.83), new THREE.Vector3(-1.45, -0.14, 0.65)]),
    new THREE.CatmullRomCurve3([new THREE.Vector3(-1.42, -0.15, 0.68), new THREE.Vector3(-0.9, -0.9, 0.83), new THREE.Vector3(-0.12, -0.82, 0.83)]),
    new THREE.CatmullRomCurve3([new THREE.Vector3(-0.12, -0.82, 0.83), new THREE.Vector3(0.6, -0.42, 0.8), new THREE.Vector3(1.28, -0.04, 0.75)]),
  ], []);
  const [active, setActive] = useState('heartbeat');
  const selected = (id: string, title: string, description: string, focus: [number, number, number]) => {
    setActive(id);
    onSelect(id, title, description, focus);
  };
  const nodes = [
    { id: 'heartbeat', title: 'Heartbeat motion', subtitle: 'BIOLOGICAL INPUT', position: [-1.45, 0.28, 0.54] as [number, number, number], color: '#e19b7f', type: 'harvester' as const, key: 'electrode' },
    { id: 'teng', title: 'PVDF-based TENG', subtitle: 'MECHANICAL → ELECTRICAL', position: [-0.42, -0.83, 0.62] as [number, number, number], color: '#66ded3', type: 'harvester' as const, key: 'pvdf' },
    { id: 'storage', title: 'Energy storage', subtitle: 'CONDITIONING / STORAGE', position: [0.63, -0.35, 0.48] as [number, number, number], color: '#f0c968', type: 'storage' as const, key: 'storage' },
    { id: 'electronics', title: 'Pacemaker circuit', subtitle: 'PROPOSED ELECTRONICS', position: [1.7, 0.25, 0.36] as [number, number, number], color: '#91c7bd', type: 'electronics' as const, key: 'electronics' },
  ];
  const descriptions: Record<string, { title: string; description: string }> = {
    heartbeat: { title: 'Heartbeat motion', description: 'Natural cardiac motion is the proposed mechanical input in this educational concept.' },
    teng: { title: 'PVDF-based TENG', description: 'A triboelectric nanogenerator concept converts cyclic mechanical contact and separation into electrical output.' },
    storage: components.storage,
    electronics: components.electronics,
  };

  return (
    <>
      <AtmosphericField count={260} paused={paused} />
      <TorsoShell breathing={!paused} />
      <HeartModel position={[-0.02, 0.02, 0.42]} scale={0.74} paused={paused} conduction={false} showHotspots={false} onSelect={onSelect} />
      {flowCurves.map((curve, index) => (
        <group key={`flow-${index}`}>
          <mesh geometry={new THREE.TubeGeometry(curve, 52, 0.018, 6, false)}>
            <meshBasicMaterial color={index === 0 ? '#d7ad72' : '#5cd5c9'} toneMapped={false} transparent opacity={0.76} />
          </mesh>
          {!paused && <MovingDot curve={curve} color={index === 0 ? '#f3d28a' : '#a6fff4'} delay={index * 0.3} />}
        </group>
      ))}
      {nodes.map((node) => (
        <EnergyNode
          key={node.id}
          title={node.title}
          subtitle={node.subtitle}
          position={node.position}
          color={node.color}
          type={node.type}
          active={active === node.id}
          onSelect={() => selected(node.id, descriptions[node.id].title, descriptions[node.id].description, node.position)}
        />
      ))}
      <Html position={[-0.02, 0.02, 1.22]} distanceFactor={8}>
        <div className="system-node-title system-node-title--heart">Mechanical energy</div>
      </Html>
      <pointLight position={[0, -0.5, 2]} color="#56e1d5" intensity={2.2} distance={5} />
      <pointLight position={[1.55, 0.5, 1.1]} color="#e5c16a" intensity={1.15} distance={4} />
    </>
  );
}

function MovingDot({ curve, color, delay }: { curve: THREE.CatmullRomCurve3; color: string; delay: number }) {
  const dot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (dot.current) dot.current.position.copy(curve.getPointAt((clock.elapsedTime * 0.095 + delay) % 1));
  });
  return (
    <mesh ref={dot}>
      <sphereGeometry args={[0.04, 12, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
