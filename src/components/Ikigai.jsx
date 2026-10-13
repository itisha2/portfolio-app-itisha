import React, { useEffect, useState } from 'react';
import { Lock, Cloud, Sparkles, Pause, Play } from 'lucide-react';

const CX = 300;
const CY = 300;
const R = 158;
const OFFSET = 100;

const CIRCLES = [
  { id: 'kg', x: CX, y: CY - OFFSET, color: '#38bdf8', ink: '#0369a1', label: ['Knowledge Graphs &', 'Information Extraction'], ikigai: 'What I love', lx: CX, ly: CY - OFFSET - 88 },
  { id: 'llm', x: CX + OFFSET, y: CY, color: '#818cf8', ink: '#4338ca', label: ['Large Language', 'Models'], ikigai: "What I'm great at", lx: CX + OFFSET + 84, ly: CY },
  { id: 'agents', x: CX, y: CY + OFFSET, color: '#34d399', ink: '#047857', label: ['Agent Orchestration', '(LangGraph)'], ikigai: 'What the world needs', lx: CX, ly: CY + OFFSET + 84 },
  { id: 'sdlc', x: CX - OFFSET, y: CY, color: '#fbbf24', ink: '#b45309', label: ['Agentic', 'SDLC'], ikigai: 'What I ship for clients', lx: CX - OFFSET - 84, ly: CY }
];

const OVERLAPS = [
  { id: 'kg-llm', x: CX + 76, y: CY - 76, label: ['LLM-built', 'KGs'] },
  { id: 'llm-agents', x: CX + 76, y: CY + 76, label: ['Agentic', 'workflows'] },
  { id: 'agents-sdlc', x: CX - 76, y: CY + 76, label: ['Agents', 'that ship'] },
  { id: 'sdlc-kg', x: CX - 76, y: CY - 76, label: ['Production', 'pipelines'] }
];

const DETAILS = {
  kg: {
    title: 'Knowledge Graphs & Information Extraction',
    tag: 'What I love',
    color: '#38bdf8',
    text: 'Turning unstructured, knowledge-intensive documents into structured, queryable knowledge: the thread through ten years of my work.',
    points: ['OWL ontologies (contributor to the open-source SDS Ontology)', 'Entity linking to Wikidata, NER, coreference', 'Neo4j, FalkorDB, Apache Jena · Cypher, SPARQL', 'Document AI: PaddleOCR, Docling, MinerU']
  },
  llm: {
    title: 'Large Language Models',
    tag: "What I'm great at",
    color: '#818cf8',
    text: 'Making LLMs precise enough for structured output: grounding, constraining and fine-tuning them rather than just prompting.',
    points: ['Ontology-guided prompting, early vs. late grounding', 'Constrained decoding & structured generation', 'LoRA / PEFT fine-tuning on GPUs and HPC (Slurm)', 'Vision-language models for document understanding']
  },
  agents: {
    title: 'Agent Orchestration with LangGraph',
    tag: 'What the world needs',
    color: '#34d399',
    text: 'Organisations need autonomous workflows they can trust. I build stateful agents that plan, call tools and stop for human approval.',
    points: ['LangGraph & LangChain state machines', 'MCP tools connected to existing back-end services', 'Agent memory and tool-calling architectures', 'Human-in-the-loop approval steps']
  },
  sdlc: {
    title: 'Agentic SDLC',
    tag: 'What I ship for clients',
    color: '#fbbf24',
    text: 'Using AI agents across the software lifecycle so AI products reach production faster, with engineering discipline intact.',
    points: ['Coding agents & spec-driven development', 'Agent-assisted code review and test generation', 'CI/CD, Docker, pytest, REST APIs (Litestar, FastAPI)', 'Coding standards and code reviews as one of the group\'s architects']
  },
  'kg-llm': {
    title: 'LLM-built knowledge graphs',
    tag: 'Knowledge Graphs × LLMs',
    color: '#60a5fa',
    text: 'LLMs extract the facts and the ontology keeps them accurate: every triple is grounded to a class and validated before it enters the graph.',
    points: ['Ontology-guided LLM-based KG construction (accepted at ISWC 2026)', 'GraphRAG over enterprise knowledge', 'Hallucination rate as a first-class metric']
  },
  'llm-agents': {
    title: 'Agentic workflows',
    tag: 'LLMs × Agent orchestration',
    color: '#4ade80',
    text: 'LLMs become reliable workers when wrapped in an explicit graph of steps, tools and checks instead of one giant prompt.',
    points: ['Autonomous document workflows in manufacturing & materials science', 'Tool-calling over MCP', 'Supervised 4 master’s theses on agentic AI']
  },
  'agents-sdlc': {
    title: 'Agents that ship',
    tag: 'Agent orchestration × Agentic SDLC',
    color: '#a3e635',
    text: 'The same agent patterns I put in products also run my engineering loop: agents that write, test and review code under human control.',
    points: ['Agent-driven code review & test generation', 'Agents wired into CI/CD pipelines', 'Reusable agent components across projects']
  },
  'sdlc-kg': {
    title: 'Production-grade knowledge pipelines',
    tag: 'Agentic SDLC × Knowledge graphs',
    color: '#fcd34d',
    text: 'Extraction pipelines treated as software products: versioned, tested, benchmarked and deployable, not research notebooks.',
    points: ['Benchmark datasets, LLM-as-judge, precision / recall / F1', 'Dockerised REST APIs on Linux servers', 'Reusable prompts, templates and pipeline components']
  },
  center: {
    title: 'My Ikigai',
    tag: 'Where it all meets',
    color: '#e879f9',
    text: 'Building trustworthy AI for natural language understanding: agentic, knowledge-intensive systems that keep confidential data on-premises and use public models where the data allows.',
    points: ['Agents (LangGraph) orchestrate LLMs to extract knowledge', 'Ontologies ground and validate everything they produce', 'Agentic SDLC takes it to production quickly and safely', 'Self-hosted models for private data, public models via Ollama for the rest']
  },
  privacy: {
    title: 'Private data stays inside',
    tag: 'The on-premises boundary',
    color: '#f472b6',
    text: 'Aerospace, manufacturing and healthcare data cannot go to public LLM services. For that data, the whole stack runs inside the organisation’s boundary.',
    points: ['Self-hosted, quantized open-weights LLMs (Ollama, llama.cpp, SGLang, TGI)', 'On-premises GPU servers and HPC clusters', 'Guardrails, observability, security and data governance', 'Regulated environments: DLR, UnitedHealth Group (Optum)']
  },
  public: {
    title: 'Public models via Ollama',
    tag: 'Outside the boundary, when data allows',
    color: '#38bdf8',
    text: 'Not every task touches confidential data. For non-sensitive work I connect to larger public models through Ollama, behind the same interface as the local ones.',
    points: ['One Ollama interface for local and public models', 'Agents can switch models without code changes', 'Only non-sensitive data crosses the boundary', 'Bigger models where they add value, local models where privacy matters']
  }
};


const TOUR = ['center', 'kg', 'llm', 'agents', 'sdlc', 'kg-llm', 'llm-agents', 'agents-sdlc', 'sdlc-kg', 'privacy', 'public'];

const useNarrow = () => {
  const query = '(max-width: 640px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
};

const Ikigai = () => {
  const narrow = useNarrow();
  const [active, setActive] = useState('center');
  const [hover, setHover] = useState(null);
  const [touring, setTouring] = useState(() => typeof window !== 'undefined' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

  // Gentle guided tour; any click hands control to the visitor.
  useEffect(() => {
    if (!touring || hover) return;
    const id = setInterval(() => setActive((a) => TOUR[(TOUR.indexOf(a) + 1) % TOUR.length]), 3500);
    return () => clearInterval(id);
  }, [touring, hover]);

  const pick = (id) => { setActive(id); setTouring(false); };
  const hoverProps = (id) => ({ onMouseEnter: () => setHover(id), onMouseLeave: () => setHover(null) });

  const shown = hover || active;
  const involved = (circleId) => shown === circleId || ['center', 'privacy', 'public'].includes(shown) || shown.split('-').includes(circleId);
  const detail = DETAILS[shown];

  return (
    <div className="grid lg:grid-cols-[1.85fr_1fr] gap-6 lg:gap-6 items-center">
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[18%] top-[12%] w-[46%] h-[46%] rounded-full bg-sky-300/25 blur-3xl" />
          <div className="absolute right-[20%] top-[30%] w-[42%] h-[42%] rounded-full bg-indigo-300/25 blur-3xl" />
          <div className="absolute left-[30%] bottom-[8%] w-[40%] h-[40%] rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute left-[5%] top-[35%] w-[30%] h-[30%] rounded-full bg-amber-200/30 blur-3xl" />
        </div>
        <svg
          viewBox={narrow ? '0 0 600 720' : '0 0 800 600'}
          className="w-full h-auto select-none mx-auto"
          style={{ maxHeight: 'calc(100vh - 90px)' }}
          role="img"
          aria-label="Ikigai diagram: knowledge graphs, LLMs, agent orchestration and agentic SDLC meeting inside an on-premises boundary for private data, connected to public models via Ollama"
        >
          <defs>
            <radialGradient id="ikigai-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
            </radialGradient>
          </defs>

          {/* Private-data boundary */}
          <g onClick={() => pick('privacy')} {...hoverProps('privacy')} className="cursor-pointer">
            <rect x="14" y="14" width="572" height="572" rx="48" fill={shown === 'privacy' ? 'rgba(244,114,182,0.07)' : 'transparent'} stroke="#ec4899" strokeOpacity={shown === 'privacy' ? 0.85 : 0.35} strokeWidth={shown === 'privacy' ? 2.5 : 1.5} strokeDasharray="10 8" />
            <rect x="180" y="0" width="240" height="30" rx="15" fill="#fff" stroke="#ec4899" strokeOpacity="0.4" />
            <text x="300" y="20" textAnchor="middle" fontSize="16" fontWeight="700" fill="#be185d">🔒 Private data · on-premises</text>
          </g>

          {/* Public models via Ollama */}
          {(() => {
            const box = narrow ? { x: 190, y: 622, w: 220, h: 88 } : { x: 636, y: 236, w: 156, h: 128 };
            const link = narrow ? 'M300,588 L300,620' : 'M588,300 L634,300';
            const on = shown === 'public';
            return (
              <g onClick={() => pick('public')} {...hoverProps('public')} className="cursor-pointer">
                <path d={link} stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5 4" fill="none" />
                {[0, 1].map((i) => (
                  <circle key={i} r="3.5" fill="#0ea5e9">
                    <animateMotion dur="2.6s" begin={`${i * 1.3}s`} repeatCount="indefinite" path={link} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear" />
                  </circle>
                ))}
                <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="16" fill={on ? '#e0f2fe' : '#fff'} stroke="#0ea5e9" strokeOpacity={on ? 1 : 0.5} strokeWidth={on ? 2 : 1.2} />
                <text x={box.x + box.w / 2} y={box.y + (narrow ? 30 : 40)} textAnchor="middle" fontSize="16" fontWeight="700" fill="#0c4a6e">{"☁\u00a0\u00a0Public models"}</text>
                <text x={box.x + box.w / 2} y={box.y + (narrow ? 52 : 66)} textAnchor="middle" fontSize="14" fontWeight="600" fill="#0369a1">via Ollama</text>
                <text x={box.x + box.w / 2} y={box.y + (narrow ? 74 : 98)} textAnchor="middle" fontSize="12" fill="#64748b" fontStyle="italic">non-sensitive data</text>
              </g>
            );
          })()}

          {/* Data staying inside the boundary */}
          {[0, 1, 2].map((i) => (
            <circle key={`d${i}`} r="3.5" fill="#ec4899" opacity="0.6">
              <animateMotion dur="10s" begin={`${i * 3.3}s`} repeatCount="indefinite" path="M300,40 H520 Q560,40 560,80 V520 Q560,560 520,560 H80 Q40,560 40,520 V80 Q40,40 80,40 Z" />
            </circle>
          ))}

          {/* Four circles */}
          {CIRCLES.map((c) => (
            <circle
              key={c.id}
              cx={c.x}
              cy={c.y}
              r={R}
              fill={c.color}
              fillOpacity={involved(c.id) ? 0.16 : 0.05}
              stroke={c.color}
              strokeOpacity={involved(c.id) ? 0.9 : 0.35}
              strokeWidth={shown === c.id ? 2.5 : 1.5}
              className="cursor-pointer transition-all duration-300"
              style={{ mixBlendMode: 'multiply', filter: shown === c.id ? `drop-shadow(0 0 14px ${c.color})` : 'none' }}
              onClick={() => pick(c.id)}
              {...hoverProps(c.id)}
            />
          ))}

          {CIRCLES.map((c) => (
            <g key={`l-${c.id}`} onClick={() => pick(c.id)} {...hoverProps(c.id)} className="cursor-pointer" opacity={involved(c.id) ? 1 : 0.55}>
              {c.label.map((line, i) => (
                <text key={line} x={c.lx} y={c.ly + (i - (c.label.length - 1) / 2) * 22} textAnchor="middle" fontSize="19.5" fontWeight="800" fill="#0f172a">{line}</text>
              ))}
              <text x={c.lx} y={c.ly + c.label.length * 12 + 12} textAnchor="middle" fontSize="15.5" fill={c.ink} fontStyle="italic" fontWeight="700">{c.ikigai}</text>
            </g>
          ))}

          {OVERLAPS.map((o) => (
            <g key={o.id} onClick={() => pick(o.id)} {...hoverProps(o.id)} className="cursor-pointer">
              <circle cx={o.x} cy={o.y} r="38" fill={shown === o.id ? 'rgba(15,23,42,0.06)' : 'transparent'} stroke={shown === o.id ? '#475569' : 'transparent'} strokeDasharray="3 3" />
              {o.label.map((line, i) => (
                <text key={line} x={o.x} y={o.y + (i - 0.5) * 18 + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1e293b">{line}</text>
              ))}
            </g>
          ))}

          <g onClick={() => pick('center')} {...hoverProps('center')} className="cursor-pointer">
            <circle cx={CX} cy={CY} r={shown === 'center' ? 50 : 44} fill="url(#ikigai-core)" className="transition-all duration-300">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
            <text x={CX} y={CY - 1} textAnchor="middle" fontSize="18" fontWeight="800" fill="#1e1b4b">IKIGAI</text>
            <text x={CX} y={CY + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill="#3b0764">trustworthy AI</text>
          </g>
        </svg>
        <p className="text-center text-sm text-slate-500 mt-1">Hover or tap any part of the diagram</p>
      </div>

      <div className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-md shadow-[0_8px_40px_-12px_rgba(79,70,229,0.25)] p-6 md:p-7 h-[40rem] sm:h-[33rem] lg:h-[39rem] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: detail.color === '#fbbf24' ? '#b45309' : detail.color }}>{detail.tag}</p>
          <button onClick={() => setTouring((t) => !t)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-700" aria-label={touring ? 'Pause the tour' : 'Play the tour'}>
            {touring ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />} {touring ? 'Pause tour' : 'Play tour'}
          </button>
        </div>
        <div key={shown} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-11 h-11 flex-shrink-0 rounded-2xl flex items-center justify-center text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${detail.color}, #6366f1)` }}>
              {shown === 'privacy' ? <Lock className="w-5 h-5" /> : shown === 'public' ? <Cloud className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </span>
            <h3 className="text-2xl md:text-[1.7rem] font-bold leading-tight text-slate-900">{detail.title}</h3>
          </div>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-4">{detail.text}</p>
          <ul className="space-y-2">
            {detail.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-[15px] md:text-base text-slate-700">
                <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: detail.color }} />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ikigai;
