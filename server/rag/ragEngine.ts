import { KnowledgeDocument, RAGChatCitation, UserProfile, SkillItem, SkillGapItem } from '../../src/types';
import { getDB } from '../database/db';
import { TfIdfEngine, tokenizeText } from '../ml/nlpEngine';

export interface RAGRetrievalResult {
  contextText: string;
  citations: RAGChatCitation[];
  groundingDocumentsCount: number;
}

/**
 * RAG Vector Retrieval Service for grounding CareerIQ AI Assistant & Career Advice
 */
export class RAGService {
  /**
   * Retrieve top-k relevant knowledge documents matching user query
   */
  public static retrieveContext(query: string, topK: number = 3): RAGRetrievalResult {
    const db = getDB();
    const docs = db.knowledge_documents;

    if (!docs || docs.length === 0) {
      return {
        contextText: 'No knowledge base documents currently indexed.',
        citations: [],
        groundingDocumentsCount: 0
      };
    }

    // Prepare corpus for TF-IDF Vector Space Retrieval
    const corpus = docs.map(d => `${d.title} ${d.tags.join(' ')} ${d.content}`);
    const engine = new TfIdfEngine(corpus);

    const queryVector = engine.transform(query);
    const scoredDocs = docs.map((doc, idx) => {
      const docVector = engine.transform(corpus[idx]);
      const similarity = TfIdfEngine.cosineSimilarity(queryVector, docVector);
      return { doc, similarity };
    });

    // Sort by descending similarity
    scoredDocs.sort((a, b) => b.similarity - a.similarity);

    // Pick top K with threshold or fallback to top items if general query
    const topMatches = scoredDocs.filter(m => m.similarity > 0.05).slice(0, topK);
    const finalMatches = topMatches.length > 0 ? topMatches : scoredDocs.slice(0, 2);

    const citations: RAGChatCitation[] = finalMatches.map(m => {
      // Extract most relevant snippet
      const queryTokens = tokenizeText(query);
      const paragraphs = m.doc.content.split('\n\n').filter(p => p.trim().length > 20);
      let bestSnippet = paragraphs[0] || m.doc.content.slice(0, 200);

      for (const p of paragraphs) {
        if (queryTokens.some(t => p.toLowerCase().includes(t))) {
          bestSnippet = p.trim().slice(0, 220) + '...';
          break;
        }
      }

      return {
        document_id: m.doc.id,
        title: m.doc.title,
        category: m.doc.category,
        excerpt: bestSnippet
      };
    });

    const contextText = finalMatches
      .map((m, idx) => `[Source ${idx + 1}: ${m.doc.title} (${m.doc.category})]\n${m.doc.content}`)
      .join('\n\n---\n\n');

    return {
      contextText,
      citations,
      groundingDocumentsCount: finalMatches.length
    };
  }

  /**
   * Build complete prompt combining User Profile, Skill Gaps, and RAG Grounding Context
   */
  public static buildGroundedPrompt(
    userMessage: string,
    profile: UserProfile | null,
    skills: SkillItem[],
    skillGaps: SkillGapItem[],
    ragResult: RAGRetrievalResult
  ): string {
    const userSkillNames = skills.length > 0 ? skills.map(s => s.name).join(', ') : 'No skills uploaded or verified yet';
    const missingHighGaps = skillGaps.length > 0 ? skillGaps.filter(g => g.priority === 'HIGH').map(g => g.skill_name).join(', ') : 'No gaps calculated yet (requires resume analysis)';

    return `
You are CareerIQ AI, an explainable, data-driven career intelligence and employability assistant.
Your mission is to provide accurate, honest, and grounded career advice.

IMPORTANT INSTRUCTION:
CareerIQ NEVER invents or assumes user information. If the candidate has not uploaded a resume or has 0 verified skills, state clearly that their profile has no uploaded resume on file yet. Do not fabricate skills like Python or SQL unless they are in "Current Verified Skills". You can still answer general career questions, explain industry trends, and recommend learning paths.

=== GROUNDING KNOWLEDGE BASE INFORMATION ===
${ragResult.contextText}

=== CANDIDATE PROFILE (LIVE USER DATA) ===
- Name: ${profile?.full_name || 'User'}
- Degree & Education: ${profile?.degree || 'Not specified'} (${profile?.university || 'Not specified'})
- Experience Level: ${profile?.experience_level || 'Student'}
- Target Role: ${profile?.target_role || 'AI/ML Engineer'}
- Target Industry: ${profile?.target_industry || 'Software & Technology'}
- Current Verified Skills: ${userSkillNames}
- Primary Identified Skill Gaps (High Priority): ${missingHighGaps}

=== USER QUERY ===
"${userMessage}"

=== INSTRUCTIONS & RESPONSIBLE AI RULES ===
1. Use the grounding knowledge base and candidate profile to provide a clear, empathetic, and actionable response.
2. If the user asks what to learn next or how to improve, reference their target role (${profile?.target_role || 'AI/ML Engineer'}) and prioritize their specific missing skills (${missingHighGaps}).
3. Do NOT make unrealistic guarantees (e.g. "You are 100% guaranteed a job"). Use responsible language: "AI-assisted recommendation", "Estimated match", "Potential skill gap".
4. Maintain an encouraging, professional, and mentor-like tone.
5. Format key recommendations with bullet points and clear step-by-step guidance.
    `.trim();
  }
}
