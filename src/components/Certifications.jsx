import React, { useState, useEffect, useCallback } from 'react';
import { Award, ExternalLink, X, ChevronLeft, ChevronRight, ZoomIn, Layers } from 'lucide-react';

const coursera = (id) => `https://www.coursera.org/account/accomplishments/verify/${id}`;

// Every certificate, in the order the lightbox steps through them.
const CERTIFICATES = {
  'neo4j-kg-with-llms': {
    name: 'Building Knowledge Graphs with LLMs',
    issuer: 'Neo4j GraphAcademy',
    date: 'Aug 2025',
    url: 'https://graphacademy.neo4j.com/c/afca4cda-c543-4ecd-bd3c-73a96168a225',
    tags: ['Knowledge Graphs', 'LLMs', 'Neo4j']
  },
  'deep-learning-specialization': {
    name: 'Deep Learning Specialization',
    issuer: 'DeepLearning.AI · Coursera',
    date: 'Mar 2018',
    url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/3RVX8BWJLX6A',
    tags: ['Deep Learning', 'CNNs', 'Sequence Models'],
    courses: ['neural-networks-deep-learning', 'improving-deep-neural-networks', 'structuring-ml-projects', 'convolutional-neural-networks', 'sequence-models']
  },
  'nlp-in-tensorflow': {
    name: 'Natural Language Processing in TensorFlow',
    issuer: 'DeepLearning.AI · Coursera',
    date: 'Aug 2019',
    url: coursera('EBKRNR22HG5V'),
    tags: ['NLP', 'TensorFlow', 'LSTMs']
  },
  'machine-learning-stanford': {
    name: 'Machine Learning',
    issuer: 'Stanford Online · Coursera',
    date: 'Oct 2016',
    url: coursera('LMZFEPASPYR8'),
    tags: ['Machine Learning', 'Andrew Ng']
  },
  'neural-networks-deep-learning': { name: 'Neural Networks and Deep Learning', issuer: 'DeepLearning.AI · Coursera', date: 'Jan 2018', url: coursera('J7UYT3MA6D24') },
  'improving-deep-neural-networks': { name: 'Improving Deep Neural Networks', issuer: 'DeepLearning.AI · Coursera', date: 'Jan 2018', url: coursera('MB436DVHMFA9') },
  'structuring-ml-projects': { name: 'Structuring Machine Learning Projects', issuer: 'DeepLearning.AI · Coursera', date: 'Feb 2018', url: coursera('ACPTJBPFGW6N') },
  'convolutional-neural-networks': { name: 'Convolutional Neural Networks', issuer: 'DeepLearning.AI · Coursera', date: 'Mar 2018', url: coursera('6LLGXEZBKGEZ') },
  'sequence-models': { name: 'Sequence Models', issuer: 'DeepLearning.AI · Coursera', date: 'Mar 2018', url: coursera('KWAWAXG3NNCU') }
};

const FEATURED = ['neo4j-kg-with-llms', 'deep-learning-specialization', 'nlp-in-tensorflow', 'machine-learning-stanford'];
const ALL_IDS = Object.keys(CERTIFICATES);

const preview = (id) => `/certificates/previews/${id}.jpg`;

const Certifications = () => {
  const [openId, setOpenId] = useState(null);

  const step = useCallback((delta) => {
    setOpenId((id) => ALL_IDS[(ALL_IDS.indexOf(id) + delta + ALL_IDS.length) % ALL_IDS.length]);
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenId(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openId, step]);

  const open = openId && CERTIFICATES[openId];

  return (
    <section id="certifications" className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-2">Credentials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-600" />
            Licenses & Certifications
          </h2>
        </div>
        <p className="text-slate-500 text-sm">{ALL_IDS.length} verified certificates · click any to view</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED.map((id) => {
          const cert = CERTIFICATES[id];
          return (
            <div key={id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all">
              <button onClick={() => setOpenId(id)} className="relative aspect-[4/3] bg-slate-50 border-b border-slate-100 overflow-hidden p-3" aria-label={`View ${cert.name} certificate`}>
                <img src={preview(id)} alt={`${cert.name} certificate`} loading="lazy" className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-900">
                    <ZoomIn className="w-4 h-4" /> View
                  </span>
                </span>
                {cert.courses && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
                    <Layers className="w-3.5 h-3.5" /> {cert.courses.length} courses
                  </span>
                )}
              </button>
              <div className="flex flex-col flex-1 p-5">
                <p className="text-xs font-semibold text-indigo-600 mb-1">{cert.issuer}</p>
                <h3 className="font-bold text-slate-900 leading-snug mb-1">{cert.name}</h3>
                <p className="text-sm text-slate-500 mb-3">Issued {cert.date}</p>
                {cert.courses && (
                  <ul className="mb-3 space-y-1">
                    {cert.courses.map((courseId) => (
                      <li key={courseId}>
                        <button onClick={() => setOpenId(courseId)} className="text-left text-xs text-slate-600 hover:text-indigo-700 hover:underline">
                          ✓ {CERTIFICATES[courseId].name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {cert.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setOpenId(null)} role="dialog" aria-modal="true" aria-label={`${open.name} certificate`}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenId(null)} className="absolute -top-12 right-0 text-white/80 hover:text-white" aria-label="Close">
              <X className="w-8 h-8" />
            </button>
            <img src={preview(openId)} alt={`${open.name} certificate`} className="w-full max-h-[70vh] object-contain rounded-xl bg-white shadow-2xl" />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-white">
              <div>
                <h3 className="font-bold text-lg">{open.name}</h3>
                <p className="text-sm text-slate-300">{open.issuer} · {open.date}</p>
              </div>
              <div className="flex gap-2">
                <a href={open.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400">
                  Verify <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <button onClick={() => step(-1)} className="absolute left-0 top-[35vh] -translate-x-1/2 md:-translate-x-full rounded-full bg-white/90 p-2 text-slate-900 shadow hover:bg-white" aria-label="Previous certificate">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => step(1)} className="absolute right-0 top-[35vh] translate-x-1/2 md:translate-x-full rounded-full bg-white/90 p-2 text-slate-900 shadow hover:bg-white" aria-label="Next certificate">
              <ChevronRight className="w-6 h-6" />
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">{ALL_IDS.indexOf(openId) + 1} / {ALL_IDS.length} · use ← → to browse</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certifications;
