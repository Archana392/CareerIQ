import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck2,
  Check,
  Code,
  Lightbulb,
  ListOrdered,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { Course, CourseLesson, Assessment, AssessmentAttempt } from '../types';
import { useAuth } from '../context/AuthContext';

export const CoursesView: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'assessments'>('courses');
  
  // Courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
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

  const handleOpenCourse = (course: Course, lessonIndex: number = 0) => {
    setActiveCourse(course);
    if (course.lessons && course.lessons.length > 0) {
      setActiveLesson(course.lessons[lessonIndex] || course.lessons[0]);
    } else {
      setActiveLesson(null);
    }
  };

  const handleCloseCourse = () => {
    setActiveCourse(null);
    setActiveLesson(null);
  };

  const handleToggleLesson = async (courseId: string, lessonId: string) => {
    try {
      const updated = await api.updateCourseProgress(courseId, lessonId);
      setCourses(prev => prev.map(c => c.id === courseId ? updated.course : c));
      if (activeCourse && activeCourse.id === courseId) {
        setActiveCourse(updated.course);
      }
    } catch (e) {
      console.error('Failed to toggle lesson:', e);
    }
  };

  const handleNextLesson = () => {
    if (!activeCourse || !activeLesson) return;
    const currentIndex = activeCourse.lessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < activeCourse.lessons.length - 1) {
      setActiveLesson(activeCourse.lessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (!activeCourse || !activeLesson) return;
    const currentIndex = activeCourse.lessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex > 0) {
      setActiveLesson(activeCourse.lessons[currentIndex - 1]);
    }
  };

  const [quizError, setQuizError] = useState<string | null>(null);

  const handleStartQuiz = async (quizId: string) => {
    try {
      const detail = await api.getAssessment(quizId);
      setSelectedAssessment(detail);
      setQuizAnswers({});
      setQuizResult(null);
      setQuizError(null);
    } catch (e) {
      console.error('Failed to load quiz details:', e);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedAssessment) return;
    setQuizError(null);
    const answerPayload = Object.entries(quizAnswers).map(([question_id, selected_index]) => ({
      question_id,
      selected_index: Number(selected_index)
    }));

    if (answerPayload.length < selectedAssessment.questions.length) {
      setQuizError(`Please answer all ${selectedAssessment.questions.length} questions before submitting.`);
      return;
    }

    setQuizSubmitting(true);
    try {
      const res = await api.submitAssessment(selectedAssessment.id, answerPayload);
      setQuizResult(res);
      await refreshProfile();
      await loadAssessments();
    } catch (e: any) {
      setQuizError(e.message || 'Submission failed');
    } finally {
      setQuizSubmitting(false);
    }
  };

  const filteredCourses = categoryFilter === 'All'
    ? courses
    : courses.filter(c => 
        c.category?.toLowerCase().includes(categoryFilter.toLowerCase()) || 
        c.skills_covered?.some(s => s.toLowerCase().includes(categoryFilter.toLowerCase()))
      );

  return (
    <div id="careeriq-courses-view" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header Banner - Clean Professional SaaS Theme */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Learning Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Courses & Skill Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Close your skill gaps through structured, real-world technical courses with code walkthroughs, exercises, and proctored skill assessments.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0">
          <button
            onClick={() => { setActiveTab('courses'); handleCloseCourse(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curated Courses ({courses.length})
          </button>
          <button
            onClick={() => { setActiveTab('assessments'); handleCloseCourse(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'assessments'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Assessments ({assessments.length})
          </button>
        </div>
      </div>

      {/* FULL INTERACTIVE COURSE PLAYER */}
      {activeCourse && activeLesson && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-150">
          {/* Top Bar of Course Player */}
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseCourse}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors"
                title="Back to courses list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {activeCourse.category} • {activeCourse.difficulty}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {activeCourse.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-slate-500 font-medium">Progress</span>
                <p className="text-xs font-bold text-slate-800 font-mono">
                  {activeCourse.progress_percentage || 0}% Completed
                </p>
              </div>

              {activeCourse.assessment_id && (
                <button
                  onClick={() => handleStartQuiz(activeCourse.assessment_id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Take Assessment</span>
                </button>
              )}
            </div>
          </div>

          {/* Player Grid: Sidebar + Lesson Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[600px]">
            
            {/* Sidebar: Course Outline */}
            <div className="lg:col-span-4 p-4 space-y-4 bg-slate-50/50 overflow-y-auto max-h-[750px]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Course Syllabus
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {activeCourse.description}
                </p>
              </div>

              {/* Lesson Items */}
              <div className="space-y-1.5 pt-2">
                {activeCourse.lessons.map((lesson, idx) => {
                  const isCurrent = lesson.id === activeLesson.id;
                  const isCompleted = activeCourse.completed_lessons?.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                        isCurrent
                          ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-50/40 border-slate-200 hover:bg-emerald-50/60'
                          : 'bg-white border-slate-200 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLesson(activeCourse.id, lesson.id);
                          }}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-colors ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white'
                          }`}
                          title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </button>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${isCurrent ? 'text-blue-900' : 'text-slate-800'}`}>
                            {lesson.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration_minutes} min
                          </p>
                        </div>
                      </div>

                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                          Done
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Skills Covered in this course */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Skills Verified:</span>
                <div className="flex flex-wrap gap-1">
                  {activeCourse.skills_covered?.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Lesson Content Area */}
            <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                {/* Lesson Header */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  {activeLesson.module_title && (
                    <span className="text-xs font-semibold text-blue-600">
                      {activeLesson.module_title}
                    </span>
                  )}
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {activeLesson.order}. {activeLesson.title}
                  </h1>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Estimated time: {activeLesson.duration_minutes} minutes
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Self-paced interactive unit</span>
                  </div>
                </div>

                {/* Explanation / Content */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line font-normal">
                  {activeLesson.content}
                </div>

                {/* Code Snippet / Technical Example */}
                {activeLesson.code_snippet && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Code className="w-4 h-4 text-blue-600" />
                      <span>Code Walkthrough & Example:</span>
                    </div>
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-xs">
                      <pre><code>{activeLesson.code_snippet}</code></pre>
                    </div>
                  </div>
                )}

                {/* Practical Application / Exercise */}
                {activeLesson.practical_application && (
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Hands-on Exercise & Practical Application:</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                      {activeLesson.practical_application}
                    </p>
                  </div>
                )}

                {/* Key Takeaway */}
                {activeLesson.key_takeaway && (
                  <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <Lightbulb className="w-4 h-4 text-emerald-600" />
                      <span>Core Takeaway:</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {activeLesson.key_takeaway}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Navigation Toolbar */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handlePrevLesson}
                    disabled={activeCourse.lessons.findIndex(l => l.id === activeLesson.id) === 0}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Lesson</span>
                  </button>

                  <button
                    onClick={() => handleToggleLesson(activeCourse.id, activeLesson.id)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeCourse.completed_lessons?.includes(activeLesson.id)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{activeCourse.completed_lessons?.includes(activeLesson.id) ? 'Completed' : 'Mark as Complete'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {activeCourse.lessons.findIndex(l => l.id === activeLesson.id) < activeCourse.lessons.length - 1 ? (
                    <button
                      onClick={handleNextLesson}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : activeCourse.assessment_id ? (
                    <button
                      onClick={() => handleStartQuiz(activeCourse.assessment_id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>Take Assessment</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCloseCourse}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
                    >
                      Back to Courses
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 1: COURSES DIRECTORY */}
      {activeTab === 'courses' && !activeCourse && (
        <div className="space-y-5">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Programming', 'Data Structures', 'Web & APIs', 'Databases', 'Tools', 'Cloud & DevOps', 'Software Engineering', 'Career Prep'].map(cat => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const progress = course.progress_percentage || 0;
              const completedCount = course.completed_lessons?.length || 0;
              const totalCount = course.lessons?.length || 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.estimated_hours || 4} hrs
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.tagline || course.description}
                    </p>

                    <div className="pt-1">
                      <div className="flex flex-wrap gap-1">
                        {course.skills_covered?.slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Start Learning CTA */}
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
                      onClick={() => handleOpenCourse(course)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs mt-2"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{progress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
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
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Passing Grade: {quiz.passing_score_percentage || 70}%
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {quiz.question_count || 3} Questions
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
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Your Assessment History ({attempts.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {attempts.map((att) => (
                  <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{att.assessment_id.replace('assess_', '').toUpperCase()} Certification</p>
                      <p className="text-[11px] text-slate-400">{new Date(att.completed_at || Date.now()).toLocaleDateString()}</p>
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
              {quizError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{quizError}</span>
                </div>
              )}
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
                        <p className="font-semibold text-slate-800">Q{i + 1}: {resItem.question}</p>
                        <p className={resItem.is_correct ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                          {resItem.is_correct ? '✓ Correct' : '✗ Incorrect'}
                        </p>
                        <p className="text-slate-600 italic">{resItem.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAssessment(null);
                      setQuizResult(null);
                    }}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Question List */
                <div className="space-y-6">
                  {selectedAssessment.questions?.map((q, qIndex) => (
                    <div key={q.id} className="space-y-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900">
                          {q.question}
                        </p>
                      </div>

                      <div className="space-y-2 pl-7">
                        {q.options?.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs transition-all ${
                              quizAnswers[q.id] === optIdx
                                ? 'bg-blue-50 border-blue-500 text-blue-950 font-medium'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz_${q.id}`}
                              checked={quizAnswers[q.id] === optIdx}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!quizResult && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Answered: {Object.keys(quizAnswers).length} of {selectedAssessment.questions?.length || 0}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={quizSubmitting || Object.keys(quizAnswers).length < (selectedAssessment.questions?.length || 0)}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all disabled:opacity-50 shadow-xs"
                  >
                    {quizSubmitting ? 'Evaluating...' : 'Submit Answers'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
