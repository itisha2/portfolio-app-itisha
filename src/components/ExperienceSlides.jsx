import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Check } from 'lucide-react';

const yearSpan = (period) => {
  const years = period.match(/\d{4}/g) || [];
  const end = /present/i.test(period) ? 'now' : years[years.length - 1];
  return years[0] === end ? years[0] : `${years[0]}–${end}`;
};

const shortName = (company) => company.replace(/\s*\(.*\)$/, '').replace(/ GmbH| Technology Solutions| Inc$/g, '');

// A horizontal slide deck, one item per slide (used for experience and education).
// Items: { title, company, period, location, domain, tags, highlights, short?, badge? }
const ExperienceSlides = ({ experiences, pointsLabel = 'Key contributions', label = 'Professional experience', itemNoun = 'role' }) => {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const [current, setCurrent] = useState(0);
  const [height, setHeight] = useState(null);

  // The deck takes the height of the visible slide, so short roles don't leave empty space.
  useEffect(() => {
    const slide = slideRefs.current[current];
    if (!slide) return;
    const update = () => setHeight(slide.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [current]);

  const goTo = (index) => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(experiences.length - 1, index));
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

  const total = String(experiences.length).padStart(2, '0');

  return (
    <div onKeyDown={onKeyDown}>
      {/* Timeline navigator */}
      <div className="relative mb-6 overflow-x-auto pb-2">
        <ol className="relative flex min-w-max md:min-w-0 md:grid gap-2" style={{ gridTemplateColumns: `repeat(${experiences.length}, minmax(0, 1fr))` }}>
          {experiences.map((exp, i) => (
            <li key={exp.company + exp.period}>
              <button
                onClick={() => goTo(i)}
                aria-label={`Show ${exp.title} at ${exp.company}`}
                aria-current={i === current ? 'step' : undefined}
                className={`w-full min-w-[120px] text-left rounded-xl border px-3 py-2.5 transition-all ${
                  i === current ? 'border-indigo-500 bg-indigo-600 text-white shadow-md' : i < current ? 'border-indigo-200 bg-indigo-50 text-indigo-900 hover:border-indigo-400' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                }`}
              >
                <span className={`block text-[11px] font-semibold ${i === current ? 'text-indigo-200' : 'text-slate-500'}`}>{yearSpan(exp.period)}</span>
                <span className="block text-sm font-bold truncate">{exp.short ?? shortName(exp.company)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Slides */}
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label={`${label} slides. Use the left and right arrow keys to navigate.`}
          style={{ height: height ?? undefined }}
          className="flex items-start overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth rounded-3xl transition-[height] duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {experiences.map((exp, i) => (
            <article
              key={exp.company + exp.period}
              ref={(el) => { slideRefs.current[i] = el; }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${experiences.length}: ${exp.title}, ${exp.company}`}
              className="w-full flex-shrink-0 snap-center grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:min-h-[380px] rounded-3xl overflow-hidden border border-slate-200 bg-white"
            >
              <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 text-white p-7 md:p-10 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-sm text-indigo-300">{String(i + 1).padStart(2, '0')} / {total}</span>
                  {exp.badge && <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/40">{exp.badge}</span>}
                </div>
                <p className="text-indigo-300 font-semibold mb-1">{exp.company}</p>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-5">{exp.title}</h3>
                <div className="space-y-1.5 text-sm text-slate-300 mb-6">
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-300" /> {exp.period}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-300" /> {exp.location}</p>
                </div>
                <div className="mt-auto">
                  <p className="text-[11px] uppercase tracking-widest text-indigo-300 mb-2">{exp.domain}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/15">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-7 md:p-10 flex flex-col justify-center">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-4">{pointsLabel}</p>
                <ul className="space-y-3">
                  {exp.highlights.map((highlight) => (
                    <li key={highlight} className={`flex items-start gap-3 text-slate-700 leading-relaxed ${exp.highlights.length <= 2 ? 'text-lg' : ''}`}>
                      <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          aria-label={`Previous ${itemNoun}`}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 text-slate-700 hover:text-indigo-600 disabled:opacity-0 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          disabled={current === experiences.length - 1}
          aria-label={`Next ${itemNoun}`}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 text-slate-700 hover:text-indigo-600 disabled:opacity-0 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Footer controls */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <button onClick={() => goTo(current - 1)} disabled={current === 0} className="md:hidden inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <div className="flex items-center gap-1.5 mx-auto">
          {experiences.map((exp, i) => (
            <button key={exp.company + exp.period} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`} />
          ))}
        </div>
        <button onClick={() => goTo(current + 1)} disabled={current === experiences.length - 1} className="md:hidden inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <p className="hidden md:block mt-2 text-center text-xs text-slate-400">Use ← → keys, the arrows, or click a {itemNoun} above</p>
    </div>
  );
};

export default ExperienceSlides;
