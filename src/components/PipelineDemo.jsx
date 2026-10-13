import React, { useState, useEffect, useRef } from 'react';
import { ScanText, FileText, Sparkles, ShieldCheck, Network, Bot, Check, X, Pause, Play, User, Wrench } from 'lucide-react';

// Illustrative walkthrough of the document -> knowledge graph -> agent pipeline.
const STAGES = [
  { id: 'doc', label: 'Document AI', title: 'Parse the PDF', icon: ScanText, ms: 9500, caption: 'Real Safety Data Sheets are hard PDFs: multi-column text, tables with merged cells, floating hazard boxes and page furniture. Layout analysis with PaddleOCR (PP-StructureV3) recovers regions, reading order and table structure before any NLP runs.' },
  { id: 'nlp', label: 'NLP', title: 'Find entities', icon: FileText, caption: 'Entity recognition finds the substances, hazards and safety measures in an unstructured Safety Data Sheet.' },
  { id: 'llm', label: 'LLMs', title: 'Extract facts', icon: Sparkles, caption: 'An LLM turns sentences into subject–predicate–object triples with structured, constrained generation.' },
  { id: 'ontology', label: 'Ontologies', title: 'Ground & validate', icon: ShieldCheck, caption: 'Every triple is grounded to ontology classes and checked against domain and range constraints; schema violations and facts not supported by the source are rejected.' },
  { id: 'kg', label: 'Knowledge Graphs', title: 'Build the graph', icon: Network, caption: 'Validated facts become a queryable knowledge graph, linked to the source text for traceability.' },
  { id: 'agent', label: 'Agentic AI', title: 'Answer with agents', icon: Bot, caption: 'An agent plans, calls a graph tool over MCP, and returns a grounded answer, with human-in-the-loop approval.' }
];

const STAGE_MS = 6500;

// Mock SDS page regions, in detected reading order (percent coordinates).
const LAYOUT = [
  { type: 'Title', top: 4, left: 8, width: 84, height: 7, color: 'indigo' },
  { type: 'Section header', top: 14, left: 8, width: 52, height: 5, color: 'violet' },
  { type: 'Text', top: 21, left: 8, width: 42, height: 29, color: 'sky' },
  { type: 'Floating text box', top: 21, left: 56, width: 36, height: 18, color: 'amber' },
  { type: 'Table', top: 54, left: 8, width: 84, height: 30, color: 'emerald' },
  { type: 'Page footer (ignored)', top: 89, left: 8, width: 84, height: 5, color: 'slate' }
];

const BOX_COLORS = {
  indigo: 'border-indigo-500 bg-indigo-500/10 text-indigo-700',
  violet: 'border-violet-500 bg-violet-500/10 text-violet-700',
  sky: 'border-sky-500 bg-sky-500/10 text-sky-700',
  amber: 'border-amber-500 bg-amber-500/15 text-amber-700',
  emerald: 'border-emerald-500 bg-emerald-500/10 text-emerald-700',
  slate: 'border-slate-400 border-dashed bg-slate-400/10 text-slate-500'
};

const TABLE_ROWS = [
  ['Flammable liquids', '2', 'H225'],
  ['Eye irritation', '2', 'H319'],
  ['STOT single exposure', '3', 'H336']
];

const DOC_CHALLENGES = ['Multi-column layout', 'Tables with merged cells', 'Floating text boxes', 'Headers & footers', 'Scanned pages (OCR)'];

const ENTITY_STYLES = {
  Substance: 'bg-indigo-500/20 text-indigo-200 ring-indigo-400/50',
  CASNumber: 'bg-slate-500/20 text-slate-200 ring-slate-400/50',
  Hazard: 'bg-rose-500/20 text-rose-200 ring-rose-400/50',
  HazardStatement: 'bg-amber-500/20 text-amber-200 ring-amber-400/50',
  PPE: 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/50',
  Storage: 'bg-sky-500/20 text-sky-200 ring-sky-400/50'
};

const DOCUMENT = [
  ['Acetone', 'Substance'], ' (CAS ', ['67-64-1', 'CASNumber'], ') is a ', ['highly flammable liquid and vapour', 'Hazard'], ' (', ['H225', 'HazardStatement'],
  ') and causes ', ['serious eye irritation', 'Hazard'], ' (', ['H319', 'HazardStatement'], '). Wear ', ['protective gloves', 'PPE'], ' and ',
  ['eye protection', 'PPE'], '. Store in a ', ['well-ventilated place', 'Storage'], '.'
];

const TRIPLES = [
  { s: 'Acetone', p: 'hasHazard', o: 'Flammability', cls: 'sds:PhysicalHazard', ok: true },
  { s: 'Acetone', p: 'hasHazard', o: 'EyeIrritation', cls: 'sds:HealthHazard', ok: true },
  { s: 'Acetone', p: 'requiresPPE', o: 'ProtectiveGloves', cls: 'sds:HandProtection', ok: true },
  { s: 'Acetone', p: 'requiresPPE', o: 'EyeProtection', cls: 'sds:EyeProtection', ok: true },
  { s: 'Acetone', p: 'hasStorageRequirement', o: 'Ventilation', cls: 'sds:StorageRequirement', ok: true },
  { s: 'Acetone', p: 'hasHazardStatement', o: 'H225', reason: 'domain violation: expects sds:GHSClassification', ok: false },
  { s: 'Acetone', p: 'boilingPoint', o: '"120 °C"', reason: 'hallucination: not in source', ok: false }
];

const GRAPH_NODES = [
  { id: 'acetone', label: 'Acetone', cls: 'Substance', x: 260, y: 150, r: 34, color: '#818cf8' },
  { id: 'flam', label: 'Flammable', cls: 'PhysicalHazard', x: 95, y: 70, r: 27, color: '#fb7185' },
  { id: 'eyeirr', label: 'Eye irrit.', cls: 'HealthHazard', x: 425, y: 70, r: 27, color: '#fb7185' },
  { id: 'gloves', label: 'Gloves', cls: 'HandProtection', x: 85, y: 230, r: 26, color: '#34d399' },
  { id: 'eye', label: 'Eye prot.', cls: 'EyeProtection', x: 435, y: 230, r: 26, color: '#34d399' },
  { id: 'vent', label: 'Ventilation', cls: 'StorageRequirement', x: 260, y: 268, r: 26, color: '#38bdf8' }
];

const GRAPH_EDGES = [
  { to: 'flam', label: 'hasHazard' },
  { to: 'eyeirr', label: 'hasHazard' },
  { to: 'gloves', label: 'requiresPPE' },
  { to: 'eye', label: 'requiresPPE' },
  { to: 'vent', label: 'hasStorageRequirement' }
];

const AGENT_STEPS = [
  { kind: 'user', text: 'What protective equipment do I need to handle acetone?' },
  { kind: 'plan', text: 'Plan: find acetone in the knowledge graph and collect its PPE requirements.' },
  { kind: 'tool', text: 'kg.sparql → SELECT ?ppe WHERE { sds:Acetone sds:requiresPPE ?ppe }' },
  { kind: 'result', text: 'Result: sds:ProtectiveGloves, sds:EyeProtection' },
  { kind: 'answer', text: 'Wear protective gloves and eye protection. Source: SDS Section 8, linked to 2 graph nodes.' }
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const PipelineDemo = () => {
  const [stage, setStage] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [hoverNode, setHoverNode] = useState(null);
  const startRef = useRef(Date.now());
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const tabsRef = useRef(null);

  // Keep the active step visible in the tab strip on narrow screens.
  useEffect(() => {
    const strip = tabsRef.current;
    const tab = strip?.children[stage];
    if (!strip || !tab || strip.scrollWidth <= strip.clientWidth) return;
    const offset = tab.getBoundingClientRect().left - strip.getBoundingClientRect().left;
    strip.scrollLeft += offset - 16;
  }, [stage]);

  // Reveal items inside a stage one by one.
  useEffect(() => {
    setStep(0);
    progressRef.current = 0;
    setProgress(0);
    const id = setInterval(() => setStep((s) => s + 1), 700);
    return () => clearInterval(id);
  }, [stage]);

  // Auto-advance through stages.
  useEffect(() => {
    if (!playing) return;
    const duration = STAGES[stage].ms || STAGE_MS;
    startRef.current = Date.now() - progressRef.current * duration;
    const id = setInterval(() => {
      const p = (Date.now() - startRef.current) / duration;
      if (p >= 1) {
        setStage((s) => (s + 1) % STAGES.length);
      } else {
        progressRef.current = p;
        setProgress(p);
      }
    }, 50);
    return () => clearInterval(id);
  }, [playing, stage]);

  const goTo = (index) => {
    setStage(index);
    setPlaying(false);
  };

  const current = STAGES[stage];
  const shown = (i) => step >= i;

  const renderDoc = () => (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="relative mx-auto w-full max-w-sm aspect-[3/4] rounded-md bg-white shadow-xl overflow-hidden text-slate-800">
        {/* Page content */}
        <div className="absolute" style={{ top: '5%', left: '8%', right: '8%' }}>
          <div className="text-[11px] font-bold tracking-wide">SAFETY DATA SHEET · Acetone</div>
          <div className="text-[7px] text-slate-500">according to Regulation (EC) No. 1907/2006</div>
        </div>
        <div className="absolute text-[9px] font-bold" style={{ top: '15%', left: '8%' }}>2. Hazards identification</div>
        <div className="absolute space-y-1" style={{ top: '22%', left: '8%', width: '40%' }}>
          {[100, 92, 97, 85, 95, 70, 90, 96, 60].map((w, i) => <div key={i} className="h-1 rounded bg-slate-300" style={{ width: `${w}%` }} />)}
        </div>
        <div className="absolute flex items-center gap-2 rounded border border-rose-300 bg-rose-50 p-1.5 -rotate-2" style={{ top: '23%', left: '57%', width: '34%' }}>
          <div className="w-7 h-7 rotate-45 border-2 border-rose-600 flex items-center justify-center flex-shrink-0">
            <span className="-rotate-45 text-rose-600 font-black text-xs">!</span>
          </div>
          <div>
            <div className="text-[9px] font-black text-rose-700">DANGER</div>
            <div className="text-[6px] leading-tight text-slate-600">Highly flammable liquid and vapour.</div>
          </div>
        </div>
        <table className="absolute text-[7px] border-collapse" style={{ top: '56%', left: '8%', width: '84%' }}>
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-1 py-0.5 text-left">Hazard class</th>
              <th className="border border-slate-300 px-1 py-0.5" colSpan={2}>Classification</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(([a, b, c]) => (
              <tr key={a}>
                <td className="border border-slate-300 px-1 py-0.5">{a}</td>
                <td className="border border-slate-300 px-1 py-0.5 text-center">Cat. {b}</td>
                <td className="border border-slate-300 px-1 py-0.5 text-center">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="absolute text-[6px] text-slate-400 flex justify-between" style={{ top: '90%', left: '8%', right: '8%' }}>
          <span>Rev. 3.1 · 2025-01-14</span><span>Page 2 / 12</span>
        </div>

        {/* Detected layout regions */}
        {LAYOUT.map((box, i) => (
          <div
            key={box.type}
            className={`absolute rounded border-2 transition-all duration-500 ${BOX_COLORS[box.color]} ${shown(i) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ top: `${box.top}%`, left: `${box.left}%`, width: `${box.width}%`, height: `${box.height}%` }}
          >
            <span className="absolute -top-2.5 left-1 rounded bg-white px-1 text-[8px] font-bold shadow-sm whitespace-nowrap">
              {i < LAYOUT.length - 1 ? `${i + 1} · ` : ''}{box.type}
            </span>
          </div>
        ))}
      </div>

      <div className={`transition-opacity duration-500 ${shown(LAYOUT.length) ? 'opacity-100' : 'opacity-30'}`}>
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Recovered table structure</div>
        <div className="overflow-x-auto rounded-lg border border-slate-800 mb-5">
          <table className="w-full text-[13px] font-mono">
            <thead className="bg-slate-900 text-slate-400">
              <tr>{['hazard_class', 'category', 'h_code'].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={row[0]} className={`border-t border-slate-800 transition-opacity duration-500 ${shown(LAYOUT.length + 1 + i) ? 'opacity-100' : 'opacity-0'}`}>
                  {row.map((cell, j) => <td key={j} className={`px-3 py-1.5 ${j === 2 ? 'text-amber-300' : 'text-slate-200'}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Handled</div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {DOC_CHALLENGES.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/30">
              <Check className="w-3 h-3" /> {c}
            </span>
          ))}
        </div>
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Parsers benchmarked</div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-lg bg-indigo-500 px-3 py-1.5 font-semibold text-white">PaddleOCR · PP-StructureV3 <span className="opacity-80 font-normal">(in production)</span></span>
          <span className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300">MinerU</span>
          <span className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300">Docling</span>
        </div>
      </div>
    </div>
  );

  const renderNlp = () => {
    let entityIndex = 0;
    return (
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">Parsed text · Sections 2 & 8</div>
        <p className="text-lg md:text-xl leading-loose text-slate-300">
          {DOCUMENT.map((part, i) => {
            if (typeof part === 'string') return <span key={i}>{part}</span>;
            const [text, type] = part;
            const visible = shown(entityIndex++);
            return (
              <span
                key={i}
                title={type}
                className={`rounded px-1 ring-1 transition-all duration-500 ${visible ? ENTITY_STYLES[type] : 'ring-transparent text-slate-300'}`}
              >
                {text}
                {visible && <sup className="ml-1 text-[10px] font-semibold opacity-80">{type}</sup>}
              </span>
            );
          })}
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {Object.entries(ENTITY_STYLES).map(([type, style]) => (
            <span key={type} className={`text-xs rounded-full px-2.5 py-1 ring-1 ${style}`}>{type}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderTriples = (validate) => (
    <div className="space-y-2 font-mono text-[13px]">
      {TRIPLES.map((t, i) => (
        <div
          key={i}
          className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-2 transition-all duration-500 ${
            shown(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } ${validate && !t.ok ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800 bg-slate-900/70'}`}
        >
          <span className="text-indigo-300">{t.s}</span>
          <span className="text-pink-300">{t.p}</span>
          <span className={validate && !t.ok ? 'text-rose-300 line-through' : 'text-emerald-300'}>{t.o}</span>
          {validate && (
            <span className={`ml-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-sans font-semibold ${t.ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
              {t.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              {t.ok ? t.cls : t.reason}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const renderGraph = (highlight = []) => (
    <div className="relative">
      <svg viewBox="0 0 520 300" className="w-full h-auto" role="img" aria-label="Knowledge graph of acetone and its hazards and safety measures">
        {GRAPH_EDGES.map((e, i) => {
          const to = GRAPH_NODES.find((n) => n.id === e.to);
          const visible = shown(i);
          const active = highlight.includes(e.to);
          return (
            <g key={e.to} className="transition-opacity duration-700" style={{ opacity: visible ? 1 : 0 }}>
              <line x1="260" y1="150" x2={to.x} y2={to.y} stroke={active ? '#34d399' : '#475569'} strokeWidth={active ? 3 : 1.5} strokeDasharray={active ? '0' : '4 4'} />
              <text x={(260 + to.x) / 2} y={(150 + to.y) / 2 - 6} textAnchor="middle" className="fill-slate-400" fontSize="10" fontFamily="ui-monospace, monospace">
                {e.label}
              </text>
            </g>
          );
        })}
        {GRAPH_NODES.map((n, i) => {
          const visible = n.id === 'acetone' || shown(i - 1);
          const active = highlight.includes(n.id);
          return (
            <g
              key={n.id}
              onMouseEnter={() => setHoverNode(n)}
              onMouseLeave={() => setHoverNode(null)}
              className="cursor-pointer transition-all duration-700"
              style={{ opacity: visible ? 1 : 0, transformOrigin: `${n.x}px ${n.y}px`, transform: visible ? 'scale(1)' : 'scale(0.3)' }}
            >
              {active && <circle cx={n.x} cy={n.y} r={n.r + 8} fill="none" stroke="#34d399" strokeWidth="2" className="animate-pulse" />}
              <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} fillOpacity="0.2" stroke={n.color} strokeWidth="2" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.id === 'acetone' ? 13 : 10} fontWeight="600" className="fill-white">
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="h-6 text-center text-sm text-slate-400">
        {hoverNode ? <span><span className="text-white font-semibold">{hoverNode.label}</span> is an instance of <span className="font-mono text-sky-300">sds:{hoverNode.cls.replace(' ', '')}</span></span> : 'Hover a node to see its ontology class'}
      </div>
    </div>
  );

  const agentStyles = {
    user: { icon: User, className: 'bg-slate-800 text-slate-100 self-end', label: 'User' },
    plan: { icon: Bot, className: 'bg-indigo-500/15 text-indigo-200', label: 'Agent' },
    tool: { icon: Wrench, className: 'bg-slate-900 border border-slate-700 text-amber-200 font-mono text-[12px]', label: 'MCP tool call' },
    result: { icon: Network, className: 'bg-slate-900 border border-slate-700 text-emerald-200 font-mono text-[12px]', label: 'Knowledge graph' },
    answer: { icon: Bot, className: 'bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/40', label: 'Agent' }
  };

  const renderAgent = () => (
    <div className="grid md:grid-cols-5 gap-5 items-start">
      <div className="md:col-span-3 flex flex-col gap-2.5">
        {AGENT_STEPS.map((s, i) => {
          const style = agentStyles[s.kind];
          const Icon = style.icon;
          return (
            <div key={i} className={`max-w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-500 ${style.className} ${shown(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider opacity-70 mb-1 font-sans">
                <Icon className="w-3 h-3" /> {style.label}
              </div>
              {s.text}
            </div>
          );
        })}
        <div className={`self-start inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 transition-opacity duration-500 ${shown(5) ? 'opacity-100' : 'opacity-0'}`}>
          <Check className="w-3.5 h-3.5" /> Approved by human reviewer
        </div>
      </div>
      <div className="md:col-span-2 hidden md:block">{renderGraph(shown(3) ? ['acetone', 'gloves', 'eye'] : [])}</div>
    </div>
  );

  const renderStage = () => {
    switch (current.id) {
      case 'doc': return renderDoc();
      case 'nlp': return renderNlp();
      case 'llm': return renderTriples(false);
      case 'ontology': return renderTriples(true);
      case 'kg': return <div className="max-w-xl mx-auto">{renderGraph()}</div>;
      case 'agent': return renderAgent();
      default: return null;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden">
      {/* Stage selector */}
      <div ref={tabsRef} className="flex overflow-x-auto border-b border-slate-800 bg-slate-900/60">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const active = i === stage;
          return (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`relative flex-1 min-w-[150px] flex items-center gap-2.5 px-4 py-4 text-left transition-colors ${active ? 'bg-slate-950' : 'hover:bg-slate-900'}`}
            >
              <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${active ? 'bg-indigo-500 text-white' : i < stage ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                <Icon className="w-4.5 h-4.5" />
              </span>
              <span>
                <span className={`block text-[11px] font-semibold uppercase tracking-wider ${active ? 'text-indigo-300' : 'text-slate-500'}`}>{i + 1}. {s.label}</span>
                <span className={`block text-sm font-medium ${active ? 'text-white' : 'text-slate-400'}`}>{s.title}</span>
              </span>
              {active && (
                <span className="absolute bottom-0 left-0 h-0.5 bg-indigo-400" style={{ width: playing ? `${progress * 100}%` : '100%' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Stage content */}
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <p className="text-slate-300 max-w-2xl">{current.caption}</p>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            aria-label={playing ? 'Pause walkthrough' : 'Play walkthrough'}
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>
        <div key={current.id} className="min-h-[300px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderStage()}
        </div>
      </div>
    </div>
  );
};

export default PipelineDemo;
