import { useEffect, useMemo, useRef, useId } from 'react';
import { useFrame } from '@react-three/fiber';

import * as T from 'three';
import { info, type InfoId } from '../data';
import { useExhibit, type Marker } from '../state';
import { path, type V3 } from '../models/geometry';
export function Hotspot({id,position,short,side='right'}:{id:InfoId;position:V3;short?:string;side?:'right'|'left'}){
 const s=useExhibit(),token=useId(),group=useRef<T.Group>(null),point=useMemo(()=>new T.Vector3(),[]);
 const marker=useMemo<Marker>(()=>({token,id,short,side,element:null}),[token,id,short,side]);
 useEffect(()=>{if(s.labels)return s.registerMarker(marker);},[s.labels,s.registerMarker,marker]);
 useFrame(({camera,size})=>{if(!group.current||!marker.element)return;group.current.getWorldPosition(point);point.project(camera);const visible=point.z>-1&&point.z<1&&Math.abs(point.x)<1.2&&Math.abs(point.y)<1.2;marker.element.style.display=visible?'block':'none';marker.element.style.transform=`translate3d(${(point.x*.5+.5)*size.width}px,${(-point.y*.5+.5)*size.height}px,0)`;});
 return <group ref={group} position={position}/>;
}
export function HotspotOverlay(){const s=useExhibit();return <div className="hotspot-overlay" aria-label="Scientific model hotspots">{s.markers.map(m=><div className="hotspot-position" key={m.token} ref={el=>{m.element=el;}}><button className={`hotspot ${m.side} ${s.selected===m.id?'chosen':''}`} onClick={()=>s.select(m.id)} aria-label={`Inspect ${info[m.id].name}`}><span className="hotspot-pin"/><span className="hotspot-line"/><span className="hotspot-copy">{m.short??info[m.id].name}<small>{info[m.id].type.split(' / ')[0]}</small></span></button></div>)}</div>;}
export function Curve({points,color='#5cbbd2',radius=.01,opacity=1}:{points:V3[];color?:string;radius?:number;opacity?:number}){
 const geometry=useMemo(()=>new T.TubeGeometry(path(points),48,radius,6,false),[points,radius]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry}><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.6} transparent={opacity<1} opacity={opacity} roughness={.4}/></mesh>;
}
export function Flow({points,color='#e6c17d',count=8,rate=1,active=true,direction=1}:{points:V3[];color?:string;count?:number;rate?:number;active?:boolean;direction?:number}){
 const s=useExhibit(),curve=useMemo(()=>path(points),[points]),dots=useRef<T.InstancedMesh>(null),t=useRef(0),dummy=useMemo(()=>new T.Object3D(),[]),v=useMemo(()=>new T.Vector3(),[]);
 useFrame((_,dt)=>{if(!dots.current)return;if(!s.paused&&active)t.current+=Math.min(dt,.05)*rate*direction;for(let i=0;i<count;i++){const phase=((t.current+i/count)%1+1)%1;curve.getPoint(phase,v);dummy.position.copy(v);dummy.scale.setScalar(active?1:0);dummy.updateMatrix();dots.current.setMatrixAt(i,dummy.matrix);}dots.current.instanceMatrix.needsUpdate=true;});
 return <instancedMesh ref={dots} args={[undefined,undefined,count]} frustumCulled={false}><sphereGeometry args={[.026,8,8]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} toneMapped={false}/></instancedMesh>;
}
export function useDispose(object:T.Object3D){useEffect(()=>()=>{const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();object.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>{if(m instanceof T.MeshStandardMaterial)m.bumpMap?.dispose();m.dispose();});},[object]);}
