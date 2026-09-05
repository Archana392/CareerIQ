import { SKILL_TAXONOMY } from '../database/seedData';
import { SkillItem, JobMatchExplanation, CareerReadinessScore, FutureReadinessReport, IndustryTrendItem } from '../../src/types';

// Stop words for NLP tokenization
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
  'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s',
  'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you',
  'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize and normalize text into clean lower-cased tokens
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * TF-IDF Vectorizer & Cosine Similarity Implementation
 */
export class TfIdfEngine {
  private vocabulary: Map<string, number> = new Map();
  private idf: Map<string, number> = new Map();

  constructor(corpus: string[] = []) {
    if (corpus.length > 0) {
      this.fit(corpus);
    }
  }

  public fit(docs: string[]) {
    const docCount = docs.length;
    const docFreq: Map<string, number> = new Map();

    docs.forEach(doc => {
      const tokens = new Set(tokenizeText(doc));
      tokens.forEach(token => {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      });
    });

    let index = 0;
    docFreq.forEach((freq, token) => {
      this.vocabulary.set(token, index++);
      // Standard smooth IDF formula: ln((1 + N) / (1 + df)) + 1
      const idfScore = Math.log((1 + docCount) / (1 + freq)) + 1;
      this.idf.set(token, idfScore);
    });
  }

  public transform(text: string): number[] {
    const tokens = tokenizeText(text);
    const vector = new Array(this.vocabulary.size).fill(0);
    const termFreq: Map<string, number> = new Map();

    tokens.forEach(t => {
      termFreq.set(t, (termFreq.get(t) || 0) + 1);
    });

    termFreq.forEach((tf, token) => {
      if (this.vocabulary.has(token)) {
        const idx = this.vocabulary.get(token)!;
        const idfVal = this.idf.get(token) || 1;
        vector[idx] = (tf / tokens.length) * idfVal;
      }
    });

    return vector;
  }

  public static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA.length || !vecB.length || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

/**
 * Skill Normalization & Extraction
 */
export function normalizeSkillName(rawName: string): { normalized: string; category: SkillItem['category']; original: string } {
  const clean = rawName.trim().toLowerCase();

  for (const entry of SKILL_TAXONOMY) {
    if (entry.name.toLowerCase() === clean) {
      return { normalized: entry.name, category: entry.category, original: rawName };
    }
    for (const alias of entry.aliases) {
      if (alias.toLowerCase() === clean) {
        return { normalized: entry.name, category: entry.category, original: rawName };
      }
    }
  }

  // Fallback for custom or unmapped skill
  const titleCased = rawName.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  return { normalized: titleCased, category: 'Other', original: rawName };
}

/**
 * Extract Normalized Skills from any unstructured text (Resume or Job Description)
 */
export function extractSkillsFromText(text: string): SkillItem[] {
  if (!text) return [];
  const lowerText = ` ${text.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ')} `;
  const extractedMap: Map<string, SkillItem> = new Map();

  SKILL_TAXONOMY.forEach(entry => {
    // Check main name
    const mainPattern = new RegExp(`[\\s,;()/\\[\\]]${entry.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s,;()/\\[\\]]`, 'i');
    const matchedMain = mainPattern.test(lowerText);

    let matchedAlias = false;
    for (const alias of entry.aliases) {
      const aliasPattern = new RegExp(`[\\s,;()/\\[\\]]${alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s,;()/\\[\\]]`, 'i');
      if (aliasPattern.test(lowerText)) {
        matchedAlias = true;
        break;
      }
    }

    if (matchedMain || matchedAlias) {
      if (!extractedMap.has(entry.name)) {
        extractedMap.set(entry.name, {
          id: `extracted_${entry.name.toLowerCase().replace(/\s+/g, '_')}`,
          name: entry.name,
          normalized_name: entry.name.toLowerCase(),
          category: entry.category,
          proficiency: 'Intermediate',
          source: 'resume',
          verified: true
        });
      }
    }
  });

  return Array.from(extractedMap.values());
}

/**
 * Parse structured sections from raw text
 */
export function parseResumeSections(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const detectedSkills = extractSkillsFromText(text);

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract candidate name from first few lines
  let name = 'Candidate Profile';
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/resume|curriculum vitae|cv/gi, '').trim();
    if (firstLine && firstLine.length < 40 && !firstLine.includes('@')) {
      name = firstLine;
    }
  }

  return {
    name,
    email,
    detectedSkills,
    summary: `Extracted profile for ${name}. Identified ${detectedSkills.length} technical skills across ${new Set(detectedSkills.map(s => s.category)).size} domains.`
  };
}

/**
 * Transparent Explainable AI Job Matching Engine
 * Formula:
 * Overall = 0.35 * TechSkillMatch + 0.20 * ProjectRelevance + 0.15 * EducationFit + 0.15 * ExperienceFit + 0.15 * IndustryAlignment
 */
export function calculateExplainableJobMatch(
  userSkills: SkillItem[],
  userProjects: Array<{ title: string; description: string; technologies: string[] }>,
  userExperience: Array<{ title: string; description: string; duration: string }>,
  userDegree: string,
  job: {
    required_skills: SkillItem[];
    preferred_skills: SkillItem[];
    responsibilities: string[];
    education_req: string;
    experience_req: string;
    raw_text: string;
    title: string;
  }
): JobMatchExplanation {
  const userSkillNames = new Set(userSkills.map(s => s.name.toLowerCase()));
  const requiredList = job.required_skills.length > 0 ? job.required_skills : extractSkillsFromText(job.raw_text);
  const preferredList = job.preferred_skills;

  const matching_skills: Array<{ name: string; category: string; match_type: 'exact' | 'alias' }> = [];
  const missing_skills: Array<{ name: string; category: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; is_required: boolean }> = [];
  const partial_matches: Array<{ name: string; related_to: string; reason: string }> = [];

  let requiredMatchedCount = 0;
  let preferredMatchedCount = 0;

  // Check required skills
  requiredList.forEach(req => {
    const reqLower = req.name.toLowerCase();
    if (userSkillNames.has(reqLower)) {
      matching_skills.push({ name: req.name, category: req.category, match_type: 'exact' });
      requiredMatchedCount++;
    } else {
      // Check for partial related skills
      let isPartial = false;
      if (req.category === 'AI/ML' && (userSkillNames.has('python') || userSkillNames.has('machine learning'))) {
        partial_matches.push({
          name: req.name,
          related_to: 'Python / Machine Learning Foundations',
          reason: 'You hold fundamental ML & Python experience, which serves as a pre-requisite for this skill.'
        });
        isPartial = true;
      } else if (req.category === 'Cloud & DevOps' && userSkillNames.has('linux')) {
        partial_matches.push({
          name: req.name,
          related_to: 'Linux / Systems Basics',
          reason: 'You demonstrate command-line systems proficiency which accelerates adoption.'
        });
        isPartial = true;
      }

      missing_skills.push({
        name: req.name,
        category: req.category,
        priority: 'HIGH',
        is_required: true
      });
    }
  });

  // Check preferred skills
  preferredList.forEach(pref => {
    const prefLower = pref.name.toLowerCase();
    if (userSkillNames.has(prefLower)) {
      matching_skills.push({ name: pref.name, category: pref.category, match_type: 'exact' });
      preferredMatchedCount++;
    } else {
      missing_skills.push({
        name: pref.name,
        category: pref.category,
        priority: 'MEDIUM',
        is_required: false
      });
    }
  });

  // 1. Technical Skills Score (0 - 100)
  const totalRequired = Math.max(requiredList.length, 1);
  const techBase = (requiredMatchedCount / totalRequired) * 85;
  const prefBonus = preferredList.length > 0 ? (preferredMatchedCount / preferredList.length) * 15 : 10;
  const technical_skills = Math.min(100, Math.round(techBase + prefBonus));

  // 2. Project Relevance Score (0 - 100)
  let projectTechOverlap = 0;
  userProjects.forEach(p => {
    p.technologies.forEach(t => {
      if (requiredList.some(r => r.name.toLowerCase() === t.toLowerCase())) {
        projectTechOverlap += 15;
      }
    });
  });
  const project_relevance = Math.min(95, Math.max(50, 60 + projectTechOverlap));

  // 3. Education Match Score (0 - 100)
  let education_match = 85;
  if (userDegree.toLowerCase().includes('computer') || userDegree.toLowerCase().includes('b.tech') || userDegree.toLowerCase().includes('bachelor')) {
    education_match = 100;
  } else if (userDegree.toLowerCase().includes('science') || userDegree.toLowerCase().includes('engineering')) {
    education_match = 90;
  }

  // 4. Experience Fit Score (0 - 100)
  let experience_fit = 70;
  if (userExperience.length > 0) {
    experience_fit = Math.min(95, 75 + userExperience.length * 10);
  }

  // 5. Industry Alignment Score (0 - 100)
  const industry_alignment = Math.min(95, Math.round((technical_skills * 0.5) + (project_relevance * 0.5)));

  // Weighted overall calculation:
  // 0.35 * Tech + 0.20 * Project + 0.15 * Edu + 0.15 * Exp + 0.15 * Ind
  const overall_score = Math.round(
    0.35 * technical_skills +
    0.20 * project_relevance +
    0.15 * education_match +
    0.15 * experience_fit +
    0.15 * industry_alignment
  );

  // Generate transparent narrative explanation
  const missingHighNames = missing_skills.filter(s => s.priority === 'HIGH').map(s => s.name);
  const matchingNames = matching_skills.slice(0, 4).map(s => s.name);

  let explanation_narrative = `Your profile demonstrates a ${overall_score}% overall compatibility with the ${job.title} role. `;
  if (matchingNames.length > 0) {
    explanation_narrative += `You strongly fulfill core technical competencies including ${matchingNames.join(', ')}. `;
  }
  if (missingHighNames.length > 0) {
    explanation_narrative += `The score is primarily constrained by ${missingHighNames.length} missing required requirement(s): ${missingHighNames.join(', ')}. Demonstrating these through portfolio repositories will bridge the remaining gap.`;
  } else {
    explanation_narrative += `You satisfy all mandatory technical qualifications for this position.`;
  }

  const recommendations = [
    ...(missingHighNames.length > 0 ? [`Prioritize learning and building a project covering ${missingHighNames.slice(0, 2).join(' and ')}.`] : []),
    `Align your resume project bullet points using quantified impact metrics matching the job responsibilities.`,
    `Review domain interview concepts relating to ${matchingNames[0] || 'core technologies'}.`
  ];

  return {
    overall_score,
    breakdown: {
      technical_skills,
      project_relevance,
      education_match,
      experience_fit,
      industry_alignment
    },
    matching_skills,
    missing_skills,
    partial_matches,
    explanation_narrative,
    recommendations
  };
}

/**
 * Transparent Career Readiness Score Calculation (0-100)
 */
export function calculateCareerReadiness(
  userSkills: SkillItem[],
  userProjects: Array<{ title: string; description: string; technologies: string[] }>,
  userExperience: Array<{ title: string; description: string; duration: string }>,
  targetRole: string,
  userDegree: string
): CareerReadinessScore {
  const skillCount = userSkills.length;
  const verifiedCount = userSkills.filter(s => s.verified).length;

  // Technical Skills (0-100)
  const technical_skills = Math.min(95, Math.max(45, 50 + verifiedCount * 5));

  // Projects (0-100)
  const projects = Math.min(95, Math.max(40, 50 + userProjects.length * 15));

  // Experience (0-100)
  const experience = Math.min(95, Math.max(50, 55 + userExperience.length * 15));

  // Job Alignment (0-100)
  const job_alignment = Math.min(95, Math.max(45, Math.round((technical_skills * 0.6) + (projects * 0.4))));

  // Industry Alignment (0-100)
  const industry_alignment = Math.min(95, Math.max(50, Math.round((technical_skills * 0.5) + (experience * 0.5))));

  // Future Readiness (0-100)
  const emergingSkills = userSkills.filter(s =>
    ['Generative AI', 'Retrieval-Augmented Generation (RAG)', 'MLOps', 'Docker', 'Kubernetes', 'AI Agents', 'LLMOps', 'Vector Databases'].includes(s.name)
  );
  const future_readiness = Math.min(95, Math.max(50, 60 + emergingSkills.length * 10));

  // Overall Score Calculation: 30% Tech + 20% Projects + 15% Exp + 15% JobAlign + 10% IndAlign + 10% Future
  const overall_score = Math.round(
    0.30 * technical_skills +
    0.20 * projects +
    0.15 * experience +
    0.15 * job_alignment +
    0.10 * industry_alignment +
    0.10 * future_readiness
  );

  let grade: CareerReadinessScore['grade'] = 'Developing';
  if (overall_score >= 85) grade = 'Highly Competitive';
  else if (overall_score >= 70) grade = 'Career Ready';
  else if (overall_score >= 55) grade = 'Developing';
  else grade = 'Needs Improvement';

  const strengths = [
    `Solid base with ${verifiedCount} verified technical competencies.`,
    userProjects.length > 0 ? `Portfolio contains ${userProjects.length} practical applied engineering project(s).` : 'Good theoretical grasp of foundational concepts.',
    userExperience.length > 0 ? `Demonstrated real-world experience through ${userExperience.length} professional/internship engagement(s).` : 'Standard degree accreditation.'
  ];

  const critical_gaps = [];
  if (emergingSkills.length === 0) critical_gaps.push('Low exposure to emerging 2025/2026 industry standards (Generative AI, RAG, MLOps, Containerization).');
  if (userProjects.length < 2) critical_gaps.push('Portfolio has fewer than 2 end-to-end deployed systems.');
  if (userSkills.length < 6) critical_gaps.push('Skill breadth across full-stack and cloud tooling needs expansion.');

  const explanation = `Your Career Readiness Score is calculated at ${overall_score}/100 (${grade}) based on a multi-factor assessment of your verified skill inventory, portfolio depth, real-world experience, and industry alignment for the ${targetRole} path.`;

  return {
    overall_score,
    grade,
    breakdown: {
      technical_skills,
      projects,
      experience,
      job_alignment,
      industry_alignment,
      future_readiness
    },
    explanation,
    strengths,
    critical_gaps,
    immediate_next_steps: [
      'Complete high-priority skill gap milestones on your personalized roadmap.',
      'Deploy containerized project demonstrations to public GitHub repositories.',
      'Conduct mock ATS resume scans against targeted job descriptions.'
    ],
    calculated_at: new Date().toISOString()
  };
}

/**
 * Future Readiness & Industry Signal Analyzer
 */
export function calculateFutureReadiness(
  userSkills: SkillItem[],
  targetRole: string,
  trends: IndustryTrendItem[]
): FutureReadinessReport {
  const userSkillNames = new Set(userSkills.map(s => s.name.toLowerCase()));

  const strengths: string[] = [];
  const future_gaps: string[] = [];
  const emerging_skills_to_adopt: FutureReadinessReport['emerging_skills_to_adopt'] = [];

  trends.forEach(trend => {
    const isRelevant = trend.key_roles.some(r => r.toLowerCase().includes(targetRole.toLowerCase()) || targetRole.toLowerCase().includes(r.toLowerCase()));
    if (isRelevant) {
      const hasSkill = userSkillNames.has(trend.name.toLowerCase());
      if (hasSkill) {
        strengths.push(`Adopted ${trend.name} (${trend.status})`);
      } else {
        future_gaps.push(`${trend.name} (${trend.status}) - ${trend.description.slice(0, 80)}...`);
        emerging_skills_to_adopt.push({
          skill: trend.name,
          relevance_to_user: `Crucial for ${targetRole} as the industry transitions towards ${trend.signal_type.toLowerCase()}.`,
          industry_signal: trend.growth_rate,
          priority: trend.status === 'CURRENT DEMAND' || trend.status === 'EMERGING' ? 'HIGH' : 'MEDIUM'
        });
      }
    }
  });

  const adoptedCount = strengths.length;
  const score = Math.min(95, Math.max(50, 55 + adoptedCount * 12));

  return {
    score,
    current_strengths: strengths.length > 0 ? strengths : ['Strong baseline analytical and problem solving capability'],
    future_gaps: future_gaps.slice(0, 4),
    emerging_skills_to_adopt: emerging_skills_to_adopt.slice(0, 4),
    risk_factors: [
      'Purely theoretical knowledge without API or cloud deployment experiences diminishing hiring velocity.',
      'Lack of autonomous agent and RAG grounding frameworks may limit readiness for next-generation software roles.'
    ],
    strategic_summary: `Your future readiness score of ${score}/100 reflects a strong foundational core with high upside once next-generation AI, vector search, and containerization patterns are integrated into your project portfolio.`
  };
}
