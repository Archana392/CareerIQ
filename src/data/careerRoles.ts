export interface RecruiterDemandProfile {
  role: string;
  category: string;
  frequently_requested_skills: Array<{ name: string; level: 'Critical' | 'High' | 'Growing' }>;
  required_technical_skills: string[];
  preferred_skills: string[];
  common_tools: string[];
  experience_expectations: {
    entry: string;
    mid: string;
    senior: string;
  };
  project_expectations: string[];
  certifications: string[];
  soft_skills: string[];
  interview_expectations: string[];
  emerging_skills: string[];
  salary_range: string;
}

export const TARGET_ROLE_OPTIONS = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'Data Engineer',
  'AI/ML Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cybersecurity Engineer',
  'Mobile App Developer',
  'UI/UX Designer',
  'Business Analyst',
  'Product Manager',
  'Other'
] as const;

export type TargetRoleOption = typeof TARGET_ROLE_OPTIONS[number];

export const RECRUITER_DEMAND_DATA: Record<string, RecruiterDemandProfile> = {
  'Software Engineer': {
    role: 'Software Engineer',
    category: 'Software Engineering',
    frequently_requested_skills: [
      { name: 'Data Structures & Algorithms', level: 'Critical' },
      { name: 'System Design', level: 'High' },
      { name: 'Object-Oriented Programming', level: 'Critical' },
      { name: 'Git & Version Control', level: 'Critical' },
      { name: 'Unit Testing & CI/CD', level: 'High' },
      { name: 'Relational SQL', level: 'High' }
    ],
    required_technical_skills: ['Java / Python / C++', 'Data Structures', 'Algorithms', 'SQL', 'Git', 'REST APIs'],
    preferred_skills: ['Docker', 'Microservices', 'Linux', 'Cloud Platforms (AWS/GCP)', 'Redis'],
    common_tools: ['Git/GitHub', 'Jira', 'Docker', 'Postman', 'VS Code / IntelliJ', 'Jenkins / GitHub Actions'],
    experience_expectations: {
      entry: '0-2 yrs: Strong algorithmic foundation, core programming language mastery, clean code practices, basic DB queries.',
      mid: '2-5 yrs: Autonomous feature design, API architecture, code reviews, performance debugging, database optimization.',
      senior: '5+ yrs: Distributed system design, technical mentorship, architectural decisions, cross-team reliability standards.'
    },
    project_expectations: [
      'Full-stack or backend service with modular architecture and clean REST endpoints',
      'High-performance data processor or cache-backed web service demonstrating concurrency',
      'Comprehensive unit and integration test suite with automated GitHub Actions workflow'
    ],
    certifications: [
      'AWS Certified Developer - Associate',
      'Oracle Certified Professional Java SE'
    ],
    soft_skills: ['Analytical Problem Solving', 'Cross-functional Collaboration', 'Technical Documentation', 'Agile/Scrum Participation'],
    interview_expectations: [
      'Round 1: Live algorithmic coding (arrays, trees, graphs, dynamic programming)',
      'Round 2: Object-Oriented or Low-Level Design (class structures, design patterns)',
      'Round 3: System Design & Scalability (data partitioning, caching, throughput)',
      'Round 4: Behavioral & Engineering Culture Fit'
    ],
    emerging_skills: ['AI-Assisted Development (Copilot)', 'Rust', 'Serverless Functions', 'Distributed Tracing'],
    salary_range: '$85,000 - $160,000 / ₹8L - ₹26L'
  },
  'Full Stack Developer': {
    role: 'Full Stack Developer',
    category: 'Software Engineering',
    frequently_requested_skills: [
      { name: 'TypeScript / JavaScript', level: 'Critical' },
      { name: 'React or Next.js', level: 'Critical' },
      { name: 'Node.js / Express', level: 'Critical' },
      { name: 'PostgreSQL / MongoDB', level: 'High' },
      { name: 'REST & GraphQL APIs', level: 'High' },
      { name: 'Tailwind CSS', level: 'Growing' }
    ],
    required_technical_skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'SQL / PostgreSQL', 'HTML5/CSS3', 'REST APIs'],
    preferred_skills: ['Next.js', 'Docker', 'Prisma / Drizzle ORM', 'Redis', 'AWS / Cloudflare', 'GraphQL'],
    common_tools: ['GitHub', 'VS Code', 'Postman', 'Vercel / AWS', 'Figma', 'npm/pnpm'],
    experience_expectations: {
      entry: '0-2 yrs: Proficient in React state, component lifecycles, Express routes, CRUD database integration.',
      mid: '2-5 yrs: End-to-end architecture, SSR/SSG workflows, authentication (JWT/OAuth), schema migrations, state management.',
      senior: '5+ yrs: Multi-tier microservices, web security standards (OWASP), observability, database sharding, frontend build optimization.'
    },
    project_expectations: [
      'Complete web SaaS application with user authentication, role-based access, and payment integration',
      'Real-time collaborative dashboard (WebSockets, optimistic UI updates, persistent DB)',
      'Clean mobile-responsive UI with automated Playwright or Cypress end-to-end tests'
    ],
    certifications: ['Meta Front-End Developer Professional Certificate', 'AWS Certified Solutions Architect'],
    soft_skills: ['Product Sense', 'Communication with Designers', 'Pragmatic Prioritization', 'Ownership Mindset'],
    interview_expectations: [
      'Round 1: Frontend live coding (React hooks, state management, UI implementation)',
      'Round 2: Backend API and database modeling challenge',
      'Round 3: Full-stack architecture & web performance (SSR, bundle sizing, caching)',
      'Round 4: Past project deep dive and engineering values'
    ],
    emerging_skills: ['Server Actions', 'Full-stack TypeScript (tRPC)', 'Edge Compute', 'Generative UI'],
    salary_range: '$80,000 - $155,000 / ₹7L - ₹24L'
  },
  'Frontend Developer': {
    role: 'Frontend Developer',
    category: 'Software Engineering',
    frequently_requested_skills: [
      { name: 'React / Next.js', level: 'Critical' },
      { name: 'TypeScript', level: 'Critical' },
      { name: 'CSS Architecture / Tailwind', level: 'Critical' },
      { name: 'Web Performance & Core Web Vitals', level: 'High' },
      { name: 'State Management (Redux/Zustand)', level: 'High' },
      { name: 'Accessibility (a11y)', level: 'Growing' }
    ],
    required_technical_skills: ['React', 'TypeScript', 'JavaScript (ES6+)', 'HTML5 & Semantic Markup', 'CSS3 / Tailwind', 'Browser APIs'],
    preferred_skills: ['Next.js', 'Vite / Webpack', 'Framer Motion', 'Testing Library / Jest', 'Storybook', 'GraphQL'],
    common_tools: ['Figma', 'Chrome DevTools', 'VS Code', 'GitHub', 'npm / pnpm', 'Vercel'],
    experience_expectations: {
      entry: '0-2 yrs: Pixel-perfect UI from Figma designs, responsive layouts, API integration, hook usage.',
      mid: '2-5 yrs: Design system construction, state architecture, memoization and bundle splitting, WCAG compliance.',
      senior: '5+ yrs: Micro-frontends, rendering strategy leadership (SSR vs ISR vs CSR), runtime telemetry, build pipeline optimization.'
    },
    project_expectations: [
      'Accessible, production-grade interactive dashboard with responsive tables and data visualizations',
      'Reusable component design system documented in Storybook with unit tests',
      'PWA or offline-capable client web application with optimistic updates'
    ],
    certifications: ['Meta Front-End Developer', 'Google Mobile Web Specialist'],
    soft_skills: ['Visual Design Empathy', 'User Centricity', 'Attention to Micro-interactions', 'Team Communication'],
    interview_expectations: [
      'Round 1: Vanilla JavaScript & DOM / Async manipulation',
      'Round 2: Live React component construction (complex state / custom hook)',
      'Round 3: Web Performance, Network Waterfalls & Accessibility audit',
      'Round 4: Behavioral & collaboration with product managers'
    ],
    emerging_skills: ['CSS subgrid', 'Island Architecture', 'WebAssembly (Wasm)', 'View Transitions API'],
    salary_range: '$75,000 - $145,000 / ₹6L - ₹22L'
  },
  'Backend Developer': {
    role: 'Backend Developer',
    category: 'Software Engineering',
    frequently_requested_skills: [
      { name: 'Node.js / Java / Go / Python', level: 'Critical' },
      { name: 'Relational Database Optimization (PostgreSQL)', level: 'Critical' },
      { name: 'REST & gRPC Microservices', level: 'Critical' },
      { name: 'Message Queues (Kafka / RabbitMQ)', level: 'High' },
      { name: 'Caching (Redis / Memcached)', level: 'High' },
      { name: 'Docker & Containerization', level: 'High' }
    ],
    required_technical_skills: ['Server-side Language (Java/Node/Go/Python)', 'SQL & Data Modeling', 'API Design', 'Authentication & Security', 'Git'],
    preferred_skills: ['Kafka / RabbitMQ', 'Redis', 'Docker', 'Kubernetes', 'Elasticsearch', 'CI/CD Pipelines'],
    common_tools: ['Postman', 'Docker', 'DBeaver / DataGrip', 'Kubernetes CLI', 'Grafana', 'Git'],
    experience_expectations: {
      entry: '0-2 yrs: Clean REST endpoints, ACID transactions, database indexing basics, unit testing.',
      mid: '2-5 yrs: Service decoupling, asynchronous worker queues, rate limiting, connection pooling, monitoring.',
      senior: '5+ yrs: Event-driven distributed architecture, high availability (99.99%), zero-downtime database migrations.'
    },
    project_expectations: [
      'Distributed task processing system with background workers and Redis message queue',
      'High-throughput banking/order processing API with idempotent requests and transaction rollbacks',
      'Secure microservice with OAuth2/JWT tokens, rate limiting, and structured logging'
    ],
    certifications: ['AWS Certified Developer', 'Spring Certified Professional'],
    soft_skills: ['Systems Thinking', 'Risk Assessment', 'Documentation Rigor', 'Root-Cause Analysis'],
    interview_expectations: [
      'Round 1: Data structures and concurrent programming challenge',
      'Round 2: Database schema design & complex query optimization',
      'Round 3: Distributed System Design (rate limiter, URL shortener, message broker)',
      'Round 4: Production troubleshooting scenario & behavioral'
    ],
    emerging_skills: ['gRPC & Protobuf', 'Rust for high-speed services', 'Vector search indexing', 'Zero-Trust Networking'],
    salary_range: '$85,000 - $160,000 / ₹8L - ₹26L'
  },
  'Data Scientist': {
    role: 'Data Scientist',
    category: 'Data & Analytics',
    frequently_requested_skills: [
      { name: 'Python & Scientific Stack (NumPy, Pandas)', level: 'Critical' },
      { name: 'Advanced SQL & Data Extraction', level: 'Critical' },
      { name: 'Machine Learning (Scikit-Learn, XGBoost)', level: 'Critical' },
      { name: 'Statistical Inference & A/B Testing', level: 'High' },
      { name: 'Data Visualization (Matplotlib, Seaborn, Tableau)', level: 'High' },
      { name: 'Business Metric Translation', level: 'High' }
    ],
    required_technical_skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistics & Probability', 'Data Cleaning'],
    preferred_skills: ['A/B Testing Frameworks', 'PyTorch', 'Spark / BigQuery', 'Tableau / Power BI', 'MLflow', 'Docker'],
    common_tools: ['Jupyter Notebooks', 'Git', 'Tableau', 'BigQuery / Snowflake', 'PostgreSQL', 'VS Code'],
    experience_expectations: {
      entry: '0-2 yrs: Exploratory data analysis, baseline regression/classification modeling, feature engineering, clear chart reporting.',
      mid: '2-5 yrs: End-to-end model evaluation, controlled experimentation (A/B testing), causal inference, stakeholder presentations.',
      senior: '5+ yrs: Novel algorithmic architectures, company-wide metric definition, automated feature stores, cross-functional strategy.'
    },
    project_expectations: [
      'Predictive model addressing real business problem (e.g., churn, fraud, demand forecasting) with documented ROI',
      'Rigorous statistical A/B test analysis notebook with sample size calculation and confidence intervals',
      'Interactive Streamlit or Dash analytical app connected to a live database'
    ],
    certifications: ['IBM Data Science Professional Certificate', 'TensorFlow Developer Certificate'],
    soft_skills: ['Storytelling with Data', 'Business Acumen', 'Intellectual Curiosity', 'Executive Communication'],
    interview_expectations: [
      'Round 1: Live SQL queries (window functions, subqueries, CTEs, aggregations)',
      'Round 2: Applied Machine Learning & Feature Engineering scenario',
      'Round 3: Statistics, Probability & A/B Testing design',
      'Round 4: Case study presentation translating business goal into quantitative model'
    ],
    emerging_skills: ['Causal ML', 'LLM Fine-Tuning for Analytics', 'Synthetic Data Generation', 'Polars Dataframe Engine'],
    salary_range: '$85,000 - $155,000 / ₹8L - ₹25L'
  },
  'Data Engineer': {
    role: 'Data Engineer',
    category: 'Data & Analytics',
    frequently_requested_skills: [
      { name: 'Python & PySpark', level: 'Critical' },
      { name: 'Advanced SQL & Data Warehousing', level: 'Critical' },
      { name: 'Orchestration (Apache Airflow)', level: 'Critical' },
      { name: 'Snowflake / BigQuery / Redshift', level: 'High' },
      { name: 'Data Lakehouse Architecture (Delta Lake / Iceberg)', level: 'High' },
      { name: 'Streaming (Kafka / Flink)', level: 'Growing' }
    ],
    required_technical_skills: ['Python', 'SQL', 'Data Pipelines / ETL', 'Data Warehousing', 'Airflow', 'Git'],
    preferred_skills: ['PySpark', 'dbt', 'Snowflake', 'Kafka', 'Docker', 'AWS Glue / Athena', 'Terraform'],
    common_tools: ['Apache Airflow', 'dbt', 'Snowflake / BigQuery', 'GitHub', 'Docker', 'Databricks'],
    experience_expectations: {
      entry: '0-2 yrs: Writing robust ETL scripts, schema design, data validation, SQL query tuning.',
      mid: '2-5 yrs: Distributed processing with Spark, Airflow DAG optimization, dimensional modeling (Kimball), data lineage.',
      senior: '5+ yrs: Enterprise data platform architecture, real-time streaming architectures, cost optimization, data governance.'
    },
    project_expectations: [
      'Automated end-to-end data pipeline extracting public API data, loading to warehouse via dbt, and tested with Great Expectations',
      'PySpark batch processing pipeline on multi-gigabyte dataset with partitioned Parquet storage',
      'Real-time streaming pipeline using Kafka and Spark Streaming'
    ],
    certifications: ['Databricks Certified Data Engineer Professional', 'Google Cloud Professional Data Engineer'],
    soft_skills: ['Attention to Detail', 'Reliability Mindset', 'Stakeholder Management', 'Cross-team Collaboration'],
    interview_expectations: [
      'Round 1: Advanced SQL and data manipulation challenge',
      'Round 2: Python scripting and data pipeline design',
      'Round 3: Data Architecture & Dimensional Modeling (Fact & Dimension tables)',
      'Round 4: Scaling, partitioning and query cost optimization scenario'
    ],
    emerging_skills: ['Apache Iceberg', 'DuckDB for in-process analytics', 'Data Observability (Monte Carlo)', 'dbt Mesh'],
    salary_range: '$90,000 - $160,000 / ₹9L - ₹27L'
  },
  'AI/ML Engineer': {
    role: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    frequently_requested_skills: [
      { name: 'Python & PyTorch / TensorFlow', level: 'Critical' },
      { name: 'FastAPI / API Model Serving', level: 'Critical' },
      { name: 'Docker & Containerization', level: 'Critical' },
      { name: 'Retrieval-Augmented Generation (RAG)', level: 'High' },
      { name: 'MLOps (MLflow, CI/CD)', level: 'High' },
      { name: 'Vector Databases (Chroma, Pinecone)', level: 'High' }
    ],
    required_technical_skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch / TensorFlow', 'FastAPI', 'Docker', 'SQL'],
    preferred_skills: ['MLOps', 'Vector Databases', 'LangChain / LlamaIndex', 'Quantization (ONNX)', 'Kubernetes', 'Hugging Face'],
    common_tools: ['Docker', 'MLflow', 'Git', 'FastAPI', 'Hugging Face', 'Jupyter', 'Weights & Biases'],
    experience_expectations: {
      entry: '0-2 yrs: Model training, evaluation metrics (F1, AUC, MSE), REST API inference serving, containerization.',
      mid: '2-5 yrs: Production model pipelines, latency optimization, RAG architecture, automated retraining upon drift.',
      senior: '5+ yrs: Distributed training across GPU clusters, custom LLM fine-tuning, end-to-end MLOps platforms, inference quantization.'
    },
    project_expectations: [
      'Containerized model serving endpoint with FastAPI, Pydantic validation, and Swagger UI',
      'Enterprise RAG pipeline with semantic chunking, vector similarity search, and hallucination guardrails',
      'Complete MLOps automated pipeline tracking experiments in MLflow with CI/CD deployment'
    ],
    certifications: ['AWS Certified Machine Learning - Specialty', 'DeepLearning.AI Specializations'],
    soft_skills: ['Scientific Curiosity', 'Pragmatic Trade-off Evaluation', 'Ethical AI Awareness', 'Clear Technical Communication'],
    interview_expectations: [
      'Round 1: Machine learning theory & mathematical foundations',
      'Round 2: Applied coding (model implementation, data pipelines)',
      'Round 3: Machine Learning System Design (recommendation engine, search ranking, LLM serving)',
      'Round 4: Production reliability, drift detection & deployment'
    ],
    emerging_skills: ['vLLM & TensorRT-LLM', 'Autonomous Agentic Frameworks', 'LoRA & QLoRA Fine-Tuning', 'DSPy Prompt Optimization'],
    salary_range: '$95,000 - $170,000 / ₹10L - ₹30L'
  },
  'Cloud Engineer': {
    role: 'Cloud Engineer',
    category: 'Infrastructure',
    frequently_requested_skills: [
      { name: 'AWS / GCP / Azure Core Services', level: 'Critical' },
      { name: 'Infrastructure as Code (Terraform)', level: 'Critical' },
      { name: 'Linux System Administration', level: 'Critical' },
      { name: 'Networking (VPC, Subnets, DNS, VPN)', level: 'High' },
      { name: 'Docker & Kubernetes', level: 'High' },
      { name: 'Cloud Security & IAM', level: 'High' }
    ],
    required_technical_skills: ['Cloud Platform (AWS/GCP/Azure)', 'Terraform', 'Linux', 'Networking', 'Python / Bash Scripting', 'IAM'],
    preferred_skills: ['Kubernetes', 'Ansible', 'CloudWatch / Datadog', 'Serverless (Lambda)', 'CI/CD Pipelines'],
    common_tools: ['Terraform', 'AWS CLI', 'Docker', 'GitHub Actions', 'Linux Terminal', 'Datadog'],
    experience_expectations: {
      entry: '0-2 yrs: Provisioning compute/storage, configuring VPCs and security groups, writing bash scripts, monitoring alarms.',
      mid: '2-5 yrs: Multi-environment Terraform modules, zero-trust IAM policies, cost optimization, disaster recovery automation.',
      senior: '5+ yrs: Multi-region cloud architecture, compliance frameworks (SOC2, HIPAA), hybrid cloud connectivity, automated governance.'
    },
    project_expectations: [
      'Terraform repository provisioning a highly-available 3-tier web architecture (VPC, ALB, Auto-scaling EC2, RDS)',
      'Serverless event-driven architecture utilizing AWS Lambda, SQS, DynamoDB, and API Gateway',
      'Automated backup and disaster recovery verification script with cloud notifications'
    ],
    certifications: ['AWS Certified Solutions Architect - Associate', 'Google Cloud Associate Cloud Engineer'],
    soft_skills: ['High Security Consciousness', 'Operational Discipline', 'Calm Incident Response', 'Clear Documentation'],
    interview_expectations: [
      'Round 1: Cloud networking, subnetting, CIDR, and routing troubleshooting',
      'Round 2: Infrastructure as Code (Terraform) live design task',
      'Round 3: High Availability and Disaster Recovery architecture scenario',
      'Round 4: Cloud security, IAM privilege restriction, and incident triage'
    ],
    emerging_skills: ['Platform Engineering (Internal Developer Portals)', 'FinOps & Cloud Cost Optimization', 'OpenTelemetry', 'eBPF'],
    salary_range: '$90,000 - $160,000 / ₹9L - ₹26L'
  },
  'DevOps Engineer': {
    role: 'DevOps Engineer',
    category: 'Infrastructure',
    frequently_requested_skills: [
      { name: 'CI/CD Pipelines (GitHub Actions, GitLab CI)', level: 'Critical' },
      { name: 'Docker & Kubernetes (K8s)', level: 'Critical' },
      { name: 'Infrastructure as Code (Terraform)', level: 'Critical' },
      { name: 'Observability (Prometheus, Grafana, ELK)', level: 'High' },
      { name: 'Linux & Shell Scripting', level: 'High' },
      { name: 'Site Reliability & Incident Management', level: 'High' }
    ],
    required_technical_skills: ['CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'Linux / Bash', 'Git', 'Monitoring & Logging'],
    preferred_skills: ['Helm', 'ArgoCD / GitOps', 'Ansible', 'Prometheus & Grafana', 'AWS / GCP', 'Python / Go'],
    common_tools: ['Kubernetes', 'Helm', 'GitHub Actions', 'Terraform', 'ArgoCD', 'Prometheus', 'Grafana'],
    experience_expectations: {
      entry: '0-2 yrs: Creating CI/CD build scripts, writing Dockerfiles, basic Kubernetes pod deployment, log inspection.',
      mid: '2-5 yrs: GitOps deployments with ArgoCD, cluster autoscaling, Helm charts, automated rollback triggers, SLO/SLI tracking.',
      senior: '5+ yrs: Enterprise platform engineering, multi-cluster federation, chaos engineering, post-mortem leadership, zero-downtime blue/green rollouts.'
    },
    project_expectations: [
      'Complete CI/CD pipeline building, testing, scanning security vulnerabilities, and deploying a Docker image to Kubernetes',
      'GitOps-managed Kubernetes repository using ArgoCD and custom Helm charts',
      'Prometheus and Grafana dashboard monitoring cluster CPU, memory, and application latency with custom P99 alerts'
    ],
    certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Certified DevOps Engineer - Professional'],
    soft_skills: ['Empathy for Developers', 'Systems Reliability Mindset', 'Blameless Post-Mortem Facilitation', 'Automation First Principle'],
    interview_expectations: [
      'Round 1: Linux system debugging and bash/python automation challenge',
      'Round 2: Kubernetes cluster manifest design & troubleshooting scenario',
      'Round 3: CI/CD pipeline architecture with automated security gates',
      'Round 4: On-call incident resolution simulation & post-mortem review'
    ],
    emerging_skills: ['GitOps (ArgoCD)', 'Kyverno / OPA Policy as Code', 'Cilium & eBPF Networking', 'Dagger CI Engine'],
    salary_range: '$95,000 - $165,000 / ₹10L - ₹28L'
  },
  'Cybersecurity Engineer': {
    role: 'Cybersecurity Engineer',
    category: 'Security',
    frequently_requested_skills: [
      { name: 'Network Security & Firewalls', level: 'Critical' },
      { name: 'Vulnerability Assessment & Penetration Testing', level: 'Critical' },
      { name: 'OWASP Top 10 & Application Security', level: 'Critical' },
      { name: 'SIEM & Threat Detection (Splunk, Wazuh)', level: 'High' },
      { name: 'Cryptography & PKI', level: 'High' },
      { name: 'Incident Response & Digital Forensics', level: 'High' }
    ],
    required_technical_skills: ['Network Protocols (TCP/IP, DNS, TLS)', 'OWASP Security', 'Linux Security', 'Vulnerability Scanning', 'Python/Bash'],
    preferred_skills: ['Penetration Testing (Kali, Burp Suite)', 'SIEM (Splunk/Elastic)', 'Cloud Security (AWS Security Hub)', 'MITRE ATT&CK', 'Identity & Access Management'],
    common_tools: ['Burp Suite', 'Wireshark', 'Nmap', 'Splunk', 'Metasploit', 'Wazuh', 'Trivy'],
    experience_expectations: {
      entry: '0-2 yrs: Triage security alerts, scan code repositories for CVEs, analyze network packet captures, configure basic firewalls.',
      mid: '2-5 yrs: Conduct threat modeling, penetration testing of web applications, automate security checks in CI/CD, author incident playbooks.',
      senior: '5+ yrs: Lead enterprise security architecture, red/blue team exercises, zero-trust implementation, regulatory audit compliance.'
    },
    project_expectations: [
      'Application security report assessing an open-source web app against the OWASP Top 10 with reproducible PoCs and fixes',
      'Automated DevSecOps pipeline running SAST, DAST, and container image scans (Trivy, SonarQube, ZAP)',
      'Home-lab SIEM deployment (Wazuh or Elastic Security) analyzing attack logs and triggering automated alerts'
    ],
    certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'OSCP (Offensive Security Certified Professional)'],
    soft_skills: ['Analytical Skepticism', 'Integrity & Ethics', 'Clear Risk Communication to Non-Technical Leaders', 'Stress Management'],
    interview_expectations: [
      'Round 1: Network protocol mechanics and attack vector fundamentals',
      'Round 2: Web application vulnerability analysis (XSS, SQLi, SSRF, CSRF)',
      'Round 3: Incident Response scenario (compromised server containment and forensic analysis)',
      'Round 4: Threat modeling and architectural risk evaluation'
    ],
    emerging_skills: ['AI-Powered Threat Detection', 'Supply Chain Security (SBOM)', 'Cloud Security Posture Management (CSPM)', 'Zero-Trust Architecture'],
    salary_range: '$90,000 - $160,000 / ₹9L - ₹27L'
  },
  'Mobile App Developer': {
    role: 'Mobile App Developer',
    category: 'Software Engineering',
    frequently_requested_skills: [
      { name: 'React Native / Flutter / Kotlin / Swift', level: 'Critical' },
      { name: 'Mobile State Management', level: 'Critical' },
      { name: 'REST API Integration & Offline Caching', level: 'Critical' },
      { name: 'App Store / Play Store Deployment', level: 'High' },
      { name: 'Mobile UI/UX Guidelines (Material / Human Interface)', level: 'High' },
      { name: 'Push Notifications & Native Modules', level: 'High' }
    ],
    required_technical_skills: ['React Native / Flutter / Swift / Kotlin', 'State Management', 'Mobile Navigation', 'REST APIs', 'Async Storage', 'Git'],
    preferred_skills: ['GraphQL', 'Firebase / Supabase', 'SQLite / Realm', 'Fastlane CI/CD', 'Performance Profiling', 'Native Bridges'],
    common_tools: ['Xcode', 'Android Studio', 'VS Code', 'Fastlane', 'Postman', 'Figma'],
    experience_expectations: {
      entry: '0-2 yrs: Building responsive mobile screens from design files, handling user input, fetching API data, local key-value storage.',
      mid: '2-5 yrs: Deep linking, offline-first database synchronization, push notification lifecycles, release management on App Store/Play Store.',
      senior: '5+ yrs: Cross-platform architecture, memory leak profiling, custom native C++/Java/Obj-C bridges, SDK design.'
    },
    project_expectations: [
      'Full production-ready mobile application published on TestFlight or Google Play with offline sync and clean state management',
      'Mobile utility integrating device hardware (Camera, GPS, Biometrics) with smooth 60fps animations',
      'Automated mobile CI/CD pipeline using Fastlane and GitHub Actions producing signed release artifacts'
    ],
    certifications: ['Meta React Native Specialization', 'Google Associate Android Developer'],
    soft_skills: ['Device-Level Empathy', 'Attention to Touch Target Sizing', 'Performance Sensitivity', 'Clear Communication'],
    interview_expectations: [
      'Round 1: Mobile UI coding challenge with responsive layouts and touch events',
      'Round 2: Asynchronous state management and network error recovery scenario',
      'Round 3: Mobile architecture, memory management, and offline cache invalidation',
      'Round 4: App Store compliance, release strategies, and behavioral'
    ],
    emerging_skills: ['Kotlin Multiplatform (KMP)', 'Jetpack Compose & SwiftUI', 'Server-Driven UI', 'On-Device ML (CoreML / TFLite)'],
    salary_range: '$80,000 - $150,000 / ₹7L - ₹23L'
  },
  'UI/UX Designer': {
    role: 'UI/UX Designer',
    category: 'Design & Product',
    frequently_requested_skills: [
      { name: 'Figma Mastery & Design Systems', level: 'Critical' },
      { name: 'User Research & Usability Testing', level: 'Critical' },
      { name: 'Information Architecture & Wireframing', level: 'Critical' },
      { name: 'Interactive Prototyping', level: 'High' },
      { name: 'Responsive Web & Mobile Design', level: 'High' },
      { name: 'Accessibility (WCAG AA Guidelines)', level: 'High' }
    ],
    required_technical_skills: ['Figma', 'Wireframing', 'User Research', 'Design Systems', 'Typography & Spacing Math', 'Prototyping', 'WCAG Accessibility'],
    preferred_skills: ['HTML5/CSS3 basics', 'Micro-interactions (Principle / After Effects)', 'Design Token Management', 'User Journey Mapping'],
    common_tools: ['Figma', 'FigJam / Miro', 'Notion', 'Lottie', 'Maze / UserTesting', 'Slack'],
    experience_expectations: {
      entry: '0-2 yrs: High-fidelity screens, component autolayout in Figma, user interview synthesis, heuristic evaluations.',
      mid: '2-5 yrs: Multi-brand design systems, complex SaaS dashboard workflows, usability testing facilitation, engineer handoff specs.',
      senior: '5+ yrs: Strategic product discovery, quantitative design ROI tracking, cross-team design standards, executive design critique.'
    },
    project_expectations: [
      'In-depth UX case study documenting discovery, user interviews, wireframing iterations, usability testing findings, and final design',
      'Scalable Figma Design System containing typography scales, tokenized color palettes, and accessible component states',
      'Interactive prototype demonstrating complex micro-interactions and edge-case error states'
    ],
    certifications: ['Google UX Design Professional Certificate', 'Nielsen Norman Group UX Master Certified'],
    soft_skills: ['User Advocacy', 'Deep Active Listening', 'Constructive Critique Acceptance', 'Storytelling and Pitching'],
    interview_expectations: [
      'Round 1: Portfolio walkthrough of 1-2 end-to-end case studies',
      'Round 2: Live whiteboard design challenge (product problem framing, user flow)',
      'Round 3: Figma technical craft test (design system components, autolayout, responsive constraints)',
      'Round 4: Collaboration with engineers and product managers'
    ],
    emerging_skills: ['Figma Variables & Advanced Prototyping', 'AI-Assisted User Research', 'Spatial UI Design', 'Design Token Automation'],
    salary_range: '$75,000 - $145,000 / ₹7L - ₹22L'
  },
  'Business Analyst': {
    role: 'Business Analyst',
    category: 'Design & Product',
    frequently_requested_skills: [
      { name: 'Requirements Gathering & BRD / PRD Documentation', level: 'Critical' },
      { name: 'SQL & Data Extraction', level: 'Critical' },
      { name: 'Business Process Modeling (BPMN)', level: 'High' },
      { name: 'Excel / Spreadsheets & Financial Modeling', level: 'High' },
      { name: 'Power BI / Tableau Dashboarding', level: 'High' },
      { name: 'Agile & User Story Mapping', level: 'High' }
    ],
    required_technical_skills: ['SQL', 'BRD/PRD Documentation', 'Process Flowcharts', 'Power BI / Tableau', 'Excel', 'Jira / Confluence'],
    preferred_skills: ['Python basics', 'A/B Testing analysis', 'UML Diagrams', 'ERP/CRM basics (Salesforce/SAP)', 'Stakeholder Management'],
    common_tools: ['Jira', 'Confluence', 'Power BI / Tableau', 'Lucidchart', 'Excel', 'SQL Server / PostgreSQL'],
    experience_expectations: {
      entry: '0-2 yrs: Documenting user stories, gap analysis, basic SQL queries, business process flows, meeting facilitation.',
      mid: '2-5 yrs: Translating ambiguous executive requirements into technical sprint specs, KPI dashboard design, root cause analysis.',
      senior: '5+ yrs: Business case justification, revenue impact modeling, strategic roadmap steering, cross-department alignment.'
    },
    project_expectations: [
      'Comprehensive Business Requirements Document (BRD) and user story map for a digital transformation project',
      'Interactive executive Power BI dashboard tracking operational KPIs and revenue retention metrics',
      'Process improvement case study demonstrating measurable reduction in workflow processing time'
    ],
    certifications: ['CBAP (Certified Business Analysis Professional)', 'PMI-PBA (PMI Professional in Business Analysis)'],
    soft_skills: ['Stakeholder Negotiation', 'Clarity in Ambiguity', 'Active Listening', 'Persuasive Presentation'],
    interview_expectations: [
      'Round 1: SQL and analytical data reasoning test',
      'Round 2: Business case study solving operational inefficiency',
      'Round 3: Requirements elicitation simulation (interviewing a difficult stakeholder)',
      'Round 4: Agile workflow and cross-functional prioritization'
    ],
    emerging_skills: ['AI-Augmented Business Analytics', 'Process Mining (Celonis)', 'Product-Led Growth Metrics', 'Prompt Engineering for Analysts'],
    salary_range: '$75,000 - $140,000 / ₹7L - ₹21L'
  },
  'Product Manager': {
    role: 'Product Manager',
    category: 'Design & Product',
    frequently_requested_skills: [
      { name: 'Product Vision & Strategy Definition', level: 'Critical' },
      { name: 'Roadmap Planning & Feature Prioritization', level: 'Critical' },
      { name: 'Data-Driven Decision Making & Metrics (Retention, CAC, LTV)', level: 'Critical' },
      { name: 'User Discovery & Customer Interviewing', level: 'High' },
      { name: 'PRD Writing & Engineering Hand-off', level: 'High' },
      { name: 'Go-To-Market (GTM) Strategy', level: 'High' }
    ],
    required_technical_skills: ['PRD Writing', 'Product Analytics (Mixpanel/Amplitude)', 'Prioritization Frameworks (RICE, MoSCoW)', 'SQL basics', 'A/B Testing'],
    preferred_skills: ['Technical Architecture literacy', 'Financial Modeling', 'Figma Wireframing', 'Market Competitive Analysis'],
    common_tools: ['Jira / Linear', 'Amplitude / Mixpanel', 'Notion', 'Figma', 'Looker', 'Canny / Productboard'],
    experience_expectations: {
      entry: '0-2 yrs: APM programs, writing clear user stories, analyzing funnels, conducting customer support shadowing.',
      mid: '2-5 yrs: Owning full product pods, driving quarterly OKRs, running iterative experimentation, trade-off decisions.',
      senior: '5+ yrs: Portfolio product strategy, cross-product coordination, executive communication, market expansion strategy.'
    },
    project_expectations: [
      'Comprehensive Product Requirement Document (PRD) detailing problem statement, user personas, success metrics, and edge cases',
      'Product teardown and improvement strategy deck with competitive analysis and wireframe proposal',
      'Funnel drop-off diagnosis and A/B test proposal with hypotheses and projected business impact'
    ],
    certifications: ['Pragmatic Institute Certified Product Manager', 'Reforge Growth / Product Series'],
    soft_skills: ['Influencing Without Authority', 'Ruthless Prioritization', 'Strategic Empathy', 'Executive Synthesis'],
    interview_expectations: [
      'Round 1: Product Design & Sense (e.g., "Design an alarm clock for the blind")',
      'Round 2: Product Strategy & Market Execution (e.g., "Should Uber enter grocery delivery?")',
      'Round 3: Analytical & Metrics Estimation (e.g., "Instagram Reels engagement dropped 4% - how to diagnose?")',
      'Round 4: Engineering & Design Collaboration and Leadership Fit'
    ],
    emerging_skills: ['AI Product Management (Model evals, prompt UX)', 'PLG Experimentation', 'API Product Strategy', 'Unit Economics Modeling'],
    salary_range: '$95,000 - $180,000 / ₹12L - ₹35L'
  }
};

export function getRecruiterDemandForRole(roleName?: string): RecruiterDemandProfile {
  if (!roleName || roleName.trim() === '' || roleName === 'Other') {
    return RECRUITER_DEMAND_DATA['Software Engineer'];
  }

  const clean = roleName.trim().toLowerCase();
  
  // Exact match search
  for (const key of Object.keys(RECRUITER_DEMAND_DATA)) {
    if (key.toLowerCase() === clean) {
      return RECRUITER_DEMAND_DATA[key];
    }
  }

  // Substring or keyword match
  for (const key of Object.keys(RECRUITER_DEMAND_DATA)) {
    if (clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
      return RECRUITER_DEMAND_DATA[key];
    }
  }

  // Keyword inferences
  if (clean.includes('frontend') || clean.includes('react') || clean.includes('ui dev') || clean.includes('web dev')) {
    return RECRUITER_DEMAND_DATA['Frontend Developer'];
  }
  if (clean.includes('backend') || clean.includes('node') || clean.includes('api') || clean.includes('java') || clean.includes('golang')) {
    return RECRUITER_DEMAND_DATA['Backend Developer'];
  }
  if (clean.includes('full') || clean.includes('stack') || clean.includes('mern')) {
    return RECRUITER_DEMAND_DATA['Full Stack Developer'];
  }
  if (clean.includes('data sci') || clean.includes('statistic') || clean.includes('analyst')) {
    return RECRUITER_DEMAND_DATA['Data Scientist'];
  }
  if (clean.includes('data eng') || clean.includes('pipeline') || clean.includes('etl') || clean.includes('spark')) {
    return RECRUITER_DEMAND_DATA['Data Engineer'];
  }
  if (clean.includes('ai') || clean.includes('ml') || clean.includes('machine learning') || clean.includes('deep learning')) {
    return RECRUITER_DEMAND_DATA['AI/ML Engineer'];
  }
  if (clean.includes('cloud') || clean.includes('aws') || clean.includes('azure') || clean.includes('gcp')) {
    return RECRUITER_DEMAND_DATA['Cloud Engineer'];
  }
  if (clean.includes('devops') || clean.includes('sre') || clean.includes('k8s') || clean.includes('kubernetes')) {
    return RECRUITER_DEMAND_DATA['DevOps Engineer'];
  }
  if (clean.includes('security') || clean.includes('cyber') || clean.includes('soc') || clean.includes('pen')) {
    return RECRUITER_DEMAND_DATA['Cybersecurity Engineer'];
  }
  if (clean.includes('mobile') || clean.includes('ios') || clean.includes('android') || clean.includes('flutter')) {
    return RECRUITER_DEMAND_DATA['Mobile App Developer'];
  }
  if (clean.includes('ux') || clean.includes('ui') || clean.includes('design') || clean.includes('product design')) {
    return RECRUITER_DEMAND_DATA['UI/UX Designer'];
  }
  if (clean.includes('product') || clean.includes('pm') || clean.includes('owner')) {
    return RECRUITER_DEMAND_DATA['Product Manager'];
  }
  if (clean.includes('business') || clean.includes('ba') || clean.includes('process')) {
    return RECRUITER_DEMAND_DATA['Business Analyst'];
  }

  // Fallback profile with personalized title
  return {
    ...RECRUITER_DEMAND_DATA['Software Engineer'],
    role: roleName,
    category: 'Engineering & Technology'
  };
}
