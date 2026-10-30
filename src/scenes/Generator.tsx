import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as T from 'three';
import { layers, type InfoId } from '../data';
import { useExhibit } from '../state';
import { Hotspot, Curve, useDispose } from '../components/SceneParts';
import { pbr, rounded, path, type V3 } from '../models/geometry';

function fiberGeometry(){
 const geos:T.BufferGeometry[]=[];let seed=421;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};
 for(let i=0;i<76;i++){const start:V3=[(random()-.5)*2.0,.055,(random()-.5)*1.30];const end:V3=[(random()-.5)*2.0,.055,(random()-.5)*1.30];const points:V3[]=[start,[(start[0]+end[0])*.5+(random()-.5)*.35,.066+(random()*.028),(start[2]+end[2])*.5],end];geos.push(new T.TubeGeometry(path(points),12,.0045,4,false));}
 const merged=mergeGeometries(geos);geos.forEach(g=>g.dispose());return merged;
}
function Layer({index}:{index:number}){
 const [hovered,setHovered]=useState(false);
 const s=useExhibit(),ref=useRef<T.Group>(null),layer=layers[index],packed=[-.23,-.15,-.09,.09,.15,.23],expanded=[-.93,-.58,-.23,.32,.68,1.04];
 const object=useMemo(()=>{const g=new T.Group();const mat=new T.MeshPhysicalMaterial({color:layer.color,roughness:index===3?.72:.32,metalness:index===1||index===4?.82:.15,clearcoat:.25,transparent:true,opacity:1,side:T.DoubleSide});rounded(g,[2.25,layer.thickness,1.55],[0,0,0],mat,.055,layer.id);
  // Rounded, chamfered sheets with edge rails, mounting holes, and electrode contact tabs.
  if(index===1||index===4){const gold=pbr('#d8ba72',.3,.8);for(const x of [-1.26,1.26])rounded(g,[.38,.025,.32],[x,.01,0],gold,.03,layer.id);}
  if(index===0||index===5){for(let x of [-.93,.93])for(let z of [-.58,.58]){const hole=new T.Mesh(new T.TorusGeometry(.036,.009,6,16),pbr('#87a5b5',.4,.6));hole.rotation.x=-Math.PI/2;hole.position.set(x,layer.thickness/2+.005,z);g.add(hole);}}
  return g;},[index,layer]);useDispose(object);
 useEffect(()=>{object.traverse(o=>{if(o instanceof T.Mesh&&o.material instanceof T.MeshStandardMaterial){o.material.transparent=true;const ghost=s.fibers&&index!==3;
 const cutaway=s.chapter===3&&index>=3;
 o.material.opacity=ghost?.07:s.transparent?.25:cutaway?(index===3?.55:.16):1;
 o.material.depthWrite=!ghost&&!s.transparent&&!cutaway;
 if(index===3)o.material.color.set(s.fibers?'#476d7b':layer.color);o.material.emissive.set(s.selected===layer.id||hovered?'#204755':'#000000');o.material.emissiveIntensity=1;}});},[s.transparent,s.selected,hovered,s.fibers,s.chapter,index,object,layer.id,layer.color]);
 useFrame((_,dt)=>{if(!ref.current)return;let y:number;if(s.chapter===3)y=packed[index]+(index>=3?-.1025+s.sample.current.separation*1.05:0);else {const spread=s.mode==='guided'? .65+.35*s.chapterProgress.current:1;y=s.exploded?T.MathUtils.lerp(packed[index],expanded[index],spread):packed[index];}ref.current.position.y=s.reduced?y:T.MathUtils.damp(ref.current.position.y,y,5,Math.min(dt,.05));});
 const fibers=useMemo(()=>index===3?fiberGeometry():null,[index]);useEffect(()=>()=>fibers?.dispose(),[fibers]);
 return <group ref={ref} position={[0,packed[index],0]} onClick={e=>{e.stopPropagation();s.select(layer.id);}} onPointerOver={()=>{document.body.style.cursor='pointer';setHovered(true);}} onPointerOut={()=>{document.body.style.cursor='auto';setHovered(false);}}>
  <primitive object={object} dispose={null}/>
  {fibers&&<mesh geometry={fibers} userData={{info:'pvdf'}}><meshStandardMaterial color={s.fibers?'#c9edf3':'#fbf7e7'} emissive={s.fibers?'#458c99':'#252c29'} emissiveIntensity={s.fibers?1:.15} roughness={.76}/></mesh>}
  {s.chapter===2&&s.labels&&s.exploded&&[0,3,4].includes(index)&&<Hotspot id={layer.id} position={[index===3?-1.05:1.05,.04,.15]} short={index===3?'PVDF nanofibers':index===0?'Flexible substrate':'Conductive electrode'} side={index===3?'left':'right'}/>}
 </group>;
}
function Charges(){
 const s=useExhibit(),upper=useRef<T.Group>(null),lower=useRef<T.Group>(null),field=useRef<T.Group>(null);
 const charges=useMemo(()=>{const g=new T.Group();const red=pbr('#e9bd7e',.3,.25);red.emissive.set('#cb8636');red.emissiveIntensity=.7;for(let x=0;x<5;x++)for(let z=0;z<3;z++){const p=new T.Group();p.position.set((x-2)*.38,0,(z-1)*.42);rounded(p,[.1,.012,.021],[0,0,0],red,.003);rounded(p,[.021,.012,.1],[0,0,0],red,.003);g.add(p);}return g;},[]);useDispose(charges);
 const minus=useMemo(()=>{const g=new T.Group();const mat=pbr('#7bcde4',.3,.2);mat.emissive.set('#388baf');mat.emissiveIntensity=.7;for(let x=0;x<5;x++)for(let z=0;z<3;z++)rounded(g,[.1,.012,.021],[(x-2)*.38,0,(z-1)*.42],mat,.003);return g;},[]);useDispose(minus);
 useFrame(()=>{const {separation,charged}=s.sample.current;const gap=Math.max(.005,separation*1.05);if(upper.current){upper.current.position.y=-.0425+separation*1.05;upper.current.visible=charged;}if(lower.current)lower.current.visible=charged;if(field.current){field.current.position.y=-.0475+gap/2;field.current.scale.y=gap;field.current.visible=charged&&separation>.08;}});
 return <><group ref={upper}><primitive object={charges} dispose={null}/></group><group ref={lower} position={[0,-.0415,0]}><primitive object={minus} dispose={null}/></group><group ref={field}>{[-.7,-.35,0,.35,.7].map(x=><mesh key={x} position={[x,0,.2]}><cylinderGeometry args={[.003,.003,1,5]}/><meshBasicMaterial color="#a4b8a7" transparent opacity={.22} depthWrite={false}/></mesh>)}</group></>;
}
const loop:V3[]=[[-1.25,-.15,0],[-1.75,-.15,0],[-1.95,-.55,.08],[-1.8,-1.15,.2],[0,-1.3,.3],[1.8,-1.15,.2],[2.0,-.1,0],[1.9,.75,0],[1.25,.75,0]];
function Circuit(){
 const s=useExhibit(),needle=useRef<T.Group>(null),bridge=useRef<T.Mesh>(null),particles=useRef<T.InstancedMesh>(null),t=useRef(0),curve=useMemo(()=>path(loop),[]),dummy=useMemo(()=>new T.Object3D(),[]),target=useMemo(()=>new T.Vector3(),[]);
 useFrame((_,dt)=>{const response=s.sample.current.response;const contactY=.0475+s.sample.current.separation*1.05;if(bridge.current){bridge.current.position.set(1.25,(.75+contactY)/2,0);bridge.current.scale.y=Math.max(.005,Math.abs(.75-contactY));}if(needle.current)needle.current.rotation.z=-response*.75;if(!particles.current)return;if(!s.paused&&(s.simPlaying||s.manual))t.current+=Math.min(dt,.05)*response*.25;for(let i=0;i<14;i++){curve.getPoint(((t.current+i/14)%1+1)%1,target);dummy.position.copy(target);dummy.scale.setScalar(Math.abs(response)>.015?1:0);dummy.updateMatrix();particles.current.setMatrixAt(i,dummy.matrix);}particles.current.instanceMatrix.needsUpdate=true;});
 return <><mesh ref={bridge}><cylinderGeometry args={[.012,.012,1,8]}/><meshStandardMaterial color="#95bbc6" metalness={.55} roughness={.4}/></mesh><Curve points={loop} color="#66899a" radius={.013}/><instancedMesh ref={particles} args={[undefined,undefined,14]} frustumCulled={false}><sphereGeometry args={[.034,8,8]}/><meshStandardMaterial color="#f4d18a" emissive="#f4d18a" emissiveIntensity={2} toneMapped={false}/></instancedMesh><group position={[2,-.23,.08]} onClick={e=>{e.stopPropagation();s.select('meter');}}>
 <mesh><boxGeometry args={[.60,.51,.17]}/><meshStandardMaterial color="#8da4b4" metalness={.65} roughness={.3}/></mesh><mesh position={[0,.02,.095]}><planeGeometry args={[.5,.36]}/><meshStandardMaterial color="#d1ddd7" roughness={.8}/></mesh><group ref={needle} position={[0,-.10,.11]}><mesh position={[0,.11,0]}><boxGeometry args={[.012,.24,.01]}/><meshBasicMaterial color="#af5948"/></mesh></group>{[-.7,-.35,0,.35,.7].map(a=><mesh key={a} position={[Math.sin(a)*.22,Math.cos(a)*.22-.1,.11]} rotation={[0,0,-a]}><boxGeometry args={[.01,.04,.005]}/><meshBasicMaterial color="#344c55"/></mesh>)}<Hotspot id="meter" position={[.1,.4,0]} short="Schematic response"/>
 </group></>;
}
export default function Generator(){const s=useExhibit();return <group rotation={[.3,-.36,.04]}><group>{layers.map((_,i)=><Layer key={i} index={i}/>)}</group>{s.chapter===3&&<><Charges/><Circuit/></>}{s.chapter===2&&s.fibers&&<Hotspot id="pvdf" position={[-.5,.56,.4]} short="Magnified fiber network" side="left"/>}</group>;}
