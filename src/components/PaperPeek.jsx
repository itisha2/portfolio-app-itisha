import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Maximize2, X } from 'lucide-react';

const base = '/my_paper_highlights';

// Abstract screenshots of my papers, with a one-line takeaway from each abstract.
const PAPERS = [
  {
    id: 'swj-2026',
    short: 'Semantic Web journal',
    title: 'External Knowledge Integration in Large Language Models: A Survey on Methods, Challenges, and Future Directions',
    venue: 'Semantic Web journal · 2026',
    image: `${base}/swj-2026-external-knowledge-llms.png`,
    width: 'max-w-3xl',
    tldr: 'How parametric and non-parametric knowledge integration (RAG, constrained and ontology-guided decoding, KGs) makes LLMs more accurate and trustworthy in knowledge-intensive domains.',
    url: 'https://doi.org/10.1177/22104968261453132'
  },
  {
    id: 'swat4hcls-2026',
    short: 'SWAT4HCLS 2026',
    title: 'Sequential Domain Adaptation on Heterogeneous Clinical Resources for Biomedical NER',
    venue: 'SWAT4HCLS 2026 · Amsterdam',
    image: `${base}/swat4hcls-2026-biomedical-ner.png`,
    width: 'max-w-none',
    tldr: 'An adaptable biomedical NER model trained by sequential fine-tuning with layer freezing across papers, clinical trials and patient profiles, avoiding catastrophic forgetting.',
    url: 'https://www.swat4ls.org/workshops/amsterdam2026/programme/accepted-submissions/'
  },
  {
    id: 'semats-2024',
    short: 'SEMANTiCS 2024',
    title: 'Implementing Semantic Technologies in Materials Science and Engineering',
    venue: 'SeMatS @ SEMANTiCS 2024',
    image: `${base}/semats-2024-semantic-tech-materials.png`,
    width: 'max-w-3xl',
    tldr: 'An overview of data-management issues in materials science and engineering, the semantic technologies that can address them, and a roadmap for implementing them in the field.',
    url: 'https://ceur-ws.org/Vol-3760/paper4.pdf'
  }
];

// Abstracts as a slide deck: one abstract per slide, large enough to read in place.
const PaperPeek = () => {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const [current, setCurrent] = useState(0);
  const [height, setHeight] = useState(null);
  const [zoomed, setZoomed] = useState(null);

  useEffect(() => {
    const slide = slideRefs.current[current];
    if (!slide) return;
    const update = () => setHeight(slide.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [current]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e) => e.key === 'Escape' && setZoomed(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoomed]);

  const goTo = (index) => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(PAPERS.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
    setCurrent(clamped);
  };

  const onScroll = () => {
    const track = trackRef.current;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== current) setCurrent(index);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  };

  return (
    <div className="mt-14" onKeyDown={onKeyDown}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-1">Quick peek</p>
        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" /> Paper abstracts
        </h3>
      </div>

      <ol className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {PAPERS.map((paper, i) => (
          <li key={paper.id} className="flex-1 min-w-[150px]">
            <button
              onClick={() => goTo(i)}
              aria-current={i === current ? 'step' : undefined}
              className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all ${i === current ? 'border-indigo-500 bg-indigo-600 text-white shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`}
            >
              <span className={`block text-[11px] font-semibold ${i === current ? 'text-indigo-200' : 'text-slate-500'}`}>Abstract {i + 1}</span>
              <span className="block text-sm font-bold truncate">{paper.short}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Paper abstract slides. Use the left and right arrow keys to navigate."
          style={{ height: height ?? undefined }}
          className="flex items-start overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth rounded-3xl transition-[height] duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PAPERS.map((paper, i) => (
            <article
              key={paper.id}
              ref={(el) => { slideRefs.current[i] = el; }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${PAPERS.length}: ${paper.title}`}
              className="w-full flex-shrink-0 snap-center rounded-3xl overflow-hidden border border-slate-200 bg-white"
            >
              <header className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 text-white px-6 py-6 md:px-10 md:py-8">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="font-mono text-sm text-indigo-300">{String(i + 1).padStart(2, '0')} / {String(PAPERS.length).padStart(2, '0')}</span>
                  <span className="text-sm font-semibold text-indigo-200">{paper.venue}</span>
                </div>
                <h4 className="text-xl md:text-2xl font-bold leading-snug mb-3">{paper.title}</h4>
                <p className="text-slate-300 leading-relaxed max-w-4xl"><span className="font-semibold text-emerald-300">TL;DR </span>{paper.tldr}</p>
              </header>
              <div className="p-4 md:p-8 bg-slate-50">
                <button onClick={() => setZoomed(paper)} className={`group relative block w-full mx-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden ${paper.width}`} aria-label={`Enlarge the abstract of ${paper.title}`}>
                  <img src={paper.image} alt={`Abstract of ${paper.title}`} onLoad={() => i === current && setHeight(slideRefs.current[i]?.offsetHeight ?? null)} className="w-full h-auto" />
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" /> Enlarge
                  </span>
                </button>
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                  Read the full paper <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <button onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Previous abstract" className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 text-slate-700 hover:text-indigo-600 disabled:opacity-0 transition-opacity">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => goTo(current + 1)} disabled={current === PAPERS.length - 1} aria-label="Next abstract" className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 text-slate-700 hover:text-indigo-600 disabled:opacity-0 transition-opacity">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <button onClick={() => goTo(current - 1)} disabled={current === 0} className="md:hidden inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <div className="flex items-center gap-1.5 mx-auto">
          {PAPERS.map((paper, i) => (
            <button key={paper.id} onClick={() => goTo(i)} aria-label={`Go to abstract ${i + 1}`} className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`} />
          ))}
        </div>
        <button onClick={() => goTo(current + 1)} disabled={current === PAPERS.length - 1} className="md:hidden inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {zoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setZoomed(null)} role="dialog" aria-modal="true" aria-label={`Abstract: ${zoomed.title}`}>
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setZoomed(null)} className="absolute -top-12 right-0 text-white/80 hover:text-white" aria-label="Close">
              <X className="w-8 h-8" />
            </button>
            <div className="max-h-[85vh] overflow-auto rounded-xl bg-white shadow-2xl">
              <img src={zoomed.image} alt={`Abstract of ${zoomed.title}`} className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperPeek;
