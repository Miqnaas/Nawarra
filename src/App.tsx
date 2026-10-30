import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters } from './data';
import { ExhibitProvider, useExhibit } from './state';
import { sampleCycle } from './simulation';
import { ContextControls, Inspector, ViewControls } from './components/Controls';
import { Icon } from './components/Icon';
import { HotspotOverlay } from './components/SceneParts';
const Experience=lazy(()=>import('./Experience'));
gsap.registerPlugin(ScrollTrigger);
function SimulationClock(){
 const s=useExhibit(),settings=useRef(s);settings.current=s;
 useEffect(()=>{let raf=0,last=performance.now(),uiTime=0;const tick=(now:number)=>{raf=requestAnimationFrame(tick);const dt=Math.max(0,Math.min((now-last)/1000,.05));last=now;const state=settings.current;if(document.hidden)return;
  if(state.chapter===3&&!state.paused){if(state.manual){state.sample.current.response*=Math.exp(-dt*2.2);}else if(state.simPlaying){state.simulationTime.current+=dt*state.speed;state.sample.current=sampleCycle(state.simulationTime.current);if(state.stage!==state.sample.current.stage)state.setStage(state.sample.current.stage);uiTime+=dt;if(uiTime>.08){state.setSeparation(state.sample.current.separation);uiTime=0;}}}
 };raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);},[]);return null;
}
function Exhibit(){
 const s=useExhibit(),story=useRef<HTMLDivElement>(null),progress=useRef<HTMLDivElement>(null),panel=useRef<HTMLDivElement>(null),[help,setHelp]=useState(false),helpDialog=useRef<HTMLDialogElement>(null);
 const go=useCallback((index:number)=>{document.getElementById(chapters[index].id)?.scrollIntoView({behavior:s.reduced?'instant':'smooth',block:'start'});},[s.reduced]);
 useEffect(()=>{
  const context=gsap.context(()=>{
   const nodes=gsap.utils.toArray<HTMLElement>('.chapter-anchor');
   nodes.forEach((node,index)=>{ScrollTrigger.create({trigger:node,start:'top 45%',end:'bottom 45%',onToggle:self=>{if(self.isActive){s.setChapter(index);s.setSelected(null);s.setFocus(null);s.setZoom(1);}},onUpdate:self=>{if(self.isActive)s.chapterProgress.current=self.progress;}});});
   gsap.to(progress.current,{scaleX:1,ease:'none',scrollTrigger:{trigger:story.current,start:'top top',end:'bottom bottom',scrub:s.reduced?true:.4}});
  },story);return()=>context.revert();
 },[s.reduced]);
 useEffect(()=>{if(!panel.current)return;panel.current.scrollTop=0;const tween=gsap.fromTo(panel.current,{opacity:s.reduced?1:0,y:s.reduced?0:16},{opacity:1,y:0,duration:s.reduced?0:.65,ease:'power2.out'});return()=>{tween.kill();};},[s.chapter,s.reduced]);
 useEffect(()=>{if(!s.tourPlaying||s.paused||s.mode!=='guided')return;const timer=setTimeout(()=>{if(s.chapter<4)go(s.chapter+1);else s.setTourPlaying(false);},14000);return()=>clearTimeout(timer);},[s.tourPlaying,s.paused,s.mode,s.chapter,go]);
 useEffect(()=>{if(help)helpDialog.current?.showModal();else helpDialog.current?.close();},[help]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){s.setSelected(null);s.setFocus(null);}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[]);
 const current=chapters[s.chapter];
 return <>
 <a className="skip-link" href="#chapter-content">Skip to chapter controls</a>
 <Suspense fallback={<div className="loading-screen"><span className="loading-orbit"/><span>Preparing the exhibit</span></div>}><Experience/></Suspense>
 <HotspotOverlay/>
 <SimulationClock/>
 <header className="site-header flex items-center justify-between"><a href="#heart" className="brand" onClick={e=>{e.preventDefault();go(0);}} aria-label="Nawarra, first chapter"><svg width="30" height="34" viewBox="0 0 30 34" fill="none" aria-hidden="true"><path d="M15 1 28 8v17l-13 8L2 25V8L15 1Z" stroke="currentColor"/><path d="M15 8v18M7 12l16 10M23 12 7 22" stroke="currentColor"/></svg><span>NAWARRA<small>BIOMEDICAL EXPLORATIONS</small></span></a><div className="exhibit-id hidden md:flex"><span className="status-dot"/> A STUDY IN SELF-POWERED TECHNOLOGY</div><button className="about-button" onClick={()=>setHelp(true)}>About the exhibit <Icon name="arrow" size={13}/></button></header>
 <div className="top-line"><span>EXHIBIT 001</span><div className="mode-switch segment"><button aria-pressed={s.mode==='guided'} onClick={()=>{s.setMode('guided');s.resetCamera();}}>Guided view</button><button aria-pressed={s.mode==='explore'} onClick={()=>{s.setMode('explore');s.setTourPlaying(false);}}>Free exploration <Icon name="rotate" size={12}/></button></div><span className="render-status"><i/> REAL-TIME 3D</span></div>
 <main>
 <div className="chapter-panel" id="chapter-content" ref={panel} tabIndex={-1}>
  <p className="eyebrow"><span/> {current.eyebrow}</p>
  <h1>{current.title.split('\n').map((line,i)=><span key={line} className={i?'title-accent':''}>{line}</span>)}</h1>
  <p className="chapter-subtitle">{current.subtitle}</p>
  <p className="chapter-description">{current.copy}</p>
  {s.chapter===0&&<button className="primary-action" onClick={()=>{s.setMode('guided');s.setPaused(false);s.setTourPlaying(!s.tourPlaying);}}>{s.tourPlaying?'Stop guided tour':'Begin the journey'}<Icon name={s.tourPlaying?'pause':'arrow'} size={16}/></button>}
  <ContextControls/>
 </div>
 <div className="scene-coordinate" aria-hidden="true"><span>{current.tag}</span><small>FIG. 0{s.chapter+1} — INTERACTIVE RECONSTRUCTION</small></div>
 <Inspector/>
 <ViewControls/>
 <nav className="chapter-nav glass" aria-label="Exhibit chapters">{chapters.map((chapter,index)=><button key={chapter.id} aria-label={`Chapter ${index+1}: ${chapter.label}`} aria-current={s.chapter===index?'step':undefined} onClick={()=>go(index)}><span>0{index+1}</span><div><strong>{chapter.label}</strong><small>{index===0?'THE HEART':index===1?'ENERGY SOURCE':index===2?'THE NANOGENERATOR':index===3?'THE MECHANISM':'THE SYSTEM'}</small></div><i/></button>)}</nav>
 <div className="story-scroll" ref={story} aria-label="Scroll through the five chapters">{chapters.map((chapter,index)=><section className="chapter-anchor" id={chapter.id} key={chapter.id} aria-label={`Chapter ${index+1}: ${chapter.label}`}><h2 className="sr-only">{chapter.title.replace('\n',' ')}</h2></section>)}</div>
 </main>
 <div className="bottom-utility"><div className="scroll-hint"><span className="scroll-icon"/><span>{s.mode==='guided'?'SCROLL TO DISCOVER':'DRAG TO ROTATE · USE + / − TO ZOOM'}</span></div><div className="global-playback"><button onClick={()=>s.setPaused(!s.paused)} aria-label={s.paused?'Resume all animations':'Pause all animations'} aria-pressed={s.paused}><Icon name={s.paused?'play':'pause'} size={13}/><span>{s.paused?'Resume':'Pause'}</span></button><span/><button onClick={s.replay} aria-label="Replay scene"><Icon name="reset" size={13}/><span>Replay scene</span></button><span/><button aria-label="Toggle low-power graphics" aria-pressed={s.quality==='low'} onClick={()=>s.setQuality(s.quality==='low'?'balanced':'low')}>{s.quality==='low'?'LOW POWER':'BALANCED'}</button></div><div className="chapter-count"><b>0{s.chapter+1}</b><span>/ 05</span><button className="icon-button" aria-label={s.chapter===4?'Return to first chapter':'Next chapter'} onClick={()=>go((s.chapter+1)%5)}><Icon name="arrow" size={15}/></button></div></div>
 <div className="scientific-disclaimer">EDUCATIONAL VISUALIZATION · EMERGING RESEARCH CONCEPT · NOT A CLINICALLY VALIDATED DEVICE</div>
 <div className="scroll-progress"><div ref={progress}/></div>
 <dialog className="about-dialog glass" ref={helpDialog} onClose={()=>setHelp(false)} aria-label="About this scientific exhibit"><div className="inspector-top"><span>ABOUT THE EXHIBIT</span><button className="icon-button" onClick={()=>setHelp(false)} aria-label="Close about dialog"><Icon name="close"/></button></div><h2>Step inside the heartbeat.</h2><p>A real-time reconstruction of the supplied ten-second reference video, expanded into five explorable chapters.</p><h3>How to explore</h3><p>Scroll or select a chapter. Switch to Free exploration to rotate the model. Use + / − to zoom, click labels or component buttons to inspect, and reset the camera at any time. The simulation supports manual separation, stage stepping, playback, and speed control.</p><h3>Science, carefully qualified</h3><p>All anatomy, fibers, signals, materials, circuitry, and dimensions are procedural educational approximations. No calibrated output or clinical performance is claimed. Conventional pacemakers still require their established energy supplies. TENG-assisted self-powering remains an emerging research concept.</p><h3>Original geometry. Clear limitations.</h3><p>No external anatomical assets were used. The reference does not establish a validated implant design, complete material specification, or quantitative electrical model. Source-video analysis and model limitations are documented in the repository.</p><p className="dialog-note">Reduced-motion preferences start animation paused. Low-power mode reduces rendering cost. A 3D-capable browser is recommended.</p><button className="primary-action" onClick={()=>setHelp(false)}>Return to the exhibit <Icon name="arrow" size={15}/></button></dialog>
 </>;
}
export default function App(){return <ExhibitProvider><Exhibit/></ExhibitProvider>;}
