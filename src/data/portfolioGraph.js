// This portfolio as a knowledge graph: a small ontology (classes + properties) and the facts on this site.

export const BASE = 'https://portfolio-app-itisha.vercel.app/kg#';

// Classes, aligned to schema.org where a close match exists.
export const CLASSES = {
  Person: { label: 'Person', color: '#6366f1', schema: 'schema:Person' },
  ResearchInstitute: { label: 'Research institute', color: '#10b981', schema: 'schema:ResearchOrganization' },
  Company: { label: 'Company', color: '#0ea5e9', schema: 'schema:Corporation' },
  University: { label: 'University', color: '#8b5cf6', schema: 'schema:CollegeOrUniversity' },
  Domain: { label: 'Domain', color: '#f43f5e', schema: 'schema:DefinedTerm' },
  SkillArea: { label: 'Skill area', color: '#f59e0b', schema: 'schema:DefinedTermSet' },
  Technique: { label: 'Technique', color: '#eab308', schema: 'schema:DefinedTerm' },
  Publication: { label: 'Publication', color: '#14b8a6', schema: 'schema:ScholarlyArticle' },
  Venue: { label: 'Venue', color: '#06b6d4', schema: 'schema:Event' },
  Project: { label: 'Project', color: '#a855f7', schema: 'schema:CreativeWork' },
  Credential: { label: 'Certificate', color: '#64748b', schema: 'schema:EducationalOccupationalCredential' },
  Thesis: { label: "Supervised thesis", color: '#ec4899', schema: 'schema:Thesis' }
};

// Object properties with domain and range, so the graph can be validated like any ontology.
export const PROPERTIES = {
  worksFor: { label: 'works for', domain: 'Person', range: ['ResearchInstitute', 'Company'], schema: 'schema:worksFor' },
  workedAt: { label: 'worked at', domain: 'Person', range: ['ResearchInstitute', 'Company'] },
  workedWith: { label: 'worked with', domain: 'Person', range: ['Company'] },
  alumniOf: { label: 'alumni of', domain: 'Person', range: ['University'], schema: 'schema:alumniOf' },
  collaboratesWith: { label: 'collaborates with', domain: 'Person', range: ['University'] },
  hasExpertise: { label: 'has expertise in', domain: 'Person', range: ['SkillArea'], schema: 'schema:knowsAbout' },
  authored: { label: 'authored', domain: 'Person', range: ['Publication'] },
  created: { label: 'created', domain: 'Person', range: ['Project'] },
  contributedTo: { label: 'contributed to', domain: 'Person', range: ['Project'] },
  holds: { label: 'holds', domain: 'Person', range: ['Credential'], schema: 'schema:hasCredential' },
  inDomain: { label: 'in domain', domain: ['ResearchInstitute', 'Company', 'Publication', 'Project', 'Thesis'], range: ['Domain'] },
  usesTechnique: { label: 'uses technique', domain: ['ResearchInstitute', 'Company'], range: ['Technique'] },
  partOf: { label: 'part of', domain: 'Technique', range: ['SkillArea'] },
  publishedIn: { label: 'published in', domain: 'Publication', range: ['Venue'] },
  about: { label: 'about', domain: ['Publication', 'Project', 'Thesis'], range: ['Technique'], schema: 'schema:about' },
  developedAt: { label: 'developed at', domain: 'Project', range: ['ResearchInstitute'] },
  supports: { label: 'supports', domain: 'Credential', range: ['SkillArea'] },
  supervised: { label: 'supervised', domain: 'Person', range: ['Thesis'] },
  atUniversity: { label: 'at university', domain: 'Thesis', range: ['University'] }
};

// section: where the node is shown in detail on the page.
export const NODES = [
  { id: 'me', label: 'Itisha Yadav', type: 'Person', section: 'about', props: { title: 'Senior Applied AI Engineer', focus: 'LLMs, agentic AI, knowledge graphs' } },

  { id: 'dlr', label: 'German Aerospace Center (DLR)', short: 'DLR', type: 'ResearchInstitute', section: 'experience', props: { role: 'Research Scientist & AI Developer', period: '2023 – now' } },
  { id: 'fsti', label: 'Ferdinand-Steinbeis-Institut', short: 'FSTI', type: 'ResearchInstitute', section: 'experience', props: { role: 'Research Assistant & AI Developer', period: '2021 – 2022' } },
  { id: 'minemake', label: 'mine&make', type: 'Company', section: 'experience', props: { role: 'Research Assistant & AI Developer', period: '2022 – 2023' } },
  { id: 'instant', label: 'Instant Systems', type: 'Company', section: 'experience', props: { role: 'Data Scientist', period: '2019 – 2021' } },
  { id: 'factorlab', label: 'FactorLab', type: 'Company', section: 'domains', props: { kind: 'Start-up' } },
  { id: 'optum', label: 'Optum (UnitedHealth Group)', short: 'Optum', type: 'Company', section: 'experience', props: { role: 'Associate Data Scientist', period: '2019' } },
  { id: 'casemine', label: 'CaseMine (Gauge Data Solutions)', short: 'CaseMine', type: 'Company', section: 'experience', props: { role: 'Data Analyst', period: '2018 – 2019' } },
  { id: 'cognizant', label: 'Cognizant', type: 'Company', section: 'experience', props: { role: 'Programmer Analyst', period: '2016 – 2018' } },

  { id: 'stuttgart', label: 'University of Stuttgart', short: 'Uni Stuttgart', type: 'University', section: 'experience', props: { degree: 'MSc Computational Linguistics', note: 'TU9 university' } },
  { id: 'juet', label: 'Jaypee University (JUET)', short: 'JUET', type: 'University', section: 'experience', props: { degree: 'BTech Electronics & Communication' } },
  { id: 'bamberg', label: 'Universität Bamberg', short: 'Bamberg', type: 'University', section: 'domains', props: { relation: 'Research collaboration' } },
  { id: 'passau', label: 'Universität Passau', short: 'Passau', type: 'University', section: 'domains', props: { relation: 'Research collaboration' } },
  { id: 'tuberlin', label: 'TU Berlin', type: 'University', section: 'domains', props: { relation: 'Research collaboration' } },
  { id: 'eahjena', label: 'Ernst-Abbe-Hochschule Jena', short: 'EAH Jena', type: 'University', section: 'domains', props: { relation: 'Research collaboration' } },

  { id: 'healthcare', label: 'Healthcare', type: 'Domain', section: 'domains' },
  { id: 'legaltech', label: 'LegalTech', type: 'Domain', section: 'domains' },
  { id: 'manufacturing', label: 'Manufacturing', type: 'Domain', section: 'domains' },
  { id: 'safety', label: 'Safety', type: 'Domain', section: 'domains' },
  { id: 'aerospace', label: 'Aerospace', type: 'Domain', section: 'domains' },
  { id: 'materials', label: 'Materials science', type: 'Domain', section: 'domains' },

  { id: 'sa-sdlc', label: 'Agentic SDLC', type: 'SkillArea', section: 'skills' },
  { id: 'sa-agents', label: 'Agentic AI', type: 'SkillArea', section: 'skills' },
  { id: 'sa-llm', label: 'LLMs & Generative AI', short: 'LLMs & GenAI', type: 'SkillArea', section: 'skills' },
  { id: 'sa-ke', label: 'RAG & Knowledge Engineering', short: 'RAG & KE', type: 'SkillArea', section: 'skills' },
  { id: 'sa-ml', label: 'ML & NLP', type: 'SkillArea', section: 'skills' },
  { id: 'sa-ops', label: 'Engineering & MLOps', short: 'MLOps', type: 'SkillArea', section: 'skills' },
  { id: 'sa-rai', label: 'Evaluation & Responsible AI', short: 'Responsible AI', type: 'SkillArea', section: 'skills' },
  { id: 'sa-lead', label: 'Leadership', type: 'SkillArea', section: 'skills' },

  { id: 'langgraph', label: 'LangGraph', type: 'Technique', section: 'how-i-work' },
  { id: 'mcp', label: 'Model Context Protocol', short: 'MCP', type: 'Technique', section: 'how-i-work' },
  { id: 'graphrag', label: 'RAG / GraphRAG', type: 'Technique', section: 'how-i-work' },
  { id: 'owl', label: 'OWL ontologies', type: 'Technique', section: 'ontology' },
  { id: 'neo4j', label: 'Neo4j', type: 'Technique', section: 'skills' },
  { id: 'lora', label: 'LoRA fine-tuning', type: 'Technique', section: 'skills' },
  { id: 'paddleocr', label: 'PaddleOCR', type: 'Technique', section: 'how-i-work' },
  { id: 'ollama', label: 'Ollama', type: 'Technique', section: 'ikigai' },
  { id: 'bert', label: 'BERT', type: 'Technique', section: 'skills' },
  { id: 'elasticsearch', label: 'Elasticsearch', type: 'Technique', section: 'skills' },
  { id: 'entitylinking', label: 'Entity linking', type: 'Technique', section: 'skills' },

  { id: 'pub-swj', label: 'External Knowledge Integration in LLMs (survey)', short: 'LLM knowledge survey', type: 'Publication', section: 'publications', props: { year: '2026', status: 'Published' } },
  { id: 'pub-iswc', label: 'Where, How, and What to Ground', short: 'Where, How, What to Ground', type: 'Publication', section: 'publications', props: { year: '2026', status: 'Accepted · Bari, 25–27 Oct 2026' } },
  { id: 'pub-swat', label: 'Sequential Domain Adaptation for Biomedical NER', short: 'Biomedical NER', type: 'Publication', section: 'publications', props: { year: '2026', status: 'Published' } },
  { id: 'pub-semats', label: 'Semantic Technologies in Materials Science', short: 'Semantic tech in MSE', type: 'Publication', section: 'publications', props: { year: '2024', status: 'Published' } },

  { id: 'v-swj', label: 'Semantic Web journal', type: 'Venue', section: 'publications', props: { impactFactor: '3.0', indexing: 'Web of Science, Scopus' } },
  { id: 'v-iswc', label: 'ISWC 2026', type: 'Venue', section: 'conferences', props: { coreRank: 'A', location: 'Bari, Italy' } },
  { id: 'v-swat', label: 'SWAT4HCLS 2026', type: 'Venue', section: 'conferences', props: { location: 'Amsterdam', proceedings: 'CEUR-WS' } },
  { id: 'v-semantics', label: 'SEMANTiCS 2024', type: 'Venue', section: 'publications', props: { location: 'Amsterdam', proceedings: 'CEUR-WS Vol-3760' } },

  { id: 'sds-onto', label: 'SDS Ontology', type: 'Project', section: 'ontology', props: { license: 'CC BY 4.0', classes: '92' } },
  { id: 'upagu', label: 'Upagu', type: 'Project', section: 'projects', props: { kind: 'AI personal assistant' } },
  { id: 'krishi', label: 'Krishi-App', type: 'Project', section: 'projects', props: { kind: 'AgTech' } },

  { id: 'c-neo4j', label: 'Building Knowledge Graphs with LLMs', short: 'Neo4j KG + LLMs', type: 'Credential', section: 'certifications', props: { issuer: 'Neo4j GraphAcademy', year: '2025' } },
  { id: 'c-dl', label: 'Deep Learning Specialization', short: 'Deep Learning Spec.', type: 'Credential', section: 'certifications', props: { issuer: 'DeepLearning.AI', year: '2018' } },
  { id: 'c-nlptf', label: 'NLP in TensorFlow', type: 'Credential', section: 'certifications', props: { issuer: 'DeepLearning.AI', year: '2019' } },
  { id: 'c-ml', label: 'Machine Learning (Stanford)', short: 'ML (Stanford)', type: 'Credential', section: 'certifications', props: { issuer: 'Stanford Online', year: '2016' } },

  { id: 'th-agentic', label: 'Agentic Architectures for Semantic Information Extraction from Semi-Structured Documents', short: 'Agentic IE (thesis)', type: 'Thesis', section: 'leadership', props: { year: '2026', elib: 'elib.dlr.de/225894' } },
  { id: 'th-chem', label: 'Leveraging LLMs and ontologies for information extraction in the chemistry domain', short: 'LLM + ontology IE (thesis)', type: 'Thesis', section: 'leadership', props: { year: '2026', elib: 'elib.dlr.de/223825' } },
  { id: 'th-kgnl', label: 'Knowledge Graph-based Engineering Decision Making: A Natural Language Interface for Accessing Manufacturability Data', short: 'KG language interface (thesis)', type: 'Thesis', section: 'leadership', props: { year: '2024', elib: 'elib.dlr.de/211813' } },
  { id: 'th-prompt', label: 'Automatic Prompt Generator Guided by Ontology for Information Extraction from Semi Structured Documents', short: 'Prompt generator (thesis)', type: 'Thesis', section: 'leadership', props: { year: '2024', elib: 'elib.dlr.de/211814' } }
];

const t = (s, p, o) => ({ s, p, o });

export const EDGES = [
  t('me', 'worksFor', 'dlr'),
  ...['fsti', 'minemake', 'instant', 'optum', 'casemine', 'cognizant'].map((o) => t('me', 'workedAt', o)),
  t('me', 'workedWith', 'factorlab'),
  t('me', 'alumniOf', 'stuttgart'), t('me', 'alumniOf', 'juet'),
  ...['bamberg', 'passau', 'tuberlin', 'eahjena'].map((o) => t('me', 'collaboratesWith', o)),
  ...['sa-sdlc', 'sa-agents', 'sa-llm', 'sa-ke', 'sa-ml', 'sa-ops', 'sa-rai', 'sa-lead'].map((o) => t('me', 'hasExpertise', o)),
  ...['pub-swj', 'pub-iswc', 'pub-swat', 'pub-semats'].map((o) => t('me', 'authored', o)),
  t('me', 'contributedTo', 'sds-onto'),
  ...['upagu', 'krishi'].map((o) => t('me', 'created', o)),
  ...['c-neo4j', 'c-dl', 'c-nlptf', 'c-ml'].map((o) => t('me', 'holds', o)),

  t('dlr', 'inDomain', 'aerospace'), t('dlr', 'inDomain', 'manufacturing'), t('dlr', 'inDomain', 'materials'),
  t('fsti', 'inDomain', 'manufacturing'), t('minemake', 'inDomain', 'manufacturing'),
  t('instant', 'inDomain', 'safety'), t('factorlab', 'inDomain', 'safety'),
  t('optum', 'inDomain', 'healthcare'), t('cognizant', 'inDomain', 'healthcare'), t('casemine', 'inDomain', 'legaltech'),

  ...['langgraph', 'mcp', 'graphrag', 'owl', 'neo4j', 'lora', 'paddleocr', 'ollama'].map((o) => t('dlr', 'usesTechnique', o)),
  t('fsti', 'usesTechnique', 'elasticsearch'), t('minemake', 'usesTechnique', 'entitylinking'), t('instant', 'usesTechnique', 'bert'),

  t('langgraph', 'partOf', 'sa-agents'), t('mcp', 'partOf', 'sa-agents'), t('graphrag', 'partOf', 'sa-ke'), t('owl', 'partOf', 'sa-ke'),
  t('neo4j', 'partOf', 'sa-ke'), t('elasticsearch', 'partOf', 'sa-ke'), t('lora', 'partOf', 'sa-llm'), t('paddleocr', 'partOf', 'sa-ml'),
  t('bert', 'partOf', 'sa-ml'), t('entitylinking', 'partOf', 'sa-ml'), t('ollama', 'partOf', 'sa-ops'),

  t('pub-swj', 'publishedIn', 'v-swj'), t('pub-iswc', 'publishedIn', 'v-iswc'), t('pub-swat', 'publishedIn', 'v-swat'), t('pub-semats', 'publishedIn', 'v-semantics'),
  t('pub-swj', 'about', 'graphrag'), t('pub-iswc', 'about', 'owl'), t('pub-semats', 'about', 'owl'),
  t('pub-swat', 'inDomain', 'healthcare'), t('pub-semats', 'inDomain', 'materials'),

  t('sds-onto', 'developedAt', 'dlr'), t('sds-onto', 'about', 'owl'), t('sds-onto', 'inDomain', 'safety'),

  ...['th-agentic', 'th-chem', 'th-kgnl', 'th-prompt'].map((o) => t('me', 'supervised', o)),
  t('th-agentic', 'atUniversity', 'eahjena'), t('th-chem', 'atUniversity', 'passau'), t('th-kgnl', 'atUniversity', 'tuberlin'), t('th-prompt', 'atUniversity', 'passau'),
  t('th-chem', 'about', 'owl'), t('th-prompt', 'about', 'owl'), t('th-kgnl', 'inDomain', 'manufacturing'),

  t('c-neo4j', 'supports', 'sa-ke'), t('c-dl', 'supports', 'sa-ml'), t('c-nlptf', 'supports', 'sa-ml'), t('c-ml', 'supports', 'sa-ml')
];

// Questions a visitor can ask; each returns the nodes it highlights.
export const QUERIES = [
  {
    q: 'Where have I built AI agents?',
    sparql: 'SELECT ?org WHERE {\n  ?org kg:usesTechnique kg:langgraph .\n}',
    run: (edges) => ['langgraph', ...edges.filter((e) => e.p === 'usesTechnique' && e.o === 'langgraph').map((e) => e.s)]
  },
  {
    q: 'Which industries have I worked in?',
    sparql: 'SELECT ?org ?domain WHERE {\n  kg:me kg:worksFor|kg:workedAt|kg:workedWith ?org .\n  ?org kg:inDomain ?domain .\n}',
    run: (edges) => {
      const orgs = edges.filter((e) => e.s === 'me' && ['worksFor', 'workedAt', 'workedWith'].includes(e.p)).map((e) => e.o);
      return ['me', ...orgs, ...edges.filter((e) => orgs.includes(e.s) && e.p === 'inDomain').map((e) => e.o)];
    }
  },
  {
    q: 'Which of my research is about ontologies?',
    sparql: 'SELECT ?paper ?venue WHERE {\n  ?paper kg:about kg:owl ;\n         kg:publishedIn ?venue .\n}',
    run: (edges) => {
      const papers = edges.filter((e) => e.p === 'about' && e.o === 'owl' && e.s.startsWith('pub-')).map((e) => e.s);
      return ['owl', ...papers, ...edges.filter((e) => papers.includes(e.s) && e.p === 'publishedIn').map((e) => e.o)];
    }
  },
  {
    q: 'What backs my knowledge-graph expertise?',
    sparql: 'SELECT ?x WHERE {\n  { ?x kg:partOf kg:sa-ke }\n  UNION { ?x kg:supports kg:sa-ke }\n}',
    run: (edges) => ['sa-ke', ...edges.filter((e) => e.o === 'sa-ke' && ['partOf', 'supports'].includes(e.p)).map((e) => e.s)]
  },
  {
    q: 'Which universities am I connected to?',
    sparql: 'SELECT ?uni ?relation WHERE {\n  kg:me ?relation ?uni .\n  ?uni a kg:University .\n}',
    run: (edges) => ['me', ...edges.filter((e) => e.s === 'me' && ['alumniOf', 'collaboratesWith'].includes(e.p)).map((e) => e.o)]
  }
];
