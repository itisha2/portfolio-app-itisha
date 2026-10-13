import React, { useState, useEffect } from 'react';
import { Mic, MapPin, Calendar, ExternalLink, X, ZoomIn, Award, FileText } from 'lucide-react';

// Add a participation certificate by putting a preview image in
// public/conferences_and_presentations/previews/ and setting `certificate`.
const CONFERENCES = [
  {
    id: 'iswc-2026',
    acronym: 'ISWC',
    year: '2026',
    name: 'International Semantic Web Conference (ISWC 2026)',
    track: 'NLP4KGC Workshop',
    location: 'Bari, Italy',
    date: '25–27 Oct 2026',
    role: 'Upcoming talk · paper accepted',
    talk: 'Where, How, and What to Ground: Evaluating Ontology-Guided LLM-based Knowledge Graph Construction',
    url: 'https://5thnlp4kgc-code.github.io/5nlp4kgc/pages/accepted-papers.html',
    gradient: 'from-indigo-600 to-sky-500'
  },
  {
    id: 'swat4hcls-2026',
    acronym: 'SWAT4HCLS',
    year: '2026',
    name: '17th International SWAT4HCLS Conference',
    track: 'Semantic Web Applications and Tools for Health Care and Life Sciences',
    location: 'Amsterdam, The Netherlands',
    date: '23–26 Mar 2026',
    role: 'Presenter',
    talk: 'Sequential Domain Adaptation on Heterogeneous Clinical Resources for Biomedical NER',
    url: 'https://www.swat4ls.org/workshops/amsterdam2026/programme/accepted-submissions/',
    certificate: '/conferences_and_presentations/previews/swat4hcls-2026.jpg',
    gradient: 'from-violet-600 to-indigo-500'
  },
  {
    id: 'dlr-internal',
    acronym: 'DLR',
    year: '2023–26',
    name: 'Internal DLR conferences',
    track: 'German Aerospace Center',
    location: 'Germany',
    role: 'Presenter',
    gradient: 'from-slate-700 to-slate-500'
  }
];

const Conferences = () => {
  const [openCert, setOpenCert] = useState(null);

  useEffect(() => {
    if (!openCert) return;
    const onKey = (e) => e.key === 'Escape' && setOpenCert(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openCert]);

  return (
    <section id="conferences" className="bg-white border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-2">On stage</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
            <Mic className="w-8 h-8 text-indigo-600" />
            Conferences & Talks
          </h2>
        </div>

        <div className="space-y-6">
          {CONFERENCES.map((conf) => (
            <article key={conf.id} className="group grid md:grid-cols-[280px_1fr] rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all">
              {conf.certificate ? (
                <button
                  onClick={() => setOpenCert(conf)}
                  className="relative aspect-[4/3] md:aspect-auto bg-white p-3 border-b md:border-b-0 md:border-r border-slate-200"
                  aria-label={`View ${conf.acronym} participation certificate`}
                >
                  <img src={conf.certificate} alt={`${conf.name} participation certificate`} loading="lazy" className="w-full h-full object-contain" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
                    <Award className="w-3.5 h-3.5" /> Certificate
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-900">
                      <ZoomIn className="w-4 h-4" /> View
                    </span>
                  </span>
                </button>
              ) : (
                <div className={`flex flex-col items-center justify-center bg-gradient-to-br ${conf.gradient} text-white p-8 min-h-[160px]`}>
                  <span className="text-3xl font-black tracking-tight">{conf.acronym}</span>
                  <span className="text-lg font-semibold opacity-80">{conf.year}</span>
                </div>
              )}

              <div className="p-6 md:p-7 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    <Mic className="w-3 h-3" /> {conf.role}
                  </span>
                  <span className="text-xs text-slate-500">{conf.track}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{conf.name}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-4">
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {conf.location}</span>
                  {conf.date && <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {conf.date}</span>}
                </div>
                {conf.talk && (
                  <p className="flex items-start gap-2 text-slate-700 leading-relaxed mb-4">
                    <FileText className="w-4 h-4 mt-1 text-indigo-500 flex-shrink-0" />
                    <span><span className="font-semibold">Talk:</span> {conf.talk}</span>
                  </p>
                )}
                <div className="mt-auto flex flex-wrap gap-4">
                  {conf.url && (
                    <a href={conf.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                      Conference programme <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {conf.certificate && (
                    <button onClick={() => setOpenCert(conf)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                      <Award className="w-3.5 h-3.5" /> View participation certificate
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {openCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setOpenCert(null)} role="dialog" aria-modal="true" aria-label={`${openCert.name} participation certificate`}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenCert(null)} className="absolute -top-12 right-0 text-white/80 hover:text-white" aria-label="Close">
              <X className="w-8 h-8" />
            </button>
            <img src={openCert.certificate} alt={`${openCert.name} participation certificate`} className="w-full max-h-[75vh] object-contain rounded-xl bg-white shadow-2xl" />
            <div className="mt-4 text-white">
              <h3 className="font-bold text-lg">Certificate of participation · {openCert.name}</h3>
              <p className="text-sm text-slate-300">{openCert.location} · {openCert.date}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Conferences;
