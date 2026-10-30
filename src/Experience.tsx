import { Component, Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as T from 'three';
import { useExhibit } from './state';
import { info, type InfoId } from './data';
import HeartScene from './scenes/Heart';
const Generator=lazy(()=>import('./scenes/Generator'));
const EnergySystem=lazy(()=>import('./scenes/EnergySystem'));
function CameraRig({mobile}:{mobile:boolean}){
 const s=useExhibit(),{camera}=useThree(),control=useRef<OrbitControlsImpl>(null),transition=useRef(true),elapsed=useRef(0);
 const target=useMemo(()=>new T.Vector3(),[]),position=useMemo(()=>new T.Vector3(),[]);
 useEffect(()=>{transition.current=true;elapsed.current=0;},[s.chapter,s.focus,s.cameraReset,s.zoom,mobile]);
 useFrame((_,dt)=>{
  if(!control.current)return;
  elapsed.current+=Math.min(dt,.05);
  if(s.mode==='explore'&&!transition.current)return;
  const rootX=mobile?0:1.05,rootY=mobile?.55:0;
  const d=[9.5,7.8,8,9.1,10.3][s.chapter]+(s.chapter===4?s.chapterProgress.current*2.0:0);
  const selected=s.focus?info[s.focus].position:null;
  if(selected){target.set(selected[0]+rootX-(mobile?0:.35),selected[1]+rootY,selected[2]);
   if(s.focus==='pvdf'){target.set(rootX-(mobile?0:.35),.4+rootY,0);position.copy(target).add(new T.Vector3(.1,3.3,4.3).multiplyScalar(s.zoom));}
   else position.copy(target).add(new T.Vector3(.1,.85,4.8*s.zoom));}
  else {target.set(mobile&&s.chapter===4?.8:0,rootY+.1,0);position.set(mobile&&s.chapter===4?.8:0,s.chapter===2||s.chapter===3?2.3:rootY+.65,d*s.zoom*(mobile?1.2:1));}
  if(!s.reduced&&!s.paused&&s.mode==='guided'){position.x+=Math.sin(s.chapterProgress.current*Math.PI)*.25;position.y+=s.chapterProgress.current*.13;}
  const factor=s.reduced?1:1-Math.exp(-dt*3.8);camera.position.lerp(position,factor);control.current.target.lerp(target,factor);control.current.update();
  if(elapsed.current>1.6)transition.current=false;
 });
 return <OrbitControls ref={control} makeDefault enabled={s.mode==='explore'} enablePan={false} enableZoom={false} minDistance={3} maxDistance={16} minPolarAngle={.15} maxPolarAngle={Math.PI-.15} enableDamping dampingFactor={.08} onStart={()=>{transition.current=false;}}/>;
}
function Atmosphere({mobile}:{mobile:boolean}){
 const s=useExhibit(),count=mobile||s.quality==='low'?60:160;
 const positions=useMemo(()=>{const arr=new Float32Array(count*3);let seed=17;for(let i=0;i<arr.length;i++){seed=seed*16807%2147483647;arr[i]=(seed/2147483647-.5)*14;}return arr;},[count]);
 const particles=useRef<T.Points>(null),t=useRef(0);
 useFrame((_,dt)=>{if(!s.paused&&!s.reduced)t.current+=Math.min(dt,.05);if(particles.current)particles.current.rotation.y=t.current*.008;});
 return <><points ref={particles}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color="#7fb7c9" size={.014} transparent opacity={.45} depthWrite={false}/></points>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.65,0]} receiveShadow><planeGeometry args={[40,40]}/><meshStandardMaterial color="#070e18" roughness={.7} metalness={.25}/></mesh>
  {[1.4,2.1,2.85].map((r,i)=><mesh key={r} rotation={[-Math.PI/2,0,0]} position={[mobile?0:1.05,-2.63,0]}><ringGeometry args={[r,r+.004,100]}/><meshBasicMaterial color="#63c0d7" transparent opacity={.12-i*.025}/></mesh>)}
 </>;
}
function World({mobile}:{mobile:boolean}){
 const s=useExhibit();
 const {gl}=useThree();useEffect(()=>{gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=1.22;},[gl]);
 return <>
 <color attach="background" args={['#050c15']}/><fog attach="fog" args={['#050c15',14,30]}/>
 <ambientLight intensity={.65} color="#a8bfd4"/><hemisphereLight args={['#9ccee4','#151827',1.3]}/>
 <directionalLight position={[-3,5,6]} intensity={3.4} color="#ffe2cb" castShadow shadow-mapSize-width={s.quality==='low'?512:1024} shadow-mapSize-height={s.quality==='low'?512:1024} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={6} shadow-camera-bottom={-5} shadow-normalBias={.04}/>
 <directionalLight position={[4,2,-4]} intensity={4} color="#55b8d8"/>
 <pointLight position={[-4,-1,4]} intensity={18} color="#a3798d" distance={12}/>
 <group position={[mobile?0:1.05,mobile?.55:0,0]}>
 {(s.chapter===0||s.chapter===1||s.chapter===4)&&<HeartScene/>}
 <Suspense fallback={null}>{(s.chapter===2||s.chapter===3)&&<Generator/>}{s.chapter===4&&<EnergySystem/>}</Suspense>
 </group><Atmosphere mobile={mobile}/><CameraRig mobile={mobile}/>
 </>;
}
class CanvasBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true};}componentDidCatch(error:Error){console.warn('3D rendering unavailable:',error.message);}render(){return this.state.failed?this.props.fallback:this.props.children;}}
function Fallback(){return <div className="webgl-fallback"><span className="fallback-mark">3D</span><h2>A window into the heartbeat</h2><p>Real-time 3D needs WebGL 2 and hardware acceleration. Try a supported browser or enable graphics acceleration.</p><p>All five chapter descriptions, material explanations, simulation controls, and the schematic waveform remain available below.</p></div>;}
export default function Experience(){
 const s=useExhibit(),[mobile,setMobile]=useState(()=>innerWidth<760),[failed,setFailed]=useState(false);
 useEffect(()=>{const m=matchMedia('(max-width:759px)');const change=()=>setMobile(m.matches);m.addEventListener('change',change);return()=>m.removeEventListener('change',change);},[]);
 return <div className="canvas-shell" aria-label="Interactive biomedical 3D exhibit" role="region"><CanvasBoundary fallback={<Fallback/>}>{failed?<Fallback/>:<Canvas shadows={s.quality!=='low'} dpr={s.quality==='low'?1:mobile?[1,1.35]:[1,1.75]} camera={{position:[0,.65,11],fov:38,near:.1,far:50}} gl={{antialias:s.quality!=='low',powerPreference:'high-performance'}} fallback={<Fallback/>} onCreated={({gl})=>{gl.domElement.setAttribute('aria-label','Interactive 3D scientific model. Use the component buttons to explore with a keyboard.');gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();setFailed(true);});}}><World mobile={mobile}/></Canvas>}</CanvasBoundary></div>;
}
