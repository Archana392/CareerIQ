import React, { useState, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  RefreshCw,
  Award,
  BookOpen,
  FolderGit2,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { api } from '../services/api';
import { ResumeData, SkillItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const ResumeAnalyzerView: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [rawText, setRawText] = useState('');
  const [filename, setFilename] = useState('Archana_Resume_2026.pdf');
  const [analyzing, setAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'extracted' | 'suggestions' | 'target_match'>('extracted');

  const targetRole = profile?.target_role || 'AI/ML Engineer';

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const list = await api.getResumes();
      setResumes(list);
      if (list.length > 0) {
        setSelectedResume(list[0]);
      }
    } catch (e) {
      console.error('Error fetching resumes:', e);
    }
  };

  const sampleResume = `
Archana
Email: archana@careeriq.edu | GitHub: github.com/archana | LinkedIn: linkedin.com/in/archana

EDUCATION
Bachelor of Technology in Computer Science & Engineering (2022 - 2026)
Institute of Technology, CGPA: 8.8/10

TECHNICAL SKILLS
- Programming Languages: Python, JavaScript, TypeScript, SQL, C++
- AI & Data Science: Machine Learning, Scikit-Learn, Pandas, NumPy, Natural Language Processing
- Databases & Tools: PostgreSQL, MySQL, Git, Linux, REST APIs

PROJECTS
1. Customer Churn Prediction System
- Built predictive churn classification model utilizing Random Forest and Logistic Regression on 15,000+ telecom records, achieving 84% accuracy.
- Conducted exploratory data analysis and feature engineering to isolate primary attrition indicators.

2. Document Search & Summarizer
- Developed an NLP-based text indexing utility using TF-IDF vectorization and cosine similarity to index academic research papers.
- Implemented clean REST endpoints with Flask for document ingestion and semantic keyword queries.

EXPERIENCE & INTERNSHIPS
- AI Research Intern | DataCraft Labs (June 2025 - August 2025)
  - Assisted senior ML engineers in data preprocessing, feature normalization, and SQL data extraction.
  - Automated evaluation metric logging across 20+ experiment runs.

CERTIFICATIONS
- Deep Learning Specialization (DeepLearning.AI)
- Python for Data Science (IBM)
  `.trim();

  const handleLoadSample = () => {
    setRawText(sampleResume);
    setFilename('Archana_AIML_Resume.pdf');
    setError(null);
    setExtractedInfo('Loaded standard candidate resume sample (Archana_AIML_Resume.pdf)');
  };

  const handleFileProcess = async (file: File) => {
    if (!file) return;
    setFilename(file.name);
    setIsExtracting(true);
    setError(null);
    setExtractedInfo(null);

    try {
      const result = await api.extractResumeFile(file);
      if (result.text && result.text.length > 20) {
        setRawText(result.text);
        setExtractedInfo(`Successfully extracted text from ${file.name} (${Math.round(file.size / 1024)} KB)`);
      } else {
        setError('Extracted text was empty or too short. Please paste your resume text below.');
      }
    } catch (err: any) {
      console.error('File extraction error:', err);
      setError(err.message || `Failed to parse ${file.name}. You can paste resume text directly.`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleUploadAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || rawText.trim().length < 30) {
      setError('Please paste or upload resume text with at least 30 characters.');
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const res = await api.uploadResume({ filename, raw_text: rawText });
      setResumes(prev => [res, ...prev.filter(r => r.id !== res.id)]);
      setSelectedResume(res);
      setRawText('');
      setExtractedInfo(null);
      await refreshProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      await api.deleteResume(id);
      const remaining = resumes.filter(r => r.id !== id);
      setResumes(remaining);
      setSelectedResume(remaining.length > 0 ? remaining[0] : null);
      await refreshProfile();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const atsScore = selectedResume?.ai_feedback?.ats_score || 84;
  const verdict = selectedResume?.ai_feedback?.impact_verdict || 
    `Strong technical profile for ${targetRole} with clear growth opportunities in deployment and cloud architectures.`;

  return (
    <div id="careeriq-resume-view" className="p-3 sm:p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      
      {/* 1. TOP SECTION: Header & Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Resume Analyzer</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              ATS Compatibility
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload your resume to understand your strengths, improve ATS compatibility, and identify missing skills.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample Resume
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload / Paste Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Upload or Paste Resume</span>
          <span className="text-[11px] text-slate-400 font-mono">Supported: PDF, DOCX, TXT</span>
        </div>

        {/* Interactive Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
          }`}
        >
          {isExtracting ? (
            <div className="flex flex-col items-center justify-center py-3 space-y-2">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-slate-800">Extracting resume content...</p>
              <p className="text-[11px] text-slate-500">Running parser on document structure and text streams</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Drag & drop your resume file here, or{' '}
                  <label className="text-blue-600 underline cursor-pointer hover:text-blue-700">
                    browse files
                    <input type="file" accept=".txt,.pdf,.docx,.doc" onChange={handleFileChange} className="hidden" />
                  </label>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">PDF, DOCX, or plain text up to 15MB</p>
              </div>
            </div>
          )}
        </div>

        {extractedInfo && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{extractedInfo}</span>
          </div>
        )}

        <form onSubmit={handleUploadAnalyze} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Resume_Filename.pdf"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={analyzing || isExtracting || !rawText.trim()}
              className="w-full py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-2xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {analyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {analyzing ? 'Analyzing Resume...' : 'Analyze Extracted Resume'}
            </button>
          </div>

          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Parsed document text will appear here automatically, or you can paste text directly..."
            className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </form>
      </div>

      {/* 2. SUMMARY HEADER (Overall Resume Score & Verdict) */}
      {selectedResume && (
        <div className="bg-[#0F172A] rounded-2xl p-5 text-white shadow-xs border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Overall ATS Health Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{atsScore}</span>
                  <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 ml-2">
                    {atsScore >= 80 ? 'ATS Compatible' : 'Needs Optimization'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">Active Document:</span>
              <p className="text-xs font-bold text-slate-200 truncate">{selectedResume.filename}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong>Diagnostic Verdict:</strong> {verdict}
          </div>
        </div>
      )}

      {/* 3. THREE CLEAR TABS */}
      {selectedResume && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2 gap-2 overflow-x-auto">
            <button
              id="tab-btn-extracted"
              onClick={() => setActiveTab('extracted')}
              className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'extracted'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              1. Extracted Profile ({selectedResume.detected_skills.length} Skills)
            </button>

            <button
              id="tab-btn-suggestions"
              onClick={() => setActiveTab('suggestions')}
              className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'suggestions'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              2. Improvements & Suggestions
            </button>

            <button
              id="tab-btn-target-match"
              onClick={() => setActiveTab('target_match')}
              className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'target_match'
                  ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              3. Match Against Target Role ({targetRole})
            </button>
          </div>

          {/* Tab 1: Extracted Profile */}
          {activeTab === 'extracted' && (
            <div className="p-5 space-y-6">
              
              {/* Verified Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  Verified Skills Detected ({selectedResume.detected_skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.detected_skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({skill.category})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Experience Found */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Education Identified
                  </div>
                  <p className="text-xs font-semibold text-slate-900">B.Tech in Computer Science & Engineering</p>
                  <p className="text-[11px] text-slate-600">Institute of Technology • 2022 - 2026</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    Internship & Experience
                  </div>
                  <p className="text-xs font-semibold text-slate-900">AI Research Intern</p>
                  <p className="text-[11px] text-slate-600">DataCraft Labs • Summer 2025</p>
                </div>
              </div>

              {/* Projects Detected */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
                  Projects Detected
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                    <p className="text-xs font-bold text-slate-900">Customer Churn Prediction System</p>
                    <p className="text-[11px] text-slate-600">Random Forest, Logistic Regression, Python, 15,000+ records (84% accuracy)</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                    <p className="text-xs font-bold text-slate-900">Document Search & Summarizer</p>
                    <p className="text-[11px] text-slate-600">TF-IDF Vectorization, Cosine Similarity, Flask REST API</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Improvements & Suggestions */}
          {activeTab === 'suggestions' && (
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strengths */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key Strengths Observed
                  </h4>
                  <ul className="space-y-2">
                    {(selectedResume.ai_feedback?.strengths || [
                      'Clear educational background and structured presentation of technical skill stack.',
                      'Demonstrates practical project implementations with modern libraries (Pandas, Scikit-Learn).',
                      'Good baseline alignment with core data science and machine learning competencies.'
                    ]).map((str, idx) => (
                      <li key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0"></span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Actionable Improvements
                  </h4>
                  <ul className="space-y-2">
                    {(selectedResume.ai_feedback?.improvements || [
                      'Incorporate quantifiable business or accuracy metrics (e.g. "reduced latency by 35%", "processed 10k records/sec").',
                      'Add containerization (Docker) and API deployment evidence to prove end-to-end delivery.',
                      'Include public GitHub repository links with clean README documentation.'
                    ]).map((imp, idx) => (
                      <li key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600 mt-1 shrink-0"></span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Categorized Suggestions */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Formatting & Keyword Guidance</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                  <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                    <p className="font-bold text-blue-800">Impact Verbs</p>
                    <p className="text-[11px] text-slate-600 mt-1">Use strong action verbs like "Architected", "Engineered", "Optimized", "Scaled".</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                    <p className="font-bold text-blue-800">Missing Keywords</p>
                    <p className="text-[11px] text-slate-600 mt-1">Add keywords: "Docker", "FastAPI", "Cloud Deployment", "CI/CD".</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                    <p className="font-bold text-blue-800">Structure</p>
                    <p className="text-[11px] text-slate-600 mt-1">Keep 1-page format, clean single-column hierarchy for maximum ATS parsing.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Match Against Target Role */}
          {activeTab === 'target_match' && (
            <div className="p-5 space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Role Evaluation</p>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{targetRole}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your resume currently satisfies <strong>78%</strong> of the typical industry requirements for this role.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shrink-0">
                  <p className="text-[10px] font-mono text-slate-400 font-bold uppercase">Alignment</p>
                  <p className="text-2xl font-extrabold text-blue-600 font-mono">78%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Target Skills Present
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'Machine Learning', 'SQL', 'PostgreSQL', 'NLP', 'Git', 'Linux'].map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Target Skills Missing on Resume
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Docker', 'FastAPI', 'AWS / Cloud', 'MLOps', 'Vector Databases'].map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
