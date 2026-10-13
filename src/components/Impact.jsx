import React from 'react';
import { TrendingUp, FileSearch, ShieldCheck, Bot, Lock, Rocket, GraduationCap } from 'lucide-react';
import FlipCard from './FlipCard';

// What my skill set delivers.
const VALUE = [
  {
    icon: FileSearch,
    outcome: 'Turn unstructured documents into decision-ready knowledge',
    who: 'Manufacturing · aerospace · healthcare · legal',
    how: 'Document AI, NLP and LLMs extract facts from PDFs, tables and reports into knowledge graphs that people and systems can query.'
  },
  {
    icon: ShieldCheck,
    outcome: 'LLM answers you can trust and trace',
    who: 'Any team putting LLMs in front of experts',
    how: 'Ontologies ground and validate what models generate; RAG and GraphRAG cite their sources; evaluation tracks hallucination rate, accuracy and cost.'
  },
  {
    icon: Bot,
    outcome: 'Automate knowledge-intensive work with AI agents',
    who: 'Operations, research and back-office teams',
    how: 'LangGraph agents that plan, call tools over MCP, plug into existing back-end services and stop for human approval where it matters.'
  },
  {
    icon: Lock,
    outcome: 'AI that respects confidential data',
    who: 'Regulated and IP-sensitive organisations',
    how: 'Self-hosted, quantized open-weights models on-premises for private data, and public models via Ollama only where the data allows.'
  },
  {
    icon: Rocket,
    outcome: 'Ship AI products faster, without cutting corners',
    who: 'Start-ups and product teams',
    how: 'Agentic SDLC: I delegate well-scoped work to AI coding agents for speed, then review every change myself as the human in the loop. CI/CD and testing take it to production-grade APIs that keep working after launch.'
  },
  {
    icon: GraduationCap,
    outcome: 'Bridge research and industry, and grow AI talent',
    who: 'Companies working with universities',
    how: 'Bring current research into products, publish what works, and mentor engineers and students through real projects.'
  }
];

const Impact = () => {
  return (
    <section id="impact" className="max-w-6xl mx-auto px-4 py-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-2">
            <span className="font-mono mr-2 text-indigo-400">Chapter 05 ·</span>Impact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-600" /> What I bring to the world
          </h2>
        </div>
        <p className="text-slate-500 text-sm md:text-right">Flip a card to see how</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {VALUE.map(({ icon: Icon, outcome, who, how }) => (
          <FlipCard
            key={outcome}
            label={outcome}
            height="h-[17rem]"
            frontClass="bg-white border border-slate-200 text-slate-900 group-hover:border-indigo-300 group-hover:shadow-lg transition-shadow"
            backClass="bg-gradient-to-br from-slate-900 to-indigo-950 text-white"
            front={
              <>
                <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center mb-5"><Icon className="w-6 h-6" /></span>
                <h3 className="text-xl font-bold leading-snug mb-3">{outcome}</h3>
                <p className="text-sm text-slate-500">For: {who}</p>
              </>
            }
            back={
              <>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-300 mb-2">How I deliver it</p>
                <p className="text-base text-slate-100 leading-relaxed">{how}</p>
              </>
            }
          />
        ))}
      </div>
    </section>
  );
};

export default Impact;
