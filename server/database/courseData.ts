import { Course, Assessment, RecruiterJob } from '../../src/types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_docker',
    title: 'Docker Fundamentals for Modern Engineering',
    tagline: 'Containerize Python, Node.js, and ML inference services for reliable cloud deployments.',
    description: 'Learn container virtualization from scratch. Master writing clean Dockerfiles, orchestrating multi-container services with docker-compose, layer caching, and minimizing production image size.',
    category: 'Cloud & DevOps',
    difficulty: 'Beginner',
    estimated_hours: 4,
    skills_covered: ['Docker', 'Linux', 'Containerization', 'DevOps'],
    assessment_id: 'assess_docker',
    lessons: [
      {
        id: 'docker_l1',
        title: 'Containerization vs Virtual Machines',
        order: 1,
        duration_minutes: 20,
        content: `### Why Docker Matters in 2026
Traditional virtual machines virtualize hardware, requiring a complete guest operating system for each application. Containers, by contrast, share the host OS kernel and isolate user space using Linux namespaces and cgroups.

Key Benefits:
- **Consistency**: "Runs on my machine" becomes "Runs everywhere identically".
- **Lightweight**: Container spin-up times are measured in milliseconds rather than minutes.
- **Resource Efficient**: Significantly lower memory and CPU overhead compared to full hypervisors.`,
        code_snippet: `# Inspect Docker version and system info
docker version
docker system info`,
        key_takeaway: 'Containers isolate processes at the kernel level rather than emulating full hardware, making them lightweight and reproducible.'
      },
      {
        id: 'docker_l2',
        title: 'Writing Production Dockerfiles',
        order: 2,
        duration_minutes: 30,
        content: `### Anatomy of a High-Performance Dockerfile
A Dockerfile contains step-by-step instructions to assemble a container image. Each instruction creates a cached layer.

Best Practices:
1. **Use Specific Base Images**: Prefer \`python:3.11-slim\` over \`python:latest\` to reduce attack surface and build size.
2. **Order Matters for Caching**: Copy dependency manifests (\`requirements.txt\`) before application source code so dependencies aren't re-downloaded on every minor code tweak.
3. **Run as Non-Root**: Create a dedicated service user for security in production.`,
        code_snippet: `FROM python:3.11-slim

WORKDIR /app

# Cache dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY src/ ./src/

USER appuser
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]`,
        key_takeaway: 'Order instructions from least frequently changed to most frequently changed to optimize Docker build cache.'
      },
      {
        id: 'docker_l3',
        title: 'Multi-Stage Builds & Optimization',
        order: 3,
        duration_minutes: 25,
        content: `### Minimizing Image Footprint
Multi-stage builds allow you to use compilers, SDKs, and build tools in an intermediate stage, then copy ONLY the compiled binaries or packages into a tiny runtime image.

This reduces typical image sizes from 1.2GB down to under 150MB, speeding up container cold-starts and reducing cloud transfer costs.`,
        code_snippet: `# Stage 1: Build & compile
FROM python:3.11 as builder
WORKDIR /app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Stage 2: Clean runtime image
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache /wheels/*
COPY . .
CMD ["python", "app.py"]`,
        key_takeaway: 'Multi-stage builds separate compilation tools from the production runtime image to drastically cut image bloat.'
      },
      {
        id: 'docker_l4',
        title: 'Docker Compose for Multi-Service Stacks',
        order: 4,
        duration_minutes: 35,
        content: `### Orchestrating Microservices
Modern applications rarely run in isolation; they depend on databases (PostgreSQL), caches (Redis), and vector stores.

\`docker-compose.yml\` defines services, networks, volumes, and environment variables in a single declarative configuration file.`,
        code_snippet: `version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/careeriq
    depends_on:
      - db
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: careeriq
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`,
        key_takeaway: 'Docker Compose manages multi-container application lifecycles with declarative networking and volume persistence.'
      }
    ]
  },
  {
    id: 'course_fastapi',
    title: 'FastAPI & REST Model Serving',
    tagline: 'Build high-throughput, asynchronous APIs to serve machine learning models and data pipelines.',
    description: 'Master asynchronous Python development with FastAPI and Pydantic. Learn dependency injection, automatic Swagger docs, request validation, background tasks, and high-performance inference endpoints.',
    category: 'Web & APIs',
    difficulty: 'Intermediate',
    estimated_hours: 5,
    skills_covered: ['FastAPI', 'Python', 'REST APIs', 'Pydantic'],
    assessment_id: 'assess_fastapi',
    lessons: [
      {
        id: 'fastapi_l1',
        title: 'FastAPI Fundamentals & Async Event Loops',
        order: 1,
        duration_minutes: 25,
        content: `### Why FastAPI Dominates Machine Learning Serving
FastAPI is built on Starlette and Pydantic, achieving execution performance comparable to NodeJS and Go thanks to Python's \`async\` and \`await\` syntax.

Key Features:
- **Type Hints**: Standard Python 3.10+ type annotations drive validation, serialization, and editor autocompletion.
- **Automated Documentation**: Instant OpenAPI 3.0 specs and interactive Swagger UI at \`/docs\`.
- **High Concurrency**: Non-blocking I/O allows handling thousands of concurrent model inference requests.`,
        code_snippet: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="CareerIQ Inference Engine")

class PredictRequest(BaseModel):
    features: list[float]
    threshold: float = 0.5

@app.post("/predict")
async def predict(req: PredictRequest):
    return {"prediction": 1, "confidence": 0.94}`,
        key_takeaway: 'FastAPI leverages native Python type hints for automatic validation, serialization, and interactive Swagger documentation.'
      },
      {
        id: 'fastapi_l2',
        title: 'Data Validation with Pydantic V2',
        order: 2,
        duration_minutes: 30,
        content: `### Enforcing Strict Input Schemas
Machine learning models fail catastrophically when fed malformed inputs. Pydantic validates incoming JSON payloads before your handler logic executes.

Using Field constraints:
- \`ge\` / \`le\`: greater/less than or equal to.
- \`min_length\` / \`max_length\`: string bounds.
- Custom field validators for data domain rules.`,
        code_snippet: `from pydantic import BaseModel, Field, field_validator

class CandidateProfile(BaseModel):
    full_name: string = Field(..., min_length=2)
    years_experience: float = Field(..., ge=0, le=50)
    target_role: string

    @field_validator('target_role')
    def validate_role(cls, v):
        allowed = ['AI/ML Engineer', 'Data Scientist', 'Software Engineer']
        if v not in allowed:
            raise ValueError(f"Role must be in {allowed}")
        return v`,
        key_takeaway: 'Pydantic prevents garbage input from ever reaching ML models or databases with fail-fast validation.'
      },
      {
        id: 'fastapi_l3',
        title: 'Production ML Model Ingestion & Caching',
        order: 3,
        duration_minutes: 35,
        content: `### Loading Heavy Models Efficiently
Never load an ML model inside an endpoint function! Doing so re-reads weights from disk on every single HTTP request.

Use the FastAPI Lifespan context manager to load model weights into application state once on startup and cleanly unload them on shutdown.`,
        code_snippet: `from contextlib import asynccontextmanager
from fastapi import FastAPI
import joblib

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup
    ml_models["classifier"] = joblib.load("models/churn_model.pkl")
    yield
    # Clean up resources on shutdown
    ml_models.clear()

app = FastAPI(lifespan=lifespan)`,
        key_takeaway: 'Use FastAPI lifespan managers to load heavy models once in memory during boot, keeping endpoints fast.'
      }
    ]
  },
  {
    id: 'course_rag',
    title: 'Vector Databases & RAG Architectures',
    tagline: 'Design retrieval-augmented generation pipelines connecting LLMs to private corporate data.',
    description: 'Understand vector embeddings, semantic chunking strategies, pgvector / ChromaDB similarity indexing, hybrid keyword-vector search, and prompt grounding to eliminate AI hallucinations.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    estimated_hours: 6,
    skills_covered: ['Retrieval-Augmented Generation (RAG)', 'Vector Databases', 'AI/ML', 'Generative AI'],
    assessment_id: 'assess_rag',
    lessons: [
      {
        id: 'rag_l1',
        title: 'Embeddings & Semantic Vector Space',
        order: 1,
        duration_minutes: 30,
        content: `### The Problem with Pure LLMs
Large Language Models have fixed knowledge cutoffs and lack access to private enterprise documents.

RAG bridges this gap:
1. Embed text chunks into high-dimensional vector space (e.g. 768 or 1536 dimensions).
2. Store vectors in a specialized index (HNSW, IVFFlat).
3. At query time, convert the user prompt to a vector, find the top nearest neighbors via cosine similarity, and inject them into the LLM context.`,
        code_snippet: `# Cosine similarity formula:
# similarity = dot(A, B) / (norm(A) * norm(B))

import numpy as np

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))`,
        key_takeaway: 'RAG converts unstructured text into dense vectors so semantic search can find relevant knowledge for prompt injection.'
      },
      {
        id: 'rag_l2',
        title: 'Chunking Strategies & Context Windows',
        order: 2,
        duration_minutes: 30,
        content: `### Chunk Size vs Semantic Coherence
Naive fixed-character chunking splits sentences in half, ruining semantic meaning.

Chunking Best Practices:
- **Chunk Size**: 500-1000 tokens preserves single thoughts.
- **Overlap**: 10-20% chunk overlap ensures boundaries between paragraphs maintain connective context.
- **Metadata**: Attach document ID, section title, and timestamp to each vector for filtered retrieval.`,
        code_snippet: `def recursive_chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks`,
        key_takeaway: 'Use overlapping chunks with rich metadata to ensure context is never split across arbitrary token boundaries.'
      },
      {
        id: 'rag_l3',
        title: 'Grounding & Preventing Hallucinations',
        order: 3,
        duration_minutes: 35,
        content: `### Strict Context Grounding in Production
To guarantee the model only answers based on provided documents:
1. Instruct the system prompt: "Only use facts directly stated in the context snippets. If the context does not contain the answer, reply: 'I do not have enough information'."
2. Include source citations in the response structure.
3. Compute semantic similarity between the generated answer and retrieved source snippets to verify factual consistency.`,
        code_snippet: `SYSTEM_PROMPT = """
You are CareerIQ AI. Answer the query ONLY using the verified context sources below.
If the answer cannot be deduced from the sources, state clearly that you do not have sufficient data.
Always cite the Source ID for every claim.
"""`,
        key_takeaway: 'Explicit grounding prompts combined with automated citation checking prevents LLM hallucinations.'
      }
    ]
  },
  {
    id: 'course_mlops',
    title: 'MLOps Fundamentals & CI/CD',
    tagline: 'Automate experiment tracking, data validation, and model deployment pipelines.',
    description: 'Learn the principles of Continuous Integration & Continuous Delivery for Machine Learning. Track experiments with MLflow, version datasets with DVC, and automate test pipelines with GitHub Actions.',
    category: 'Cloud & DevOps',
    difficulty: 'Intermediate',
    estimated_hours: 5,
    skills_covered: ['MLOps', 'CI/CD', 'Docker', 'Machine Learning'],
    assessment_id: 'assess_mlops',
    lessons: [
      {
        id: 'mlops_l1',
        title: 'The ML Technical Debt Problem',
        order: 1,
        duration_minutes: 25,
        content: `### Code is Only 5% of Production ML
Google's seminal paper "Hidden Technical Debt in Machine Learning Systems" revealed that actual ML code is a tiny fraction of a production system.

Surrounding Components:
- Data verification and schema validation
- Resource management and model monitoring
- Feature extraction pipelines
- Continuous retraining upon data drift`,
        code_snippet: `# Track model parameters and metrics
import mlflow

with mlflow.start_run():
    mlflow.log_param("learning_rate", 0.01)
    mlflow.log_metric("validation_accuracy", 0.94)
    mlflow.sklearn.log_model(model, "random_forest_model")`,
        key_takeaway: 'MLOps automates the 95% of software infrastructure surrounding machine learning algorithms.'
      },
      {
        id: 'mlops_l2',
        title: 'Detecting Concept & Data Drift',
        order: 2,
        duration_minutes: 30,
        content: `### When Production Models Fail
In production, user behavior changes over time. When input feature distributions shift (data drift) or the relationship between features and target labels changes (concept drift), model accuracy degrades.

Automated drift alerts monitor statistical tests (e.g. Kolmogorov-Smirnov test, Population Stability Index) to trigger retraining pipelines before users notice degraded recommendations.`,
        code_snippet: `from scipy.stats import ks_2samp

def detect_drift(baseline_data, current_data, p_val_threshold=0.05):
    stat, p_val = ks_2samp(baseline_data, current_data)
    return p_val < p_val_threshold # True indicates statistically significant drift`,
        key_takeaway: 'Continuous statistical monitoring flags data and concept drift to trigger automated model retraining.'
      }
    ]
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess_docker',
    course_id: 'course_docker',
    target_skill: 'Docker',
    title: 'Docker & Containerization Skill Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_d1',
        question: 'What is the primary difference between a Docker container and a traditional Virtual Machine?',
        type: 'mcq',
        options: [
          'Containers share the host operating system kernel, whereas VMs run an entire guest operating system.',
          'Containers require dedicated hardware hypervisors (Type 1), while VMs do not.',
          'Virtual Machines start up faster than Docker containers.',
          'Docker containers cannot be networked or assigned IP addresses.'
        ],
        correct_index: 0,
        explanation: 'Docker containers share the host kernel and isolate processes via namespaces and cgroups, eliminating guest OS overhead.'
      },
      {
        id: 'q_d2',
        question: 'Why should you place "COPY requirements.txt ." and "RUN pip install -r requirements.txt" BEFORE "COPY src/ ." in a Dockerfile?',
        type: 'scenario',
        options: [
          'It is required by Python syntax to run in that order.',
          'To leverage Docker layer caching so expensive dependency installs do not re-run every time application code changes.',
          'To ensure the root user is downgraded to a standard user.',
          'Because pip cannot find requirements.txt if source code is already present.'
        ],
        correct_index: 1,
        explanation: 'Docker caches layers sequentially. Placing dependency installation before source code changes allows Docker to reuse the cached dependency layer.'
      },
      {
        id: 'q_d3',
        question: 'In a multi-stage Docker build, what is the primary objective of using "COPY --from=builder"?',
        type: 'code',
        options: [
          'To transfer heavy compilers and build SDKs into the final production image.',
          'To copy only the compiled artifacts or wheels into a minimal, secure production image without build tool bloat.',
          'To execute unit tests during runtime.',
          'To connect the container to an external Docker volume.'
        ],
        correct_index: 1,
        explanation: 'Multi-stage builds leave compiler SDKs and temporary files in the build stage, copying only necessary artifacts to minimize production image size.'
      },
      {
        id: 'q_d4',
        question: 'Which docker-compose configuration property ensures a service named "api" waits for the "db" container to start?',
        type: 'mcq',
        options: [
          'networks: [db_net]',
          'depends_on: [db]',
          'volumes: [db]',
          'links_to: [db]'
        ],
        correct_index: 1,
        explanation: '"depends_on" controls startup order in Docker Compose, ensuring the database container boots before dependent applications.'
      }
    ]
  },
  {
    id: 'assess_fastapi',
    course_id: 'course_fastapi',
    target_skill: 'FastAPI',
    title: 'FastAPI & Production Serving Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_f1',
        question: 'How does FastAPI achieve automated input validation and serialization?',
        type: 'mcq',
        options: [
          'Through manual regular expression matching in endpoint decorators.',
          'By leveraging standard Python type hints and Pydantic models.',
          'By querying an external database schema on every request.',
          'Through Flask-RESTful plugins.'
        ],
        correct_index: 1,
        explanation: 'FastAPI inspects Python type hints and Pydantic schema declarations to automatically validate query/body parameters and generate OpenAPI documentation.'
      },
      {
        id: 'q_f2',
        question: 'When serving an ML model in FastAPI, where should the model weights (e.g. model.pkl) be loaded?',
        type: 'scenario',
        options: [
          'Inside each endpoint route function right before calling predict().',
          'In the FastAPI lifespan context manager or global startup handler so it loads once into memory.',
          'In client-side JavaScript before sending the HTTP request.',
          'Re-downloaded from S3 on every POST /predict invocation.'
        ],
        correct_index: 1,
        explanation: 'Loading model weights takes seconds and heavy I/O. Using FastAPI lifespan managers loads the model into RAM once at boot time.'
      },
      {
        id: 'q_f3',
        question: 'What happens when a client sends a payload missing a required field to a FastAPI route typed with a Pydantic model?',
        type: 'code',
        options: [
          'FastAPI crashes the server with an unhandled exception.',
          'FastAPI automatically fills the missing value with null.',
          'FastAPI immediately returns a 422 Unprocessable Entity status with clear JSON error details identifying the missing field.',
          'FastAPI returns a 500 Internal Server Error.'
        ],
        correct_index: 2,
        explanation: 'FastAPI automatically catches validation failures and responds with HTTP 422 with exact field error locations.'
      }
    ]
  },
  {
    id: 'assess_rag',
    course_id: 'course_rag',
    target_skill: 'Retrieval-Augmented Generation (RAG)',
    title: 'RAG & Vector Architecture Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_r1',
        question: 'In a RAG system, what is the role of a Vector Database like pgvector or Chroma?',
        type: 'mcq',
        options: [
          'To generate Python code on the fly.',
          'To index dense embedding vectors and quickly perform approximate nearest-neighbor similarity searches.',
          'To replace traditional relational tables for user authentication.',
          'To compress video files.'
        ],
        correct_index: 1,
        explanation: 'Vector databases store mathematical representations of text chunks and execute cosine/Euclidean similarity searches to find relevant information.'
      },
      {
        id: 'q_r2',
        question: 'Why is chunk overlap (e.g. 10-20%) recommended when breaking down long documents for RAG?',
        type: 'scenario',
        options: [
          'To make the database index twice as large.',
          'To ensure semantic context is not severed if a key sentence spans across chunk boundaries.',
          'To confuse the language model into generating diverse responses.',
          'It is required by OpenAI embedding models.'
        ],
        correct_index: 1,
        explanation: 'Chunk overlap preserves continuity, ensuring that thoughts or arguments split across boundaries remain comprehensible in at least one retrieved chunk.'
      },
      {
        id: 'q_r3',
        question: 'What is the most effective way to eliminate hallucinations when prompting a grounded RAG model?',
        type: 'scenario',
        options: [
          'Increase model temperature to 1.0.',
          'Instruct the model to answer exclusively using the supplied context snippets and admit when context is insufficient, coupled with source citations.',
          'Remove all system instructions.',
          'Pass the entire database in a single prompt.'
        ],
        correct_index: 1,
        explanation: 'Strict grounding instructions requiring citations and clear instructions to state when data is missing prevents the model from confabulating answers.'
      }
    ]
  }
];

export const INITIAL_RECRUITER_JOBS: RecruiterJob[] = [
  {
    id: 'job_rec_1',
    recruiter_id: 'recruiter_system',
    title: 'Associate AI/ML Engineer',
    company: 'NeuralFlow Technologies',
    department: 'Machine Learning Engineering',
    location: 'San Francisco, CA / Remote',
    work_type: 'Hybrid',
    experience_level: 'Fresher / Junior (0-2 years)',
    salary_range: '$95,000 - $120,000',
    required_skills: ['Python', 'Machine Learning', 'FastAPI', 'Docker', 'SQL'],
    preferred_skills: ['PyTorch', 'Retrieval-Augmented Generation (RAG)', 'MLflow', 'AWS'],
    description: 'We are seeking an ambitious Associate AI/ML Engineer to build and deploy real-time model inference microservices. You will work directly with our senior research team to containerize scikit-learn and LLM pipelines, implement automated unit testing, and optimize inference latency.',
    status: 'Active',
    applicants_count: 3,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'job_rec_2',
    recruiter_id: 'recruiter_system',
    title: 'Junior Data Engineer',
    company: 'CloudScale Analytics',
    department: 'Data Platforms',
    location: 'New York, NY / Hybrid',
    work_type: 'Hybrid',
    experience_level: 'Fresher / Junior (0-2 years)',
    salary_range: '$90,000 - $115,000',
    required_skills: ['Python', 'SQL', 'PostgreSQL', 'Docker', 'Git'],
    preferred_skills: ['Apache Spark', 'AWS', 'Airflow'],
    description: 'Join our Data Infrastructure team to build reliable ETL/ELT pipelines, optimize PostgreSQL query performance, and ensure enterprise data quality for downstream analytics and machine learning applications.',
    status: 'Active',
    applicants_count: 5,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: 'job_rec_3',
    recruiter_id: 'recruiter_system',
    title: 'Full Stack AI Application Developer',
    company: 'Nexus Intelligence',
    department: 'Product Engineering',
    location: 'Remote',
    work_type: 'Remote',
    experience_level: 'Junior / Mid-Level (1-3 years)',
    salary_range: '$105,000 - $130,000',
    required_skills: ['Python', 'FastAPI', 'React', 'TypeScript', 'SQL'],
    preferred_skills: ['Docker', 'Vector Databases', 'Tailwind CSS'],
    description: 'Help us build intelligent, responsive web applications powered by generative AI. You will craft clean TypeScript/React user interfaces backed by performant asynchronous FastAPI endpoints.',
    status: 'Active',
    applicants_count: 2,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];
