import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  UserProfile,
  ResumeData,
  JobDescriptionData,
  JobMatchExplanation,
  SkillGapItem,
  CareerReadinessScore,
  IndustryTrendItem,
  CareerRoleItem,
  PersonalizedRoadmap,
  RoadmapStep,
  RecommendedProject,
  KnowledgeDocument,
  SkillItem,
  AnalysisHistoryItem,
  Course,
  Assessment,
  UserCourseProgress,
  AssessmentAttempt,
  RecruiterJob,
  CandidateApplication
} from '../../src/types';
import {
  SKILL_TAXONOMY,
  INITIAL_INDUSTRY_TRENDS,
  INITIAL_CAREER_ROLES,
  INITIAL_PROJECTS,
  INITIAL_KNOWLEDGE_DOCUMENTS
} from './seedData';
import {
  INITIAL_COURSES,
  INITIAL_ASSESSMENTS,
  INITIAL_RECRUITER_JOBS
} from './courseData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'careeriq_db.json');

export interface DatabaseSchema {
  users: User[];
  profiles: UserProfile[];
  resumes: ResumeData[];
  skills: SkillItem[];
  user_skills: Array<{ id: string; user_id: string; skill_id: string; proficiency: 'Beginner' | 'Intermediate' | 'Advanced'; source: string; verified: boolean }>;
  jobs: JobDescriptionData[];
  job_matches: Array<{ id: string; user_id: string; job_id: string; resume_id: string; match_data: JobMatchExplanation; created_at: string }>;
  skill_gaps: SkillGapItem[];
  career_scores: Array<{ id: string; user_id: string; score_data: CareerReadinessScore; created_at: string }>;
  industry_trends: IndustryTrendItem[];
  career_roles: CareerRoleItem[];
  roadmaps: PersonalizedRoadmap[];
  projects: RecommendedProject[];
  knowledge_documents: KnowledgeDocument[];
  analyses_history: AnalysisHistoryItem[];
  notifications: Array<{ id: string; user_id: string; title: string; message: string; type: 'info' | 'success' | 'alert'; is_read: boolean; created_at: string }>;
  password_resets: Array<{ email: string; code: string; expires_at: number; created_at: string }>;
  courses: Course[];
  assessments: Assessment[];
  user_progress: UserCourseProgress[];
  assessment_attempts: AssessmentAttempt[];
  recruiter_jobs: RecruiterJob[];
  candidate_applications: CandidateApplication[];
}

let dbInstance: DatabaseSchema | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  ensureDataDir();
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.password_resets) parsed.password_resets = [];
      if (!parsed.courses || parsed.courses.length === 0) parsed.courses = INITIAL_COURSES;
      if (!parsed.assessments || parsed.assessments.length === 0) parsed.assessments = INITIAL_ASSESSMENTS;
      if (!parsed.user_progress) parsed.user_progress = [];
      if (!parsed.assessment_attempts) parsed.assessment_attempts = [];
      if (!parsed.recruiter_jobs || parsed.recruiter_jobs.length === 0) parsed.recruiter_jobs = INITIAL_RECRUITER_JOBS;
      if (!parsed.candidate_applications) parsed.candidate_applications = [];
      return parsed;
    } catch (e) {
      console.error('Error loading database file, re-initializing...', e);
    }
  }

  // Initialize fresh database with seeds
  const initialSkills: SkillItem[] = SKILL_TAXONOMY.map((item, index) => ({
    id: `skill_${index + 1}`,
    name: item.name,
    normalized_name: item.name.toLowerCase(),
    category: item.category,
    proficiency: 'Intermediate',
    source: 'manual',
    verified: true
  }));

  // Create demo user
  const demoUserId = 'user_demo_1';
  const demoPasswordHash = bcrypt.hashSync('CareerIQ@2026', 10);
  const now = new Date().toISOString();

  const demoUser: User = {
    id: demoUserId,
    email: 'archana@careeriq.edu',
    password_hash: demoPasswordHash,
    full_name: 'Archana',
    role: 'student',
    created_at: now,
    updated_at: now
  };

  const demoProfile: UserProfile = {
    id: 'prof_demo_1',
    user_id: demoUserId,
    full_name: 'Archana',
    email: 'archana@careeriq.edu',
    degree: 'B.Tech in Computer Science & Engineering',
    university: 'Institute of Technology',
    graduation_year: '2026',
    experience_level: 'Student',
    target_role: 'AI/ML Engineer',
    target_industry: 'Artificial Intelligence & Software',
    career_interests: ['Machine Learning', 'Generative AI', 'Cloud Computing', 'Data Engineering'],
    bio: 'Passionate computer science student with hands-on foundations in Python, machine learning, and relational databases. Eager to build production AI applications and scalable data systems.',
    created_at: now,
    updated_at: now
  };

  const demoResume: ResumeData = {
    id: 'res_demo_1',
    user_id: demoUserId,
    filename: 'Archana_Resume_2026.pdf',
    upload_date: now,
    raw_text: `Archana
Email: archana@careeriq.edu | GitHub: github.com/archana | LinkedIn: linkedin.com/in/archana
Education:
B.Tech in Computer Science and Engineering, Institute of Technology (2022 - 2026), GPA: 8.8/10

Technical Skills:
Programming: Python, JavaScript, SQL, C++
AI / Machine Learning: Machine Learning, Scikit-Learn, Pandas, NumPy, Data Science, Natural Language Processing
Databases & Tools: PostgreSQL, MySQL, Git, Linux, REST APIs

Projects:
1. Customer Churn Prediction System (Python, Scikit-Learn, Pandas)
- Built predictive churn model utilizing Random Forest and Logistic Regression on 15,000+ telecom records, achieving 84% accuracy.
- Conducted exploratory data analysis and feature engineering to identify primary customer attrition indicators.

2. Document Search & Summarizer (Python, NLP, Flask)
- Developed an NLP-based text extraction utility using TF-IDF vectorization and cosine similarity to index academic research papers.
- Implemented clean REST endpoints with Flask for document ingestion and semantic keyword queries.

Internships & Experience:
AI Research Intern | DataCraft Labs (June 2025 - August 2025)
- Assisted senior ML engineers in data preprocessing, feature normalization, and SQL data extraction.
- Automated evaluation metric logging across 20+ experiment runs.

Certifications:
- Deep Learning Specialization (DeepLearning.AI)
- Python for Data Science (IBM)`,
    summary: 'Computer Science senior with proven experience in Python, Machine Learning, Data Science, and SQL, complemented by an AI Research Internship at DataCraft Labs.',
    detected_skills: [
      { id: 's_py', name: 'Python', normalized_name: 'python', category: 'Programming', proficiency: 'Advanced', source: 'resume', verified: true },
      { id: 's_sql', name: 'SQL', normalized_name: 'sql', category: 'Programming', proficiency: 'Intermediate', source: 'resume', verified: true },
      { id: 's_ml', name: 'Machine Learning', normalized_name: 'machine learning', category: 'AI/ML', proficiency: 'Intermediate', source: 'resume', verified: true },
      { id: 's_nlp', name: 'Natural Language Processing', normalized_name: 'natural language processing', category: 'AI/ML', proficiency: 'Intermediate', source: 'resume', verified: true },
      { id: 's_pandas', name: 'Pandas', normalized_name: 'pandas', category: 'Data & Analytics', proficiency: 'Intermediate', source: 'resume', verified: true },
      { id: 's_postgres', name: 'PostgreSQL', normalized_name: 'postgresql', category: 'Databases', proficiency: 'Intermediate', source: 'resume', verified: true },
      { id: 's_git', name: 'Git', normalized_name: 'git', category: 'Tools', proficiency: 'Intermediate', source: 'resume', verified: true },
      { id: 's_linux', name: 'Linux', normalized_name: 'linux', category: 'Cloud & DevOps', proficiency: 'Beginner', source: 'resume', verified: true }
    ],
    education: [
      {
        institution: 'Apex Institute of Technology',
        degree: 'B.Tech',
        field: 'Computer Science and Engineering',
        year: '2022 - 2026',
        score: '8.8 / 10 CGPA'
      }
    ],
    experience: [
      {
        title: 'AI Research Intern',
        company: 'DataCraft Labs',
        duration: 'June 2025 - August 2025 (3 mos)',
        description: 'Assisted senior ML engineers in data preprocessing, feature normalization, and SQL data extraction. Automated evaluation metric logging across 20+ experiment runs.',
        skills_used: ['Python', 'SQL', 'Scikit-Learn', 'Data Preprocessing']
      }
    ],
    projects: [
      {
        title: 'Customer Churn Prediction System',
        description: 'Built predictive churn model utilizing Random Forest and Logistic Regression on 15,000+ telecom records, achieving 84% accuracy.',
        technologies: ['Python', 'Scikit-Learn', 'Pandas'],
        link: 'https://github.com/alexchen/churn-predictor'
      },
      {
        title: 'Document Search & Summarizer',
        description: 'Developed an NLP-based text extraction utility using TF-IDF vectorization and cosine similarity to index academic research papers.',
        technologies: ['Python', 'NLP', 'Flask', 'SQL'],
        link: 'https://github.com/alexchen/doc-search'
      }
    ],
    certifications: [
      { title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', year: '2025' },
      { title: 'Python for Data Science', issuer: 'IBM', year: '2024' }
    ],
    achievements: [
      'Dean’s Academic Merit List (2023, 2024)',
      '1st Place in University Hackathon 2025 (NLP Track)'
    ],
    ai_feedback: {
      ats_score: 82,
      impact_verdict: 'Strong foundational technical profile with clear project descriptions and relevant research internship.',
      strengths: [
        'Solid programming foundation in Python and SQL with quantifiable project outcomes.',
        'Hands-on data science toolkit demonstrated through Scikit-Learn and Pandas.',
        'Clear academic credential and demonstrated internship experience.'
      ],
      improvements: [
        'Add containerization (Docker) and modern API framework (FastAPI) to bridge ML engineering requirements.',
        'Include live deployment links or CI/CD test badges on GitHub repositories.',
        'Highlight modern Generative AI / RAG concepts to align with 2025/2026 industry demand.'
      ]
    }
  };

  const initialRoadmap: PersonalizedRoadmap = {
    id: 'rdm_demo_1',
    user_id: demoUserId,
    title: 'AI/ML Engineer Production Readiness Roadmap',
    target_role: 'AI/ML Engineer',
    estimated_duration_months: 4,
    completion_percentage: 20,
    created_at: now,
    steps: [
      {
        id: 'step_1',
        step_order: 1,
        title: 'Deep Learning & Neural Network Architectures',
        skill_name: 'Deep Learning',
        category: 'AI/ML',
        priority: 'HIGH',
        why_learn: 'Core requirement for modern computer vision, NLP, and transformer foundation models.',
        learning_objective: 'Understand backpropagation, CNN/RNN mechanics, and build a PyTorch multi-class classifier with custom dataset loaders.',
        suggested_project: 'Image & Text Multimodal Classifier with PyTorch',
        estimated_weeks: 3,
        completed: true,
        resources: [
          { title: 'PyTorch Official Deep Learning Tutorials', type: 'doc' },
          { title: 'Practical Deep Learning for Coders (Fast.ai)', type: 'course' }
        ]
      },
      {
        id: 'step_2',
        step_order: 2,
        title: 'High-Performance API Engineering with FastAPI',
        skill_name: 'FastAPI',
        category: 'Web Frameworks',
        priority: 'HIGH',
        why_learn: 'Industry standard for serving machine learning models with asynchronous throughput and automated OpenAPI documentation.',
        learning_objective: 'Create asynchronous REST APIs with Pydantic validation, dependency injection, and background task queues.',
        suggested_project: 'ML Inference Microservice with Validation and Latency Metrics',
        estimated_weeks: 2,
        completed: false,
        resources: [
          { title: 'FastAPI In-Depth Documentation & Best Practices', type: 'doc' },
          { title: 'Building Production REST APIs with Python', type: 'practice' }
        ]
      },
      {
        id: 'step_3',
        step_order: 3,
        title: 'Containerization & Microservices with Docker',
        skill_name: 'Docker',
        category: 'Cloud & DevOps',
        priority: 'HIGH',
        why_learn: 'Ensures model training and serving run identically across local workstations, testing staging, and cloud production environments.',
        learning_objective: 'Write multi-stage Dockerfiles, configure docker-compose environments, and optimize container image layers.',
        suggested_project: 'Containerized AI Prediction Service on Docker Compose',
        estimated_weeks: 2,
        completed: false,
        resources: [
          { title: 'Docker Official Get Started Guide', type: 'doc' },
          { title: 'Docker for Data Science & Machine Learning', type: 'course' }
        ]
      },
      {
        id: 'step_4',
        step_order: 4,
        title: 'RAG Architectures & Vector Search Integration',
        skill_name: 'Retrieval-Augmented Generation (RAG)',
        category: 'AI/ML',
        priority: 'HIGH',
        why_learn: 'High-demand enterprise capability for connecting LLMs to private proprietary knowledge bases.',
        learning_objective: 'Implement semantic chunking, cosine vector similarity lookup with pgvector/Chroma, and prompt context injection.',
        suggested_project: 'Enterprise RAG Document Intelligence Platform',
        estimated_weeks: 3,
        completed: false,
        resources: [
          { title: 'RAG Triad Evaluation & Architecture Guide', type: 'doc' },
          { title: 'Vector Database Fundamentals (pgvector & Chroma)', type: 'practice' }
        ]
      },
      {
        id: 'step_5',
        step_order: 5,
        title: 'MLOps Pipeline Automation & Model Monitoring',
        skill_name: 'MLOps',
        category: 'AI/ML',
        priority: 'MEDIUM',
        why_learn: 'Guarantees continuous model quality, automated retraining, and data drift detection.',
        learning_objective: 'Set up MLflow experiment tracking, automated GitHub Actions CI/CD workflows, and latency monitoring.',
        suggested_project: 'Automated Model Registry & CI/CD Pipeline',
        estimated_weeks: 3,
        completed: false,
        resources: [
          { title: 'MLflow Tracking & Model Registry Docs', type: 'doc' },
          { title: 'Full Stack MLOps Course', type: 'course' }
        ]
      }
    ]
  };

  const initialCareerScore: CareerReadinessScore = {
    overall_score: 78,
    grade: 'Career Ready',
    breakdown: {
      technical_skills: 82,
      projects: 76,
      experience: 68,
      job_alignment: 84,
      industry_alignment: 79,
      future_readiness: 72
    },
    explanation: 'Your profile demonstrates strong programming, data science, and mathematical foundations with relevant internship experience. Your score is positioned at 78/100, indicating solid baseline readiness. Completing containerization (Docker) and API deployment (FastAPI) will elevate your competitiveness to 88+.',
    strengths: [
      'Strong core in Python, SQL, and Machine Learning algorithms.',
      'Practical internship experience at an AI research laboratory.',
      'Quantified academic achievement and hackathon project execution.'
    ],
    critical_gaps: [
      'Missing Docker containerization on GitHub portfolios.',
      'Needs hands-on FastAPI or RESTful microservice deployment.',
      'Emerging Generative AI / RAG skills need demonstration.'
    ],
    immediate_next_steps: [
      'Complete Roadmap Step 2: Build a FastAPI ML serving API.',
      'Package your customer churn predictor into a Docker image.',
      'Add a RAG document search project to your portfolio.'
    ],
    calculated_at: now
  };

  const initialHistory: AnalysisHistoryItem[] = [
    {
      id: 'hist_1',
      user_id: demoUserId,
      type: 'resume_analysis',
      title: 'Baseline Resume Extraction & Analysis',
      summary: 'Extracted 8 technical skills, verified AI Research internship, and generated ATS feedback (Score: 82/100).',
      score: 82,
      details: { resume_id: demoResume.id },
      created_at: now
    },
    {
      id: 'hist_2',
      user_id: demoUserId,
      type: 'readiness_check',
      title: 'Career Readiness Index Assessment',
      summary: 'Comprehensive 6-factor assessment evaluated Career Readiness at 78/100 for AI/ML Engineer target role.',
      score: 78,
      details: initialCareerScore,
      created_at: now
    }
  ];

  const db: DatabaseSchema = {
    users: [demoUser],
    profiles: [demoProfile],
    resumes: [demoResume],
    skills: initialSkills,
    user_skills: [
      { id: 'us_1', user_id: demoUserId, skill_id: 'skill_1', proficiency: 'Advanced', source: 'resume', verified: true },
      { id: 'us_2', user_id: demoUserId, skill_id: 'skill_9', proficiency: 'Intermediate', source: 'resume', verified: true },
      { id: 'us_3', user_id: demoUserId, skill_id: 'skill_14', proficiency: 'Intermediate', source: 'resume', verified: true },
      { id: 'us_4', user_id: demoUserId, skill_id: 'skill_18', proficiency: 'Intermediate', source: 'resume', verified: true }
    ],
    jobs: [],
    job_matches: [],
    skill_gaps: [
      {
        id: 'gap_1',
        user_id: demoUserId,
        target_role: 'AI/ML Engineer',
        skill_name: 'Docker',
        category: 'Cloud & DevOps',
        priority: 'HIGH',
        is_required: true,
        importance_reason: 'Required by 85% of AI/ML Engineer job postings to ensure reproducible model deployments and cloud orchestration.',
        recommended_action: 'Build a containerized inference microservice with Docker and test multi-stage builds.',
        learning_resources: ['Docker Official Docs', 'Docker for ML Course']
      },
      {
        id: 'gap_2',
        user_id: demoUserId,
        target_role: 'AI/ML Engineer',
        skill_name: 'FastAPI',
        category: 'Web Frameworks',
        priority: 'HIGH',
        is_required: true,
        importance_reason: 'Modern high-performance asynchronous API framework required to serve AI models with low latency.',
        recommended_action: 'Develop an asynchronous REST endpoint wrapping Scikit-Learn or PyTorch models.',
        learning_resources: ['FastAPI Tutorial User Guide', 'Building Production APIs']
      },
      {
        id: 'gap_3',
        user_id: demoUserId,
        target_role: 'AI/ML Engineer',
        skill_name: 'Retrieval-Augmented Generation (RAG)',
        category: 'AI/ML',
        priority: 'HIGH',
        is_required: true,
        importance_reason: 'Fastest-growing enterprise AI architecture in 2025/2026. Demonstrates modern GenAI engineering capability.',
        recommended_action: 'Implement a semantic vector search project with pgvector or ChromaDB.',
        learning_resources: ['RAG Architecture Patterns', 'LangChain / LlamaIndex Cookbook']
      },
      {
        id: 'gap_4',
        user_id: demoUserId,
        target_role: 'AI/ML Engineer',
        skill_name: 'MLOps',
        category: 'AI/ML',
        priority: 'MEDIUM',
        is_required: false,
        importance_reason: 'Automates model lifecycle, tracking, and continuous integration.',
        recommended_action: 'Integrate MLflow tracking and automated GitHub Actions testing.',
        learning_resources: ['MLflow Documentation', 'Made With ML MLOps Guide']
      }
    ],
    career_scores: [{ id: 'cs_1', user_id: demoUserId, score_data: initialCareerScore, created_at: now }],
    industry_trends: INITIAL_INDUSTRY_TRENDS,
    career_roles: INITIAL_CAREER_ROLES,
    roadmaps: [initialRoadmap],
    projects: INITIAL_PROJECTS,
    knowledge_documents: INITIAL_KNOWLEDGE_DOCUMENTS,
    analyses_history: initialHistory,
    notifications: [
      {
        id: 'notif_1',
        user_id: demoUserId,
        title: 'Welcome to CareerIQ!',
        message: 'Your baseline profile has been initialized with AI career readiness metrics and personalized roadmap recommendations.',
        type: 'info',
        is_read: false,
        created_at: now
      }
    ],
    password_resets: [],
    courses: INITIAL_COURSES,
    assessments: INITIAL_ASSESSMENTS,
    user_progress: [],
    assessment_attempts: [],
    recruiter_jobs: INITIAL_RECRUITER_JOBS,
    candidate_applications: []
  };

  saveDatabase(db);
  return db;
}

export function saveDatabase(db: DatabaseSchema) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export function getDB(): DatabaseSchema {
  if (!dbInstance) {
    dbInstance = loadDatabase();
  }
  return dbInstance;
}

export function updateDB(mutator: (db: DatabaseSchema) => void): DatabaseSchema {
  const db = getDB();
  mutator(db);
  saveDatabase(db);
  return db;
}

/**
 * Explicitly seed sample/demo data for a user who clicks "Load Sample Resume" or "Load Demo Profile"
 */
export function seedUserDemoData(userId: string) {
  const now = new Date().toISOString();
  return updateDB(db => {
    // 1. Ensure user profile has standard target role
    let profile = db.profiles.find(p => p.user_id === userId);
    if (profile) {
      profile.target_role = 'AI/ML Engineer';
      profile.experience_level = 'Student / Fresher';
    }

    // 2. Clear previous user resume and add sample resume
    db.resumes = db.resumes.filter(r => r.user_id !== userId);
    const sampleResume: ResumeData = {
      id: `res_sample_${Date.now()}`,
      user_id: userId,
      filename: 'Sample_Candidate_Resume.pdf',
      upload_date: now,
      raw_text: `Technical Resume
Degree: B.Tech Computer Science (2022-2026)
Technical Skills: Python, SQL, Machine Learning, NLP, Pandas, PostgreSQL, Git, Linux
Projects: Customer Churn Prediction System with Random Forest (84% accuracy); Document Semantic Search with TF-IDF.
Experience: AI Research Intern at DataCraft Labs (June 2025 - August 2025).`,
      summary: 'Computer Science student with strong foundations in Python, machine learning algorithms, and relational databases. Experience building predictive models and document search pipelines.',
      detected_skills: [
        { id: `s_${Date.now()}_1`, name: 'Python', normalized_name: 'python', category: 'Programming', proficiency: 'Advanced', verified: true, source: 'resume' },
        { id: `s_${Date.now()}_2`, name: 'SQL', normalized_name: 'sql', category: 'Programming', proficiency: 'Intermediate', verified: true, source: 'resume' },
        { id: `s_${Date.now()}_3`, name: 'Machine Learning', normalized_name: 'machine learning', category: 'AI/ML', proficiency: 'Intermediate', verified: true, source: 'resume' },
        { id: `s_${Date.now()}_4`, name: 'Natural Language Processing', normalized_name: 'natural language processing', category: 'AI/ML', proficiency: 'Intermediate', verified: true, source: 'resume' },
        { id: `s_${Date.now()}_5`, name: 'Pandas', normalized_name: 'pandas', category: 'Data & Analytics', proficiency: 'Intermediate', verified: true, source: 'resume' },
        { id: `s_${Date.now()}_6`, name: 'PostgreSQL', normalized_name: 'postgresql', category: 'Databases', proficiency: 'Intermediate', verified: true, source: 'resume' },
        { id: `s_${Date.now()}_7`, name: 'Git', normalized_name: 'git', category: 'Tools', proficiency: 'Intermediate', verified: true, source: 'resume' },
        { id: `s_${Date.now()}_8`, name: 'Linux', normalized_name: 'linux', category: 'Cloud & DevOps', proficiency: 'Intermediate', verified: true, source: 'resume' }
      ],
      education: [{ institution: 'Institute of Technology', degree: 'B.Tech', field: 'Computer Science', year: '2026', score: '8.8/10' }],
      experience: [{ title: 'AI Research Intern', company: 'DataCraft Labs', duration: 'June 2025 - August 2025', description: 'Assisted senior ML engineers in feature normalization and SQL data extraction.', skills_used: ['Python', 'SQL', 'Machine Learning'] }],
      projects: [{ title: 'Customer Churn Prediction System', description: 'Predictive churn classification with 84% accuracy.', technologies: ['Python', 'Machine Learning', 'Pandas'] }],
      certifications: [{ title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', year: '2025' }],
      achievements: ['Won 2nd prize in State Level Hackathon (NLP Track)'],
      ai_feedback: {
        ats_score: 84,
        impact_verdict: 'Strong foundational profile for AI/ML Engineer roles with clear growth opportunities in deployment and containerization.',
        strengths: [
          'Structured presentation of core programming (Python, SQL) and ML competencies.',
          'Quantifiable project metrics in customer churn classification (84% accuracy).',
          'Verified hands-on internship experience in data extraction and model evaluation.'
        ],
        improvements: [
          'Add containerization (Docker) and FastAPI deployment links.',
          'Quantify operational metrics across academic projects.',
          'Integrate emerging Generative AI / RAG architecture proofs.'
        ]
      }
    };
    db.resumes.push(sampleResume);

    // 3. Populate skill gaps for target role
    db.skill_gaps = db.skill_gaps.filter(g => g.user_id !== userId);
    db.skill_gaps.push(
      {
        id: `gap_${Date.now()}_1`,
        user_id: userId,
        target_role: 'AI/ML Engineer',
        skill_name: 'Docker',
        category: 'Cloud & DevOps',
        priority: 'HIGH',
        is_required: true,
        importance_reason: 'Required by 85% of AI/ML Engineer postings for reproducible model deployment.',
        recommended_action: 'Complete Docker Fundamentals and containerize your ML prediction service.',
        learning_resources: ['Docker Official Get Started Guide', 'Docker for Machine Learning']
      },
      {
        id: `gap_${Date.now()}_2`,
        user_id: userId,
        target_role: 'AI/ML Engineer',
        skill_name: 'FastAPI',
        category: 'Web Frameworks',
        priority: 'HIGH',
        is_required: true,
        importance_reason: 'Modern high-performance asynchronous API framework required to serve AI models with low latency.',
        recommended_action: 'Develop an asynchronous REST endpoint wrapping your Scikit-Learn model.',
        learning_resources: ['FastAPI Tutorial User Guide', 'Building Production APIs']
      },
      {
        id: `gap_${Date.now()}_3`,
        user_id: userId,
        target_role: 'AI/ML Engineer',
        skill_name: 'Retrieval-Augmented Generation (RAG)',
        category: 'AI/ML',
        priority: 'HIGH',
        is_required: true,
        importance_reason: 'Fastest-growing enterprise AI architecture. Connects LLMs to private knowledge bases.',
        recommended_action: 'Implement vector embeddings and similarity search with ChromaDB or pgvector.',
        learning_resources: ['RAG Architecture Patterns', 'LangChain Cookbook']
      },
      {
        id: `gap_${Date.now()}_4`,
        user_id: userId,
        target_role: 'AI/ML Engineer',
        skill_name: 'MLOps',
        category: 'AI/ML',
        priority: 'MEDIUM',
        is_required: false,
        importance_reason: 'Automates model lifecycle tracking, data drift monitoring, and continuous integration.',
        recommended_action: 'Integrate MLflow experiment tracking and automated GitHub Actions testing.',
        learning_resources: ['MLflow Documentation', 'Made With ML MLOps Guide']
      }
    );

    // 4. Populate readiness score
    db.career_scores = db.career_scores.filter(c => c.user_id !== userId);
    db.career_scores.push({
      id: `cs_${Date.now()}`,
      user_id: userId,
      score_data: {
        overall_score: 78,
        grade: 'Career Ready',
        breakdown: {
          technical_skills: 82,
          projects: 76,
          experience: 68,
          job_alignment: 84,
          industry_alignment: 79,
          future_readiness: 72
        },
        explanation: 'Your profile demonstrates strong programming, data science, and mathematical foundations with relevant internship experience. Your score is positioned at 78/100, indicating solid baseline readiness. Completing containerization (Docker) and API deployment (FastAPI) will elevate your competitiveness to 88+.',
        strengths: [
          'Strong core in Python, SQL, and Machine Learning algorithms.',
          'Practical internship experience at an AI research laboratory.',
          'Quantified academic achievement and hackathon project execution.'
        ],
        critical_gaps: [
          'Missing Docker containerization on GitHub portfolios.',
          'Needs hands-on FastAPI or RESTful microservice deployment.',
          'Emerging Generative AI / RAG skills need demonstration.'
        ],
        immediate_next_steps: [
          'Complete Course: Docker Fundamentals for Modern Engineering.',
          'Build Roadmap Step 2: FastAPI ML model serving endpoint.',
          'Take the Docker skill assessment to verify confidence.'
        ],
        calculated_at: now
      },
      created_at: now
    });
  });
}

/**
 * Resets user back to authentic STATE A (New User without resume or assumptions)
 */
export function clearUserData(userId: string) {
  return updateDB(db => {
    db.resumes = db.resumes.filter(r => r.user_id !== userId);
    db.skill_gaps = db.skill_gaps.filter(g => g.user_id !== userId);
    db.career_scores = db.career_scores.filter(c => c.user_id !== userId);
    db.roadmaps = db.roadmaps.filter(r => r.user_id !== userId);
    db.user_progress = db.user_progress.filter(p => p.user_id !== userId);
    db.assessment_attempts = db.assessment_attempts.filter(a => a.user_id !== userId);
  });
}

