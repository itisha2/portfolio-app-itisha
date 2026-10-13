// "Digital twin": answers questions in first person, grounded only in the portfolio knowledge graph.
// Runs fully in the browser: entity linking + intent detection over the graph, no LLM call, no data leaves the page.
import { NODES, EDGES, PROPERTIES } from './portfolioGraph';

const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));
const name = (id) => BY_ID[id].label;
const lower = (label) => (label === 'LegalTech' ? 'legal tech' : label.toLowerCase());
const list = (items) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);
const out = (s, p) => EDGES.filter((e) => e.s === s && (!p || [].concat(p).includes(e.p)));
const inc = (o, p) => EDGES.filter((e) => e.o === o && (!p || [].concat(p).includes(e.p)));

const EMAIL = 'itishayadav80@gmail.com';

// Extra words people use for things in the graph.
const ALIASES = {
  dlr: ['dlr', 'german aerospace', 'aerospace center'],
  fsti: ['steinbeis', 'fsti'],
  minemake: ['mine&make', 'mine and make', 'minemake'],
  instant: ['instant systems', 'instant'],
  optum: ['optum', 'unitedhealth', 'united health'],
  casemine: ['casemine', 'gauge'],
  cognizant: ['cognizant'],
  factorlab: ['factorlab', 'factor lab'],
  stuttgart: ['stuttgart', 'tu9'],
  juet: ['juet', 'jaypee', 'bachelor', 'btech'],
  langgraph: ['langgraph', 'lang graph'],
  mcp: ['mcp', 'model context protocol'],
  graphrag: ['rag', 'graphrag', 'retrieval'],
  owl: ['ontology', 'ontologies', 'owl', 'semantic web'],
  neo4j: ['neo4j', 'graph database'],
  lora: ['lora', 'fine-tun', 'finetun'],
  paddleocr: ['paddleocr', 'ocr', 'pdf', 'document understanding', 'document ai'],
  ollama: ['ollama', 'self-host', 'open-weight', 'local model'],
  bert: ['bert'],
  elasticsearch: ['elasticsearch', 'semantic search'],
  entitylinking: ['entity linking', 'wikidata'],
  'sa-agents': ['agentic ai', 'ai agent', 'agents', 'agentic'],
  'sa-sdlc': ['agentic sdlc', 'sdlc', 'coding agent'],
  'sa-ke': ['knowledge graph', 'knowledge engineering', 'kg'],
  'sa-llm': ['llm', 'large language model', 'generative ai', 'genai'],
  'sa-ml': ['machine learning', 'nlp', 'deep learning'],
  'sa-ops': ['mlops', 'llmops', 'deployment', 'production'],
  'sa-rai': ['responsible ai', 'evaluation', 'hallucination', 'guardrail'],
  'sa-lead': ['leadership', 'mentor', 'lead a team', 'manage'],
  'sds-onto': ['sds ontology', 'safety data sheet'],
  healthcare: ['healthcare', 'health', 'medical', 'clinical', 'biomedical'],
  legaltech: ['legal', 'law'],
  manufacturing: ['manufacturing', 'industry 4.0'],
  safety: ['safety'],
  aerospace: ['aerospace', 'space'],
  materials: ['materials', 'material science'],
  'th-agentic': ['agentic architecture', 'agentic ie thesis', 'agentic information extraction'],
  'th-chem': ['chemistry thesis', 'chemistry domain', 'information extraction in chemistry'],
  'th-kgnl': ['manufacturability', 'natural language interface', 'text-to-sparql', 'text to sparql'],
  'th-prompt': ['prompt generator', 'prompt generation', 'automatic prompt']
};

const escapeRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Matches at a word start, so "owl" does not fire inside "knowledge" or "rag" inside "storage".
const mentions = (q, w) => new RegExp(`(^|[^a-z0-9])${escapeRe(w)}`).test(q);

const linkEntities = (q) => {
  const found = [];
  NODES.forEach((n) => {
    if (n.id === 'me') return;
    const words = [n.label, n.short, ...(ALIASES[n.id] || [])].filter(Boolean).map((w) => w.toLowerCase().trim());
    if (words.some((w) => w.length >= 2 && mentions(q, w))) found.push(n.id);
  });
  return found;
};

const triple = (e) => `kg:${e.s} kg:${e.p} kg:${e.o}`;

const orgAnswer = (id) => {
  const n = BY_ID[id];
  const role = n.props?.role ? `I worked as ${n.props.role}${n.props.period ? ` (${n.props.period})` : ''}.` : 'I have worked with them.';
  const doms = out(id, 'inDomain').map((e) => name(e.o));
  const techs = out(id, 'usesTechnique').map((e) => name(e.o));
  const current = EDGES.some((e) => e.s === 'me' && e.p === 'worksFor' && e.o === id);
  const text = [
    `At ${n.label}, ${current ? `I currently work as ${n.props.role} (${n.props.period}).` : role}`,
    doms.length ? `The work was in ${list(doms.map(lower))}.` : '',
    techs.length ? `Techniques I used there: ${list(techs)}.` : ''
  ].filter(Boolean).join(' ');
  const ev = [...EDGES.filter((e) => e.s === 'me' && e.o === id), ...out(id)];
  return { text, nodes: ['me', id, ...ev.map((e) => e.o)], evidence: ev, section: n.section };
};

const topicAnswer = (id) => {
  const n = BY_ID[id];
  if (['ResearchInstitute', 'Company'].includes(n.type)) return orgAnswer(id);
  const usedAt = inc(id, 'usesTechnique').map((e) => e.s);
  const papers = inc(id, 'about').filter((e) => e.s.startsWith('pub-')).map((e) => e.s);
  const projects = inc(id, 'about').filter((e) => BY_ID[e.s].type === 'Project').map((e) => e.s);
  const thesesOn = inc(id, 'about').filter((e) => BY_ID[e.s].type === 'Thesis').map((e) => e.s);
  const area = out(id, 'partOf').map((e) => e.o);
  const parts = inc(id, 'partOf').map((e) => e.s);
  const certs = inc(id, 'supports').map((e) => e.s);
  const orgsInDomain = inc(id, 'inDomain').filter((e) => !e.s.startsWith('pub-') && BY_ID[e.s].type !== 'Project').map((e) => e.s);
  const sentences = [];
  if (n.type === 'Domain') {
    sentences.push(orgsInDomain.length ? `I have worked in ${n.label.toLowerCase()} at ${list(orgsInDomain.map(name))}.` : `${n.label} is one of the domains in my work.`);
    const p = inc(id, 'inDomain').filter((e) => e.s.startsWith('pub-')).map((e) => e.s);
    if (p.length) sentences.push(`I have also published on it: ${list(p.map((x) => `"${name(x)}"`))}.`);
  } else if (n.type === 'SkillArea') {
    sentences.push(`${n.label} is one of my core skill areas.`);
    if (parts.length) sentences.push(`It includes ${list(parts.map(name))}, which I have used at ${list([...new Set(parts.flatMap((t) => inc(t, 'usesTechnique').map((e) => name(e.s))))])}.`);
    if (certs.length) sentences.push(`It is backed by my ${list(certs.map(name))} certificate${certs.length > 1 ? 's' : ''}.`);
  } else if (n.type === 'University') {
    const rel = EDGES.find((e) => e.s === 'me' && e.o === id);
    sentences.push(rel?.p === 'alumniOf' ? `I studied at ${n.label}: ${n.props.degree}${n.props.note ? ` (${n.props.note})` : ''}.` : `I collaborate with ${n.label} on joint research and master's theses.`);
  } else if (n.type === 'Thesis') {
    const uni = out(id, 'atUniversity').map((e) => name(e.o));
    sentences.push(`I supervised the master's thesis "${n.label}"${uni.length ? ` with ${list(uni)}` : ''} (${n.props.year}). You can find it on ${n.props.elib}.`);
  } else if (n.type === 'Project') {
    const where = out(id, 'developedAt').map((e) => name(e.o));
    const topics = out(id, 'about').map((e) => name(e.o));
    const contributed = EDGES.some((e) => e.s === 'me' && e.p === 'contributedTo' && e.o === id);
    sentences.push(contributed
      ? `I contributed to the ${n.label}${where.length ? ` at ${list(where)}` : ''}.`
      : `I built ${n.label} as a side project${n.props?.kind ? ` (${n.props.kind})` : ''}. You can try the live demo in the projects section.`);
    if (topics.length) sentences.push(`It is about ${list(topics)}${n.props?.license ? `, released as open source under ${n.props.license}` : ''}.`);
    if (id === 'sds-onto') sentences.push('It helps LLMs extract facts from chemical Safety Data Sheets and checks every extracted fact against the ontology. You can explore it live in the ontology section.');
  } else {
    if (usedAt.length) sentences.push(`I use ${n.label} at ${list(usedAt.map(name))}.`);
    if (area.length) sentences.push(`It is part of my ${list(area.map(name))} skills.`);
    if (papers.length) sentences.push(`My research on it: ${list(papers.map((x) => `"${name(x)}"`))}.`);
    if (projects.length) sentences.push(`I also contributed to the ${list(projects.map(name))}, which is built around it.`);
    if (thesesOn.length) sentences.push(`And I supervised master's theses on it: ${list(thesesOn.map((x) => `"${name(x)}"`))}.`);
    if (!sentences.length) sentences.push(`${n.label} is part of my work; you can find it in the ${n.section} section.`);
  }
  // For skill areas, also bring in where its techniques were used.
  const usage = n.type === 'SkillArea' ? parts.flatMap((t) => inc(t, 'usesTechnique')) : [];
  const ev = [...inc(id), ...out(id), ...usage];
  return { text: sentences.join(' '), nodes: [id, ...ev.map((e) => e.s), ...ev.map((e) => e.o)], evidence: ev, section: n.section };
};

// Typical recruiter and hiring-manager questions. Logistics I don't publish are never guessed.
const RECRUITER_INTENTS = [
  {
    test: /\b(ship|shipping|fast|faster|quick|quickly|speed|deliver|delivery|time.to.market|productiv|velocity|agentic sdlc|sdlc)/,
    answer: () => ({
      text: "I ship faster by sharing the work with AI. Following an agentic SDLC, I delegate well-scoped tasks to coding agents (specs, implementation, tests, first-pass reviews), and then I stay the human in the loop: I review every change carefully, test it and decide what goes to production. The agents bring speed; careful review keeps the quality and safety a team needs to trust what ships.",
      section: 'skills',
      nodes: ['me', 'sa-sdlc', 'sa-agents', 'sa-ops', 'sa-rai'],
      evidence: EDGES.filter((e) => e.s === 'me' && ['sa-sdlc', 'sa-agents', 'sa-ops', 'sa-rai'].includes(e.o))
    })
  },
  {
    test: /(bring to the table|what (can|do|would) you bring|value (do|can) you (add|bring)|why should (we|i|they) hire|why hire|why (are )?you|what makes you (different|unique|special|stand out)|stand out|differentiat|unique about you)/,
    answer: () => ({
      text: "Every team's needs are different, so I would really like to hear yours first. What I can offer is ten years of putting AI into real use, a deep grounding in ontologies and knowledge graphs that help LLMs stay accurate, hands-on work with AI agents, and experience with confidential data. And I try to bring gratitude, empathy and a focus on the real problem, not the job title.",
      section: 'impact',
      nodes: ['me', 'sa-ke', 'sa-agents', 'sa-llm', 'sa-ops', 'owl', 'dlr'],
      evidence: EDGES.filter((e) => e.s === 'me' && ['sa-ke', 'sa-agents', 'sa-llm', 'sa-ops'].includes(e.o))
    })
  },
  {
    test: /(achievement|proud|accomplish|biggest win|success stor|best work|highlight of your)/,
    answer: () => ({
      text: "The work that has meant the most to me, all done with wonderful colleagues: helping shape our LLM and knowledge graph platform at DLR as one of its architects and code reviewers; contributing to open-source code and an ontology so others can ground and validate LLM output too; writing four peer-reviewed papers, including a survey in the Semantic Web journal and a paper accepted at ISWC 2026; and helping a Silicon Valley incubator bring three start-up products to life.",
      section: 'impact',
      nodes: ['me', 'dlr', 'sds-onto', 'pub-swj', 'v-swj', 'pub-iswc', 'v-iswc', 'pub-swat', 'pub-semats', 'instant'],
      evidence: [...EDGES.filter((e) => e.s === 'me' && ['dlr', 'sds-onto', 'pub-swj', 'pub-iswc', 'instant'].includes(e.o)), ...out('pub-swj', 'publishedIn'), ...out('pub-iswc', 'publishedIn')]
    })
  },
  {
    test: /(how many years|years of experience|how long have you|how experienced|seniority level)/,
    answer: () => ({
      text: 'Ten years in industry: I started in 2016 at Cognizant and have since worked across data science, NLP and LLM engineering in India, Germany and for US clients, today at the German Aerospace Center (DLR).',
      section: 'experience',
      nodes: ['me', 'cognizant', 'dlr'],
      evidence: out('me', ['worksFor', 'workedAt']).filter((e) => ['dlr', 'cognizant'].includes(e.o))
    })
  },
  {
    test: /\b(languages?|speak|german|english)\b/,
    answer: (q) => ({
      text: /programming|coding|code/.test(q)
        ? 'Mainly Python, plus SQL, Java, C/C++ and Bash, and React and Node.js for the web, like this site.'
        : 'I speak English fluently; it is my professional working language. I also speak some German (A1). For programming: mainly Python, plus SQL, Java and C/C++.',
      section: 'skills',
      nodes: ['me'],
      evidence: []
    })
  },
  {
    test: /(notice period|start date|when can you start|availability to start|salary|compensation|pay|relocat|remote|hybrid|on-?site|visa|work permit|sponsorship|location)/,
    answer: () => ({
      text: `Things like start date, location, compensation and work authorisation really depend on your role and situation, so it would be fairer to talk them through together than for me to guess here. Please write to me at ${EMAIL} or on LinkedIn; I'll be glad to answer.`,
      section: 'contact',
      nodes: ['me'],
      evidence: []
    })
  },
  {
    test: /(stakeholder|non-?technical|business (people|users|side)|communicat|explain (complex|technical)|work with (managers|clients|customers))/,
    answer: () => ({
      text: "I start by listening. Business users, partners and leaders know the real problem best, so I try to understand it in their words, then translate it into an AI solution, explain the trade-offs in plain language, and share results early so we can decide together.",
      section: 'leadership',
      nodes: ['me', 'sa-lead', 'dlr'],
      evidence: EDGES.filter((e) => e.s === 'me' && ['sa-lead', 'dlr'].includes(e.o))
    })
  },
  {
    test: /(what (kind of |type of )?(role|team|company|job|position)|looking for|ideal (role|job|team|company)|next role|career goal|where do you see)/,
    answer: () => ({
      text: "I'm hoping to find a Senior Applied AI Engineer, LLM Engineer or AI Architect role, in a team that solves real problems with LLMs, agents and knowledge graphs, keeps learning, and values gratitude and empathy as much as technical skill.",
      section: 'contact',
      nodes: ['me', 'sa-llm', 'sa-agents', 'sa-ke'],
      evidence: EDGES.filter((e) => e.s === 'me' && ['sa-llm', 'sa-agents', 'sa-ke'].includes(e.o))
    })
  }
];

const INTENTS = [
  {
    test: /\b(lead|leader|leadership|supervis|mentor|senior|manage|thesis|theses|students?|coach)/,
    answer: () => ({
      text: "I've had the privilege of supervising 4 master's theses with German partner universities: agentic architectures for semantic information extraction (EAH Jena), LLMs and ontologies for information extraction in chemistry and ontology-guided prompt generation (both University of Passau), and a natural-language interface to knowledge graphs (TU Berlin). I learned as much from the students as they did from me. In my group I'm one of the architects and code reviewers of our LLM and knowledge graph platform, I help shape our coding and evaluation standards with the team, and I enjoy mentoring junior developers.",
      section: 'leadership',
      nodes: ['me', 'sa-lead', 'th-agentic', 'th-chem', 'th-kgnl', 'th-prompt', 'passau', 'tuberlin', 'eahjena'],
      evidence: [...EDGES.filter((e) => (e.s === 'me' && (e.o === 'sa-lead' || e.p === 'supervised')) || e.p === 'atUniversity')]
    })
  },
  {
    test: /\b(believe|belief|values?|culture|cultural|fit|eq|emotional|empathy|gratitude|grateful|ethic|work style|team ?player|principles?|personality)/,
    answer: () => ({
      text: 'I believe the most important skill is emotional intelligence; it is what still sets us apart from machines. In the AI era we have to adapt early and use AI to its full benefit, with ethics built in, and be agile enough to shift between roles. Titles like data scientist, engineer or manager matter less than understanding the real problem and solving it; that is when the magic happens. Above all: gratitude for the work and the people around us, and empathy for ourselves and our colleagues.',
      section: 'beliefs',
      nodes: ['me', 'sa-lead', 'sa-rai'],
      evidence: EDGES.filter((e) => e.s === 'me' && ['sa-lead', 'sa-rai'].includes(e.o))
    })
  },
  {
    test: /\b(why|motivat|passion|soul|ikigai|drives? you|care about|purpose)\b/,
    answer: () => ({
      text: "My ikigai is building trustworthy AI for natural language understanding. I find real joy in turning messy, knowledge-intensive documents into knowledge people can use, in helping LLMs stay accurate by grounding them in ontologies and knowledge graphs, and in building agents that take on real work while people stay in control. I also care that it is safe for confidential data, so it can run on-premises when needed.",
      section: 'ikigai',
      nodes: ['me', 'sa-ke', 'sa-llm', 'sa-agents', 'sa-sdlc', 'owl', 'ollama'],
      evidence: EDGES.filter((e) => e.s === 'me' && e.p === 'hasExpertise')
    })
  },
  {
    test: /\b(hire|hiring|available|availability|open to|contact|reach|email|role you|looking for|join)\b/,
    answer: () => ({
      text: `Yes, I'm open to Senior Applied AI Engineer, LLM Engineer and AI Architect roles. I'd be happy to hear what you are working on: you can reach me at ${EMAIL} or on LinkedIn, or use the "Get in touch" button at the top or bottom of this page.`,
      section: 'contact',
      nodes: ['me'],
      evidence: []
    })
  },
  {
    test: /\b(privacy|private|confidential|on-?prem|gdpr|secure|security|sensitive)\b/,
    answer: () => ({
      text: "I understand how important this is. For confidential data I use self-hosted, quantized open-weights models on-premises (Ollama, llama.cpp, SGLang, TGI), so the data stays inside the organisation. For non-sensitive work I can connect to larger public models through Ollama. I've learned these practices in regulated settings at DLR and Optum.",
      section: 'ikigai',
      nodes: ['me', 'ollama', 'sa-ops', 'dlr', 'optum'],
      evidence: [...out('dlr', 'usesTechnique').filter((e) => e.o === 'ollama'), ...EDGES.filter((e) => e.s === 'me' && ['dlr', 'optum'].includes(e.o))]
    })
  },
  {
    test: /\b(paper|papers|publication|publish|research|article|journal|conference)\b/,
    answer: () => {
      const pubs = out('me', 'authored').map((e) => e.o);
      const lines = pubs.map((p) => {
        const venue = out(p, 'publishedIn').map((e) => name(e.o))[0];
        const status = BY_ID[p].props?.status;
        return `"${name(p)}" (${venue}${status && status !== 'Published' ? `, ${status.replace('Accepted · ', 'accepted, to be presented in ')}` : ''})`;
      });
      return { section: 'publications', text: `I have ${pubs.length} peer-reviewed papers: ${list(lines)}.`, nodes: ['me', ...pubs, ...pubs.flatMap((p) => out(p, 'publishedIn').map((e) => e.o))], evidence: [...out('me', 'authored'), ...pubs.flatMap((p) => out(p, 'publishedIn'))] };
    }
  },
  {
    test: /\b(certif|course|coursera|credential)/,
    answer: () => {
      const certs = out('me', 'holds').map((e) => e.o);
      return { section: 'certifications', text: `I hold ${list(certs.map((c) => `${name(c)} (${BY_ID[c].props.issuer}, ${BY_ID[c].props.year})`))}.`, nodes: ['me', ...certs], evidence: out('me', 'holds') };
    }
  },
  {
    test: /\b(study|studied|education|degree|master|msc|university|universities|uni)\b/,
    answer: () => {
      const alma = out('me', 'alumniOf').map((e) => e.o);
      const partners = out('me', 'collaboratesWith').map((e) => e.o);
      return {
        section: 'experience',
        text: `I studied at ${list(alma.map((u) => `${name(u)} (${BY_ID[u].props.degree}${BY_ID[u].props.note ? `, a ${BY_ID[u].props.note}` : ''})`))}. Today I collaborate with ${list(partners.map(name))} on joint research and master's theses.`,
        nodes: ['me', ...alma, ...partners],
        evidence: [...out('me', 'alumniOf'), ...out('me', 'collaboratesWith')]
      };
    }
  },
  {
    test: /\b(industr|domain|sector|field)/,
    answer: () => {
      const orgs = out('me', ['worksFor', 'workedAt', 'workedWith']).map((e) => e.o);
      const doms = [...new Set(orgs.flatMap((o) => out(o, 'inDomain').map((e) => e.o)))];
      return { section: 'domains', text: `I have worked in ${list(doms.map((d) => lower(name(d))))}, from aerospace research at DLR to healthcare at Optum and legal tech at CaseMine.`, nodes: ['me', ...orgs, ...doms], evidence: orgs.flatMap((o) => out(o, 'inDomain')) };
    }
  },
  {
    test: /\b(experience|career|worked|work history|companies|jobs?|background)\b/,
    answer: () => {
      const cur = out('me', 'worksFor').map((e) => e.o)[0];
      const past = out('me', 'workedAt').map((e) => e.o);
      return {
        section: 'experience',
        text: `I currently work at ${name(cur)} as ${BY_ID[cur].props.role}. Before that: ${list(past.map((o) => `${BY_ID[o].props.role} at ${BY_ID[o].short || name(o)}`))}. Ten years across India, Germany and US clients.`,
        nodes: ['me', cur, ...past],
        evidence: out('me', ['worksFor', 'workedAt'])
      };
    }
  },
  {
    test: /\b(skills?|good at|strength|expertise|tech stack|tools)\b/,
    answer: () => {
      const areas = out('me', 'hasExpertise').map((e) => e.o);
      return { section: 'skills', text: `My core skill areas are ${list(areas.map(name))}. Where I can usually help most is with ontologies and knowledge graphs that keep LLMs and agents accurate and explainable.`, nodes: ['me', ...areas], evidence: out('me', 'hasExpertise') };
    }
  },
  {
    test: /\b(who are you|about you|introduce|summary|tell me about yourself|who is)\b/,
    answer: () => ({
      text: "I'm Itisha Yadav, a Senior Applied AI Engineer. For ten years I've worked on AI, NLP and LLM systems with MNCs, start-ups and research labs in India, Germany and the US. Today I work on LLM-based knowledge graphs and agentic AI at the German Aerospace Center (DLR).",
      section: 'about',
      nodes: ['me', 'dlr', 'sa-llm', 'sa-agents', 'sa-ke'],
      evidence: out('me', 'worksFor')
    })
  }
];

export const SUGGESTION_GROUPS = [
  {
    group: 'Recruiter questions',
    items: ['What do you bring to the table?', 'How do you ship fast?', 'What is your biggest achievement?', 'Have you led or mentored people?', 'What role are you looking for?', 'What languages do you speak?', 'When can you start?']
  },
  {
    group: 'About my work',
    items: ['Why do you do what you do?', 'Which domains have you worked in?', 'What is your education?', 'Where have you built AI agents?', 'How do you handle confidential data?', 'What do you believe in at work?', 'Tell me about your research']
  }
];
export const SUGGESTIONS = SUGGESTION_GROUPS.flatMap((g) => g.items);

export const askTwin = (question) => {
  const q = ` ${question.toLowerCase()} `;
  const entities = linkEntities(q);
  // Specific entities win over generic intents ("agents", "healthcare", "DLR"),
  // except for questions that are clearly about motivation, contact or privacy.
  const thesis = entities.find((e) => BY_ID[e].type === 'Thesis');
  if (thesis) { const a = topicAnswer(thesis); return { ...a, nodes: [...new Set(a.nodes)], grounded: true }; }
  const recruiter = RECRUITER_INTENTS.find((i) => i.test.test(q));
  if (recruiter) return { ...recruiter.answer(q), grounded: true };
  const priority = INTENTS.slice(0, 5).find((i) => i.test.test(q));
  if (priority) return { ...priority.answer(), grounded: true };
  if (entities.length) {
    // The most specific thing mentioned wins: a project or company before a technique, a technique before a skill area.
    const RANK = { Project: 0, Publication: 0, Thesis: 0, ResearchInstitute: 1, Company: 1, University: 1, Credential: 1, Venue: 1, Technique: 2, Domain: 2, SkillArea: 3 };
    const best = entities.sort((a, b) => RANK[BY_ID[a].type] - RANK[BY_ID[b].type])[0];
    const ans = topicAnswer(best);
    return { ...ans, nodes: [...new Set(ans.nodes)], evidence: ans.evidence.slice(0, 8), grounded: true };
  }
  const intent = INTENTS.slice(5).find((i) => i.test.test(q));
  if (intent) return { ...intent.answer(), grounded: true };
  return {
    text: `I'm sorry, that isn't in my knowledge graph, and I'd rather not guess. You're very welcome to ask Itisha directly at ${EMAIL}, or try asking about my experience, research, skills, industries, how I handle confidential data, or why I do this work.`,
    section: 'contact',
    nodes: ['me'],
    evidence: [],
    grounded: false
  };
};

export const formatTriple = triple;
export const propertyLabel = (p) => PROPERTIES[p]?.label || p;
