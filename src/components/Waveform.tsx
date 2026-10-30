import { useEffect, useRef } from 'react';
import { useExhibit } from '../state';
export default function Waveform(){
 const s=useExhibit(),canvas=useRef<HTMLCanvasElement>(null),potential=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;let raf=0,last=0,points=Array(130).fill(0) as number[];
  const draw=(now:number)=>{raf=requestAnimationFrame(draw);const dpr=Math.min(devicePixelRatio,1.5),r=el.getBoundingClientRect(),w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(el.width!==w||el.height!==h){el.width=w;el.height=h;}
   if(!s.paused&&(s.simPlaying||s.manual)&&now-last>40){points=points.slice(1);points.push(s.sample.current.response);last=now;}
   ctx.clearRect(0,0,w,h);ctx.strokeStyle='#8fbed315';ctx.lineWidth=1;for(let x=0;x<w;x+=20*dpr){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=14*dpr){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
   ctx.strokeStyle='#a1bfd338';ctx.setLineDash([3*dpr,4*dpr]);ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();ctx.setLineDash([]);
   ctx.beginPath();points.forEach((p,i)=>{const x=i/(points.length-1)*w,y=h/2-p*h*.37;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.strokeStyle='#e6c482';ctx.lineWidth=1.5*dpr;ctx.shadowColor='#e6c482';ctx.shadowBlur=5;ctx.stroke();ctx.shadowBlur=0;
   if(potential.current)potential.current.textContent=s.sample.current.separation>.66?'Higher':s.sample.current.separation>.2?'Changing':'Lower';
  };raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
 },[s.paused,s.simPlaying,s.manual,s.replayId,s.sample]);
 return <div className="waveform"><div className="waveform-heading"><span><i/> Schematic electrical response</span><span>± <small>NO UNITS</small></span></div><canvas ref={canvas} aria-label="Qualitative bipolar electrical response to changes in layer separation; not a measured voltage"/><div className="waveform-footer"><span>Relative potential: <span ref={potential}>Lower</span></span><span>Illustrative · not measured</span></div></div>;
}
