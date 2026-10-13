import React, { useMemo, useState } from 'react';
import { Search, Network, ShieldCheck, Code, Check, X, ChevronRight, ChevronDown, Play, Link2, Ban, Lightbulb, Image } from 'lucide-react';
import ontology from '../data/sdsOntology.json';

// Generated from sds_document_ontology_v2.ttl by scripts/extract_ontology.py.
const CLASSES = Object.fromEntries(ontology.classes.map((c) => [c.id, c]));
const PROPS = Object.fromEntries(ontology.objectProperties.map((p) => [p.id, p]));
const TOP = new Set(['owl:Thing', 'rdfs:Resource']);

const CHILDREN = {};
ontology.classes.forEach((c) => c.parents.forEach((p) => { (CHILDREN[p] ||= []).push(c.id); }));

const ancestors = (id) => {
  const seen = new Set();
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    (CLASSES[cur]?.parents || []).forEach((p) => stack.push(p));
  }
  return seen;
};

const rootOf = (id) => {
  let cur = id;
  while (CLASSES[cur]?.parents.some((p) => CLASSES[p])) cur = CLASSES[cur].parents.find((p) => CLASSES[p]);
  return cur;
};

const MODULES = [
  { name: 'Document & provenance', roots: ['sds:SDSDocument', 'sds:SDSSection', 'sds:ExtractionRecord', 'sds:EvidenceSpan', 'sds:OCRBlock'] },
  { name: 'Products & chemistry', roots: ['sds:Product', 'sds:ChemicalEntity', 'sds:CompositionRecord', 'sds:PhysicalChemicalProperty', 'sds:Organization'] },
  { name: 'Hazards & GHS', roots: ['sds:Hazard', 'sds:GHSClassification', 'sds:HazardClass', 'sds:HazardCategory', 'sds:HazardStatement', 'sds:PrecautionaryStatement', 'sds:Pictogram', 'sds:SignalWord', 'sds:RouteOfExposure', 'sds:ToxicologicalEffect', 'sds:TargetOrganSystem', 'sds:EcologicalEffect'] },
  { name: 'Safety & controls', roots: ['sds:ControlMeasure', 'sds:FirstAidMeasure', 'sds:FireFightingMeasure', 'sds:ExtinguishingMedia', 'sds:HandlingRequirement', 'sds:StorageRequirement', 'sds:ExposureLimit', 'sds:WasteDisposalMeasure', 'sds:EmergencyContact'] },
  { name: 'Regulatory & transport', roots: ['sds:RegulatoryListing', 'sds:InventoryStatus', 'sds:TransportClassification'] }
];

const name = (id) => id.replace(/^[a-z]+:/, '');

// ---------- Validation ----------

const fits = (allowed, cls) => !allowed.length || allowed.some((a) => TOP.has(a) || ancestors(cls).has(a));

const disjointPairs = (types) => {
  const clashes = [];
  types.forEach((a, i) => types.slice(i + 1).forEach((b) => {
    const clash = [...ancestors(a)].some((x) => (CLASSES[x]?.disjointWith || []).some((d) => ancestors(b).has(d)));
    if (clash) clashes.push([a, b]);
  }));
  return clashes;
};

const suggestProperties = (sCls, oCls) =>
  ontology.objectProperties.filter((p) => fits(p.domain, sCls) && fits(p.range, oCls) && !p.domain.some((d) => TOP.has(d))).map((p) => p.id);

const validate = (t) => {
  if (t.types) {
    const clashes = disjointPairs(t.types);
    return {
      ok: clashes.length === 0,
      checks: [{ label: 'Disjointness', ok: !clashes.length, detail: clashes.length ? `${name(clashes[0][0])} and ${name(clashes[0][1])} are declared owl:disjointWith` : 'no disjoint types' }],
      fix: clashes.length ? 'Keep one type. The agent should re-read Section 1 to decide whether the product is a substance or a mixture.' : null
    };
  }
  const prop = PROPS[t.p];
  if (!prop) {
    return { ok: false, checks: [{ label: 'Property', ok: false, detail: `${t.p} is not defined in the ontology` }], fix: 'Map the relation to an ontology property or drop it.' };
  }
  const domainOk = fits(prop.domain, t.sType);
  const rangeOk = fits(prop.range, t.oType);
  const checks = [
    { label: 'Property', ok: true, detail: `${name(t.p)} exists` },
    { label: 'Domain', ok: domainOk, detail: `${name(t.sType)} ${domainOk ? '⊑' : '⋢'} ${prop.domain.map(name).join(' ∪ ')}` },
    { label: 'Range', ok: rangeOk, detail: `${name(t.oType)} ${rangeOk ? '⊑' : '⋢'} ${prop.range.map(name).join(' ∪ ')}` }
  ];
  let fix = null;
  if (!domainOk || !rangeOk) {
    const alternatives = suggestProperties(t.sType, t.oType);
    fix = alternatives.length
      ? `Use ${alternatives.slice(0, 3).map(name).join(' or ')} to link ${name(t.sType)} to ${name(t.oType)}.`
      : `No property links ${name(t.sType)} to ${name(t.oType)} directly; the agent must add an intermediate ${prop.domain.map(name).join(' / ')} node.`;
  }
  return { ok: domainOk && rangeOk, checks, fix };
};

const AGENT_OUTPUT = [
  { s: ':Acetone', sType: 'sds:Substance', p: 'sds:requiresPPE', o: ':NitrileGloves', oType: 'sds:HandProtection' },
  { s: ':FlamLiq2', sType: 'sds:GHSClassification', p: 'sds:hasHazardStatement', o: ':H225', oType: 'sds:HazardStatement' },
  { s: ':Acetone', sType: 'sds:Substance', p: 'sds:hasHazardStatement', o: ':H225', oType: 'sds:HazardStatement' },
  { s: ':EyeIrritation', sType: 'sds:HealthHazard', p: 'sds:hasRouteOfExposure', o: ':EyeContact', oType: 'sds:RouteOfExposure' },
  { s: ':Acetone', sType: 'sds:Substance', p: 'sds:hasManufacturer', o: ':ChemCo', oType: 'sds:Supplier' },
  { s: ':Acetone', types: ['sds:Mixture', 'sds:Substance'] }
];

// ---------- Turtle source ----------

const SNIPPET = `@prefix sds:   <https://w3id.org/sds-ontology#> .
@prefix chebi: <http://purl.obolibrary.org/obo/CHEBI_> .

# A product made of two or more substances
sds:Mixture a owl:Class ;
    rdfs:subClassOf  sds:Product ;
    owl:disjointWith sds:Substance ;
    rdfs:label       "Mixture"@en ;
    skos:exactMatch  chebi:60004 .

# Components that must be disclosed in SDS Section 3
sds:HazardousComponent a owl:Class ;
    rdfs:subClassOf  sds:ChemicalComponent ;
    owl:disjointWith sds:NonHazardousComponent ;
    rdfs:seeAlso     chebi:50903 .

# GHS classification -> H-code hazard statement
sds:hasHazardStatement a owl:ObjectProperty ;
    owl:inverseOf sds:isHazardStatementOf ;
    rdfs:domain   sds:GHSClassification ;
    rdfs:range    sds:HazardStatement .`;

const highlightTurtle = (line) => {
  if (line.trimStart().startsWith('#')) return <span className="text-slate-500 italic">{line}</span>;
  return line.split(/("(?:[^"\\]|\\.)*"(?:@[a-z]+)?|@prefix|\ba\b|<[^>]+>|[a-z]+:[A-Za-z0-9_]*)/g).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('"')) return <span key={i} className="text-emerald-300">{part}</span>;
    if (part === '@prefix' || part === 'a') return <span key={i} className="text-pink-400">{part}</span>;
    if (part.startsWith('<')) return <span key={i} className="text-amber-300">{part}</span>;
    if (part.startsWith('sds:')) return <span key={i} className="text-sky-300">{part}</span>;
    if (/^[a-z]+:/.test(part)) return <span key={i} className="text-violet-300">{part}</span>;
    return <span key={i}>{part}</span>;
  });
};

// ---------- Neighbourhood graph ----------

const MAX_PER_SIDE = 5;

const VIEW_W = 780;
const nodeWidth = (label, kind) => Math.max(70, label.length * (kind === 'focus' ? 7.6 : 6.6) + 22);

const GraphNode = ({ x, y, label, kind, onClick }) => {
  const w = nodeWidth(label, kind);
  const styles = {
    focus: { fill: '#4f46e5', stroke: '#a5b4fc', text: '#fff' },
    class: { fill: '#1e293b', stroke: '#64748b', text: '#e2e8f0' },
    parent: { fill: '#1e1b4b', stroke: '#818cf8', text: '#c7d2fe' },
    external: { fill: '#1c1917', stroke: '#a8a29e', text: '#d6d3d1' },
    more: { fill: 'transparent', stroke: '#475569', text: '#94a3b8' }
  }[kind];
  return (
    <g onClick={onClick} className={onClick ? 'cursor-pointer' : ''} style={{ transition: 'transform 400ms' }}>
      <rect x={x - w / 2} y={y - 14} width={w} height={28} rx={kind === 'focus' ? 14 : 8} fill={styles.fill} stroke={styles.stroke} strokeWidth={kind === 'focus' ? 2 : 1.2} strokeDasharray={kind === 'more' ? '3 3' : '0'} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={kind === 'focus' ? 13 : 11} fontWeight={kind === 'focus' ? 700 : 500} fill={styles.text}>{label}</text>
    </g>
  );
};

const NeighbourhoodGraph = ({ id, onSelect }) => {
  const cls = CLASSES[id];
  const cx = VIEW_W / 2;
  const cy = 190;
  const focusHalf = nodeWidth(cls.label, 'focus') / 2;
  const labelOf = (item) => (item.more ? `+${item.more} more` : name(item.c));
  // Right column is right-aligned, left column left-aligned, so long names never clip.
  const rightX = (item) => VIEW_W - 6 - nodeWidth(labelOf(item), 'class') / 2;
  const leftX = (item) => 6 + nodeWidth(labelOf(item), 'class') / 2;
  const along = (x1, y1, x2, y2, t) => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  const spread = (items, from, to) => items.map((item, i) => ({ item, pos: items.length === 1 ? (from + to) / 2 : from + ((to - from) * i) / (items.length - 1) }));
  const limit = (items) => (items.length > MAX_PER_SIDE ? [...items.slice(0, MAX_PER_SIDE - 1), { more: items.length - (MAX_PER_SIDE - 1) }] : items);

  const parents = limit(cls.parents);
  const children = limit(CHILDREN[id] || []);
  const outgoing = limit(ontology.objectProperties.filter((p) => p.domain.includes(id)).flatMap((p) => p.range.map((r) => ({ p: p.id, c: r }))));
  const incoming = limit(ontology.objectProperties.filter((p) => p.range.includes(id) && !p.id.includes(':is')).flatMap((p) => p.domain.filter((d) => !TOP.has(d)).map((d) => ({ p: p.id, c: d }))));

  const kindOf = (c) => (CLASSES[c] ? 'class' : 'external');
  const select = (c) => (CLASSES[c] ? () => onSelect(c) : undefined);

  return (
    <svg viewBox={`0 0 ${VIEW_W} 380`} className="w-full h-auto" role="img" aria-label={`Ontology neighbourhood of ${cls.label}`}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
        </marker>
        <marker id="hollow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M1,1 L11,6 L1,11 z" fill="#0f172a" stroke="#818cf8" strokeWidth="1.3" />
        </marker>
      </defs>

      {spread(parents, cx - 160, cx + 160).map(({ item, pos }) => (
        <g key={`p-${item.more || item}`}>
          {!item.more && <line x1={cx} y1={cy - 15} x2={pos} y2={58} stroke="#818cf8" strokeWidth="1.4" markerEnd="url(#hollow)" />}
          <GraphNode x={pos} y={44} label={item.more ? `+${item.more} more` : name(item)} kind={item.more ? 'more' : CLASSES[item] ? 'parent' : 'external'} onClick={item.more ? undefined : select(item)} />
        </g>
      ))}
      {parents.length > 0 && <text x={cx + 8} y={110} fontSize="10" fill="#818cf8" fontFamily="ui-monospace, monospace">rdfs:subClassOf</text>}

      {spread(children, 100, VIEW_W - 100).map(({ item, pos }) => (
        <g key={`c-${item.more || item}`}>
          {!item.more && <line x1={pos} y1={322} x2={cx} y2={cy + 16} stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.7" markerEnd="url(#hollow)" />}
          <GraphNode x={pos} y={336} label={item.more ? `+${item.more} more` : name(item)} kind={item.more ? 'more' : 'class'} onClick={item.more ? undefined : select(item)} />
        </g>
      ))}

      {spread(outgoing, 70, 300).map(({ item, pos }) => {
        const x = rightX(item);
        const end = x - nodeWidth(labelOf(item), 'class') / 2 - 4;
        const [lx, ly] = along(cx + focusHalf, cy, end, pos, 0.62);
        return (
          <g key={`o-${item.more || item.p + item.c}`}>
            {!item.more && (
              <>
                <line x1={cx + focusHalf} y1={cy} x2={end} y2={pos} stroke="#64748b" strokeWidth="1.2" markerEnd="url(#arrow)" />
                <text x={lx} y={ly - 5} fontSize="9.5" fill="#94a3b8" textAnchor="middle" fontFamily="ui-monospace, monospace" paintOrder="stroke" stroke="#0f172a" strokeWidth="3">{name(item.p)}</text>
              </>
            )}
            <GraphNode x={x} y={pos} label={labelOf(item)} kind={item.more ? 'more' : kindOf(item.c)} onClick={item.more ? undefined : select(item.c)} />
          </g>
        );
      })}

      {spread(incoming, 70, 300).map(({ item, pos }) => {
        const x = leftX(item);
        const start = x + nodeWidth(labelOf(item), 'class') / 2;
        const [lx, ly] = along(start, pos, cx - focusHalf, cy, 0.38);
        return (
          <g key={`i-${item.more || item.p + item.c}`}>
            {!item.more && (
              <>
                <line x1={start} y1={pos} x2={cx - focusHalf - 4} y2={cy} stroke="#64748b" strokeWidth="1.2" markerEnd="url(#arrow)" />
                <text x={lx} y={ly - 5} fontSize="9.5" fill="#94a3b8" textAnchor="middle" fontFamily="ui-monospace, monospace" paintOrder="stroke" stroke="#0f172a" strokeWidth="3">{name(item.p)}</text>
              </>
            )}
            <GraphNode x={x} y={pos} label={labelOf(item)} kind={item.more ? 'more' : kindOf(item.c)} onClick={item.more ? undefined : select(item.c)} />
          </g>
        );
      })}

      <GraphNode x={cx} y={cy} label={cls.label} kind="focus" />
    </svg>
  );
};

// ---------- Panels ----------

const ExplorePanel = () => {
  const [selected, setSelected] = useState('sds:Product');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(() => new Set(['sds:Product', 'sds:Hazard']));
  const cls = CLASSES[selected];

  const select = (id) => {
    setSelected(id);
    setExpanded((prev) => new Set([...prev, ...ancestors(id)]));
  };

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ontology.classes.filter((c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) : null;
  }, [query]);

  const TreeItem = ({ id, depth }) => {
    const kids = CHILDREN[id] || [];
    const open = expanded.has(id);
    return (
      <li>
        <div className={`flex items-center gap-1 rounded-md pr-2 text-sm ${selected === id ? 'bg-indigo-500/20 text-white' : 'text-slate-300 hover:bg-slate-800'}`} style={{ paddingLeft: depth * 14 + 4 }}>
          {kids.length ? (
            <button onClick={() => setExpanded((prev) => { const next = new Set(prev); open ? next.delete(id) : next.add(id); return next; })} className="p-0.5 text-slate-500 hover:text-white" aria-label={open ? 'Collapse' : 'Expand'}>
              {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : <span className="w-4.5 inline-block" />}
          <button onClick={() => select(id)} className="flex-1 text-left py-1 truncate">
            {CLASSES[id].label}
            {kids.length > 0 && <span className="ml-1 text-[10px] text-slate-500">{kids.length}</span>}
          </button>
        </div>
        {open && kids.length > 0 && (
          <ul>{kids.map((k) => <TreeItem key={k} id={k} depth={depth + 1} />)}</ul>
        )}
      </li>
    );
  };

  const outgoing = ontology.objectProperties.filter((p) => [...ancestors(selected)].some((a) => p.domain.includes(a)));
  const dataProps = ontology.datatypeProperties.filter((p) => [...ancestors(selected)].some((a) => p.domain.includes(a)));

  return (
    <div className="grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b lg:border-b-0 lg:border-r border-slate-800 p-4 lg:max-h-[640px] lg:overflow-y-auto">
        <label className="relative block mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${ontology.stats.classes} classes…`} className="w-full rounded-lg bg-slate-900 border border-slate-700 pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500" />
        </label>
        {matches ? (
          <ul className="space-y-0.5">
            {matches.length === 0 && <li className="text-sm text-slate-500 px-2">No class matches “{query}”</li>}
            {matches.map((c) => (
              <li key={c.id}>
                <button onClick={() => { select(c.id); setQuery(''); }} className="w-full text-left rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-800">
                  {c.label} <span className="text-[10px] text-slate-500">{name(rootOf(c.id))}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-4">
            {MODULES.map((m) => (
              <div key={m.name}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 mb-1 px-1">{m.name}</div>
                <ul>{m.roots.filter((r) => CLASSES[r]).map((r) => <TreeItem key={r} id={r} depth={0} />)}</ul>
              </div>
            ))}
          </div>
        )}
      </aside>

      <div className="p-5 md:p-6 min-w-0">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-2 mb-5">
          <NeighbourhoodGraph id={selected} onSelect={select} />
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] text-slate-400 pb-1">
            <span><span className="text-indigo-300">▷</span> subClassOf</span>
            <span><span className="text-slate-300">→</span> object property</span>
            <span><span className="inline-block w-2.5 h-2.5 rounded-sm border border-stone-400 align-middle" /> external ontology</span>
            <span>Click a node to navigate</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <h4 className="text-xl font-bold text-white">{cls.label}</h4>
              <code className="text-xs text-sky-300">{cls.id}</code>
            </div>
            {cls.comment && <p className="text-sm text-slate-300 leading-relaxed mb-3">{cls.comment}</p>}
            <div className="space-y-2 text-xs">
              {cls.alignments.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-slate-400">Aligned with</span>
                  {cls.alignments.map((a) => (
                    <a key={a} href={a.startsWith('chebi:') ? `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:${a.slice(6)}` : undefined} target="_blank" rel="noopener noreferrer" className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-amber-200 hover:bg-amber-500/25">{a}</a>
                  ))}
                </div>
              )}
              {cls.disjointWith.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Ban className="w-3.5 h-3.5 text-rose-300" />
                  <span className="text-slate-400">Disjoint with</span>
                  {cls.disjointWith.map((d) => (
                    <button key={d} onClick={() => select(d)} className="rounded bg-rose-500/15 px-1.5 py-0.5 font-mono text-rose-200 hover:bg-rose-500/25">{name(d)}</button>
                  ))}
                </div>
              )}
            </div>
            {cls.example && (
              <div className="mt-3">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Few-shot example pattern for LLMs</div>
                <pre className="rounded-lg bg-slate-900 border border-slate-800 p-3 text-[12px] text-emerald-200 whitespace-pre-wrap break-words font-mono">{cls.example}</pre>
              </div>
            )}
          </div>
          <div className="text-sm">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Properties (incl. inherited)</div>
            {outgoing.length + dataProps.length === 0 ? (
              <p className="text-slate-500">No properties with this class as domain.</p>
            ) : (
              <ul className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {outgoing.map((p) => (
                  <li key={p.id} className="font-mono text-[12px]">
                    <span className="text-pink-300">{name(p.id)}</span>
                    <span className="text-slate-500"> → </span>
                    {p.range.map((r) => (
                      <button key={r} onClick={() => CLASSES[r] && select(r)} className="text-sky-300 hover:underline mr-1">{name(r)}</button>
                    ))}
                  </li>
                ))}
                {dataProps.map((p) => (
                  <li key={p.id} className="font-mono text-[12px]">
                    <span className="text-violet-300">{name(p.id)}</span>
                    <span className="text-slate-500"> → </span>
                    <span className="text-emerald-300">{p.range.join(', ')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ValidatePanel = () => {
  const [ran, setRan] = useState(0);
  const [running, setRunning] = useState(false);
  const [custom, setCustom] = useState({ sType: 'sds:Substance', p: 'sds:hasHazard', oType: 'sds:HealthHazard' });

  const run = () => {
    setRan(0);
    setRunning(true);
    AGENT_OUTPUT.forEach((_, i) => setTimeout(() => {
      setRan(i + 1);
      if (i === AGENT_OUTPUT.length - 1) setRunning(false);
    }, 450 * (i + 1)));
  };

  const results = AGENT_OUTPUT.map(validate);
  const accepted = results.slice(0, ran).filter((r) => r.ok).length;
  const customResult = validate({ s: ':x', ...custom, o: ':y' });
  const classOptions = ontology.classes.map((c) => c.id);

  return (
    <div className="p-5 md:p-6 space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h4 className="text-lg font-bold text-white">LLM agent output → ontology validation</h4>
            <p className="text-sm text-slate-400">Triples an extraction agent proposed for an acetone SDS, checked against the real constraints of the ontology before they enter the knowledge graph.</p>
          </div>
          <button onClick={run} disabled={running} className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60">
            <Play className="w-4 h-4" /> {ran ? 'Run again' : 'Run validation'}
          </button>
        </div>

        <div className="space-y-2">
          {AGENT_OUTPUT.map((t, i) => {
            const r = results[i];
            const done = i < ran;
            return (
              <div key={i} className={`rounded-xl border p-3 transition-colors duration-300 ${!done ? 'border-slate-800 bg-slate-900/50' : r.ok ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/40 bg-rose-500/5'}`}>
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${!done ? 'bg-slate-800 text-slate-500' : r.ok ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {!done ? <span className="text-[10px]">{i + 1}</span> : r.ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <code className="block text-[13px] text-slate-200 break-words">
                      {t.types ? (
                        <><span className="text-indigo-300">{t.s}</span> <span className="text-pink-300">a</span> {t.types.map((x, j) => <span key={x} className="text-sky-300">{x}{j < t.types.length - 1 ? ', ' : ''}</span>)} .</>
                      ) : (
                        <><span className="text-indigo-300">{t.s}</span><span className="text-slate-500"> ({name(t.sType)})</span> <span className="text-pink-300">{t.p}</span> <span className="text-indigo-300">{t.o}</span><span className="text-slate-500"> ({name(t.oType)})</span> .</>
                      )}
                    </code>
                    {done && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.checks.map((c) => (
                          <span key={c.label} className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] ${c.ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                            {c.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} <b>{c.label}</b> {c.detail}
                          </span>
                        ))}
                      </div>
                    )}
                    {done && r.fix && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-200"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> Feedback to agent: {r.fix}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {ran === AGENT_OUTPUT.length && (
          <p className="mt-3 text-sm text-slate-300"><span className="text-emerald-300 font-semibold">{accepted} accepted</span> into the knowledge graph · <span className="text-rose-300 font-semibold">{AGENT_OUTPUT.length - accepted} rejected</span> and sent back to the agent with feedback.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <h4 className="font-bold text-white mb-1">Try it yourself</h4>
        <p className="text-sm text-slate-400 mb-4">Pick any classes and property from the ontology and see whether the triple is valid.</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {[['sType', 'Subject type', classOptions], ['p', 'Property', ontology.objectProperties.map((p) => p.id)], ['oType', 'Object type', classOptions]].map(([key, label, options]) => (
            <label key={key} className="text-xs text-slate-400">
              {label}
              <select value={custom[key]} onChange={(e) => setCustom((c) => ({ ...c, [key]: e.target.value }))} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-2 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500">
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          ))}
        </div>
        <div className={`rounded-lg p-3 ${customResult.ok ? 'bg-emerald-500/10 border border-emerald-500/40' : 'bg-rose-500/10 border border-rose-500/40'}`}>
          <div className={`font-semibold mb-2 flex items-center gap-1.5 ${customResult.ok ? 'text-emerald-300' : 'text-rose-300'}`}>
            {customResult.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} {customResult.ok ? 'Valid triple' : 'Rejected'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {customResult.checks.map((c) => (
              <span key={c.label} className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] ${c.ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                {c.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} <b>{c.label}</b> {c.detail}
              </span>
            ))}
          </div>
          {customResult.fix && <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-200"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {customResult.fix}</p>}
        </div>
      </div>
    </div>
  );
};

const SourcePanel = () => (
  <div className="p-5 md:p-6">
    <div className="rounded-xl overflow-hidden border border-slate-800">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900">
        <span className="w-3 h-3 rounded-full bg-red-400/80" />
        <span className="w-3 h-3 rounded-full bg-amber-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs text-slate-400 font-mono">sds_document_ontology.ttl (excerpt)</span>
      </div>
      <pre className="p-5 text-[13px] leading-relaxed font-mono text-slate-300 overflow-x-auto bg-slate-950">
        <code>{SNIPPET.split('\n').map((line, i) => <div key={i}>{line ? highlightTurtle(line) : ' '}</div>)}</code>
      </pre>
    </div>
  </div>
);

const ProtegePanel = () => (
  <div className="p-5 md:p-6">
    <p className="text-sm text-slate-400 mb-4">High-level class view of the ontology as modelled in Protégé: products, chemical entities, hazards, safety measures and the SDS document, with their object-property links.</p>
    <a href="/ontology/ontology_sceenshot_high_level.png" target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden bg-white border border-slate-800">
      <img src="/ontology/ontology_sceenshot_high_level.png" alt="High-level class diagram of the SDS ontology in Protégé" className="w-full h-auto" />
    </a>
  </div>
);

const TABS = [
  { id: 'explore', label: 'Explore the ontology', icon: Network },
  { id: 'validate', label: 'Validate LLM output', icon: ShieldCheck },
  { id: 'protege', label: 'Protégé view', icon: Image },
  { id: 'source', label: 'Turtle source', icon: Code }
];

const OntologyExplorer = () => {
  const [tab, setTab] = useState('explore');
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden">
      <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-900/60">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === id ? 'border-indigo-400 text-white bg-slate-950' : 'border-transparent text-slate-400 hover:text-white'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>
      {tab === 'explore' && <ExplorePanel />}
      {tab === 'validate' && <ValidatePanel />}
      {tab === 'protege' && <ProtegePanel />}
      {tab === 'source' && <SourcePanel />}
    </div>
  );
};

export const ontologyStats = ontology.stats;
export const ontologyVersion = ontology.version;
export default OntologyExplorer;
