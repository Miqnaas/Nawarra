import { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as T from 'three';
import { useExhibit } from '../state';
import { makeHeart, makePacemaker, makeTorso, rounded, pbr, type V3 } from '../models/geometry';
import { Hotspot, Curve, Flow, useDispose } from '../components/SceneParts';
import type { InfoId } from '../data';
const conductionPaths:V3[][]=[
 [[-.6,.75,.45],[-.46,.59,.6],[-.25,.42,.68],[-.1,.22,.74]],
 [[-.1,.22,.74],[-.06,-.15,.73],[-.06,-.55,.58],[-.36,-1.15,.25]],
 [[-.1,.22,.74],[.16,.12,.69],[.43,-.13,.59],[.58,-.48,.35],[.23,-.9,.39]],
 [[-.06,-.45,.62],[-.37,-.51,.61],[-.63,-.76,.34]],
];
const lead:V3[]=[[1.2,1.5,.2],[.65,1.7,.02],[-.5,1.25,.1],[-.57,.45,.48],[-.26,-.44,.61]];
const harvestPath:V3[]=[[.63,-.05,.71],[1.02,.18,.57],[1.23,.76,.24],[1.28,1.16,.2]];
export default function HeartScene(){
 const s=useExhibit(),heart=useMemo(()=>{const g=makeHeart(),old=new Set<T.Material>();g.traverse(o=>{if(o instanceof T.Mesh&&o.material instanceof T.MeshStandardMaterial&&o.userData.info){old.add(o.material);o.material=o.material.clone();}});old.forEach(m=>m.dispose());return g;},[]),torso=useMemo(makeTorso,[]),pacemaker=useMemo(makePacemaker,[]),beat=useRef<T.Group>(null),body=useRef<T.Group>(null),time=useRef(0),harvest=useRef<T.Group>(null);
 const [hovered,setHovered]=useState<InfoId|null>(null);
 useEffect(()=>{heart.traverse(o=>{if(o instanceof T.Mesh&&o.material instanceof T.MeshStandardMaterial){o.material.emissive.set(o.userData.info===(hovered??s.selected)?'#234b58':'#000000');o.material.emissiveIntensity=.65;}});},[heart,s.selected,hovered]);
 useDispose(heart);useDispose(torso);useDispose(pacemaker);
 const plate=useMemo(()=>{const g=new T.Group();for(let i=0;i<4;i++)rounded(g,[.31,.46,.025],[0,0,i*.026],pbr(i%2?'#c6b57c':'#7d9caa',.4,.5),.035,'harvester');return g;},[]);useDispose(plate);
 useEffect(()=>{time.current=0;},[s.replayId]);
 const click=(e:ThreeEvent<MouseEvent>)=>{let o:T.Object3D|null=e.object;while(o&&!o.userData.info)o=o.parent;if(o?.userData.info){e.stopPropagation();const id=o.userData.info as InfoId;s.select(id);if(id==='ventricle'||id==='heart')s.setFocus('heart');}};
 useFrame((_,dt)=>{if(!s.paused)time.current+=Math.min(dt,.05);const phase=(time.current*s.bpm/60)%1;const pulse=.05*Math.exp(-Math.pow((phase-.18)/.08,2))+.02*Math.exp(-Math.pow((phase-.36)/.07,2));if(beat.current)beat.current.scale.set(1+pulse,1-pulse*.4,1+pulse);if(body.current)body.current.scale.setScalar(1+Math.sin(time.current*.9)*.003);if(harvest.current)harvest.current.rotation.y=.15+Math.sin(phase*Math.PI*2)*.05;});
 const showTorso=s.chapter===0||s.chapter===4;
 return <group>
  {showTorso&&<group ref={body}><primitive object={torso} dispose={null}/></group>}
  <group ref={beat} onClick={click} onPointerOver={e=>{if(e.object.userData.info){document.body.style.cursor='pointer';setHovered(e.object.userData.info as InfoId);}}} onPointerOut={()=>{document.body.style.cursor='auto';setHovered(null);}}>
   <primitive object={heart} dispose={null}/>
   {s.conduction&&<group rotation={[-.08,-.22,-.12]}>
    {conductionPaths.map((points,i)=><group key={i}><Curve points={points} color="#b1dee0" radius={.008} opacity={.8}/><Flow points={points} count={3} rate={s.bpm/120} color="#f0d18c"/></group>)}
    {([[-.6,.75,.45],[-.1,.22,.74]] as V3[]).map((p,i)=><mesh key={i} position={p} userData={{info:i?'av':'sa'}}><sphereGeometry args={[.047,16,12]}/><meshStandardMaterial color="#e7ca85" emissive="#e7ca85" emissiveIntensity={1.4}/></mesh>)}
   </group>}
   {(s.chapter===4||(s.chapter===1&&s.comparison==='teng'))&&<group ref={harvest} position={[.64,-.03,.65]} rotation={[0,.15,-.14]}><primitive object={plate} dispose={null}/></group>}
  </group>
  {s.labels&&<>
   <Hotspot id="sa" position={[-.62,.8,.66]} short="SA node" side="left"/>
   <Hotspot id="av" position={[-.03,.17,.88]} short="AV node"/>
   {s.chapter===0&&<Hotspot id="aorta" position={[.45,1.58,.1]} short="Aortic arch"/>}
  </>}
  {s.chapter===1&&<group><group position={[1.35,1.32,.05]} rotation={[.1,-.14,-.12]} onClick={click}><primitive object={pacemaker} dispose={null}/></group><Curve points={lead} radius={.013} color="#89b5c2"/><Flow points={lead} rate={s.bpm/160} count={5} active={true}/><Hotspot id="pacemaker" position={[1.6,1.65,.2]} short="Pacemaker"/>{s.comparison==='traditional'?<Hotspot id="battery" position={[1.25,1.24,.26]} short="Internal battery"/>:<><Curve points={harvestPath} color="#e0bc76" radius={.014}/><Flow points={harvestPath} rate={.45}/><Hotspot id="harvester" position={[.75,-.13,.8]} short="Motion-coupled TENG"/></>}</group>}
 </group>;
}
