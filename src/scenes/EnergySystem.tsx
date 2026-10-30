import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as T from 'three';
import { makeBoard, makePacemaker, pbr, rounded, type V3 } from '../models/geometry';
import { useExhibit } from '../state';
import { Curve, Flow, Hotspot, useDispose } from '../components/SceneParts';
import type { InfoId } from '../data';
const links:V3[][]=[
 [[.63,-.05,.7],[1.12,-.1,.6],[1.65,-.28,.5]],
 [[1.65,-.28,.5],[2.1,-.5,.6],[2.2,-1.05,.5]],
 [[2.2,-1.05,.5],[2.8,-.82,.32],[2.9,.54,.13],[2.15,1.12,.16]],
 [[2.15,1.12,.16],[1.5,1.63,.1],[.8,1.53,.1],[-.25,.24,.69],[-.24,-.5,.6]],
];
export default function EnergySystem(){
 const s=useExhibit(),board=useMemo(makeBoard,[]),pacemaker=useMemo(makePacemaker,[]),storage=useMemo(()=>{const g=new T.Group();rounded(g,[.76,.4,.25],[0,0,0],pbr('#899fa8',.32,.7),.06,'storage');rounded(g,[.53,.24,.015],[0,0,.14],pbr('#1e3d4b',.4,.3),.02,'storage');for(let x of [-.22,.22])rounded(g,[.07,.06,.03],[x,.23,0],pbr('#d7be79',.3,.8),.01,'storage');return g;},[]);
 useDispose(board);useDispose(pacemaker);useDispose(storage);
 const objectClick=(id:InfoId)=>{s.select(id);s.setFocus(id);};
 return <group>
  <group position={[1.65,-.1,.34]} rotation={[.6,0,.1]} onClick={e=>{e.stopPropagation();objectClick('conditioning');}}><primitive object={board} dispose={null}/></group>
  <group position={[2.2,-1.03,.4]} onClick={e=>{e.stopPropagation();objectClick('storage');}}><primitive object={storage} dispose={null}/></group>
  <group position={[2.15,1.17,.05]} rotation={[.08,-.15,-.1]} onClick={e=>{e.stopPropagation();objectClick('pacemaker');}}><primitive object={pacemaker} dispose={null}/></group>
  {links.map((points,i)=><group key={i}><Curve points={points} color={i===3?'#73b9cf':'#bb9d65'} radius={.012}/><Flow points={points} color={i===3?'#8edbe7':'#efca81'} count={s.quality==='low'?4:8} rate={.22+i*.06}/></group>)}
  <Hotspot id="harvester" position={[.67,-.13,.82]} short="01 · Motion → TENG" side="left"/>
  <Hotspot id="conditioning" position={[1.64,-.05,.8]} short="02 · Conditioning"/>
  <Hotspot id="storage" position={[2.2,-1.12,.62]} short="03 · Energy storage"/>
  <Hotspot id="pacemaker" position={[2.16,1.45,.34]} short="04 · Pacemaker"/>
 </group>;
}
