import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Linkedin, Brain, Database, Code, BookOpen, Award, Briefcase, GraduationCap, ChevronRight, Calendar, ExternalLink, Building, Zap, Globe, Cpu, Layers, Activity, Sparkles, Target, Microscope, MousePointer } from 'lucide-react';
import './App.css';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [isVisible, setIsVisible] = useState(false);
  const [animatedSkills, setAnimatedSkills] = useState(new Set());
  const [hoveredProject, setHoveredProject] = useState(null);
  const [timelineAnimation, setTimelineAnimation] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setTimelineAnimation(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const tabConfig = [
    { id: 'about', label: 'About', icon: User },
    { id: 'research', label: 'Research', icon: Microscope },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'publications', label: 'Publications', icon: BookOpen }
  ];

  const affiliations = [
    {
      institution: "German Aerospace Center (DLR)",
      role: "Research Scientist",
      location: "Jena, Germany",
      description: "Institute of Data Science, German Aerospace Center (DLR), Jena, Germany",
      website: "https://www.dlr.de/en",
      logo: "🚀"
    },
    {
      institution: "University of Bamberg",
      role: "Doctoral Researcher",
      location: "Bamberg, Germany", 
      description: "Fundamentals of Natural Language Processing",
      supervisor: "Prof. Dr. Roman Klinger",
      website: "https://www.uni-bamberg.de/en/nlproc/",
      logo: "🎓"
    }
  ];

  const researchInterests = [
    {
      title: "Ontology-Guided Constraint Decoding in LLMs for Knowledge Graph Construction",
      description: "Developing sophisticated methodologies that leverage domain-specific ontologies to guide Large Language Models in generating semantically accurate and structurally consistent knowledge graphs. This approach ensures that LLM outputs adhere to predefined semantic constraints while maintaining high-quality information extraction from diverse data sources.",
      icon: <Brain className="w-6 h-6" />,
      color: "blue",
      keywords: ["LLMs", "Ontologies", "Constraint Decoding", "Knowledge Graph Construction", "Semantic Accuracy"]
    },
    {
      title: "Domain-Agnostic Information Extraction",
      description: "Creating universal methodologies for extracting structured information from semi-structured data across various domains, enabling scalable applications in aerospace, material science and other scientific domains.",
      icon: <Database className="w-6 h-6" />,
      color: "green", 
      keywords: ["Information Extraction", "Domain Adaptation", "PDF-to-RDF", "Cross-Domain Transfer"]
    },
    {
      title: "Semantic Web & NLP Integration",
      description: "Combining semantic web technologies with natural language processing for privacy-aware and interpretable AI systems that maintain data sovereignty while enabling advanced reasoning capabilities.",
      icon: <Globe className="w-6 h-6" />,
      color: "purple",
      keywords: ["Semantic Web", "RDF", "Wikidata", "Privacy-Aware AI", "Interpretable AI"]
    },
    {
      title: "Visual Language Models for Document Parsing",
      description: "Exploring advanced Visual Language Models for parsing complex document layouts, semantic table interpretation, and multi-modal information extraction from scientific and technical documents.",
      icon: <Layers className="w-6 h-6" />,
      color: "orange",
      keywords: ["VLMs", "Document Parsing", "Table Interpretation", "Multi-modal AI", "Layout Analysis"]
    }
  ];

  const experiences = [
    {
      title: "Research Scientist",
      company: "German Space Agency (DLR)",
      location: "Jena, Germany",
      period: "08/2023 – Present",
      domain: "Aerospace",
      description: "Doctoral Researcher at University of Bamberg, Bavaria, Germany",
      highlights: [
        "Information extraction pipeline and Knowledge graph creation using LLMs and Ontologies",
        "Working on external knowledge integration in LLMs for natural language understanding (NLU)",
        "Implemented a Retrieval-Augmented Generation (RAG) system; currently working on GraphRAG",
        "Exploring Visual Language Models (VLMs) for parsing complex document layouts",
        "Successfully supervised 3 master's thesis"
      ],
      icon: "🚀"
    },
    {
      title: "Computational Linguist",
      company: "FactorLab Inc",
      location: "Remote",
      period: "05/2023 – 08/2023",
      domain: "Safety",
      highlights: [
        "Integration of LLMs and LangChain for Retrieval Augmented Generation (RAG)",
        "Text-to-SQL using RAG",
        "Training and Inference code development for decoder-only models like Falcon-40B",
        "LLMOps: deployment of Falcon-40B on AWS Sagemaker with 4 seconds inference time"
      ],
      icon: "🛡️"
    },
    {
      title: "Master Thesis Student and Werkstudium",
      company: "mine&make GmbH",
      location: "Stuttgart, Germany",
      period: "08/2022 – 04/2023",
      domain: "Manufacturing",
      highlights: [
        "Entity linking to wikidata using domain adaptation for low-resource domains",
        "Integration of coreference resolution model to information extraction pipeline",
        "Resolving semantic and syntactic ambiguity using syntactic parser and AMR graphs"
      ],
      icon: "🏭"
    },
    {
      title: "Research Assistance (Werkstudium)",
      company: "Ferdinand-Steinbeis-Institut",
      location: "Stuttgart, Germany",
      period: "10/2021 – 07/2022",
      domain: "Data-driven",
      highlights: [
        "Recommendation engine using knowledge graphs",
        "Crawled 50k documents and performed elasticsearch setup",
        "Designed and deployed nearest neighbor finder with 70% accuracy NER system"
      ],
      icon: "📊"
    },
    {
      title: "Data Scientist",
      company: "Instant Systems Inc",
      location: "India",
      period: "09/2019 – 10/2021",
      domain: "Safety",
      highlights: [
        "Topic classification using BERT with 82% accuracy",
        "Incidents prediction using multi-task learning",
        "Video Recommendation System using clustering and PCA",
        "Named entity recognition for US procurement documents"
      ],
      icon: "🔍"
    },
    {
      title: "Associate Data Scientist",
      company: "UnitedHealth Group (Optum)",
      location: "India",
      period: "07/2019 – 08/2019",
      domain: "Healthcare",
      highlights: [
        "Falls prediction in elderly population using US medical claims data",
        "Applied multiple ML algorithms including random forest, xgboost"
      ],
      icon: "🏥"
    },
    {
      title: "Data Analyst",
      company: "Gauge Data Solutions (CaseMine)",
      location: "India",
      period: "03/2018 – 06/2019",
      domain: "Law",
      highlights: [
        "Search Engine Optimization using NER systems",
        "Document linking using vector space models and LSA"
      ],
      icon: "⚖️"
    },
    {
      title: "Programmer Analyst",
      company: "Cognizant Technology Solutions",
      location: "India",
      period: "11/2016 – 02/2018",
      domain: "Healthcare",
      highlights: [
        "ETL platform migration from SAS to Hadoop",
        "Data validation using Spark in agile framework"
      ],
      icon: "💻"
    }
  ];

  const education = [
    {
      degree: "PhD in Computational Linguistics",
      institution: "University of Bamberg",
      location: "Bamberg, Germany",
      period: "2024-ongoing",
      focus: "Constraint-decoding in LLMs using Ontologies",
      details: [
        "Converting semi-structured data from PDF to Knowledge graphs (pdf-to-RDF)",
        "Methods of integrating external knowledge into LLMs",
        "Structured generation in open source and small LLMs",
        "Visual language models for PDF parsing (VLMs)"
      ]
    },
    {
      degree: "MSc Computational Linguistics",
      institution: "University of Stuttgart",
      location: "Stuttgart, Germany",
      period: "04/2021 – 05/2023",
      focus: "Speech Processing & Applied NLP",
      details: [
        "Speech Processing: Spoken language understanding, deep learning for speech",
        "Applied NLP: Ethics and NLP, emotion analysis, machine translation",
        "Core Linguistics: Parsing, context sensitivity, computational methods"
      ]
    },
    {
      degree: "BTech Electronics & Communication",
      institution: "Jaypee University of Engineering and Technology",
      location: "India",
      period: "08/2012 – 08/2016",
      focus: "Electronics & Mathematics Foundation",
      details: [
        "Mathematics: Probability theory, discrete mathematics, game theory",
        "Signal Processing: Digital signal processing, information theory",
        "Programming: Object-oriented systems, UNIX, MATLAB"
      ]
    }
  ];

  const skillCategories = [
    {
      category: "Large Language Models & AI",
      icon: <Brain className="w-6 h-6" />,
      skills: [
        { name: "LLMs & RAG", level: "high", description: "GPT, BERT, Falcon-40B, GraphRAG" },
        { name: "Deep Learning", level: "high", description: "Neural Networks, Transformers" },
        { name: "NLP", level: "high", description: "Entity Recognition, Sentiment Analysis" },
        { name: "Knowledge Graphs", level: "medium", description: "RDF, Ontologies, Wikidata" }
      ]
    },
    {
      category: "Programming & Development",
      icon: <Code className="w-6 h-6" />,
      skills: [
        { name: "Python", level: "high", description: "Primary programming language" },
        { name: "Java", level: "medium", description: "Object-oriented development" },
        { name: "JavaScript", level: "medium", description: "Web development" },
        { name: "MATLAB", level: "medium", description: "Scientific computing" }
      ]
    },
    {
      category: "Databases & Infrastructure",
      icon: <Database className="w-6 h-6" />,
      skills: [
        { name: "SQL", level: "medium", description: "Relational databases" },
        { name: "MongoDB", level: "medium", description: "NoSQL databases" },
        { name: "Elasticsearch", level: "medium", description: "Search and analytics" },
        { name: "AWS", level: "high", description: "SageMaker, EC2, Lambda" }
      ]
    },
    {
      category: "Research & Analytics",
      icon: <Activity className="w-6 h-6" />,
      skills: [
        { name: "MLOps", level: "high", description: "Model deployment & monitoring" },
        { name: "Data Science", level: "high", description: "Statistical analysis, visualization" },
        { name: "Research", level: "high", description: "Academic research, publications" },
        { name: "Agile", level: "high", description: "Project management" }
      ]
    }
  ];

  const projects = [
    {
      name: "Upagu",
      description: "AI-powered personal assistant application focusing on natural language understanding and user interaction optimization.",
      status: "Seeking External Funding",
      technologies: ["Python", "React", "Natural Language Processing", "Speech Processing", "Emotional AI", "Afftective Computing"],
      category: "Matchmaking",
      fundingNote: "Looking for external investors to scale this innovative AI assistant platform.",
      interactive: true,
      url: "https://upagu.vercel.app/"
    },
    {
      name: "Krishi-App", 
      description: "Agricultural technology application leveraging AI for crop monitoring, yield prediction, and farming optimization.",
      status: "Seeking External Funding",
      technologies: ["Computer Vision", "IoT", "Machine Learning", "Natural Language Processing", "Mobile App"],
      category: "AgTech",
      fundingNote: "Seeking investment to bring AI-driven agricultural solutions to farmers worldwide.",
      interactive: true,
      url: "https://krishi-app-zhd6.vercel.app/"
    },
    {
      name: "Yug3DAI Projects",
      description: "AI and 3D printing convergence projects developed with co-founder Siddharth Yadav, focusing on innovative manufacturing solutions.",
      status: "Active Development",
      technologies: ["3D Printing", "AI", "Robotics", "Automation"],
      category: "AI + 3D Printing",
      fundingNote: "Yug3DAI is a company focusing on merging AI with 3D printing technologies for next-generation manufacturing.",
      interactive: true,
      url: "https://yug3dai.com/"
    }
  ];

  const publications = [
    {
      title: "Implementing Semantic Technologies in Materials Science and Engineering",
      authors: "Dembska, Marta, et al.",
      venue: "Proceedings of the First International Workshop on Semantic Materials Science (SeMatS 2024)",
      year: "2024",
      url: "https://ceur-ws.org/Vol-3760/paper4.pdf"
    },
    {
      title: "External knowledge integration in large language models: A survey on methods, challenges, and future directions",
      authors: "Yadav, I., Schindler, S., Peters, D., & Klinger, R.",
      venue: "arXiv preprint arXiv:2403.11181",
      year: "2024",
      url: "https://www.semantic-web-journal.net/system/files/swj3835.pdf"
    }
  ];

  const renderAbout = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Itisha Yadav</h1>
            <p className="text-xl text-gray-600 mb-4">Computational Linguist & NLP Researcher</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Stuttgart, Germany</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+49 1520 8828056</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>itishayadav80@gmail.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Linkedin className="w-4 h-4" />
                <a href="https://www.linkedin.com/in/itisha-yadav-90395513a/" className="text-blue-600 hover:underline">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Description */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Brain className="w-6 h-6 mr-2 text-blue-600" />
          Professional Profile
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          <strong>Itisha Yadav</strong> is a <strong>Research Scientist at the German Aerospace Center (DLR)</strong>, 
          and <strong>Doctoral Researcher at the University of Bamberg, Germany</strong>, pursuing her PhD under the supervision of  
          <strong> Prof. Dr. Roman Klinger</strong>. She holds a Master's degree in Computational Linguistics from the University of Stuttgart 
          and a Bachelor's in Electronics and Communication Engineering. Her research lies at the intersection of Natural Language Processing 
          and the Semantic Web, with a particular focus on ontology-guided constraint decoding using Large Language Models for knowledge 
          graph construction.
        </p>
        
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          Her work spans multiple domains including aerospace, manufacturing, healthcare, legal, and safety sectors. She has extensive 
          experience in developing and deploying Large Language Models, implementing Retrieval-Augmented Generation systems, and creating 
          sophisticated information extraction pipelines. Her upcoming goals are to explore Visual Language Models for document parsing, semantic 
          table interpretation, and multi-modal AI systems.
        </p>

        <p className="text-gray-700 leading-relaxed text-lg">
          As an entrepreneur, she is actively seeking external funding for innovative AI applications including Upagu (AI-powered personal 
          assistant) and Krishi-App (agricultural technology platform). She co-founded Yug3DAI with Siddharth Yadav, focusing on the 
          convergence of AI and 3D printing technologies for next-generation manufacturing solutions.
        </p>
      </div>

      {/* Current Affiliations */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Building className="w-6 h-6 mr-2 text-blue-600" />
          Current Affiliations
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {affiliations.map((affiliation, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{affiliation.logo}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{affiliation.institution}</h3>
                  <p className="text-blue-600 font-medium">{affiliation.role}</p>
                  <p className="text-gray-600 text-sm mb-2">{affiliation.location}</p>
                  <p className="text-gray-700 text-sm mb-3">{affiliation.description}</p>
                  {affiliation.supervisor && (
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Supervisor:</strong> {affiliation.supervisor}
                    </p>
                  )}
                  <a 
                    href={affiliation.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visit Website <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResearch = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Microscope className="w-8 h-8 mr-3 text-blue-600" />
          Research Interests
        </h2>
        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
          My research focuses on developing innovative methodologies at the intersection of Natural Language Processing, 
          Semantic Web technologies, and Large Language Models. I aim to create domain-agnostic solutions for knowledge 
          extraction and graph construction that can scale across diverse scientific and technical domains.
        </p>
        
        <div className="grid gap-8">
          {researchInterests.map((interest, index) => (
            <div key={index} className={`border-l-4 border-${interest.color}-500 bg-${interest.color}-50 p-6 rounded-r-lg`}>
              <div className="flex items-start space-x-4">
                <div className={`text-${interest.color}-600 mt-1`}>
                  {interest.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{interest.title}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{interest.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {interest.keywords.map((keyword, kidx) => (
                      <span key={kidx} className={`px-3 py-1 bg-${interest.color}-100 text-${interest.color}-800 rounded-full text-sm font-medium`}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Briefcase className="w-8 h-8 mr-3 text-blue-600" />
          Professional Experience
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className={`relative flex items-start space-x-6 ${timelineAnimation ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: `${index * 0.1}s`}}>
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-2xl">
                  {exp.icon}
                </div>
                
                <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-gray-600">{exp.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-1" />
                        {exp.period}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">{exp.domain}</p>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-4 italic">{exp.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    {exp.highlights.map((highlight, hidx) => (
                      <div key={hidx} className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <GraduationCap className="w-8 h-8 mr-3 text-blue-600" />
          Education
        </h2>
        
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-lg text-blue-600 font-medium">{edu.institution}</p>
                  <p className="text-gray-600">{edu.location}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-1" />
                    {edu.period}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 font-medium mb-4">{edu.focus}</p>
              
              <div className="space-y-2">
                {edu.details.map((detail, didx) => (
                  <div key={didx} className="flex items-start space-x-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Code className="w-8 h-8 mr-3 text-blue-600" />
          Technical Skills
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="text-blue-600 mr-2">{category.icon}</span>
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, sidx) => (
                  <div 
                    key={sidx} 
                    className="cursor-pointer"
                    onMouseEnter={() => setAnimatedSkills(prev => new Set([...prev, `${index}-${sidx}`]))}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        skill.level === 'high' ? 'bg-green-100 text-green-800' :
                        skill.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {skill.level.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          skill.level === 'high' ? 'bg-green-500' :
                          skill.level === 'medium' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        } ${animatedSkills.has(`${index}-${sidx}`) ? 
                          (skill.level === 'high' ? 'w-5/6' : skill.level === 'medium' ? 'w-3/4' : 'w-1/2') : 'w-0'
                        }`}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Layers className="w-8 h-8 mr-3 text-blue-600" />
          Projects & Ventures
        </h2>
        
        <div className="grid gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-6 transition-all duration-300 ${
                hoveredProject === index ? 'shadow-lg scale-105' : 'hover:shadow-md'
              }`}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-600 mb-2">{project.category}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'Seeking External Funding' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {project.status}
                  </span>
                  {project.interactive && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <MousePointer className="w-4 h-4 mr-1" />
                      Try Interactive Demo
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, tidx) => (
                  <span key={tidx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
              
              {project.fundingNote && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-yellow-800 font-medium">{project.fundingNote}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPublications = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
          Publications
        </h2>
        
        <div className="space-y-6">
          {publications.map((pub, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{pub.title}</h3>
              <p className="text-gray-700 mb-2">{pub.authors}</p>
              <p className="text-gray-600 mb-3">{pub.venue} ({pub.year})</p>
              <a 
                href={pub.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Read Publication <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'about': return renderAbout();
      case 'research': return renderResearch();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'projects': return renderProjects();
      case 'publications': return renderPublications();
      default: return renderAbout();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Itisha Yadav</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {tabConfig.map((tab) => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default Portfolio;

