import { IndustryTrendItem, CareerRoleItem, RecommendedProject, KnowledgeDocument, SkillItem } from '../../src/types';

export const SKILL_TAXONOMY: Array<{ name: string; category: SkillItem['category']; aliases: string[] }> = [
  // Programming
  { name: 'Python', category: 'Programming', aliases: ['python3', 'python 3', 'py'] },
  { name: 'JavaScript', category: 'Programming', aliases: ['js', 'es6', 'es2020', 'vanilla js'] },
  { name: 'TypeScript', category: 'Programming', aliases: ['ts', 'typescriptlang'] },
  { name: 'Java', category: 'Programming', aliases: ['core java', 'java 8', 'java 17', 'java 21'] },
  { name: 'C++', category: 'Programming', aliases: ['cpp', 'c plus plus'] },
  { name: 'C#', category: 'Programming', aliases: ['csharp', '.net c#'] },
  { name: 'Go', category: 'Programming', aliases: ['golang', 'go lang'] },
  { name: 'Rust', category: 'Programming', aliases: ['rustlang'] },
  { name: 'SQL', category: 'Programming', aliases: ['structured query language', 't-sql', 'pl/sql'] },
  { name: 'R', category: 'Programming', aliases: ['r programming', 'r-lang'] },
  { name: 'PHP', category: 'Programming', aliases: ['php7', 'php8'] },
  { name: 'Kotlin', category: 'Programming', aliases: ['kotlin lang'] },
  { name: 'Swift', category: 'Programming', aliases: ['swiftui', 'swift lang'] },

  // AI & Machine Learning
  { name: 'Machine Learning', category: 'AI/ML', aliases: ['ml', 'supervised learning', 'unsupervised learning', 'ml algorithms'] },
  { name: 'Deep Learning', category: 'AI/ML', aliases: ['dl', 'neural networks', 'ann', 'cnn', 'rnn', 'lstm'] },
  { name: 'Generative AI', category: 'AI/ML', aliases: ['genai', 'gen ai', 'llms', 'large language models', 'diffusion models'] },
  { name: 'Retrieval-Augmented Generation (RAG)', category: 'AI/ML', aliases: ['rag', 'retrieval augmented generation', 'vector search rag'] },
  { name: 'Natural Language Processing', category: 'AI/ML', aliases: ['nlp', 'text processing', 'text analytics', 'nlu', 'nlg'] },
  { name: 'Computer Vision', category: 'AI/ML', aliases: ['cv', 'image processing', 'object detection', 'yolo', 'opencv'] },
  { name: 'PyTorch', category: 'AI/ML', aliases: ['torch', 'pytorch 2.0'] },
  { name: 'TensorFlow', category: 'AI/ML', aliases: ['tf', 'keras', 'tf 2.0'] },
  { name: 'Scikit-Learn', category: 'AI/ML', aliases: ['sklearn', 'scikit learn'] },
  { name: 'LangChain', category: 'AI/ML', aliases: ['langchain framework', 'langsmith'] },
  { name: 'LlamaIndex', category: 'AI/ML', aliases: ['gpt-index', 'llamaindex'] },
  { name: 'Hugging Face', category: 'AI/ML', aliases: ['transformers', 'hf', 'huggingface transformers'] },
  { name: 'MLOps', category: 'AI/ML', aliases: ['ml operations', 'mlflow', 'kubeflow', 'dvc', 'weights and biases'] },
  { name: 'LLMOps', category: 'AI/ML', aliases: ['llm operations', 'prompt engineering', 'fine-tuning', 'rlhf', 'lora'] },
  { name: 'AI Agents', category: 'AI/ML', aliases: ['agentic ai', 'autonomous agents', 'autogen', 'crewai'] },

  // Data & Analytics
  { name: 'Data Science', category: 'Data & Analytics', aliases: ['data analytics', 'data mining'] },
  { name: 'Pandas', category: 'Data & Analytics', aliases: ['pandas dataframe', 'python pandas'] },
  { name: 'NumPy', category: 'Data & Analytics', aliases: ['numpy arrays'] },
  { name: 'Power BI', category: 'Data & Analytics', aliases: ['powerbi', 'microsoft power bi'] },
  { name: 'Tableau', category: 'Data & Analytics', aliases: ['tableau desktop', 'tableau server'] },
  { name: 'Apache Spark', category: 'Data & Analytics', aliases: ['spark', 'pyspark', 'spark sql'] },
  { name: 'Apache Kafka', category: 'Data & Analytics', aliases: ['kafka', 'event streaming'] },
  { name: 'Data Warehousing', category: 'Data & Analytics', aliases: ['dwh', 'snowflake', 'bigquery', 'redshift', 'data lake'] },
  { name: 'Statistics', category: 'Data & Analytics', aliases: ['statistical modeling', 'hypothesis testing', 'probability'] },

  // Web Frameworks
  { name: 'React', category: 'Web Frameworks', aliases: ['react.js', 'reactjs', 'react native'] },
  { name: 'Node.js', category: 'Web Frameworks', aliases: ['nodejs', 'node', 'node js'] },
  { name: 'Express', category: 'Web Frameworks', aliases: ['express.js', 'expressjs'] },
  { name: 'Next.js', category: 'Web Frameworks', aliases: ['nextjs', 'next js'] },
  { name: 'FastAPI', category: 'Web Frameworks', aliases: ['fast api', 'fastapi python'] },
  { name: 'Django', category: 'Web Frameworks', aliases: ['django framework', 'django rest framework', 'drf'] },
  { name: 'Flask', category: 'Web Frameworks', aliases: ['flask python'] },
  { name: 'Spring Boot', category: 'Web Frameworks', aliases: ['springboot', 'spring framework', 'spring'] },
  { name: 'Vue.js', category: 'Web Frameworks', aliases: ['vue', 'vuejs', 'vue 3', 'nuxt'] },
  { name: 'Angular', category: 'Web Frameworks', aliases: ['angularjs', 'angular 2+'] },
  { name: 'Tailwind CSS', category: 'Web Frameworks', aliases: ['tailwind', 'tailwindcss'] },

  // Cloud & DevOps
  { name: 'Docker', category: 'Cloud & DevOps', aliases: ['containerization', 'docker container', 'dockerfile', 'docker-compose'] },
  { name: 'Kubernetes', category: 'Cloud & DevOps', aliases: ['k8s', 'kube', 'k8s cluster'] },
  { name: 'AWS', category: 'Cloud & DevOps', aliases: ['amazon web services', 'aws ec2', 'aws s3', 'aws lambda'] },
  { name: 'Google Cloud Platform', category: 'Cloud & DevOps', aliases: ['gcp', 'google cloud', 'cloud run', 'gcs', 'bigquery'] },
  { name: 'Microsoft Azure', category: 'Cloud & DevOps', aliases: ['azure', 'azure devops', 'azure cloud'] },
  { name: 'CI/CD', category: 'Cloud & DevOps', aliases: ['continuous integration', 'github actions', 'gitlab ci', 'jenkins'] },
  { name: 'Terraform', category: 'Cloud & DevOps', aliases: ['infrastructure as code', 'iac'] },
  { name: 'Linux', category: 'Cloud & DevOps', aliases: ['bash', 'shell scripting', 'ubuntu', 'unix'] },

  // Databases
  { name: 'PostgreSQL', category: 'Databases', aliases: ['postgres', 'postgresql db', 'pgsql'] },
  { name: 'MySQL', category: 'Databases', aliases: ['mariadb', 'mysql server'] },
  { name: 'MongoDB', category: 'Databases', aliases: ['mongo', 'nosql mongodb', 'mongoose'] },
  { name: 'Redis', category: 'Databases', aliases: ['redis cache', 'in-memory db'] },
  { name: 'Vector Databases', category: 'Databases', aliases: ['vector db', 'pinecone', 'chromadb', 'weaviate', 'qdrant', 'milvus', 'pgvector'] },
  { name: 'Neo4j', category: 'Databases', aliases: ['graph database', 'graph db'] },

  // Cybersecurity
  { name: 'Cybersecurity', category: 'Cybersecurity', aliases: ['infosec', 'information security', 'network security'] },
  { name: 'Ethical Hacking', category: 'Cybersecurity', aliases: ['penetration testing', 'pen testing', 'kali linux'] },
  { name: 'OWASP Security', category: 'Cybersecurity', aliases: ['owasp top 10', 'web security', 'appsec'] },
  { name: 'Cryptography', category: 'Cybersecurity', aliases: ['encryption', 'tls/ssl', 'pki'] },

  // Tools & Version Control
  { name: 'Git', category: 'Tools', aliases: ['github', 'gitlab', 'version control', 'git cli'] },
  { name: 'REST APIs', category: 'Tools', aliases: ['restful apis', 'api design', 'json apis', 'postman'] },
  { name: 'GraphQL', category: 'Tools', aliases: ['apollo graphql'] },
  { name: 'Jira', category: 'Tools', aliases: ['agile', 'scrum', 'kanban'] },

  // Soft Skills
  { name: 'Problem Solving', category: 'Soft Skills', aliases: ['analytical thinking', 'algorithmic thinking'] },
  { name: 'Team Collaboration', category: 'Soft Skills', aliases: ['cross-functional collaboration', 'team player'] },
  { name: 'Technical Communication', category: 'Soft Skills', aliases: ['presentation skills', 'documentation', 'verbal communication'] },
  { name: 'Agile Methodology', category: 'Soft Skills', aliases: ['scrum master', 'sprint planning', 'agile development'] }
];

export const INITIAL_INDUSTRY_TRENDS: IndustryTrendItem[] = [
  {
    id: 'trend_1',
    name: 'Agentic AI & Multi-Agent Workflows',
    category: 'AI & Data',
    status: 'EMERGING',
    relevance_score: 95,
    growth_rate: 'Emerging',
    description: 'Transition from single-turn chat prompts to goal-directed autonomous agents utilizing function calling, tool use, memory loops, and human-in-the-loop oversight.',
    signal_type: 'Emerging technology',
    key_roles: ['AI/ML Engineer', 'Full Stack Developer', 'Data Scientist'],
    source: 'Tech Hiring & Open Source AI Surveys',
    date_recorded: '2026-02-15',
    is_sample: true
  },
  {
    id: 'trend_2',
    name: 'Retrieval-Augmented Generation & Vector Search',
    category: 'AI & Data',
    status: 'CURRENT DEMAND',
    relevance_score: 92,
    growth_rate: 'High Demand',
    description: 'Industry standard for grounding generative language models in proprietary knowledge stores via vector embeddings and hybrid search.',
    signal_type: 'Core standard',
    key_roles: ['AI/ML Engineer', 'Backend Developer', 'Data Engineer'],
    source: 'Industry Job Postings Index',
    date_recorded: '2026-01-20',
    is_sample: true
  },
  {
    id: 'trend_3',
    name: 'MLOps & LLMOps Pipeline Automation',
    category: 'Automation & MLOps',
    status: 'GROWING',
    relevance_score: 88,
    growth_rate: 'Growing',
    description: 'Continuous monitoring, evaluation benchmarks, latency optimization, quantization, and automated deployment pipelines for production AI models.',
    signal_type: 'Growing demand',
    key_roles: ['MLOps Engineer', 'DevOps Engineer', 'AI/ML Engineer'],
    source: 'DevOps & AI Industry Index',
    date_recorded: '2026-02-01',
    is_sample: true
  },
  {
    id: 'trend_4',
    name: 'Cloud Native & Containerized Microservices',
    category: 'Cloud & Infrastructure',
    status: 'CURRENT DEMAND',
    relevance_score: 90,
    growth_rate: 'High Demand',
    description: 'Containerized microservice orchestration, infrastructure-as-code, and serverless event-driven architectures across AWS, GCP, and Azure.',
    signal_type: 'Core standard',
    key_roles: ['Cloud Engineer', 'Backend Developer', 'DevOps Engineer'],
    source: 'Cloud Ecosystem Reports',
    date_recorded: '2026-01-10',
    is_sample: true
  },
  {
    id: 'trend_5',
    name: 'Explainable AI & Algorithmic Transparency',
    category: 'AI & Data',
    status: 'EMERGING',
    relevance_score: 85,
    growth_rate: 'Emerging',
    description: 'Mathematical interpretability and transparent feature attribution for automated decision engines and production systems.',
    signal_type: 'Emerging technology',
    key_roles: ['AI/ML Engineer', 'Data Scientist', 'AI Ethics Researcher'],
    source: 'Responsible AI & Engineering Standards',
    date_recorded: '2026-02-18',
    is_sample: true
  },
  {
    id: 'trend_6',
    name: 'Full Stack TypeScript & Modern Web Runtimes',
    category: 'Software Engineering',
    status: 'CURRENT DEMAND',
    relevance_score: 89,
    growth_rate: 'High Demand',
    description: 'End-to-end type safety spanning React frontends and Node.js backends with modern component architectures and microservices.',
    signal_type: 'Core standard',
    key_roles: ['Full Stack Developer', 'Frontend Engineer', 'Software Engineer'],
    source: 'Developer Ecosystem Survey',
    date_recorded: '2026-01-05',
    is_sample: true
  },
  {
    id: 'trend_7',
    name: 'Application Security & DevSecOps Practices',
    category: 'Cybersecurity',
    status: 'GROWING',
    relevance_score: 87,
    growth_rate: 'Growing',
    description: 'Automated dependency scanning, container vulnerability triage, secrets management, and OWASP security practices integrated directly into pipelines.',
    signal_type: 'Growing demand',
    key_roles: ['Cybersecurity Analyst', 'DevOps Engineer', 'Software Engineer'],
    source: 'Security Engineering Reports',
    date_recorded: '2026-02-10',
    is_sample: true
  }
];

export const INITIAL_CAREER_ROLES: CareerRoleItem[] = [
  {
    id: 'role_aiml',
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    match_percentage: 84,
    description: 'Designs, develops, trains, and operationalizes machine learning and generative AI models into high-performance production systems.',
    average_salary_range: '$95,000 - $165,000 / ₹10L - ₹28L',
    required_skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'FastAPI', 'Docker', 'SQL', 'MLOps'],
    user_has_skills: ['Python', 'SQL', 'Machine Learning'],
    user_missing_skills: ['Docker', 'FastAPI', 'MLOps', 'PyTorch'],
    career_path_stages: [
      { level: 'Entry', title: 'Junior ML Engineer / AI Associate', years: '0-2 yrs' },
      { level: 'Mid', title: 'Machine Learning Engineer', years: '2-5 yrs' },
      { level: 'Senior', title: 'Senior AI Engineer / Lead MLOps', years: '5-8 yrs' },
      { level: 'Principal', title: 'Principal AI Architect / Head of AI', years: '8+ yrs' }
    ],
    recommended_next_steps: [
      'Master FastAPI and containerize a PyTorch/Scikit model with Docker',
      'Implement a RAG pipeline with vector search and evaluation metrics',
      'Deploy an end-to-end model pipeline with CI/CD automation'
    ],
    explanation: 'Your profile has a solid mathematical and foundational Python/ML base. Bridging containerization (Docker), API engineering (FastAPI), and deployment (MLOps) creates immediate hiring readiness.'
  },
  {
    id: 'role_ds',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    match_percentage: 80,
    description: 'Transforms complex structured and unstructured data into predictive insights, statistical models, and executive data products.',
    average_salary_range: '$85,000 - $150,000 / ₹8L - ₹24L',
    required_skills: ['Python', 'SQL', 'Data Science', 'Pandas', 'Statistics', 'Scikit-Learn', 'Power BI', 'Machine Learning'],
    user_has_skills: ['Python', 'SQL', 'Machine Learning'],
    user_missing_skills: ['Pandas', 'Power BI', 'Statistics'],
    career_path_stages: [
      { level: 'Entry', title: 'Associate Data Analyst / Jr Scientist', years: '0-2 yrs' },
      { level: 'Mid', title: 'Data Scientist', years: '2-5 yrs' },
      { level: 'Senior', title: 'Senior Data Scientist', years: '5-8 yrs' },
      { level: 'Staff', title: 'Chief Data Scientist / Director of Analytics', years: '8+ yrs' }
    ],
    recommended_next_steps: [
      'Build end-to-end Exploratory Data Analysis (EDA) projects with rigorous hypothesis testing',
      'Create interactive executive dashboards using Power BI / Tableau',
      'Publish reproducible Jupyter notebooks on real-world datasets'
    ],
    explanation: 'You hold strong predictive modeling skills. Adding statistical rigor and business intelligence visualizer capabilities will round out your qualification.'
  },
  {
    id: 'role_fsd',
    title: 'Full Stack Developer',
    category: 'Software Engineering',
    match_percentage: 72,
    description: 'Builds complete scalable client-side interfaces and server architectures, managing state, databases, authentication, and REST/GraphQL APIs.',
    average_salary_range: '$80,000 - $145,000 / ₹7L - ₹22L',
    required_skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'PostgreSQL', 'Docker', 'REST APIs'],
    user_has_skills: ['SQL', 'JavaScript'],
    user_missing_skills: ['React', 'TypeScript', 'Node.js', 'Docker'],
    career_path_stages: [
      { level: 'Entry', title: 'Junior Software Engineer / Frontend Dev', years: '0-2 yrs' },
      { level: 'Mid', title: 'Full Stack Software Engineer', years: '2-5 yrs' },
      { level: 'Senior', title: 'Senior Full Stack Engineer', years: '5-8 yrs' },
      { level: 'Lead', title: 'Tech Lead / Engineering Manager', years: '8+ yrs' }
    ],
    recommended_next_steps: [
      'Develop modern TypeScript React applications with component state',
      'Build Express or Nest REST APIs with JWT auth and relational SQL ORM',
      'Containerize full-stack apps with multi-stage Docker builds'
    ],
    explanation: 'A versatile engineering path with strong market volume. Learning TypeScript, React, and server-side Node.js expands your job options significantly.'
  },
  {
    id: 'role_cloud',
    title: 'Cloud & DevOps Engineer',
    category: 'Cloud & Infrastructure',
    match_percentage: 65,
    description: 'Architects resilient cloud infrastructure, automates CI/CD deployment pipelines, manages Kubernetes clusters, and guarantees system uptime.',
    average_salary_range: '$90,000 - $160,000 / ₹9L - ₹26L',
    required_skills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Python', 'Networking'],
    user_has_skills: ['Python', 'Linux'],
    user_missing_skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    career_path_stages: [
      { level: 'Entry', title: 'Cloud Associate / Junior SysAdmin', years: '0-2 yrs' },
      { level: 'Mid', title: 'DevOps Engineer / SRE', years: '2-5 yrs' },
      { level: 'Senior', title: 'Senior Cloud Architect', years: '5-8 yrs' },
      { level: 'Principal', title: 'Head of Infrastructure / Platform Engineering', years: '8+ yrs' }
    ],
    recommended_next_steps: [
      'Gain hands-on AWS or GCP experience with compute, networking, and storage',
      'Build declarative CI/CD workflows with GitHub Actions',
      'Deploy containerized applications to Kubernetes with Helm charts'
    ],
    explanation: 'High demand infrastructure role. Requires building proficiency in container orchestration, cloud providers, and declarative IaC.'
  }
];

export const INITIAL_PROJECTS: RecommendedProject[] = [
  {
    id: 'proj_1',
    title: 'Production AI Model Deployment & Inference API',
    tagline: 'FastAPI + Dockerized Model Serving with Caching and Latency Tracking',
    target_role: 'AI/ML Engineer',
    skills_demonstrated: ['Python', 'FastAPI', 'Docker', 'Machine Learning', 'REST APIs', 'PostgreSQL'],
    missing_skills_covered: ['FastAPI', 'Docker', 'REST APIs'],
    difficulty: 'Intermediate',
    estimated_hours: 24,
    why_improves_employability: 'Demonstrates to employers that you can take an offline ML experiment and wrap it into a containerized, production-grade microservice with input validation and automated tests.',
    key_features: [
      'Pydantic request payload validation with anomaly boundary checks',
      'Asynchronous batch prediction endpoint with Redis caching',
      'Multi-stage Dockerfile optimized for minimal image size (<200MB)',
      'Prometheus metrics endpoint tracking p95/p99 inference latency'
    ],
    architecture_hint: 'Client -> Nginx Proxy -> FastAPI Worker (Uvicorn) -> ONNX/PyTorch Runtime -> PostgreSQL Log Store',
    github_blueprint_summary: 'Includes complete boilerplate structure: /app/api, /app/models, Dockerfile, docker-compose.yml, tests/test_api.py, and GitHub Actions CI workflow.'
  },
  {
    id: 'proj_2',
    title: 'Enterprise RAG Document Intelligence Platform',
    tagline: 'Hybrid Vector Search with Semantic Re-ranking and Document Grounding',
    target_role: 'AI/ML Engineer',
    skills_demonstrated: ['Python', 'Generative AI', 'Retrieval-Augmented Generation (RAG)', 'Vector Databases', 'LangChain', 'PostgreSQL'],
    missing_skills_covered: ['Retrieval-Augmented Generation (RAG)', 'Vector Databases', 'Generative AI'],
    difficulty: 'Advanced',
    estimated_hours: 35,
    why_improves_employability: 'Top enterprise trend in 2025/2026. Proves competence in parsing PDF/documents, semantic chunking, cosine vector similarity, and hallucination guardrails.',
    key_features: [
      'Multi-format parser (PDF, DOCX, Markdown) with recursive semantic chunking',
      'Vector indexing using pgvector with HNSW index for sub-10ms lookup',
      'Cross-encoder re-ranking step for high precision recall',
      'Direct source citation highlighting with confidence scoring'
    ],
    architecture_hint: 'Frontend UI -> FastAPI Ingestion -> Text Splitter -> Gemini/HuggingFace Embeddings -> pgvector -> LLM Generator -> Grounded Answer',
    github_blueprint_summary: 'Repository with ingest script, vector store migration, FastAPI query endpoint, and precision/recall evaluation benchmark.'
  },
  {
    id: 'proj_3',
    title: 'Full-Stack Analytical Dashboard with Role-Based Access Control',
    tagline: 'TypeScript + React + Express + Relational Database with Real-Time Filters',
    target_role: 'Full Stack Developer',
    skills_demonstrated: ['TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'Tailwind CSS', 'CI/CD'],
    missing_skills_covered: ['TypeScript', 'React', 'Node.js', 'Express'],
    difficulty: 'Intermediate',
    estimated_hours: 28,
    why_improves_employability: 'Showcases end-to-end full-stack software craftsmanship: clean type safety, responsive UI layout, secure JWT authentication, and structured relational queries.',
    key_features: [
      'Full JWT authentication flow with refresh tokens and hashed passwords',
      'Parameterized SQL queries with relational joins and index optimization',
      'Interactive Recharts data visualizations with export to CSV/JSON',
      'Responsive dark/light Tailwind interface with keyboard navigation'
    ],
    architecture_hint: 'React Client -> Express API Router -> Auth Middleware -> Drizzle/Prisma ORM -> PostgreSQL -> Docker Container',
    github_blueprint_summary: 'Modular monorepo structure with /client, /server, /shared/types, and Docker Compose development setup.'
  }
];

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'kb_employability_framework',
    title: 'CareerIQ Employability & Skills Architecture',
    category: 'role_guide',
    tags: ['Employability', 'Skill Gaps', 'Career Readiness', 'Learning Path', 'Industry Alignment'],
    source_doc: 'CareerIQ Technical Competency Framework',
    last_updated: '2026-01-01',
    content: `
CareerIQ is engineered to address the structural disconnect between education and industry hiring demands:

1. Competency Alignment:
- By reducing the skill mismatch between educational outputs and industry hiring demands.
- Providing transparent, explainable career readiness assessments that empower job seekers with merit-based career diagnostics.
- Helping candidates upskill into high-demand technological roles (AI, Cloud, Software Engineering, Data Science).

2. Demand-Driven Learning:
- Helping learners identify and acquire relevant technical skills for employment.
- Transforming static learning into dynamic, demand-driven roadmaps.
- Providing actionable project blueprints so learners acquire practical, applied engineering experience.
    `
  },
  {
    id: 'kb_aiml_role_specs',
    title: 'AI/ML Engineer Industry Standards & Hiring Criteria (2025-2026)',
    category: 'role_guide',
    tags: ['AI/ML Engineer', 'Python', 'FastAPI', 'Docker', 'MLOps', 'PyTorch', 'RAG'],
    source_doc: 'Industry Tech Hiring Survey & Standard Competency Matrix',
    last_updated: '2026-02-01',
    content: `
Industry Expectations for AI/ML Engineers:
1. Core Foundations: Strong proficiency in Python, linear algebra, calculus, and relational databases (SQL).
2. Modeling: Experience with both classical ML (Scikit-Learn, XGBoost) and Deep Learning (PyTorch, Hugging Face).
3. Production Engineering: Ability to wrap models in RESTful APIs (FastAPI), containerize with Docker, and manage dependencies.
4. Modern Generative AI: Understanding RAG architectures, vector databases (pgvector, ChromaDB), embedding models, and prompt engineering.
5. MLOps: Familiarity with experiment tracking (MLflow, Weights & Biases), CI/CD pipelines, model monitoring, and latency benchmarks.
Key Pitfall: Candidates who only build Jupyter notebooks without containerization or API deployment score in the lower 30% of technical hiring screens.
    `
  },
  {
    id: 'kb_resume_ats_guide',
    title: 'Technical Resume Optimization & ATS Best Practices',
    category: 'skill_breakdown',
    tags: ['Resume', 'ATS', 'Quantified Impact', 'Keywords', 'Action Verbs'],
    source_doc: 'Technical Recruiting & ATS Algorithmic Standards',
    last_updated: '2026-01-15',
    content: `
Keys to High-Scoring Technical Resumes:
1. Standard Machine-Readable Structure: Clear headings (Summary, Skills, Experience, Projects, Education, Certifications). Avoid multi-column text that confuses parsers.
2. Skill Categorization: Group skills logically (Programming Languages, Frameworks & Libraries, Cloud & Tools, Databases).
3. Quantified Impact in Projects & Experience: Use the Google XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]"). For example: "Reduced model inference latency by 42% by quantizing PyTorch model and deploying on FastAPI with Redis caching."
4. Verifiable Project Links: Always include GitHub repository links with clean README documentation, architecture diagrams, and test coverage.
5. Keyword Normalization: Ensure recognized industry standard terms (e.g., 'React', 'FastAPI', 'Docker', 'PostgreSQL') appear explicitly.
    `
  },
  {
    id: 'kb_explainable_ai_framework',
    title: 'Explainable AI (XAI) Scoring Methodology in CareerIQ',
    category: 'interview_insight',
    tags: ['XAI', 'Scoring', 'Job Match', 'Career Readiness', 'Weights', 'Transparency'],
    source_doc: 'CareerIQ Technical Whitepaper on Explainable Employability Metrics',
    last_updated: '2026-02-10',
    content: `
CareerIQ Explainable AI (XAI) Architecture:
1. Job Match Score Formulation:
   - Technical Skill Match (35% weight): Ratio of verified required technical skills demonstrated vs job requirements.
   - Project Relevance (20% weight): Semantic similarity and technology overlap between user projects and target role duties.
   - Education Alignment (15% weight): Degree level and domain fit.
   - Experience Fit (15% weight): Years of relevant work or internship experience mapped to seniority level.
   - Industry Alignment (15% weight): Familiarity with industry tools, domain terminology, and modern practices.

2. Career Readiness Score (0-100):
   - Integrates Technical Skills (30%), Portfolio & Projects (25%), Practical Experience (15%), Target Role Alignment (15%), and Future Technology Adaptability (15%).
   - Provides transparent narrative explanations detailing exactly why points were awarded or deducted, along with prioritized corrective actions.
    `
  }
];
