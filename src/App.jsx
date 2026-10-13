import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Linkedin, Github, Brain, Database, Code, BookOpen, Award, Briefcase, GraduationCap, ChevronRight, ExternalLink, Bot, Workflow, ShieldCheck, Users, Server, Layers, Quote, Menu, X, ArrowRight, Sparkles, MousePointer, GitBranch, Network, ChevronDown } from 'lucide-react';
import PipelineDemo from './components/PipelineDemo';
import Certifications from './components/Certifications';
import Conferences from './components/Conferences';
import Ikigai from './components/Ikigai';
import LogoBand from './components/LogoBand';
import ExperienceSlides from './components/ExperienceSlides';
import PaperPeek from './components/PaperPeek';
import Impact from './components/Impact';
import FlipCard from './components/FlipCard';
import { Heart, Compass, Shuffle, Target, Sparkle, HeartHandshake, GraduationCap as Mortarboard, UserCheck, ClipboardCheck, Presentation, Crown } from 'lucide-react';
import PortfolioGraph from './components/PortfolioGraph';
import OntologyExplorer, { ontologyStats, ontologyVersion } from './components/OntologyExplorer';
import './App.css';

const LINKEDIN_URL = "https://www.linkedin.com/in/itisha-yadav-90395513a/";
const GITHUB_URL = "https://github.com/itisha2";
const EMAIL = "itishayadav80@gmail.com";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const heroWords = ["knowledge graphs", "question answering systems", "grounded LLM answers", "agentic workflows", "ontology-driven AI", "NLP pipelines"];

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % heroWords.length), 2200);
    return () => clearInterval(id);
  }, [heroWords.length]);

  const stats = [
    { value: "10", label: "Years in industry" },
    { value: "3", label: "Markets: India, Germany and US clients" },
    { value: "4", label: "Accepted papers in peer-reviewed venues" }
  ];

  const focusAreas = [
    {
      title: "Agentic AI Systems",
      hook: "Agents that plan, call tools and ask before they act.",
      description: "Autonomous document workflows with LangGraph and LangChain: tool-calling, agent memory, MCP tools wired into existing back-end services, and human-in-the-loop approval.",
      tags: ["LangGraph", "MCP", "Tool-calling", "Human-in-the-loop"],
      icon: Bot
    },
    {
      title: "RAG & GraphRAG",
      hook: "Answers grounded in your own knowledge.",
      description: "Retrieval-Augmented Generation over enterprise knowledge, with embeddings, vector databases and knowledge graphs for grounded and traceable answers.",
      tags: ["FAISS", "ChromaDB", "Neo4j", "GraphRAG"],
      icon: Database
    },
    {
      title: "Knowledge Graphs from Documents",
      hook: "From messy PDFs to queryable knowledge.",
      description: "Turning unstructured PDFs into structured, queryable knowledge with ontologies, LLMs, vision-language models and constrained decoding.",
      tags: ["Ontologies", "VLMs", "Constrained decoding", "SPARQL"],
      icon: Layers
    },
    {
      title: "LLMOps in Production",
      hook: "Private, monitored, cost-aware LLMs.",
      description: "Self-hosted, quantized open-weights LLMs behind REST APIs in Docker, with CI/CD, evaluation, guardrails and observability, keeping confidential data on-premises.",
      tags: ["Ollama", "SGLang", "Docker", "Evaluation"],
      icon: Server
    }
  ];

  const skillCategories = [
    {
      category: "Agentic SDLC",
      icon: GitBranch,
      highlight: true,
      skills: ["AI-assisted software development", "Coding agents (Claude Code, GitHub Copilot)", "Spec-driven development", "Agent-driven code review", "Automated test generation", "Agents in CI/CD pipelines", "MCP servers and tools", "Human-in-the-loop guardrails for agents"]
    },
    {
      category: "Agentic AI",
      icon: Bot,
      highlight: true,
      skills: ["LangGraph", "LangChain", "Multi-agent systems", "Model Context Protocol (MCP)", "Tool-calling architectures", "Agent memory", "Human-in-the-loop approval", "REST API integration"]
    },
    {
      category: "LLMs & Generative AI",
      icon: Brain,
      skills: ["Fine-tuning (LoRA, PEFT)", "Context and prompt engineering", "Structured generation and constrained decoding", "Vision-language models", "OpenAI API", "Open-weights LLMs", "Ollama, llama.cpp, SGLang, TGI", "Quantization"]
    },
    {
      category: "RAG & Knowledge Engineering",
      icon: Database,
      skills: ["RAG", "GraphRAG", "Embeddings", "FAISS", "ChromaDB", "Elasticsearch", "Neo4j", "FalkorDB", "Apache Jena", "Cypher", "SPARQL", "OWL / RDF ontologies", "Entity linking"]
    },
    {
      category: "ML & NLP",
      icon: Sparkles,
      skills: ["PyTorch", "TensorFlow / Keras", "Hugging Face Transformers", "Scikit-learn", "XGBoost", "NER", "Text classification", "Transfer learning", "A/B testing", "Bandits"]
    },
    {
      category: "Engineering & MLOps",
      icon: Code,
      skills: ["Python", "SQL", "Java", "C/C++", "Bash", "FastAPI", "Litestar", "OpenAPI", "React", "Node.js", "Docker", "Git", "CI/CD", "pytest", "AWS (SageMaker, EC2)", "Spark / Hadoop", "CUDA", "Slurm / HPC", "Linux"]
    },
    {
      category: "Evaluation & Responsible AI",
      icon: ShieldCheck,
      skills: ["Benchmarks", "LLM-as-judge", "Hallucination rate and error analysis", "Guardrails", "AI observability", "Latency and cost optimization", "Privacy and data governance", "On-premises LLMs"]
    },
    {
      category: "Leadership",
      icon: Users,
      skills: ["Technical leadership", "Solution architecture", "Code reviews and coding standards", "Mentoring engineers", "Stakeholder engagement", "Requirements to solutions", "Cross-functional collaboration"]
    }
  ];

  const experiences = [
    {
      title: "Research Scientist & AI Developer",
      badge: "Current role",
      company: "German Aerospace Center (DLR)",
      location: "Jena, Germany",
      period: "Aug 2023 – Present",
      domain: "Aerospace · Manufacturing · Materials",
      highlights: [
        "One of the hands-on architects and core code reviewers of the group's LLM-based information extraction and knowledge graph platform: shape the system design, coding standards and best practices together with the team.",
        "Design, build and deploy agentic AI systems (LangGraph, LangChain) for autonomous document workflows, with tool-calling, agent memory, MCP tools connected to existing back-end services, and human-in-the-loop approval.",
        "Built RAG and GraphRAG over enterprise knowledge repositories using FAISS, ChromaDB, Neo4j, FalkorDB and Apache Jena (Cypher, SPARQL).",
        "Architected data pipelines for LLM fine-tuning (LoRA) in PyTorch on GPUs and HPC clusters; built multi-modal document intelligence with vision-language models and benchmarked 3 document parsers (PaddleOCR, Docling, MinerU).",
        "Helped establish the evaluation standard for LLM systems: benchmark datasets, LLM-as-judge, precision, recall, F1, hallucination rate and error analysis, plus guardrails and observability for accuracy, latency and cost.",
        "Shipped models to production as REST APIs (Litestar, OpenAPI) in Docker with self-hosted, quantized open-weights LLMs (Ollama, llama.cpp, SGLang, TGI), Git, CI/CD and pytest.",
        "Contributed to open-source code and an OWL ontology for grounding LLM extraction; mentor junior developers and supervised 4 master's theses on agentic AI and LLM-based extraction."
      ],
      tags: ["LangGraph", "MCP", "GraphRAG", "LoRA", "VLMs", "LLMOps"]
    },
    {
      title: "Research Assistant & AI Developer",
      company: "mine&make GmbH",
      location: "Stuttgart, Germany",
      period: "Aug 2022 – Apr 2023",
      domain: "Manufacturing",
      highlights: [
        "Built knowledge graph construction components (coreference resolution, entity linking to Wikidata) for manufacturing data, deployed on AWS EC2."
      ],
      tags: ["Entity Linking", "Knowledge Graphs", "AWS"]
    },
    {
      title: "Research Assistant & AI Developer",
      company: "Ferdinand-Steinbeis-Institut",
      location: "Stuttgart, Germany",
      period: "Oct 2021 – Jul 2022",
      domain: "Industry 4.0",
      highlights: [
        "Built a knowledge-graph-based recommender system and knowledge retrieval system.",
        "Indexed 50,000 documents and deployed semantic search with Elasticsearch; built the NER component with spaCy."
      ],
      tags: ["Recommender Systems", "Elasticsearch", "spaCy"]
    },
    {
      title: "Data Scientist",
      company: "Instant Systems Inc",
      location: "India · US clients",
      period: "Sep 2019 – Oct 2021",
      domain: "Safety · Procurement",
      highlights: [
        "Built a multi-task deep neural network for incident prediction (TensorFlow, Keras), served in real time on AWS EC2 via FastAPI.",
        "Fine-tuned BERT for multi-class text classification (82% accuracy) and shipped NER and document-classification REST APIs for enterprise integration."
      ],
      tags: ["BERT", "TensorFlow", "FastAPI", "AWS"]
    },
    {
      title: "Associate Data Scientist",
      company: "UnitedHealth Group (Optum)",
      location: "India",
      period: "Jul 2019 – Aug 2019",
      domain: "Healthcare",
      highlights: [
        "Built classification models (Random Forest, XGBoost, logistic regression) on US healthcare claims data in a regulated enterprise environment."
      ],
      tags: ["XGBoost", "Scikit-learn"]
    },
    {
      title: "Data Analyst",
      company: "Gauge Data Solutions (CaseMine)",
      location: "India",
      period: "Mar 2018 – Jun 2019",
      domain: "Legal Tech",
      highlights: [
        "Trained an NER system and built document similarity with Vector Space Models and Latent Semantic Analysis."
      ],
      tags: ["NER", "LSA"]
    },
    {
      title: "Programmer Analyst",
      company: "Cognizant Technology Solutions",
      location: "India",
      period: "Nov 2016 – Feb 2018",
      domain: "Healthcare",
      highlights: [
        "Migrated an enterprise ETL data platform from SAS to Hadoop and Apache Spark in an 8-member team."
      ],
      tags: ["Spark", "Hadoop", "ETL"]
    }
  ];

  const projects = [
    {
      name: "Early vs. Late Ontology Grounding",
      description: "Open-source project comparing prompt-based and embedding-based entity grounding for LLM-based knowledge graph construction. Code and ontology released under CC BY 4.0.",
      label: "Open Source · DLR",
      technologies: ["LLMs", "Knowledge Graphs", "Embeddings", "Python"],
      url: "https://zenodo.org/records/21511936",
      cta: "View on Zenodo"
    },
    {
      name: "Upagu",
      description: "AI-powered personal assistant focused on natural language understanding, speech and emotionally aware interaction.",
      label: "Side Project",
      technologies: ["Python", "React", "NLP", "Speech Processing", "Affective Computing"],
      url: "https://upagu.vercel.app/",
      cta: "Live demo"
    },
    {
      name: "Krishi-App",
      description: "AgTech application using AI for crop monitoring, yield prediction and farming optimization.",
      label: "Side Project",
      technologies: ["Computer Vision", "Machine Learning", "NLP", "Mobile"],
      url: "https://krishi-app-ten.vercel.app/",
      cta: "Live demo"
    }
  ];

  // Filled from LinkedIn (Recommendations received). Each entry: { name, title, relationship, text }
  // Recommenders' names are intentionally left out of the code; only role and relationship are shown.
  const recommendations = [
    {
      id: 'de-fsti',
      country: 'Germany',
      flag: '🇩🇪',
      title: 'PostDoc, Ferdinand-Steinbeis-Institut · Co-Founder & CEO of a tech start-up',
      relationship: 'Managed Itisha directly',
      date: 'Jul 2022',
      text: "It is with great pleasure to recommend Itisha. At the FSTI, I was Itisha's direct supervisor in the field of Information Systems. She was responsible for the automation of triple extraction and knowledge graph creation by using the latest researched techniques from the field of NLP. In addition to these main responsibilities, she configured and managed the Elastic Search instance on the cloud, developed APIs, and held presentations as well as workshops with great detail and profoundness for knowledge sharing…"
    },
    {
      id: 'us-instant',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Co-Founder and eVP, Instant Systems (Silicon Valley)',
      relationship: 'Managed Itisha directly',
      date: 'Jan 2021',
      text: "Itisha is an exceptional young woman with passion for learning and advancing science. Her intelligence and natural analytical talent greatly help her with empathy and understanding of her customers' problems. My company is post-series-A stage B2B incubator program based out of Silicon Valley. Itisha has worked on three major products so far and done an amazing job impressing all of these companies' CEOs & investors."
    },
    {
      id: 'in-datascience',
      country: 'India',
      flag: '🇮🇳',
      title: 'Head of Data Science · Digital & AI Transformation Executive',
      relationship: 'Worked with Itisha on the same team',
      date: 'Apr 2021',
      text: 'Itisha has worked with me on a couple of projects, she has a keen eye on data trends, a great statistician and an innovative scientist!'
    },
    {
      id: 'de-tsystems',
      country: 'Germany',
      flag: '🇩🇪',
      title: 'AI/LLM Engineer, T-Systems · LLM Inference, HPC',
      relationship: 'Studied together, worked on 2 projects',
      date: 'Sep 2022',
      text: "Itisha is a wonderful teammate. I worked with her on 2 projects for 1 year and our cooperation couldn't be smoother. Her direct and specific communication style makes our work ten times more efficient. Whenever she has problems or questions, she always let me know in a honest way, and is 100% respectful and responsive when it is the other way around. She is also very passionate, responsible and she has great work ethics. I really enjoyed working with her, and I wish her the best in the future!"
    }
  ];

  // Venue metrics: Semantic Web IF from the journal's 2024 JCR post; ISWC rank from CORE; CEUR-WS is Scopus-indexed.
  const publications = [
    {
      title: "External knowledge integration in large language models: A survey on methods, challenges, and future directions",
      venue: "Semantic Web journal (SAGE), vol. 17(4)",
      type: "Journal",
      year: "2026",
      url: "https://doi.org/10.1177/22104968261453132",
      metrics: [
        { label: "Impact factor 3.0", note: "Clarivate JCR, 2024 release", tone: "emerald" },
        { label: "Web of Science · Scopus", note: "indexed", tone: "sky" }
      ]
    },
    {
      title: "Where, How, and What to Ground: Evaluating Ontology-Guided LLM-based Knowledge Graph Construction",
      venue: "NLP4KGC Workshop at ISWC 2026, Bari, Italy",
      type: "Accepted",
      year: "2026",
      url: "https://5thnlp4kgc-code.github.io/5nlp4kgc/pages/accepted-papers.html",
      metrics: [
        { label: "ISWC: CORE rank A", note: "flagship Semantic Web conference", tone: "emerald" },
        { label: "To be presented in Bari", note: "25–27 Oct 2026", tone: "amber" }
      ]
    },
    {
      title: "Sequential Domain Adaptation on Heterogeneous Clinical Resources for Biomedical NER",
      venue: "17th SWAT4HCLS Conference 2026, Amsterdam",
      type: "Conference",
      year: "2026",
      url: "https://www.swat4ls.org/workshops/amsterdam2026/programme/accepted-submissions/#Sequential_Domain_Adaptation_on_Heterogeneous_Clinical_Resources_for_Biomedical_NER",
      metrics: [
        { label: "CEUR-WS proceedings", note: "Scopus-indexed series", tone: "sky" },
        { label: "Presented in Amsterdam", tone: "indigo" }
      ]
    },
    {
      title: "Implementing Semantic Technologies in Materials Science and Engineering",
      venue: "SeMatS Workshop at SEMANTiCS 2024, Amsterdam",
      type: "Workshop",
      year: "2024",
      url: "https://ceur-ws.org/Vol-3760/paper4.pdf",
      metrics: [
        { label: "CEUR-WS Vol-3760", note: "Scopus-indexed series", tone: "sky" }
      ]
    }
  ];

  const education = [
    {
      title: "MSc in Computational Linguistics",
      company: "University of Stuttgart",
      short: "MSc · Uni Stuttgart",
      period: "Apr 2021 – May 2023",
      location: "Stuttgart, Germany",
      domain: "Computational Linguistics · NLP",
      badge: "TU9 university",
      tags: ["NLP", "Speech Processing", "Entity Linking", "Transfer Learning", "Machine Translation"],
      highlights: [
        "Thesis: entity linking to Wikidata for a low-resource domain with transfer learning and domain adaptation, in industry at mine&make.",
        "Applied NLP: ethics and NLP, emotion analysis, machine translation.",
        "Speech processing: spoken language understanding and deep learning for speech.",
        "Core computational linguistics: parsing, context sensitivity and computational methods."
      ]
    },
    {
      title: "BTech in Electronics & Communication Engineering",
      company: "Jaypee University of Engineering and Technology",
      short: "BTech · JUET",
      period: "Aug 2012 – Aug 2016",
      location: "India",
      domain: "Electronics · Mathematics · Programming",
      tags: ["Signal Processing", "Probability", "Information Theory", "MATLAB", "UNIX"],
      highlights: [
        "Mathematics: probability theory, discrete mathematics and game theory.",
        "Signal processing: digital signal processing and information theory.",
        "Programming: object-oriented systems, UNIX and MATLAB."
      ]
    }
  ];

  // The page tells a story in chapters; each chapter can span several sections.
  const chapters = [
    { id: 'ikigai', num: '01', label: 'Ikigai', title: 'Why I do it', ids: ['ikigai', 'beliefs'], subs: [['ikigai', 'My Ikigai'], ['beliefs', 'What I believe']] },
    { id: 'how-i-work', num: '02', label: 'What I do', title: 'How I build', ids: ['how-i-work', 'focus', 'skills'], subs: [['how-i-work', 'Walkthrough'], ['focus', 'Core focus'], ['skills', 'Skills']] },
    { id: 'graph', num: '03', label: 'Knowledge graphs', title: 'Signature expertise', ids: ['graph', 'ontology'], subs: [['graph', 'Graph-based digital twin'], ['ontology', 'SDS ontology explorer']] },
    { id: 'experience', num: '04', label: 'Journey', title: 'Where I have been', ids: ['experience', 'leadership', 'projects'], subs: [['experience', 'Experience & education'], ['leadership', 'Leadership & mentoring'], ['projects', 'Projects']] },
    { id: 'impact', num: '05', label: 'Impact', title: 'Results and proof', ids: ['impact', 'recommendations', 'certifications'], subs: [['impact', 'Impact'], ['recommendations', 'Recommendations'], ['certifications', 'Certifications']] },
    { id: 'publications', num: '06', label: 'Research', title: 'Papers and talks', ids: ['publications', 'conferences'], subs: [['publications', 'Publications'], ['conferences', 'Conferences']] },
    { id: 'contact', num: '07', label: 'Contact', title: "Let's talk", ids: ['contact'] }
  ];
  const activeChapter = chapters.find((c) => c.ids.includes(activeSection))?.id;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const SectionHeading = ({ eyebrow, title, icon: Icon, chapter }) => (
    <div className="mb-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-2">
        {chapter && <span className="font-mono mr-2 text-indigo-400">Chapter {chapter} ·</span>}
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
        <Icon className="w-8 h-8 text-indigo-600" />
        {title}
      </h2>
    </div>
  );

  const NextStep = ({ href, eyebrow, label }) => (
    <div className="mt-10 flex justify-center">
      <a href={href} className="group inline-flex flex-col items-center gap-1 rounded-2xl border border-indigo-200 bg-white px-8 py-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{eyebrow}</span>
        <span className="inline-flex items-center gap-2 text-lg font-bold text-indigo-700">
          {label} <ArrowRight className="w-5 h-5 rotate-90 group-hover:translate-y-1 transition-transform" />
        </span>
      </a>
    </div>
  );

  const renderHero = () => (
    <header id="about" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.35),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(14,165,233,0.2),_transparent_55%)]" />
      <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-14">
        <div className="flex-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Open to Senior Applied AI roles
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">Itisha Yadav</h1>
        <p className="text-xl md:text-2xl text-slate-300 font-medium mb-6">
          Senior Applied AI Engineer · <span className="text-indigo-300">LLMs, Agentic AI, RAG & Knowledge Engineering</span>
        </p>
        <p className="text-2xl md:text-3xl font-semibold text-white mb-6">
          I turn data into{' '}
          <span key={wordIndex} className="inline-block bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-2 duration-500">
            {heroWords[wordIndex]}
          </span>
        </p>
        <p className="max-w-2xl text-lg text-slate-400 leading-relaxed mb-10">
          10 years shipping AI, NLP and LLM systems for MNCs, start-ups and research labs in India, Germany and the US.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 font-semibold text-white hover:bg-indigo-400 transition-colors">
            <Mail className="w-4 h-4" /> Get in touch
          </a>
          <a href="#ikigai" className="inline-flex items-center gap-2 rounded-lg border border-indigo-400/50 bg-indigo-500/10 px-5 py-3 font-semibold text-indigo-200 hover:bg-indigo-500/20 transition-colors">
            <Sparkles className="w-4 h-4" /> Start the story
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
        </div>
        <div className="flex-shrink-0 self-start md:self-center">
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 opacity-70 blur-sm" />
            <img
              src="/personal-photo/profile.jpg"
              alt="Itisha Yadav"
              className="relative w-36 h-36 md:w-56 md:h-56 rounded-full object-cover object-center border-4 border-slate-950"
            />
          </div>
        </div>
        </div>

        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Choose your path</p>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { href: '#how-i-work', who: 'Hiring for GenAI & agents?', go: 'See what I build' },
              { href: '#graph', who: 'Have a question?', go: 'Talk to my digital twin' },
              { href: '#impact', who: 'Want results?', go: 'See my impact' },
              { href: '#beliefs', who: 'Culture fit?', go: 'What I believe' },
              { href: '#experience', who: 'Short on time?', go: 'Jump to my journey' }
            ].map((path) => (
              <a key={path.href} href={path.href} className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-indigo-400/60 hover:bg-slate-900 transition-colors">
                <span className="block text-sm text-slate-400">{path.who}</span>
                <span className="mt-1 flex items-center gap-1.5 font-semibold text-white">
                  {path.go} <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 md:p-5">
              <div className="text-2xl md:text-4xl font-bold text-white">{stat.value}<span className="text-indigo-400">+</span></div>
              <div className="mt-1 text-xs md:text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
          <a href="https://zenodo.org/records/21511936" target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-slate-800 bg-slate-900/60 p-3 md:p-5 hover:border-emerald-400/50 transition-colors">
            <div className="flex items-center gap-2 text-2xl md:text-4xl font-bold text-white">
              <Github className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" /> OSS
            </div>
            <div className="mt-1 text-xs md:text-sm text-slate-400">
              Open-source contributor: code & an OWL ontology (CC BY 4.0)
              <ExternalLink className="inline w-3 h-3 ml-1 opacity-60 group-hover:opacity-100" />
            </div>
          </a>
        </div>
      </div>
    </header>
  );

  // Culture fit: what I believe about work in the AI era.
  const beliefs = [
    { icon: Heart, title: 'EQ is the skill that matters most', text: 'Emotional intelligence is what still sets us apart from machines, at least for now. I lead with it.' },
    { icon: Compass, title: 'Adapt early, use AI fully, stay ethical', text: 'The AI era rewards people who adapt soon and use AI to its maximum benefit, with ethical considerations built in from the start.' },
    { icon: Shuffle, title: 'Be agile across roles', text: 'Working with AI, and in the AI era, means being ready to shift between roles as the work demands.' },
    { icon: Target, title: 'Problems over titles', text: 'Data scientist, AI scientist, engineer, manager: labels matter less than understanding the real problem and solving it.' },
    { icon: Sparkle, title: 'The magic is in the solved problem', text: 'When the problem is truly solved, that is when the magic happens and the world sees it.' },
    { icon: HeartHandshake, title: 'Gratitude and empathy, above all', text: 'Be grateful for the work and the people around us, and have empathy for ourselves and for the people we work with.' }
  ];

  const renderBeliefs = () => (
    <section id="beliefs" className="max-w-6xl mx-auto px-4 pt-20">
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 border border-amber-100 p-6 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-600 mb-3">Culture fit · What I believe</p>
        <blockquote className="text-2xl md:text-4xl font-bold leading-tight text-slate-900 max-w-4xl mb-10">
          “The most important skill is <span className="bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text text-transparent">emotional intelligence</span>.
          It is what sets us apart from machines.”
        </blockquote>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beliefs.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="group rounded-2xl bg-white/80 backdrop-blur border border-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white flex items-center justify-center"><Icon className="w-5 h-5" /></span>
                <span className="font-mono text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderIkigai = () => (
    <section id="ikigai" className="max-w-6xl mx-auto px-4 pt-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-2"><span className="font-mono mr-2 text-indigo-400">Chapter 01 ·</span>Why I do it</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600" /> My Ikigai
        </h2>
        <p className="text-slate-600 text-lg max-w-3xl">
          Four things I do every day meet in one point: <strong className="text-slate-900">building trustworthy AI for natural language understanding</strong>,
          applied to knowledge-intensive NLP tasks: on confidential data that stays on-premises, and with public models I connect to via Ollama when the data allows.
        </p>
      </div>
      <Ikigai />
    </section>
  );

  const renderHowIWork = () => (
    <section id="how-i-work" className="max-w-6xl mx-auto px-4 pt-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-2"><span className="font-mono mr-2 text-indigo-400">Chapter 02 ·</span>What I do</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">From documents to answers</h2>
        <p className="text-slate-600 text-lg max-w-3xl">
          How NLP, LLMs, ontologies, knowledge graphs and agentic AI fit together in the systems I build. Click any step,
          or let it play. The example is illustrative, based on my work on chemical Safety Data Sheets.
        </p>
      </div>
      <PipelineDemo />
    </section>
  );

  const renderFocus = () => (
    <section id="focus" className="max-w-6xl mx-auto px-4 pt-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-1">Core focus</p>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Workflow className="w-6 h-6 text-indigo-600" /> What I focus on</h3>
        </div>
        <p className="hidden sm:block text-sm text-slate-500">Click a card to flip it</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {focusAreas.map(({ title, hook, description, tags, icon: Icon }) => (
          <FlipCard
            key={title}
            label={title}
            height="h-[21rem]"
            frontClass="bg-white border border-slate-200 text-slate-900 group-hover:border-indigo-300 group-hover:shadow-lg transition-shadow"
            backClass="bg-gradient-to-br from-indigo-600 to-violet-700 text-white"
            front={
              <>
                <span className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5"><Icon className="w-6 h-6" /></span>
                <h4 className="text-xl font-bold mb-2">{title}</h4>
                <p className="text-slate-600">{hook}</p>
              </>
            }
            back={
              <>
                <h4 className="font-bold mb-2 flex items-center gap-2"><Icon className="w-5 h-5" /> {title}</h4>
                <p className="text-sm text-indigo-50 leading-relaxed mb-4">{description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {tags.map((tag) => <span key={tag} className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-semibold">{tag}</span>)}
                </div>
              </>
            }
          />
        ))}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section id="skills" className="max-w-6xl mx-auto px-4 pt-16 pb-4">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-1">Toolbox</p>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Code className="w-6 h-6 text-indigo-600" /> Core skills</h3>
        </div>
        <p className="hidden sm:block text-sm text-slate-500">Flip a card to see every skill</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {skillCategories.map(({ category, icon: Icon, skills, highlight }) => (
          <FlipCard
            key={category}
            label={category}
            height="h-[25rem]"
            frontClass={`border text-slate-900 transition-shadow group-hover:shadow-lg ${highlight ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200' : 'bg-white border-slate-200 group-hover:border-indigo-300'}`}
            backClass="bg-slate-900 text-white"
            front={
              <>
                <div className="flex items-start justify-between mb-4">
                  <span className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center"><Icon className="w-5 h-5" /></span>
                  {highlight && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">Focus</span>}
                </div>
                <h4 className="text-lg font-bold leading-snug mb-1">{category}</h4>
                <p className="text-sm text-slate-500 mb-3">{skills.length} skills</p>
                <p className="text-sm text-slate-600 line-clamp-2">{skills.slice(0, 3).join(' · ')}</p>
              </>
            }
            back={
              <>
                <h4 className="font-bold mb-3 flex items-center gap-2 text-indigo-300"><Icon className="w-4 h-4" /> {category}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => <span key={skill} className="rounded-md bg-white/10 px-2 py-1 text-xs text-slate-100 ring-1 ring-white/10">{skill}</span>)}
                </div>
              </>
            }
          />
        ))}
      </div>
    </section>
  );

  const renderExperience = () => (
    <section id="experience" className="max-w-6xl mx-auto px-4 py-20">
      <SectionHeading eyebrow="The journey" title="Experience" icon={Briefcase} chapter="04" />
      <ExperienceSlides experiences={experiences} />

      <div className="mt-14">
        <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-indigo-600" /> Education
        </h3>
        <ExperienceSlides experiences={education} pointsLabel="What I studied" label="Education" itemNoun="degree" />
      </div>
    </section>
  );

  // Leadership signals from my CV. Supervised theses appear here once their elib links are added.
  const leadership = [
    { icon: Mortarboard, title: "Supervised 4 master's theses", text: "Guided master's students from research question to results, on agentic AI and LLM-based information extraction, with German partner universities." },
    { icon: Crown, title: 'Co-architect and core code reviewer', text: "Shape the system design, coding standards and best practices of my group's LLM-based information extraction and knowledge graph platform, together with the team." },
    { icon: UserCheck, title: 'Mentor to junior developers', text: 'Coach developers and students through real projects, code reviews and reusable engineering patterns.' },
    { icon: ClipboardCheck, title: 'Raise the quality bar', text: 'Helped establish benchmark datasets, LLM-as-judge and error analysis as the way LLM systems are measured in the group.' },
    { icon: Presentation, title: 'Bridge to business and partners', text: 'Work with business users, project partners and leadership to turn requirements into reliable, secure AI solutions.' }
  ];

  // Master's theses I supervised (titles only; full records on elib).
  const theses = [
    { title: 'Agentic Architectures for Semantic Information Extraction from Semi-Structured Documents', university: 'Ernst-Abbe-Hochschule Jena', year: '2026', url: 'https://elib.dlr.de/225894/' },
    { title: 'Leveraging LLMs and Ontologies for Information Extraction in the Chemistry Domain', university: 'University of Passau', year: '2026', url: 'https://elib.dlr.de/223825/' },
    { title: 'Knowledge Graph-based Engineering Decision Making: A Natural Language Interface for Accessing Manufacturability Data', university: 'TU Berlin', year: '2024', url: 'https://elib.dlr.de/211813/' },
    { title: 'Automatic Prompt Generator Guided by Ontology for Information Extraction from Semi-Structured Documents', university: 'University of Passau', year: '2024', url: 'https://elib.dlr.de/211814/' }
  ];

  const renderLeadership = () => (
    <section id="leadership" className="max-w-6xl mx-auto px-4 pt-16">
      <div className="rounded-3xl bg-slate-950 text-white p-6 md:p-10 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.3),_transparent_60%)]" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300 mb-2">Leadership & mentoring</p>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Leading people, not only models</h3>
          <p className="text-slate-300 max-w-3xl mb-8">Seniority is measured by the people and standards you leave behind. Mine: theses supervised, engineers mentored, and the design and quality bar for an LLM platform.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {leadership.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className={`rounded-2xl p-5 ring-1 transition-colors ${i === 0 ? 'bg-indigo-600/90 ring-indigo-400 lg:col-span-2' : 'bg-white/5 ring-white/10 hover:bg-white/10'}`}>
                <Icon className={`w-6 h-6 mb-3 ${i === 0 ? 'text-white' : 'text-indigo-300'}`} />
                <h4 className={`font-bold mb-1.5 ${i === 0 ? 'text-xl' : ''}`}>{title}</h4>
                <p className={`text-sm leading-relaxed ${i === 0 ? 'text-indigo-50' : 'text-slate-300'}`}>{text}</p>
              </div>
            ))}
          </div>
          {theses.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-300 mb-3">Master's theses I supervised · on elib</p>
              <div className="grid md:grid-cols-2 gap-3">
                {theses.map((t) => (
                  <a key={t.title} href={t.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/10">
                    <span>
                      <span className="block font-semibold leading-snug">{t.title}</span>
                      <span className="block text-xs text-slate-400 mt-1">{[t.student, t.university, t.year].filter(Boolean).join(' · ')}</span>
                    </span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const renderProjects = () => (
    <section id="projects" className="bg-white border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <SectionHeading eyebrow="Built & shipped" title="Projects" icon={Layers} />
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all"
            >
              <span className="self-start text-xs font-semibold uppercase tracking-wide text-indigo-700 bg-indigo-100 rounded-full px-2.5 py-1 mb-4">{project.label}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{project.name}</h3>
              <p className="text-slate-600 leading-relaxed mb-5 flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700">{tech}</span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                {project.cta.includes('demo') ? <MousePointer className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                {project.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );

  const renderGraph = () => (
    <section id="graph" className="max-w-6xl mx-auto px-4 pt-20">
      <SectionHeading eyebrow="Signature expertise" title="Explore my graph-based digital twin" icon={Network} chapter="03" />
      <p className="text-lg text-slate-700 leading-relaxed max-w-3xl -mt-4 mb-8">
        This whole portfolio, built as a knowledge graph: my career, industries, research and skills, connected and grounded in a small ontology.
        Ask my digital twin a question and watch the graph answer. It is the same approach I use to turn a company's documents into
        reliable, explainable AI.
      </p>
      <PortfolioGraph />
    </section>
  );

  const renderOntology = () => (
    <section id="ontology" className="max-w-6xl mx-auto px-4 py-20">
      <SectionHeading eyebrow="Signature expertise" title="Ontology & Knowledge Engineering" icon={Network} />
      <div className="grid lg:grid-cols-5 gap-8 mb-10">
        <div className="lg:col-span-3">
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            I work with OWL ontologies and use them to make LLMs and AI agents reliable: the ontology tells the model <strong>what to extract</strong>,
            grounds every entity to a defined class, and <strong>validates</strong> each generated triple before it reaches the knowledge graph.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Below is the <strong>Safety Data Sheet (SDS) Ontology</strong> I contributed to, live. Browse its class hierarchy and relations, then watch it catch
            errors in an LLM agent's output. It is aligned with <strong>ChEBI</strong>, the EU <strong>ORIONT</strong> ontology and <strong>PROV-O</strong>,
            and every class carries an example pattern that doubles as a few-shot prompt.
          </p>
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              [ontologyStats.classes, 'Classes'],
              [ontologyStats.objectProperties, 'Object properties'],
              [ontologyStats.datatypeProperties, 'Datatype properties'],
              [ontologyStats.triples.toLocaleString('en'), 'RDF triples']
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-2xl font-bold text-indigo-600">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['OWL 2', 'RDF / Turtle', 'SPARQL', 'Domain / range validation', 'Reasoning', 'OOPS! pitfall scan', 'LLM grounding', 'Agentic KG construction'].map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">{tag}</span>
            ))}
          </div>
          <a href="https://zenodo.org/records/21511936" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            Open-source code and ontology on Zenodo (CC BY 4.0) <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      <OntologyExplorer />
      <p className="mt-3 text-xs text-slate-500">Explorer generated from sds_document_ontology v{ontologyVersion}.</p>
      <NextStep href="#experience" eyebrow="Chapter 04" label="The journey so far" />
    </section>
  );

  const renderRecommendations = () => recommendations.length > 0 && (
    <section id="recommendations" className="bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300 mb-2">What colleagues say</p>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Quote className="w-8 h-8 text-indigo-400" /> Recommendations
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {[['🇩🇪', 'Germany'], ['🇮🇳', 'India'], ['🇺🇸', 'United States']].map(([flag, country]) => (
              <span key={country} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">{flag} {country}</span>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <figure key={rec.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-7 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-indigo-500/70" />
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">{rec.flag} {rec.country}</span>
              </div>
              <blockquote className="flex-1 mb-6 text-slate-200 leading-relaxed">“{rec.text}”</blockquote>
              <figcaption className="flex items-center gap-3 border-t border-slate-800 pt-4">
                <span className="w-11 h-11 flex-shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 blur-[2px]" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="font-semibold text-white blur-[5px] select-none" aria-label="Name hidden for privacy">Hidden Name</div>
                  <div className="text-sm text-slate-400">{rec.title}</div>
                  <div className="text-xs text-indigo-300 mt-0.5">{rec.relationship} · {rec.date}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-500">Recommender names are hidden for privacy. Originals are on my LinkedIn profile.</p>
        <a href={`${LINKEDIN_URL}details/recommendations/`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 font-semibold">
          See all on LinkedIn <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </section>
  );

  const METRIC_TONES = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200'
  };

  const renderPublications = () => (
    <section id="publications" className="max-w-6xl mx-auto px-4 py-20">
      <SectionHeading eyebrow="Research" title="Publications & Talks" icon={BookOpen} chapter="06" />
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          ['IF 3.0', 'Semantic Web journal (Web of Science & Scopus)'],
          ['CORE A', 'ISWC, the flagship Semantic Web conference'],
          ['4', 'peer-reviewed papers, incl. 1 accepted at ISWC 2026']
        ].map(([value, label]) => (
          <div key={value} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-indigo-600">{value}</div>
            <div className="text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>
      <PaperPeek />
      <details className="group mt-10 rounded-2xl border border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-slate-900 hover:text-indigo-700">
          <span>All publications with venue metrics ({publications.length})</span>
          <ChevronRight className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-90" />
        </summary>
        <div className="px-5 pb-5">
        <div className="space-y-4">
          {publications.map((pub) => (
            <a
              key={pub.title}
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col md:flex-row md:items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex md:flex-col items-center md:items-start gap-2 w-24 flex-shrink-0">
                <span className="text-sm font-bold text-indigo-600">{pub.year}</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{pub.type}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">{pub.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{pub.venue}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pub.metrics.map((m) => (
                    <span key={m.label} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${METRIC_TONES[m.tone]}`}>
                      {m.label}
                      {m.note && <span className="font-normal opacity-75">· {m.note}</span>}
                    </span>
                  ))}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Metrics: journal impact factor from Clarivate JCR (2024 release); conference rank from the CORE portal. Workshop papers are peer-reviewed
          and presented at the host conference; the CORE rank refers to the host conference. The ISWC 2026 paper is accepted and will be presented in Bari, 25–27 Oct 2026.
        </p>
        </div>
      </details>
    </section>
  );

  const renderContact = () => (
    <section id="contact" className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's build reliable AI products together</h2>
        <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">
          Open to Senior Applied AI Engineer, LLM Engineer and AI Architect roles.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors">
            <Mail className="w-4 h-4" /> {EMAIL}
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold hover:bg-white/10 transition-colors">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold hover:bg-white/10 transition-colors">
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-indigo-100">
          <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +49 1520 8828056</span>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/85 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <a href="#about" className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap text-white font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm">IY</span>
            Itisha Yadav
          </a>
          <div className="hidden lg:flex items-center gap-0.5">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="relative group/nav">
                <a
                  href={`#${chapter.id}`}
                  className={`flex items-center gap-1 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeChapter === chapter.id ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="mr-0.5 font-mono text-[11px] text-indigo-400">{chapter.num}</span>{chapter.label}
                  {chapter.subs && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </a>
                {chapter.subs && (
                  <div className="invisible opacity-0 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100 transition-opacity absolute left-0 top-full pt-2">
                    <div className="min-w-48 rounded-xl border border-slate-800 bg-slate-950 p-1.5 shadow-xl">
                      {chapter.subs.map(([id, label]) => (
                        <a key={id} href={`#${id}`} className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm ${activeSection === id ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="lg:hidden text-slate-200" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 grid sm:grid-cols-2 gap-1 max-h-[75vh] overflow-y-auto">
            {chapters.map((chapter) => (
              <a key={chapter.id} href={`#${chapter.id}`} onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">
                <span className="mr-2 font-mono text-xs text-indigo-400">{chapter.num}</span>{chapter.label}
                <span className="block text-xs text-slate-500 ml-7">{chapter.title}</span>
                {chapter.subs && (
                  <span className="mt-1 ml-7 flex flex-wrap gap-1">
                    {chapter.subs.map(([id, label]) => (
                      <a key={id} href={`#${id}`} onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-200 hover:bg-slate-700">{label}</a>
                    ))}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
      </nav>

      <aside aria-label="Chapters" className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {chapters.map((chapter) => {
          const on = activeChapter === chapter.id;
          return (
            <a key={chapter.id} href={`#${chapter.id}`} className="group flex items-center justify-end gap-2" aria-label={`Chapter ${chapter.num}: ${chapter.label}`}>
              <span className={`rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow transition-opacity ${on ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {chapter.num} · {chapter.label}
              </span>
              <span className={`block rounded-full transition-all ${on ? 'w-3 h-3 bg-indigo-600 ring-4 ring-indigo-200' : 'w-2.5 h-2.5 bg-slate-300 group-hover:bg-indigo-400'}`} />
            </a>
          );
        })}
      </aside>

      {renderHero()}
      <LogoBand />
      {renderIkigai()}
      {renderBeliefs()}
      <div className="max-w-6xl mx-auto px-4"><NextStep href="#how-i-work" eyebrow="Chapter 02" label="See what I do" /></div>
      {renderHowIWork()}
      {renderFocus()}
      {renderSkills()}
      <div className="max-w-6xl mx-auto px-4"><NextStep href="#graph" eyebrow="Chapter 03" label="My signature expertise: knowledge graphs" /></div>
      {renderGraph()}
      {renderOntology()}
      {renderExperience()}
      {renderLeadership()}
      {renderProjects()}
      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-4"><NextStep href="#impact" eyebrow="Chapter 05" label="The impact it had" /></div>
      <Impact />
      {renderRecommendations()}
      <Certifications />
      <div className="max-w-6xl mx-auto px-4 -mt-10 pb-6"><NextStep href="#publications" eyebrow="Chapter 06" label="Research and talks" /></div>
      {renderPublications()}
      <Conferences />
      {renderContact()}

      <footer className="bg-slate-950 text-slate-500 text-sm text-center py-6">
        © {new Date().getFullYear()} Itisha Yadav · Senior Applied AI Engineer
      </footer>
    </div>
  );
};

export default Portfolio;
