import React, { useEffect, useState } from 'react';
import { Lock, Cloud, Sparkles, Pause, Play } from 'lucide-react';

const CX = 300;
const CY = 300;
const R = 158;
const OFFSET = 100;

const CIRCLES = [
  { id: 'kg', x: CX, y: CY - OFFSET, color: '#38bdf8', label: ['Knowledge Graphs &', 'Information Extraction'], ikigai: 'What I love', lx: CX, ly: CY - OFFSET - 88 },
  { id: 'llm', x: CX + OFFSET, y: CY, color: '#818cf8', label: ['Large Language', 'Models'], ikigai: "What I'm great at", lx: CX + OFFSET + 84, ly: CY },
  { id: 'agents', x: CX, y: CY + OFFSET, color: '#34d399', label: ['Agent Orchestration', '(LangGraph)'], ikigai: 'What the world needs', lx: CX, ly: CY + OFFSET + 84 },
  { id: 'sdlc', x: CX - OFFSET, y: CY, color: '#fbbf24', label: ['Agentic', 'SDLC'], ikigai: 'What I ship for clients', lx: CX - OFFSET - 84, ly: CY }
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

const TOUR = ['kg', 'llm', 'agents', 'sdlc', 'kg-llm', 'llm-agents', 'agents-sdlc', 'sdlc-kg', 'privacy', 'public', 'center'];

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
  const [touring, setTouring] = useState(() => typeof window !== 'undefined' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (!touring) return;
    const id = setInterval(() => setActive((a) => TOUR[(TOUR.indexOf(a) + 1) % TOUR.length]), 3200);
    return () => clearInterval(id);
  }, [touring]);

  const pick = (id) => {
    setActive(id);
    setTouring(false);
  };

  const involved = (circleId) => active === circleId || ['center', 'privacy', 'public'].includes(active) || active.split('-').includes(circleId);
  const detail = DETAILS[active];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden">
      <div>
        <div className="relative px-2 pt-4 pb-2 sm:p-6 max-w-4xl mx-auto">
          <svg viewBox={narrow ? '0 0 600 720' : '0 0 800 600'} className="w-full h-auto select-none" role="img" aria-label="Ikigai diagram: knowledge graphs, LLMs, agent orchestration and agentic SDLC meeting inside an on-premises boundary for private data, connected to public models via Ollama">
            <defs>
              <radialGradient id="ikigai-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.15" />
              </radialGradient>
            </defs>

            {/* Privacy boundary */}
            <g onClick={() => pick('privacy')} className="cursor-pointer">
              <rect x="14" y="14" width="572" height="572" rx="48" fill={active === 'privacy' ? 'rgba(244,114,182,0.06)' : 'transparent'} stroke="#f472b6" strokeOpacity={active === 'privacy' ? 0.9 : 0.45} strokeWidth={active === 'privacy' ? 3 : 2} strokeDasharray="10 8" className="transition-all duration-500" />
              <rect x="180" y="0" width="240" height="30" rx="15" fill="#0f172a" stroke="#f472b6" strokeOpacity="0.6" />
              <text x="300" y="20" textAnchor="middle" fontSize="15" fontWeight="600" fill="#f9a8d4">🔒 Private data · on-premises</text>
            </g>

            {/* Public models via Ollama, outside the boundary */}
            {(() => {
              const box = narrow ? { x: 190, y: 622, w: 220, h: 88 } : { x: 636, y: 236, w: 156, h: 128 };
              const link = narrow ? 'M300,588 L300,620' : 'M588,300 L634,300';
              const on = active === 'public';
              return (
                <g onClick={() => pick('public')} className="cursor-pointer" opacity={on || active === 'center' ? 1 : 0.75}>
                  <path d={link} stroke="#38bdf8" strokeWidth={on ? 3 : 2} strokeDasharray="5 4" fill="none" />
                  {[0, 1].map((i) => (
                    <circle key={i} r="3.5" fill="#38bdf8">
                      <animateMotion dur="2.4s" begin={`${i * 1.2}s`} repeatCount="indefinite" path={link} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear" />
                    </circle>
                  ))}
                  <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="16" fill={on ? 'rgba(56,189,248,0.14)' : '#0f172a'} stroke="#38bdf8" strokeOpacity={on ? 1 : 0.6} strokeWidth={on ? 2.5 : 1.5} className="transition-all duration-500" />
                  <text x={box.x + box.w / 2} y={box.y + (narrow ? 30 : 40)} textAnchor="middle" fontSize="16" fontWeight="700" fill="#e0f2fe">{"☁\u00a0\u00a0Public models"}</text>
                  <text x={box.x + box.w / 2} y={box.y + (narrow ? 52 : 66)} textAnchor="middle" fontSize="14" fontWeight="600" fill="#7dd3fc">via Ollama</text>
                  <text x={box.x + box.w / 2} y={box.y + (narrow ? 74 : 98)} textAnchor="middle" fontSize="12" fill="#94a3b8" fontStyle="italic">non-sensitive data</text>
                </g>
              );
            })()}

            {/* Data staying inside the boundary */}
            {[0, 1, 2].map((i) => (
              <circle key={i} r="4" fill="#f472b6" opacity="0.8">
                <animateMotion dur="9s" begin={`${i * 3}s`} repeatCount="indefinite" path="M300,40 H520 Q560,40 560,80 V520 Q560,560 520,560 H80 Q40,560 40,520 V80 Q40,40 80,40 Z" />
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
                fillOpacity={involved(c.id) ? 0.2 : 0.06}
                stroke={c.color}
                strokeOpacity={involved(c.id) ? 0.95 : 0.35}
                strokeWidth={active === c.id ? 3 : 1.5}
                className="cursor-pointer transition-all duration-500"
                style={{ mixBlendMode: 'screen' }}
                onClick={() => pick(c.id)}
              />
            ))}

            {/* Circle labels */}
            {CIRCLES.map((c) => (
              <g key={`l-${c.id}`} onClick={() => pick(c.id)} className="cursor-pointer" opacity={involved(c.id) ? 1 : 0.5}>
                {c.label.map((line, i) => (
                  <text key={line} x={c.lx} y={c.ly + (i - (c.label.length - 1) / 2) * 20} textAnchor="middle" fontSize="17" fontWeight="700" fill="#f8fafc">{line}</text>
                ))}
                <text x={c.lx} y={c.ly + c.label.length * 11 + 10} textAnchor="middle" fontSize="13.5" fill={c.color} fontStyle="italic" fontWeight="600">{c.ikigai}</text>
              </g>
            ))}

            {/* Pairwise overlaps */}
            {OVERLAPS.map((o) => (
              <g key={o.id} onClick={() => pick(o.id)} className="cursor-pointer">
                <circle cx={o.x} cy={o.y} r="38" fill={active === o.id ? 'rgba(255,255,255,0.12)' : 'transparent'} stroke={active === o.id ? '#fff' : 'transparent'} strokeDasharray="3 3" className="transition-all duration-300" />
                {o.label.map((line, i) => (
                  <text key={line} x={o.x} y={o.y + (i - 0.5) * 16 + 5} textAnchor="middle" fontSize="13.5" fontWeight="600" fill="#e2e8f0">{line}</text>
                ))}
              </g>
            ))}

            {/* Core */}
            <g onClick={() => pick('center')} className="cursor-pointer">
              <circle cx={CX} cy={CY} r={active === 'center' ? 50 : 44} fill="url(#ikigai-core)" className="transition-all duration-500">
                <animate attributeName="opacity" values="0.75;1;0.75" dur="3s" repeatCount="indefinite" />
              </circle>
              <text x={CX} y={CY - 1} textAnchor="middle" fontSize="16" fontWeight="800" fill="#1e1b4b">IKIGAI</text>
              <text x={CX} y={CY + 15} textAnchor="middle" fontSize="11" fontWeight="600" fill="#3b0764">trustworthy AI</text>
            </g>
          </svg>
          <p className="text-center text-xs text-slate-500 -mt-2">Click a circle, an overlap, the centre, the private boundary or the public models</p>
        </div>

        <div className="border-t border-slate-800 p-6 md:p-8 flex flex-col max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: detail.color }}>{detail.tag}</span>
            <button onClick={() => setTouring((t) => !t)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800" aria-label={touring ? 'Pause tour' : 'Play tour'}>
              {touring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />} {touring ? 'Pause tour' : 'Play tour'}
            </button>
          </div>
          <div key={active} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              {active === 'center' && <Sparkles className="w-6 h-6 text-fuchsia-300" />}
              {active === 'privacy' && <Lock className="w-6 h-6 text-pink-300" />}
              {active === 'public' && <Cloud className="w-6 h-6 text-sky-300" />}
              {detail.title}
            </h3>
            <p className="text-slate-300 leading-relaxed mb-5">{detail.text}</p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {detail.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-slate-200">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: detail.color }} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto pt-6 flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-4 h-4 flex-shrink-0" /> Private data stays on self-hosted, open-weights models; public models are reached via Ollama when the data allows.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ikigai;
