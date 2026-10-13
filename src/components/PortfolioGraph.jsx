import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Network, Code, Search, ZoomIn, ZoomOut, Maximize, ArrowRight, Copy, Check, X, Send, MessageCircle, ChevronDown, Lock } from 'lucide-react';
import { BASE, CLASSES, PROPERTIES, NODES, EDGES, QUERIES } from '../data/portfolioGraph';
import { askTwin, SUGGESTIONS, formatTriple } from '../data/twin';

const W = 1100;
const H = 720;
const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));
const DEGREE = {};
EDGES.forEach((e) => { DEGREE[e.s] = (DEGREE[e.s] || 0) + 1; DEGREE[e.o] = (DEGREE[e.o] || 0) + 1; });
const radius = (n) => (n.id === 'me' ? 24 : 7 + Math.sqrt(DEGREE[n.id] || 1) * 2.2);

// Radial "story" layout: you in the centre, each kind of thing in its own labelled sector.
const R1 = 165;
const R2 = 290;
const STRETCH = 1.35;
const SECTOR_PLAN = [
  { types: ['ResearchInstitute', 'Company'], ring: R1, from: -64, to: 14 },
  { types: ['Domain'], ring: R2, from: -56, to: 12 },
  { types: ['University'], ring: R1, from: 28, to: 94 },
  { types: ['Thesis'], ring: R2, from: 16, to: 52 },
  { types: ['Credential'], ring: R2, from: 68, to: 102 },
  { types: ['Publication'], ring: R1, from: 114, to: 154 },
  { types: ['Venue'], ring: R2, from: 108, to: 146 },
  { types: ['Project'], ring: R2, from: 156, to: 174 },
  { types: ['SkillArea'], ring: R1, from: 178, to: 256 },
  { types: ['Technique'], ring: R2, from: 182, to: 240 }
];
const SECTOR_LABELS = [
  { text: 'Career → industries', angle: -28, r: R2 + 78 },
  { text: 'Education, theses & certificates', angle: 52, r: R2 + 78 },
  { text: 'Research & venues', angle: 128, r: R2 + 95 },
  { text: 'Projects', angle: 168, r: R2 + 80 },
  { text: 'Skills → techniques', angle: 212, r: R2 + 108 }
];
const polar = (angle, r) => ({ x: W / 2 + Math.cos((angle * Math.PI) / 180) * r * STRETCH, y: H / 2 + Math.sin((angle * Math.PI) / 180) * r });
// Labels point away from the centre so neighbours don't collide.
const labelFor = (p, r, flip = false) => {
  const dx = p.x - W / 2;
  const dy = p.y - H / 2;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  if (len < 1) return { x: p.x, y: p.y + r + 16, anchor: 'middle' };
  if (ux > 0.35) return { x: p.x + r + 6, y: p.y + 4, anchor: 'start' };
  if (ux < -0.35) return { x: p.x - r - 6, y: p.y + 4, anchor: 'end' };
  const below = flip ? dy <= 0 : dy > 0;
  return { x: p.x, y: below ? p.y + r + 15 : p.y - r - 7, anchor: 'middle' };
};

const computeLayout = () => {
  const pos = { me: { x: W / 2, y: H / 2 } };
  SECTOR_PLAN.forEach(({ types, ring, from, to }) => {
    const nodes = NODES.filter((n) => types.includes(n.type));
    nodes.forEach((n, i) => {
      const angle = nodes.length === 1 ? (from + to) / 2 : from + ((to - from) * i) / (nodes.length - 1);
      pos[n.id] = polar(angle, ring);
    });
  });
  return pos;
};

// Edges inside the story structure are always drawn; cross-links appear when relevant.
const STRUCTURAL = new Set(['worksFor', 'workedAt', 'workedWith', 'alumniOf', 'collaboratesWith', 'hasExpertise', 'authored', 'created', 'contributedTo', 'holds', 'partOf', 'publishedIn', 'supervised', 'atUniversity']);

const toTurtle = () => {
  const iri = (id) => `kg:${id}`;
  const esc = (v) => String(v).replace(/"/g, '\\"');
  const lines = [
    `@prefix kg:     <${BASE}> .`,
    '@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix owl:    <http://www.w3.org/2002/07/owl#> .',
    '@prefix schema: <https://schema.org/> .',
    '',
    '# ---------- Ontology ----------'
  ];
  Object.entries(CLASSES).forEach(([id, c]) => lines.push(`kg:${id} a owl:Class ; rdfs:label "${c.label}"@en ; rdfs:subClassOf ${c.schema} .`));
  lines.push('');
  Object.entries(PROPERTIES).forEach(([id, p]) => {
    const dom = [].concat(p.domain).map((d) => `kg:${d}`).join(', ');
    const rng = [].concat(p.range).map((r) => `kg:${r}`).join(', ');
    lines.push(`kg:${id} a owl:ObjectProperty ; rdfs:label "${p.label}"@en ; rdfs:domain ${dom} ; rdfs:range ${rng}${p.schema ? ` ; rdfs:subPropertyOf ${p.schema}` : ''} .`);
  });
  lines.push('', '# ---------- Facts ----------');
  NODES.forEach((n) => {
    const out = EDGES.filter((e) => e.s === n.id);
    const parts = [`a kg:${n.type}`, `rdfs:label "${esc(n.label)}"@en`];
    Object.entries(n.props || {}).forEach(([k, v]) => parts.push(`kg:${k} "${esc(v)}"`));
    const byP = {};
    out.forEach((e) => { (byP[e.p] ||= []).push(iri(e.o)); });
    Object.entries(byP).forEach(([p, os]) => parts.push(`kg:${p} ${os.join(', ')}`));
    lines.push(`${iri(n.id)} ${parts.join(' ;\n    ')} .`, '');
  });
  return lines.join('\n');
};

// Where each twin answer can send the reader for the full story.
const SECTION_LABELS = {
  about: 'Introduction', ikigai: 'My Ikigai', beliefs: 'What I believe', domains: 'Industries & companies', 'how-i-work': 'What I do',
  focus: 'Core focus', skills: 'Core skills', graph: 'Digital twin', ontology: 'Ontology explorer', experience: 'Experience & education',
  leadership: 'Leadership & mentoring', projects: 'Projects', impact: 'What I bring', recommendations: 'Recommendations',
  certifications: 'Certifications', publications: 'Publications', conferences: 'Conferences', contact: 'Contact'
};

const PortfolioGraph = () => {
  const initial = useMemo(computeLayout, []);
  const [posState, setPos] = useState(initial);
  const pos = useMemo(() => ({ ...initial, ...posState }), [initial, posState]);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [hidden, setHidden] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState(null);
  const [query, setQuery] = useState(null);
  const [tab, setTab] = useState('graph');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'twin', text: "Hi, thank you for stopping by. I'm Itisha's digital twin. I can only speak from what is in my knowledge graph, so if I don't know something, I'll simply say so. What would you like to know?", nodes: null, evidence: [] }
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [twinHits, setTwinHits] = useState(null);
  const [openEvidence, setOpenEvidence] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const ask = (question) => {
    const q = question.trim();
    if (!q || thinking) return;
    setDraft('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setThinking(true);
    setQuery(null);
    setSelected(null);
    setTimeout(() => {
      const a = askTwin(q);
      setMessages((m) => [...m, { role: 'twin', ...a }]);
      setTwinHits(a.nodes && a.nodes.length > 1 ? new Set(a.nodes) : null);
      setThinking(false);
    }, 450);
  };
  const svgRef = useRef(null);
  const drag = useRef(null);
  const turtle = useMemo(toTurtle, []);

  const visible = (id) => !hidden.has(BY_ID[id].type);
  const presetHits = useMemo(() => (query !== null ? new Set(QUERIES[query].run(EDGES)) : null), [query]);
  const queryHits = presetHits || (selected || hover ? null : twinHits);
  const focusId = hover || selected;
  const neighbours = useMemo(() => {
    if (!focusId) return null;
    const set = new Set([focusId]);
    EDGES.forEach((e) => { if (e.s === focusId) set.add(e.o); if (e.o === focusId) set.add(e.s); });
    return set;
  }, [focusId]);
  const lit = (id) => (queryHits ? queryHits.has(id) : neighbours ? neighbours.has(id) : true);
  const edgeOn = (e) => (queryHits ? queryHits.has(e.s) && queryHits.has(e.o) : focusId ? e.s === focusId || e.o === focusId : false);

  const svgPoint = (evt) => {
    const rect = svgRef.current.getBoundingClientRect();
    const sx = ((evt.clientX - rect.left) / rect.width) * W;
    const sy = ((evt.clientY - rect.top) / rect.height) * H;
    return { sx, sy, x: (sx - view.x) / view.k, y: (sy - view.y) / view.k };
  };

  const onPointerDown = (evt, id) => {
    const p = svgPoint(evt);
    drag.current = { id, start: p, moved: false, view: { ...view } };
    if (id || evt.pointerType !== 'touch') {
      try { evt.currentTarget.setPointerCapture?.(evt.pointerId); } catch { /* pointer already released */ }
    }
  };
  const onPointerMove = (evt) => {
    const d = drag.current;
    if (!d) return;
    const p = svgPoint(evt);
    if (Math.hypot(p.sx - d.start.sx, p.sy - d.start.sy) > 4) d.moved = true;
    if (!d.moved) return;
    if (d.id) {
      setPos((prev) => ({ ...prev, [d.id]: { x: p.x, y: p.y } }));
    } else {
      setView({ ...d.view, x: d.view.x + (p.sx - d.start.sx), y: d.view.y + (p.sy - d.start.sy) });
    }
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved && d.id) { setSelected(d.id); setQuery(null); setTwinHits(null); }
  };
  const zoom = (factor) => setView((v) => {
    const k = Math.max(0.6, Math.min(2.5, v.k * factor));
    return { k, x: W / 2 - ((W / 2 - v.x) / v.k) * k, y: H / 2 - ((H / 2 - v.y) / v.k) * k };
  });
  const reset = () => { setView({ x: 0, y: 0, k: 1 }); setPos(initial); setSelected(null); setQuery(null); setTwinHits(null); };

  const node = selected ? BY_ID[selected] : null;
  const outgoing = EDGES.filter((e) => e.s === selected);
  const incoming = EDGES.filter((e) => e.o === selected);
  const matches = search.trim() ? NODES.filter((n) => n.label.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 6) : [];

  const copyTurtle = async () => {
    try { await navigator.clipboard.writeText(turtle); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/60 px-3">
        <div className="flex">
          {[['graph', 'Graph & digital twin', Network], ['turtle', 'Turtle (RDF)', Code]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors ${tab === id ? 'border-indigo-400 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <span className="px-2 text-xs text-slate-400">{NODES.length} nodes · {EDGES.length} triples · {Object.keys(CLASSES).length} classes · {Object.keys(PROPERTIES).length} properties</span>
      </div>

      {tab === 'graph' ? (
        <div>
          <div className="relative min-w-0">
            {/* Class filter */}
            <div className="flex flex-wrap gap-1.5 p-3 border-b border-slate-800">
              {Object.entries(CLASSES).map(([id, c]) => {
                const off = hidden.has(id);
                return (
                  <button
                    key={id}
                    onClick={() => setHidden((prev) => { const next = new Set(prev); off ? next.delete(id) : next.add(id); return next; })}
                    aria-pressed={!off}
                    disabled={id === 'Person'}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition-opacity ${off ? 'opacity-40 ring-slate-700' : 'ring-slate-600'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} /> {c.label}
                  </button>
                );
              })}
            </div>

            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto select-none cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'pan-y' }}
              role="img"
              aria-label="Knowledge graph of Itisha Yadav's experience, skills, research and credentials"
              onPointerDown={(e) => onPointerDown(e, null)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
                {SECTOR_LABELS.map((l) => {
                  const p = polar(l.angle, l.r);
                  return <text key={l.text} x={p.x} y={p.y} textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="1.5" fill="#64748b" className="uppercase pointer-events-none">{l.text.toUpperCase()}</text>;
                })}
                {EDGES.filter((e) => visible(e.s) && visible(e.o)).map((e, i) => {
                  const a = pos[e.s];
                  const b = pos[e.o];
                  const on = edgeOn(e);
                  if (!on && !STRUCTURAL.has(e.p)) return null;
                  const cross = !STRUCTURAL.has(e.p);
                  const mx = (a.x + b.x) / 2;
                  const my = (a.y + b.y) / 2;
                  const cx = cross ? mx + (W / 2 - mx) * 0.45 : mx;
                  const cy = cross ? my + (H / 2 - my) * 0.45 : my;
                  return (
                    <g key={i}>
                      <path d={`M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`} fill="none" stroke={on ? '#a5b4fc' : '#1e293b'} strokeWidth={on ? 2 : 1.2} strokeOpacity={on ? 0.95 : 0.9} />
                      {on && (
                        <text x={(a.x + 2 * cx + b.x) / 4} y={(a.y + 2 * cy + b.y) / 4 - 4} textAnchor="middle" fontSize="11" fill="#c7d2fe" fontFamily="ui-monospace, monospace" paintOrder="stroke" stroke="#020617" strokeWidth="3">
                          {PROPERTIES[e.p].label}
                        </text>
                      )}
                    </g>
                  );
                })}
                {NODES.filter((n) => visible(n.id)).map((n, idx) => {
                  const p = pos[n.id];
                  const r = radius(n);
                  const on = lit(n.id);
                  return (
                    <g
                      key={n.id}
                      onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e, n.id); }}
                      onPointerEnter={() => setHover(n.id)}
                      onPointerLeave={() => setHover(null)}
                      className="cursor-pointer"
                      opacity={on ? 1 : 0.25}
                    >
                      {selected === n.id && <circle cx={p.x} cy={p.y} r={r + 6} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />}
                      <circle cx={p.x} cy={p.y} r={r} fill={CLASSES[n.type].color} stroke="#020617" strokeWidth="2" />
                      {n.id === 'me' && <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">IY</text>}
                      <text {...(() => { const l = labelFor(p, r, ['University', 'Credential'].includes(n.type) && idx % 2 === 1); return { x: l.x, y: l.y, textAnchor: l.anchor }; })()} fontSize={n.id === 'me' ? 16 : 13} fontWeight={n.id === 'me' || focusId === n.id ? 700 : 500} fill="#e2e8f0" paintOrder="stroke" stroke="#020617" strokeWidth="3">
                        {n.short || n.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {[[ZoomIn, () => zoom(1.25), 'Zoom in'], [ZoomOut, () => zoom(0.8), 'Zoom out'], [Maximize, reset, 'Reset view']].map(([Icon, fn, label]) => (
                <button key={label} onClick={fn} aria-label={label} className="w-9 h-9 rounded-lg bg-slate-800/90 ring-1 ring-slate-700 flex items-center justify-center text-slate-200 hover:bg-slate-700">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <p className="absolute bottom-4 right-3 hidden sm:block text-[11px] text-slate-500">Drag nodes · drag background to pan · click to inspect</p>
          </div>

          {/* Talk to the twin + inspector */}
          <aside className="border-t border-slate-800 grid lg:grid-cols-[1.25fr_1fr]">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
                <div>
                  <p className="flex items-center gap-2 font-bold"><MessageCircle className="w-5 h-5 text-indigo-300" /> Talk to my digital twin</p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Lock className="w-3 h-3" /> Answers come only from this knowledge graph and run in your browser.</p>
                </div>
              </div>
              <div ref={chatRef} className="h-80 overflow-y-auto px-5 space-y-3" aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-slate-900 text-slate-100 ring-1 ring-slate-800 rounded-bl-md'}`}>
                      {m.role === 'twin' && <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300 mb-1">Itisha's twin</p>}
                      <p>{m.text}</p>
                      {m.role === 'twin' && (m.section || m.evidence?.length > 0 || m.nodes?.length > 1) && (
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          {m.section && SECTION_LABELS[m.section] && (
                            <a href={`#${m.section}`} className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-200 ring-1 ring-indigo-400/40 hover:bg-indigo-500/30 hover:text-white">
                              Read more: {SECTION_LABELS[m.section]} <ArrowRight className="w-3 h-3" />
                            </a>
                          )}
                          {m.nodes?.length > 1 && (
                            <button onClick={() => { setTwinHits(new Set(m.nodes)); setSelected(null); setQuery(null); }} className="text-[11px] font-semibold text-sky-300 hover:text-sky-200">Show in graph</button>
                          )}
                          {m.evidence?.length > 0 && (
                            <button onClick={() => setOpenEvidence(openEvidence === i ? null : i)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white">
                              Evidence ({m.evidence.length}) <ChevronDown className={`w-3 h-3 transition-transform ${openEvidence === i ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                      )}
                      {openEvidence === i && (
                        <pre className="mt-2 rounded-lg bg-slate-950 p-2 text-[11px] font-mono text-emerald-200 whitespace-pre-wrap">{m.evidence.map(formatTriple).join(' .\n')} .</pre>
                      )}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md bg-slate-900 ring-1 ring-slate-800 px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />)}
                  </div></div>
                )}
              </div>
              <div className="px-5 pt-3 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((sug) => (
                  <button key={sug} onClick={() => ask(sug)} className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300 ring-1 ring-slate-700 hover:ring-indigo-500 hover:text-white">{sug}</button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); ask(draft); }} className="p-5 pt-3 flex gap-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask me about my work…" aria-label="Ask Itisha's digital twin a question" className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500" />
                <button type="submit" disabled={!draft.trim() || thinking} className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-40" aria-label="Send question">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="p-5 space-y-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a node in the graph…" className="w-full rounded-lg bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500" />
                {matches.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl">
                    {matches.map((m) => (
                      <li key={m.id}><button onClick={() => { setSelected(m.id); setQuery(null); setTwinHits(null); setSearch(''); }} className="w-full text-left rounded px-2 py-1.5 text-sm hover:bg-slate-800">{m.label} <span className="text-[10px] text-slate-500">{CLASSES[m.type].label}</span></button></li>
                    ))}
                  </ul>
                )}
              </div>

              {!node && (
                <div className="rounded-xl bg-slate-900 ring-1 ring-slate-800 p-4">
                  <p className="font-semibold mb-1">How to read this</p>
                  <p className="text-sm text-slate-300 leading-relaxed">I am in the centre. Around me: my career and the industries it touched, my education and research partners, my research, and the skills behind it all. <span className="text-white">Click any node</span> to see how it connects, or ask my twin a question.</p>
                </div>
              )}
              {node && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: CLASSES[node.type].color }} />
                    <span className="text-xs font-semibold text-slate-300">{CLASSES[node.type].label}</span>
                    <code className="text-[11px] text-sky-300/80">kg:{node.id}</code>
                  </div>
                  <h4 className="text-lg font-bold leading-snug">{node.label}</h4>
                  {node.props && (
                    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
                      {Object.entries(node.props).map(([k, v]) => (
                        <React.Fragment key={k}><dt className="text-slate-500">{k}</dt><dd className="text-slate-200">{v}</dd></React.Fragment>
                      ))}
                    </dl>
                  )}
                  <ul className="mt-3 space-y-1 text-xs max-h-44 overflow-y-auto pr-1">
                    {outgoing.map((e, i) => (
                      <li key={`o${i}`}><span className="text-pink-300">{PROPERTIES[e.p].label}</span> → <button onClick={() => setSelected(e.o)} className="text-sky-300 hover:underline">{BY_ID[e.o].short || BY_ID[e.o].label}</button></li>
                    ))}
                    {incoming.map((e, i) => (
                      <li key={`i${i}`}><button onClick={() => setSelected(e.s)} className="text-sky-300 hover:underline">{BY_ID[e.s].short || BY_ID[e.s].label}</button> → <span className="text-pink-300">{PROPERTIES[e.p].label}</span></li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between">
                    <a href={`#${node.section}`} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-indigo-200">
                      See it on the page <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => setSelected(null)} className="text-xs text-slate-400 hover:text-white">Clear</button>
                  </div>
                </div>
              )}

              <details className="group rounded-xl bg-slate-900 ring-1 ring-slate-800">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-slate-200">
                  For engineers: run a SPARQL query
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 space-y-1.5">
                  {QUERIES.map((qq, i) => (
                    <button key={qq.q} onClick={() => { setQuery(query === i ? null : i); setSelected(null); }} className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${query === i ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-200 ring-1 ring-slate-800 hover:ring-indigo-500/60'}`}>
                      {qq.q}
                    </button>
                  ))}
                  {query !== null && (
                    <div className="mt-2 rounded-lg bg-slate-950 ring-1 ring-slate-800">
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 text-[11px] text-slate-400">
                        SPARQL · {presetHits.size} matching nodes
                        <button onClick={() => setQuery(null)} aria-label="Clear query" className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                      </div>
                      <pre className="p-3 text-[11.5px] leading-relaxed text-emerald-200 font-mono whitespace-pre-wrap">{`PREFIX kg: <${BASE}>\n${QUERIES[query].sparql}`}</pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </aside>
        </div>
      ) : (
        <div className="relative">
          <button onClick={copyTurtle} className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-700 hover:bg-slate-700">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy Turtle'}
          </button>
          <pre className="max-h-[640px] overflow-auto p-5 pt-12 text-[12px] leading-relaxed font-mono text-slate-300">{turtle}</pre>
        </div>
      )}
    </div>
  );
};

export default PortfolioGraph;
