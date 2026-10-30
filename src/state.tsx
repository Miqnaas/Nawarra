import { createContext, useContext, useCallback, useMemo, useRef, useState, type ReactNode, type MutableRefObject } from 'react';
import type { InfoId } from './data';
import { manualResponse, sampleCycle, type SimulationSample } from './simulation';
export type Marker = {token:string;id:InfoId;short?:string;side:'right'|'left';element:HTMLDivElement|null};
type Mode = 'guided' | 'explore';
export function useExhibitState() {
  const [markers,setMarkers]=useState<Marker[]>([]);
  const registerMarker=useCallback((marker:Marker)=>{setMarkers(list=>[...list.filter(m=>m.token!==marker.token),marker]);return()=>setMarkers(list=>list.filter(m=>m.token!==marker.token));},[]);
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [chapter, setChapter] = useState(0);
  const [mode, setMode] = useState<Mode>('guided');
  const [paused, setPaused] = useState(reduced);
  const [labels, setLabels] = useState(true);
  const [conduction, setConduction] = useState(true);
  const [comparison, setComparison] = useState<'traditional' | 'teng'>('traditional');
  const [exploded, setExploded] = useState(true);
  const [transparent, setTransparent] = useState(false);
  const [fibers, setFibers] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [selected, setSelected] = useState<InfoId | null>(null);
  const [focus, setFocus] = useState<InfoId | null>(null);
  const [cameraReset, setCameraReset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [stage, setStage] = useState(0);
  const [simPlaying, setSimPlaying] = useState(!reduced);
  const [speed, setSpeed] = useState(1);
  const [manual, setManual] = useState(false);
  const [separation, setSeparation] = useState(0);
  const [replayId, setReplayId] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [quality, setQuality] = useState<'balanced'|'low'>('balanced');
  const sample = useRef<SimulationSample>(sampleCycle(0));
  const simulationTime = useRef(0), chapterProgress = useRef(0), lastManual = useRef(0);
  function select(id: InfoId) { setSelected(id); }
  function resetCamera() { setFocus(null); setZoom(1); setCameraReset(n=>n+1); }
  function changeStage(n: number) {
    const value = (n+4)%4; setManual(false); setSimPlaying(false); setStage(value);
    // Show each stage at its illustrative midpoint; replay starts the complete cycle.
    simulationTime.current = value*3+(value>1?1.5:1);
    sample.current = sampleCycle(simulationTime.current);
    setSeparation(sample.current.separation);
  }
  function moveLayers(value: number) {
    const now=performance.now()/1000;
    setManual(true); setSimPlaying(false); setSeparation(value);
    const response = manualResponse(sample.current.separation,value,(lastManual.current?Math.min(.35,now-lastManual.current):.12));
    sample.current={separation:value,response,stage:value<.02?1:response<0?3:2,charged:true,time:simulationTime.current};
    setStage(sample.current.stage);lastManual.current=now;
  }
  function replay() {
    simulationTime.current=0;lastManual.current=0;sample.current=sampleCycle(0);setStage(0);setManual(false);setSeparation(0);setSimPlaying(!reduced);setExploded(true);setSelected(null);setReplayId(n=>n+1);resetCamera();
  }
  return { markers,registerMarker,reduced,chapter,setChapter,mode,setMode,paused,setPaused,labels,setLabels,conduction,setConduction,comparison,setComparison,exploded,setExploded,transparent,setTransparent,fibers,setFibers,bpm,setBpm,selected,setSelected,focus,setFocus,cameraReset,zoom,setZoom,stage,setStage,simPlaying,setSimPlaying,speed,setSpeed,manual,setManual,separation,setSeparation,replayId,tourPlaying,setTourPlaying,quality,setQuality,sample,simulationTime,chapterProgress,lastManual,select,resetCamera,changeStage,moveLayers,replay };
}
export type ExhibitState = ReturnType<typeof useExhibitState>;
const Context=createContext<ExhibitState | null>(null);
export function ExhibitProvider({children}:{children:ReactNode}) { const state=useExhibitState();return <Context.Provider value={state}>{children}</Context.Provider>; }
export function useExhibit(){ const state=useContext(Context);if(!state)throw new Error('Exhibit provider missing');return state; }
export type SampleRef = MutableRefObject<SimulationSample>;
