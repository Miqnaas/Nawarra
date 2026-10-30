import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Experience from './scene/Experience';
import { chapters } from './data';
import type { SelectPart } from './scene/types';

gsap.registerPlugin(ScrollTrigger);

type SelectedPart = { id: string; title: string; description: string; focus: [number, number, number] };

const simulationStages = [
  { title: 'Contact electrification', note: 'The material pair develops opposite surface charge through contact. The polarity shown is illustrative and depends on the actual material pair.' },
  { title: 'Surface contact', note: 'Microscale surface features meet across the active interface. The fibrous layer is a procedural visualization, not a measured material sample.' },
  { title: 'Separation', note: 'As the charged surfaces move apart, their potential difference changes and charge can flow through the external circuit.' },
  { title: 'Electrostatic induction', note: 'Induced charge redistribution continues through the circuit as the layers separate, then reverses as they return toward contact.' },
];

function waveformPath(gap: number, stage: number) {
  const amplitude = stage === 1 ? 4 : 8 + gap * 24;
  const path: string[] = [];
  for (let x = 0; x <= 280; x += 4) {
    const t = (x / 280) * Math.PI * 4;
    const envelope = 0.35 + 0.65 * Math.sin((x / 280) * Math.PI);
    const signal = Math.sin(t) * 0.34 + Math.sin(t * 2.4) * 0.08 + Math.sin(t * 0.5) * 0.15;
    const y = 43 - signal * amplitude * envelope;
    path.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
  }
  return path.join(' ');
}

function ChapterControls({
  chapter,
  conduction,
  setConduction,
  comparisonMode,
  setComparisonMode,
  exploded,
  setExploded,
  layersTransparent,
  setLayersTransparent,
  simulationStage,
  setSimulationStage,
  gap,
  setGap,
  simulationPlaying,
  setSimulationPlaying,
  paused,
  speed,
  setSpeed,
}: {
  chapter: number;
  conduction: boolean;
  setConduction: (value: boolean) => void;
  comparisonMode: 'conventional' | 'experimental';
  setComparisonMode: (value: 'conventional' | 'experimental') => void;
  exploded: boolean;
  setExploded: (value: boolean) => void;
  layersTransparent: boolean;
  setLayersTransparent: (value: boolean) => void;
  simulationStage: number;
  setSimulationStage: (value: number) => void;
  gap: number;
  setGap: (value: number) => void;
  simulationPlaying: boolean;
  setSimulationPlaying: (value: boolean) => void;
  paused: boolean;
  speed: number;
  setSpeed: (value: number) => void;
}) {
  const selectStage = (nextStage: number) => {
    setSimulationStage(nextStage);
    const gapByStage = [0, 0.06, 0.28, 0.84, 0.62];
    setGap(gapByStage[nextStage]);
  };

  if (chapter === 0) {
    return (
      <div className="control-row">
        <button type="button" className={`text-control${conduction ? ' is-active' : ''}`} onClick={() => setConduction(!conduction)}>
          <span className="control-dot" />
          {conduction ? 'Conduction pathways on' : 'Show conduction pathways'}
        </button>
      </div>
    );
  }

  if (chapter === 1) {
    return (
      <div className="comparison-switch" aria-label="Compare pacemaker concepts">
        <button type="button" className={comparisonMode === 'conventional' ? 'is-active' : ''} onClick={() => setComparisonMode('conventional')}>Conventional</button>
        <button type="button" className={comparisonMode === 'experimental' ? 'is-active' : ''} onClick={() => setComparisonMode('experimental')}>TENG concept</button>
      </div>
    );
  }

  if (chapter === 2) {
    return (
      <div className="control-row">
        <button type="button" className="primary-control" onClick={() => setExploded(!exploded)}>
          <span className={`explode-symbol${exploded ? ' is-open' : ''}`} aria-hidden="true" />
          {exploded ? 'Assemble layers' : 'Explode layers'}
        </button>
        <button type="button" className={`text-control${layersTransparent ? ' is-active' : ''}`} onClick={() => setLayersTransparent(!layersTransparent)}>
          <span className="control-dot" />
          {layersTransparent ? 'Restore opacity' : 'Reveal inner layers'}
        </button>
        <span className="micro-note">Select a layer in the model to inspect it</span>
      </div>
    );
  }

  if (chapter === 3) {
    const wave = waveformPath(gap, simulationStage);
    return (
      <div className="simulation-controls">
        <div className="simulation-title-row">
          <span className="micro-label">TENG CYCLE</span>
          <span className="micro-label micro-label--status"><i /> {simulationPlaying && !paused ? 'RUNNING' : 'MANUAL'}</span>
        </div>
        <div className="stage-list" role="tablist" aria-label="TENG generation stages">
          {[
            'Contact electrification',
            'Surface contact',
            'Separation',
            'Electrostatic induction',
          ].map((name, index) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={simulationStage === index + 1}
              className={`stage-button${simulationStage === index + 1 ? ' is-active' : ''}${index + 1 < simulationStage ? ' is-past' : ''}`}
              onClick={() => selectStage(index + 1)}
            >
              <span className="stage-number">0{index + 1}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
        <div className="simulation-buttons">
          <button type="button" className="small-icon-button" aria-label="Previous stage" onClick={() => selectStage(Math.max(1, simulationStage - 1))}>‹</button>
          <button type="button" className="simulation-play" aria-label={simulationPlaying ? 'Pause simulation' : 'Play simulation'} onClick={() => setSimulationPlaying(!simulationPlaying)}>
            <span className={simulationPlaying ? 'icon-pause' : 'icon-play'} />
            {simulationPlaying ? 'Pause' : 'Play cycle'}
          </button>
          <button type="button" className="small-icon-button" aria-label="Next stage" onClick={() => selectStage(Math.min(4, simulationStage + 1))}>›</button>
          <button type="button" className="replay-link" onClick={() => { setSimulationPlaying(false); selectStage(1); }}>Replay</button>
        </div>
        <label className="range-control">
          <span><span>Layer separation</span><span>{Math.round(gap * 100)}%</span></span>
          <input aria-label="Manually separate the TENG layers" type="range" min="0" max="1" step="0.01" value={gap} onChange={(event) => { setGap(Number(event.target.value)); setSimulationPlaying(false); }} />
          <span className="range-ends"><span>Contact</span><span>Separate</span></span>
        </label>
        <div className="waveform-card">
          <div className="waveform-header"><span>Illustrative output</span><span>SCHEMATIC</span></div>
          <svg viewBox="0 0 280 86" role="img" aria-label="Schematic waveform that responds to the layer separation control">
            <path className="wave-grid" d="M0 22H280M0 43H280M0 64H280M70 0V86M140 0V86M210 0V86" />
            <path className="wave-baseline" d="M0 43H280" />
            <path className="wave-line" d={wave} />
          </svg>
          <div className="waveform-caption">Responsive to layer motion · not measured data</div>
        </div>
        <label className="speed-control">
          <span>Animation speed</span>
          <input aria-label="Animation speed" type="range" min="0.5" max="1.5" step="0.25" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
          <span>{speed.toFixed(2)}×</span>
        </label>
      </div>
    );
  }

  return <p className="system-sequence">Heartbeat motion <span>→</span> mechanical energy <span>→</span> TENG output <span>→</span> conditioning & storage <span>→</span> pacemaker electronics</p>;
}

export default function App() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [mode, setMode] = useState<'guided' | 'explore'>('guided');
  const [paused, setPaused] = useState(false);
  const [conduction, setConduction] = useState(true);
  const [comparisonMode, setComparisonMode] = useState<'conventional' | 'experimental'>('conventional');
  const [exploded, setExploded] = useState(true);
  const [layersTransparent, setLayersTransparent] = useState(false);
  const [simulationStage, setSimulationStage] = useState(1);
  const [gap, setGap] = useState(0.12);
  const [simulationPlaying, setSimulationPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedPart, setSelectedPart] = useState<SelectedPart | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heading = useRef<HTMLDivElement>(null);
  const canvasLayer = useRef<HTMLDivElement>(null);
  const active = chapters[activeChapter] ?? chapters[0];

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  const selectChapter = useCallback((id: number) => {
    setActiveChapter(id);
    setSelectedPart(null);
    if (id !== 3) setSimulationPlaying(false);
  }, []);

  useEffect(() => {
    const markers = document.querySelectorAll<HTMLElement>('.story-section');
    const triggers = Array.from(markers).map((marker, index) => ScrollTrigger.create({
      trigger: marker,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => selectChapter(index),
      onEnterBack: () => selectChapter(index),
    }));
    ScrollTrigger.refresh();
    return () => triggers.forEach((trigger) => trigger.kill());
  }, [selectChapter]);

  useEffect(() => {
    if (!heading.current) return;
    gsap.fromTo(heading.current, { opacity: 0, y: 16, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: reducedMotion ? 0 : 0.72, ease: 'power3.out' });
  }, [activeChapter, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) setSimulationPlaying(false);
  }, [reducedMotion]);

  useEffect(() => {
    if (!simulationPlaying || paused || reducedMotion || activeChapter !== 3) return;
    const timer = window.setInterval(() => {
      const next = simulationStage >= 4 ? 1 : simulationStage + 1;
      const gapByStage = [0, 0.06, 0.28, 0.84, 0.62];
      setSimulationStage(next);
      setGap(gapByStage[next]);
    }, 1900 / speed);
    return () => window.clearInterval(timer);
  }, [simulationPlaying, paused, reducedMotion, activeChapter, speed, simulationStage]);

  const onSelect = useCallback<SelectPart>((id, title, description, focus) => {
    setSelectedPart({ id, title, description, focus });
  }, []);

  const selectedFocus = selectedPart?.focus ?? null;
  const caution = useMemo(() => activeChapter === 1
    ? 'TENG-assisted pacemaker concepts are experimental research, not an approved replacement for battery-powered devices.'
    : activeChapter === 4
      ? 'Educational visualization only · no clinical performance or device design is implied.'
      : 'Educational scientific visualization · illustrative models, not clinical measurements.', [activeChapter]);

  const goToChapter = (id: number) => {
    const section = document.getElementById(`chapter-${id}`);
    if (section) {
      selectChapter(id);
      section.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    }
  };

  const replayChapter = () => {
    setPaused(false);
    setSelectedPart(null);
    setResetKey((key) => key + 1);
    if (activeChapter === 2) setExploded(true);
    if (activeChapter === 3) {
      setSimulationStage(1);
      setGap(0.06);
      setSimulationPlaying(!reducedMotion);
    }
  };

  const toggleMode = () => {
    const nextMode = mode === 'guided' ? 'explore' : 'guided';
    setMode(nextMode);
    if (nextMode === 'explore') requestAnimationFrame(() => canvasLayer.current?.focus());
  };
  const progress = (activeChapter + 1) / chapters.length;

  return (
    <main className={`app-shell${mode === 'explore' ? ' is-exploring' : ''}${reducedMotion ? ' reduced-motion' : ''}`}>
      <div ref={canvasLayer} className="canvas-layer" tabIndex={-1} role="group" aria-label="Interactive 3D exhibit. Use arrow keys to rotate and plus or minus to zoom when Free Explore is active.">
        <Experience
          chapter={activeChapter}
          mode={mode}
          paused={paused}
          resetKey={resetKey}
          selectedFocus={selectedFocus}
          selectedId={selectedPart?.id ?? null}
          conduction={conduction}
          exploded={exploded}
          comparisonMode={comparisonMode}
          gap={gap}
          simulationStage={simulationStage}
          layersTransparent={layersTransparent}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
        />
      </div>
      <div className="ambient-wash" aria-hidden="true" />
      <div className="edge-vignette" aria-hidden="true" />

      <header className="topbar">
        <a className="brand-lockup" href="#top" onClick={(event) => { event.preventDefault(); goToChapter(0); }} aria-label="Heartbeat Lab, return to chapter one">
          <span className="brand-mark"><i /><i /><i /></span>
          <span className="brand-text"><strong>HEARTBEAT</strong><small>LAB / 01</small></span>
        </a>
        <div className="topbar-meta"><span className="topbar-rule" /><span>BIOMEDICAL SYSTEMS</span><span className="topbar-dot" /><span>INTERACTIVE STUDY</span></div>
        <div className="topbar-right">
          <span className="education-badge"><i /> EDUCATIONAL VIEW</span>
          <button type="button" className={`mode-toggle${mode === 'explore' ? ' is-active' : ''}`} onClick={toggleMode} aria-pressed={mode === 'explore'}>
            <span className="mode-toggle-icon" aria-hidden="true">{mode === 'explore' ? '◎' : '↗'}</span>
            {mode === 'guided' ? 'Free explore' : 'Guided tour'}
          </button>
        </div>
      </header>

      <nav className="chapter-rail" aria-label="Experience chapters">
        <div className="rail-heading">EXPERIENCE PATH</div>
        <div className="rail-progress"><span style={{ height: `${progress * 100}%` }} /></div>
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            className={`rail-item${activeChapter === chapter.id ? ' is-active' : ''}`}
            onClick={() => goToChapter(chapter.id)}
            aria-label={`Go to chapter ${chapter.code}: ${chapter.title}`}
            aria-current={activeChapter === chapter.id ? 'step' : undefined}
          >
            <span className="rail-index">{chapter.code}</span>
            <span className="rail-name">{chapter.sceneTag}</span>
          </button>
        ))}
      </nav>

      <section className="chapter-copy" aria-live="polite" aria-atomic="true" ref={heading}>
        <div className="chapter-eyebrow"><span className="eyebrow-line" />{active.eyebrow}</div>
        <h1>{active.title}</h1>
        <p className="chapter-subtitle">{active.subtitle}</p>
        <p className="chapter-description">{active.description}</p>
        <div className="chapter-tools">
          <ChapterControls
            chapter={activeChapter}
            conduction={conduction}
            setConduction={setConduction}
            comparisonMode={comparisonMode}
            setComparisonMode={setComparisonMode}
            exploded={exploded}
            setExploded={setExploded}
            layersTransparent={layersTransparent}
            setLayersTransparent={setLayersTransparent}
            simulationStage={simulationStage}
            setSimulationStage={setSimulationStage}
            gap={gap}
            setGap={setGap}
            simulationPlaying={simulationPlaying}
            setSimulationPlaying={setSimulationPlaying}
            paused={paused}
            speed={speed}
            setSpeed={setSpeed}
          />
        </div>
      </section>

      <aside className={`insight-panel${selectedPart ? ' has-selection' : ''}`} aria-live="polite">
        <div className="panel-topline"><span>{selectedPart ? 'COMPONENT DETAIL' : 'SCIENTIFIC NOTE'}</span><span>{active.code} / 05</span></div>
        <div className="panel-heading-row">
          <span className="panel-mark" aria-hidden="true"><i /></span>
          <h2>{selectedPart?.title ?? (activeChapter === 0 ? 'CARDIAC CONDUCTION' : activeChapter === 2 ? 'MATERIAL SYSTEM' : activeChapter === 3 ? simulationStages[simulationStage - 1].title.toUpperCase() : activeChapter === 4 ? 'ENERGY PATHWAY' : 'SYSTEM COMPARISON')}</h2>
          {selectedPart && <button type="button" className="close-selection" aria-label="Close component detail" onClick={() => setSelectedPart(null)}>×</button>}
        </div>
        <p className="panel-copy">{selectedPart?.description ?? (activeChapter === 3 ? simulationStages[simulationStage - 1].note : active.insight)}</p>
        {activeChapter === 3 && !selectedPart && <p className="panel-caution">Move the upper layer with the control below. Particle flow and the schematic trace respond to the gap.</p>}
        {activeChapter === 4 && !selectedPart && <p className="panel-caution">A proposed energy path, visualized for learning. This is not a tested or clinically validated system.</p>}
        {activeChapter === 1 && !selectedPart && <div className="comparison-caption"><span className={comparisonMode === 'conventional' ? 'active' : ''}>01&nbsp; / &nbsp;BATTERY POWERED</span><span className={comparisonMode === 'experimental' ? 'active' : ''}>02&nbsp; / &nbsp;MOTION HARVESTING</span></div>}
        {activeChapter === 2 && !selectedPart && <div className="layer-key"><span><i className="key-electrode" /> conductive electrode</span><span><i className="key-pvdf" /> PVDF nanofiber film</span><span><i className="key-polymer" /> flexible polymer</span></div>}
        {mode === 'explore' && <p className="keyboard-hint">Drag to rotate · scroll to zoom · arrow keys to orbit · + / − to zoom</p>}
        <div className="panel-footer"><span className="pulse-indicator" />{caution}</div>
      </aside>

      <div className="bottom-console">
        <div className="scene-counter"><strong>{active.code}</strong><span>/</span><span>05</span></div>
        <div className="progress-track" aria-label={`Chapter ${active.code} of five`}><span style={{ transform: `scaleX(${progress})` }} /></div>
        <div className="scroll-cue"><span className="scroll-cue-icon">↓</span><span>{activeChapter === 4 ? 'END OF EXPERIENCE' : 'SCROLL TO CONTINUE'}</span></div>
        <div className="console-actions">
          <button type="button" className="console-button" onClick={replayChapter} aria-label="Replay this scene"><span className="replay-icon">↻</span><span>Replay scene</span></button>
          <button type="button" className={`console-button${paused ? ' is-paused' : ''}`} onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume animations' : 'Pause animations'}><span className={paused ? 'icon-play' : 'icon-pause'} /><span>{paused ? 'Resume' : 'Pause'}</span></button>
          <button type="button" className="console-button" onClick={() => { setSelectedPart(null); setResetKey((key) => key + 1); }} aria-label="Reset camera to chapter view"><span className="reset-camera-icon">⌖</span><span>Reset view</span></button>
        </div>
      </div>

      <div className="scientific-disclaimer">{caution}</div>
      <div className="story-scroll" aria-hidden="true">
        {chapters.map((chapter) => <div id={`chapter-${chapter.id}`} className="story-section" key={chapter.id} />)}
      </div>
    </main>
  );
}
