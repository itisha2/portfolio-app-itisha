import React from 'react';
import { Star, HeartPulse, Scale, Factory, HardHat, Rocket, FlaskConical } from 'lucide-react';

const base = '/companies_worked_with';

const HIGHLIGHTS = [
  { name: 'German Aerospace Center (DLR)', logo: `${base}/highlights/dlr.png`, caption: 'Research Scientist & AI Developer · since 2023' },
  { name: 'University of Stuttgart', logo: `${base}/highlights/university-of-stuttgart.png`, caption: 'MSc Computational Linguistics · TU9 university' }
];

// Scrolling band: everyone I have worked with or for.
const LOGOS = [
  { name: 'Cognizant', logo: `${base}/MNCs/cognizant.png`, kind: 'MNC' },
  { name: 'Optum (UnitedHealth Group)', logo: `${base}/MNCs/optum.png`, kind: 'MNC' },
  { name: 'Aetna', logo: `${base}/MNCs/aetna.png`, kind: 'MNC' },
  { name: 'Instant Systems', logo: `${base}/Startups_supported/instant-systems.png`, kind: 'Start-up' },
  { name: 'FactorLab', logo: `${base}/Startups_supported/factorlab.png`, kind: 'Start-up' },
  { name: 'mine&make', logo: `${base}/Startups_supported/mine-and-make.png`, kind: 'Start-up' },
  { name: 'Ferdinand-Steinbeis-Institut', logo: `${base}/research_institutes/ferdinand-steinbeis-institut.png`, kind: 'Research institute' },
  { name: 'Universität Bamberg', logo: '/research_collaborations/uni-bamberg.png', kind: 'Research collaboration' },
  { name: 'Universität Passau', logo: '/research_collaborations/uni-passau.png', kind: 'Research collaboration' },
  { name: 'TU Berlin', logo: '/research_collaborations/tu-berlin.png', kind: 'Research collaboration' },
  { name: 'Ernst-Abbe-Hochschule Jena', logo: '/research_collaborations/eah-jena.png', kind: 'Research collaboration' }
];

const DOMAINS = [
  { name: 'Healthcare', where: 'Optum · Cognizant', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 ring-rose-200' },
  { name: 'LegalTech', where: 'CaseMine', icon: Scale, color: 'text-amber-700 bg-amber-50 ring-amber-200' },
  { name: 'Manufacturing', where: 'DLR · mine&make · FSTI', icon: Factory, color: 'text-slate-700 bg-slate-100 ring-slate-300' },
  { name: 'Safety', where: 'Instant Systems · FactorLab', icon: HardHat, color: 'text-orange-700 bg-orange-50 ring-orange-200' },
  { name: 'Aerospace', where: 'German Aerospace Center', icon: Rocket, color: 'text-indigo-700 bg-indigo-50 ring-indigo-200' },
  { name: 'Materials science', where: 'DLR', icon: FlaskConical, color: 'text-emerald-700 bg-emerald-50 ring-emerald-200' }
];

const KIND_STYLES = {
  MNC: 'text-sky-700 bg-sky-50',
  'Start-up': 'text-amber-700 bg-amber-50',
  'Research institute': 'text-emerald-700 bg-emerald-50',
  'Research collaboration': 'text-violet-700 bg-violet-50'
};

const LogoBand = () => (
  <section id="domains" aria-label="Companies and institutions I have worked with" className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row lg:items-center gap-6">
      <div className="flex-shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-indigo-600" /> Highlights
        </p>
        <div className="grid grid-cols-2 gap-3">
          {HIGHLIGHTS.map((h) => (
            <figure key={h.name} className="flex flex-col items-center rounded-xl border-2 border-indigo-100 bg-indigo-50/40 px-4 py-3 w-full lg:w-48">
              <img src={h.logo} alt={`${h.name} logo`} className="h-14 object-contain" />
              <figcaption className="mt-2 text-center text-[11px] leading-snug text-slate-600">{h.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
          Worked with MNCs, start-ups, research institutes and universities
        </p>
        <div className="logo-marquee relative overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)' }}>
          <ul className="logo-marquee-track flex w-max gap-4">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <li key={`${l.name}-${i}`} aria-hidden={i >= LOGOS.length} className="flex flex-col items-center justify-between w-40 h-28 rounded-xl border border-slate-200 bg-white px-3 py-3">
                <div className="flex-1 flex items-center justify-center w-full">
                  <img src={l.logo} alt={i < LOGOS.length ? `${l.name} logo` : ''} className="max-h-12 max-w-full object-contain" />
                </div>
                <span className={`mt-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${KIND_STYLES[l.kind]}`}>{l.kind}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row md:items-center gap-3">
        <p className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-500 whitespace-nowrap">Domains I've worked in</p>
        <ul className="flex flex-wrap gap-2">
          {DOMAINS.map(({ name, where, icon: Icon, color }) => (
            <li key={name} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 ring-1 ${color}`} title={where}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-semibold">{name}</span>
              <span className="hidden sm:inline text-[11px] opacity-70">· {where}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default LogoBand;
