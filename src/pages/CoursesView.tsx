import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  PlayCircle,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck2,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { Course, Assessment, AssessmentAttempt } from '../types';
import { useAuth } from '../context/AuthContext';

export const CoursesView: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'assessments'>('courses');
  
  // Courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Assessments state
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    loadCourses();
    loadAssessments();
  }, []);

  const loadCourses = async () => {
    try {
      const list = await api.getCourses();
      setCourses(list);
    } catch (e) {
      console.error('Error fetching courses:', e);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadAssessments = async () => {
    try {
      const [list, hist] = await Promise.all([
        api.getAssessments().catch(() => []),
        api.getAssessmentAttempts().catch(() => [])
      ]);
      setAssessments(list);
      setAttempts(hist);
    } catch (e) {
      console.error('Error fetching assessments:', e);
    } finally {
      setLoadingAssessments(false);
    }
  };

  const handleToggleLesson = async (courseId: string, lessonId: string) => {
    try {
      const updated = await api.updateCourseProgress(courseId, lessonId);
      setCourses(prev => prev.map(c => c.id === courseId ? updated.course : c));
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(updated.course);
      }
    } catch (e) {
      console.error('Failed to toggle lesson:', e);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    try {
      const detail = await api.getAssessment(quizId);
      setSelectedAssessment(detail);
      setQuizAnswers({});
      setQuizResult(null);
    } catch (e) {
      console.error('Failed to load quiz details:', e);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedAssessment) return;
    const answerPayload = Object.entries(quizAnswers).map(([question_id, selected_index]) => ({
      question_id,
      selected_index: Number(selected_index)
    }));

    if (answerPayload.length < selectedAssessment.questions.length) {
      alert(`Please answer all ${selectedAssessment.questions.length} questions before submitting.`);
      return;
    }

    setQuizSubmitting(true);
    try {
      const res = await api.submitAssessment(selectedAssessment.id, answerPayload);
      setQuizResult(res);
      await refreshProfile();
      await loadAssessments();
    } catch (e: any) {
      alert(e.message || 'Submission failed');
    } finally {
      setQuizSubmitting(false);
    }
  };

  const filteredCourses = categoryFilter === 'All'
    ? courses
    : courses.filter(c => c.category.toLowerCase().includes(categoryFilter.toLowerCase()) || c.skill_targeted.toLowerCase().includes(categoryFilter.toLowerCase()));

  return (
    <div id="careeriq-courses-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-7 text-white shadow-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Skill Mastery & Verification</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Courses & Skill Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Close your skill gaps through targeted micro-courses and earn verified skill badges via proctored assessments to boost your career readiness score.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Curated Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'assessments'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Skill Quizzes ({assessments.length})
          </button>
        </div>
      </div>

      {/* TAB 1: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-5">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'AI/ML', 'Cloud', 'Data', 'Web'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const progress = course.progress_percentage || 0;
              const completedCount = course.completed_lessons?.length || 0;
              const totalCount = course.lessons?.length || 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration_hours} hrs
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="text-slate-500">Skill:</span>
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {course.skill_targeted}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar & Open Syllabus */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">{completedCount} of {totalCount} lessons</span>
                      <span className="font-bold text-blue-600 font-mono">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 mt-2"
                    >
                      <span>{progress > 0 ? 'Continue Lessons' : 'View Syllabus'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ASSESSMENTS */}
      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-emerald-400 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Passing Grade: {quiz.passing_score_percentage}%
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {quiz.question_count} Questions
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{quiz.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{quiz.description}</p>
                  
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Awards verified badge in: <strong>{quiz.skill_name}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Take Skill Assessment</span>
                </button>
              </div>
            ))}
          </div>

          {/* Past Attempts History */}
          {attempts.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Your Assessment History ({attempts.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {attempts.map((att) => (
                  <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{att.assessment_id.replace('quiz_', '').toUpperCase()} Certification</p>
                      <p className="text-[11px] text-slate-400">{new Date(att.completed_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{att.score_percentage}%</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        att.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {att.passed ? 'Passed' : 'Needs Practice'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* COURSE SYLLABUS MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">Syllabus & Lessons</span>
                <h3 className="text-base font-bold text-slate-900">{selectedCourse.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              <p className="text-xs text-slate-600 leading-relaxed">{selectedCourse.description}</p>
              
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Lessons:</p>
                <div className="space-y-2">
                  {selectedCourse.lessons?.map((lesson, idx) => {
                    const isDone = selectedCourse.completed_lessons?.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleToggleLesson(selectedCourse.id, lesson.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isDone
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{lesson.title}</p>
                            <p className="text-[11px] text-slate-400">{lesson.duration_minutes} min</p>
                          </div>
                        </div>
                        <span className={`text-[11px] font-bold ${isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {isDone ? 'Completed' : 'Mark Done'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                Progress: {selectedCourse.progress_percentage || 0}%
              </span>
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Close Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SKILL ASSESSMENT MODAL */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Skill Assessment
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedAssessment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {quizResult ? (
                /* Result View */
                <div className="space-y-4 text-center py-4">
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                    quizResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {quizResult.passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      {quizResult.passed ? 'Skill Verification Passed!' : 'Assessment Not Passed'}
                    </h4>
                    <p className="text-3xl font-extrabold font-mono mt-1 text-blue-600">
                      {quizResult.score_percentage}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Passing score: {quizResult.passing_score}%
                    </p>
                  </div>

                  {quizResult.passed ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 max-w-md mx-auto">
                      🎉 Congratulations! <strong>{quizResult.skill_verified}</strong> has been verified and added to your profile. Your Career Readiness Score has increased!
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 max-w-md mx-auto">
                      Review the concepts in the Course curriculum and try the assessment again when ready.
                    </div>
                  )}

                  {/* Question Explanations */}
                  <div className="text-left space-y-3 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Detailed Feedback:</p>
                    {quizResult.results?.map((resItem: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Question {i + 1}</span>
                          <span className={`font-bold ${resItem.is_correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {resItem.is_correct ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{resItem.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Question List */
                <div className="space-y-6">
                  {selectedAssessment.questions?.map((q, qIndex) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        {qIndex + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = quizAnswers[q.id] === optIndex;
                          return (
                            <div
                              key={optIndex}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIndex }))}
                              className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                              }`}>
                                {isSelected && '✓'}
                              </div>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {quizResult ? (
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Return to Courses
                </button>
              ) : (
                <>
                  <span className="text-xs text-slate-500">
                    Answered {Object.keys(quizAnswers).length} of {selectedAssessment.questions?.length}
                  </span>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={quizSubmitting || Object.keys(quizAnswers).length < selectedAssessment.questions?.length}
                    className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-all disabled:opacity-40"
                  >
                    {quizSubmitting ? 'Grading Assessment...' : 'Submit Answers'}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
