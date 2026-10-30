import { chapters, info, layers, stages, type InfoId } from '../data';
import { useExhibit } from '../state';
import Waveform from './Waveform';
import { Icon } from './Icon';
export function ContextControls(){
 const s=useExhibit();
 const inspect=(id:InfoId)=>{s.select(id);};
 return <div className="context-controls" key={s.chapter}>
 {s.chapter===0&&<>
  <div className="control-row"><span>Visual field</span><div className="segment"><button aria-pressed={!s.conduction} onClick={()=>s.setConduction(false)}>Anatomy</button><button aria-pressed={s.conduction} onClick={()=>s.setConduction(true)}>Conduction</button></div></div>
  <div className="component-chips" aria-label="Anatomical components">{(['sa','av','aorta','ventricle'] as InfoId[]).map(id=><button key={id} onClick={()=>inspect(id)} aria-pressed={s.selected===id}>{id==='sa'?'SA node':id==='av'?'AV node':id==='ventricle'?'Ventricles':'Aorta'}<Icon name="plus" size={12}/></button>)}</div>
  <div className="control-row bpm-row"><label htmlFor="bpm">Illustrative heartbeat</label><output htmlFor="bpm">{s.bpm} <small>BPM</small></output></div><input id="bpm" aria-label="Illustrative heart rate" type="range" min="45" max="120" value={s.bpm} onChange={e=>s.setBpm(Number(e.target.value))}/>
  <button className="text-action" onClick={()=>{s.setFocus('heart');s.select('heart');}}><Icon name="target" size={15}/> Focus heart <Icon name="arrow" size={12}/></button>
 </>}
 {s.chapter===1&&<>
  <div className="comparison-toggle segment"><button aria-pressed={s.comparison==='traditional'} onClick={()=>s.setComparison('traditional')}>Conventional</button><button aria-pressed={s.comparison==='teng'} onClick={()=>s.setComparison('teng')}>TENG-assisted concept</button></div>
  <div className={`source-card ${s.comparison}`}><span className="source-indicator"/><div><small>{s.comparison==='traditional'?'ESTABLISHED TECHNOLOGY':'RESEARCH CONCEPT'}</small><h3>{s.comparison==='traditional'?'Stored chemical energy':'Harvested mechanical energy'}</h3><p>{s.comparison==='traditional'?'An internal battery powers sensing and electrical stimulation.':'A motion-coupled TENG could feed conditioning and storage. Clinical sufficiency is not established.'}</p></div></div>
  <div className="component-chips"><button onClick={()=>inspect('battery')}>Inspect battery <Icon name="plus" size={12}/></button><button onClick={()=>inspect('pacemaker')}>Inspect pacemaker <Icon name="plus" size={12}/></button>{s.comparison==='teng'&&<button onClick={()=>inspect('harvester')}>Inspect harvester <Icon name="plus" size={12}/></button>}</div>
 </>}
 {s.chapter===2&&<>
  <div className="control-row"><span>Assembly</span><div className="segment"><button aria-pressed={!s.exploded} onClick={()=>s.setExploded(false)}>Assemble</button><button aria-pressed={s.exploded} onClick={()=>s.setExploded(true)}>Explode <Icon name="layers" size={13}/></button></div></div>
  <div className="layer-list" aria-label="Nanogenerator layers">{[...layers].reverse().map((l,i)=><button key={l.id} className={s.selected===l.id?'active':''} onClick={()=>{inspect(l.id);}} aria-pressed={s.selected===l.id}><span style={{background:l.color}}/><span>{info[l.id].name}</span><small>0{6-i}</small></button>)}</div>
  <div className="toggle-row"><label><input type="checkbox" checked={s.transparent} onChange={e=>s.setTransparent(e.target.checked)}/> Transparent layers</label><label><input type="checkbox" checked={s.fibers} onChange={e=>{s.setFibers(e.target.checked);if(e.target.checked){s.setExploded(true);s.setFocus('pvdf');inspect('pvdf');}else s.resetCamera();}}/> Fiber close-up</label></div>
 </>}
 {s.chapter===3&&<>
  <div className="stage-buttons" aria-label="Simulation stages">{stages.map((stage,i)=><button key={stage.short} aria-label={`Stage ${i+1}: ${stage.title}`} aria-pressed={s.stage===i} onClick={()=>s.changeStage(i)}><span>0{i+1}</span><small>{stage.short}</small></button>)}</div>
  <div className="stage-description" aria-live="polite"><h3>{stages[s.stage].title}</h3><p>{stages[s.stage].text}</p></div>
  <div className="simulation-playback"><button className="icon-button" aria-label="Previous stage" onClick={()=>s.changeStage(s.stage-1)}><span className="flip"><Icon name="chevron" size={16}/></span></button><button className="sim-play" onClick={()=>{s.setManual(false);s.setSimPlaying(!s.simPlaying);}} aria-pressed={s.simPlaying}>{s.simPlaying?<Icon name="pause" size={13}/>:<Icon name="play" size={13}/>} {s.simPlaying?'Pause cycle':'Play cycle'}</button><button className="icon-button" aria-label="Next stage" onClick={()=>s.changeStage(s.stage+1)}><Icon name="chevron" size={16}/></button><button className="icon-button" aria-label="Replay simulation" onClick={s.replay}><Icon name="reset" size={16}/></button><select aria-label="Simulation speed" value={s.speed} onChange={e=>s.setSpeed(Number(e.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={1.5}>1.5×</option><option value={2}>2×</option></select></div>
  <div className="manual-control"><div className="control-row"><label htmlFor="separation">Move the layers yourself</label><span>{s.manual?'MANUAL':'AUTO'}</span></div><input id="separation" aria-label="Manual layer separation" type="range" min="0" max="100" step="1" value={Math.round(s.separation*100)} onChange={e=>s.moveLayers(Number(e.target.value)/100)}/><div className="range-extents"><span>Contact</span><span>Separated</span></div></div>
  <Waveform/>
 </>}
 {s.chapter===4&&<>
  <ol className="energy-chain">{(['heart','harvester','conditioning','storage','pacemaker'] as InfoId[]).map((id,i)=><li key={id}><button onClick={()=>{inspect(id);s.setFocus(id);}} aria-pressed={s.selected===id}><span>0{i+1}</span><span>{['Heartbeat motion','Mechanical energy → TENG','Conditioning circuit','Energy storage','Pacemaker electronics'][i]}</span><Icon name="arrow" size={12}/></button></li>)}</ol>
  <p className="research-note">A proposed pathway, not a validated implant. Safe integration and sufficient usable energy remain research questions.</p>
  <button className="text-action" onClick={s.resetCamera}><Icon name="target" size={15}/> View complete system</button>
 </>}
 </div>;
}
export function Inspector(){const s=useExhibit();if(!s.selected)return null;const data=info[s.selected];return <aside className="inspector glass" aria-label="Selected component details" aria-live="polite"><div className="inspector-top"><span>COMPONENT INSPECTOR</span><button className="icon-button" onClick={()=>s.setSelected(null)} aria-label="Close component details"><Icon name="close" size={16}/></button></div><small>{data.type}</small><h2>{data.name}</h2><p>{data.text}</p><button className="text-action" onClick={()=>{s.setFocus(s.selected);}}><Icon name="target" size={14}/> Focus component</button></aside>;}
export function ViewControls(){const s=useExhibit();return <div className="view-controls glass" aria-label="3D view controls"><button className="icon-button" onClick={()=>{s.setMode(s.mode==='explore'?'guided':'explore');s.setTourPlaying(false);}} aria-pressed={s.mode==='explore'} aria-label={s.mode==='explore'?'Leave exploration mode':'Enable 360 degree exploration'}><Icon name="rotate"/></button><span/><button className="icon-button" aria-label="Zoom in" onClick={()=>s.setZoom(z=>Math.max(.55,z-.12))}><Icon name="plus"/></button><button className="icon-button" aria-label="Zoom out" onClick={()=>s.setZoom(z=>Math.min(1.4,z+.12))}><Icon name="minus"/></button><button className="icon-button" aria-label="Reset camera" onClick={s.resetCamera}><Icon name="target"/></button><span/><button className="label-toggle" aria-label={s.labels?'Hide scientific labels':'Show scientific labels'} aria-pressed={s.labels} onClick={()=>s.setLabels(!s.labels)}>Aa</button></div>;}
