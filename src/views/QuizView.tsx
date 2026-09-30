import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { generateQuiz } from '../api';
import { QuizResponse, QuizQuestion, ActivityItem } from '../types';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Trophy,
  Award,
  AlertTriangle,
  Lightbulb,
  Send,
  Check
} from 'lucide-react';

interface QuizViewProps {
  onSaveActivity?: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  initialTopic?: string;
  onNavigateTo?: (route: any, payload?: any) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  onSaveActivity,
  initialTopic = '',
  onNavigateTo,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active quiz state
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const sampleTopics = [
    "Python Functions & Scope",
    "Cellular Respiration",
    "World War II Key Battles",
    "Calculus Derivatives & Integrals",
    "Microeconomics Market Structures",
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {
      setError('Please enter a topic for the quiz.');
      return;
    }
    if (trimmed.length > 12000) {
      setError('Topic exceeds character limit.');
      return;
    }

    setLoading(true);
    setError(null);
    setQuizData(null);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);

    try {
      const res = await generateQuiz(trimmed, difficulty);
      setQuizData(res);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating your quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const handleNext = () => {
    if (!quizData) return;
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;
    setSubmitted(true);

    // Calculate score
    let correctCount = 0;
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / quizData.questions.length) * 100);

    // Trigger celebration if passed
    if (percent >= 66) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    }

    if (onSaveActivity) {
      onSaveActivity({
        type: 'quiz',
        title: `Quiz: ${topic} (${difficulty})`,
        snippet: `Scored ${correctCount}/${quizData.questions.length} (${percent}%) on ${topic}`,
        data: { topic, difficulty, score: correctCount, total: quizData.questions.length, percent },
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  const currentQ: QuizQuestion | undefined = quizData?.questions[currentIndex];
  const totalQuestions = quizData?.questions.length || 3;

  // Score calculation
  const correctCount = quizData
    ? quizData.questions.filter((q, idx) => selectedAnswers[idx] === q.answer).length
    : 0;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Interactive AI Knowledge Check</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Quiz Generator
        </h1>
        <p className="mt-2 text-slate-600 text-base sm:text-lg">
          Test your understanding with 3 precision multiple-choice questions tailored to your topic and difficulty.
        </p>
      </div>

      {/* Input Card */}
      {!quizData && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
          <form onSubmit={handleGenerate}>
            <div className="mb-5">
              <label htmlFor="quiz-topic" className="block text-sm font-bold text-slate-800 mb-2">
                Quiz Topic
              </label>
              <input
                id="quiz-topic"
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Example: Python Functions, Cell Division, Cold War, Trigonometry..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base transition-all"
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold capitalize border transition-all cursor-pointer ${
                      difficulty === d
                        ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-2xs font-bold ring-2 ring-amber-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            <div className="pt-3 border-t border-slate-100 mb-6">
              <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick suggestions:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleTopics.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(s);
                      if (error) setError(null);
                    }}
                    className="text-xs bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-200 transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating Quiz Questions...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-8 animate-pulse mb-8 space-y-4">
          <div className="h-4 bg-amber-100 rounded w-24"></div>
          <div className="h-6 bg-slate-200 rounded w-4/5"></div>
          <div className="space-y-3 pt-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl w-full"></div>
            ))}
          </div>
        </div>
      )}

      {/* Active Quiz Interaction Card */}
      {quizData && !submitted && currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 mb-8 animate-in fade-in">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <h2 className="text-sm font-semibold text-slate-500 capitalize">{topic} ({difficulty})</h2>
            </div>
            {/* Step bubbles */}
            <div className="flex items-center gap-1.5">
              {quizData.questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-amber-600 scale-125'
                      : selectedAnswers[idx]
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-6">
            {currentQ.question}
          </h3>

          {/* 4 Options touch-friendly buttons */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === option;
              const optionLetter = ['A', 'B', 'C', 'D'][optIdx];

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer text-sm sm:text-base ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 text-slate-900 ring-2 ring-amber-400/40 font-semibold shadow-xs'
                      : 'bg-slate-50/60 hover:bg-slate-100/90 border-slate-200 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className="leading-relaxed flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Previous
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedAnswers[currentIndex]}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-semibold text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Submit Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Results Screen */}
      {quizData && submitted && (
        <div className="space-y-6 animate-in fade-in duration-300 mb-12">
          {/* Score Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 text-center">
            <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-600 mb-3">
              {scorePercent >= 66 ? <Trophy className="w-8 h-8" /> : <Award className="w-8 h-8" />}
            </div>

            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">
              Your Quiz Result
            </h2>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">{correctCount}</span>
              <span className="text-2xl text-slate-400 font-bold">/ {totalQuestions}</span>
            </div>

            {/* Score Percentage Pill */}
            <div className="inline-block px-4 py-1.5 rounded-full text-base font-extrabold mb-4"
              style={{
                backgroundColor: scorePercent >= 66 ? '#ecfdf5' : '#fffbeb',
                color: scorePercent >= 66 ? '#065f46' : '#92400e',
              }}
            >
              {scorePercent}% Correct
            </div>

            <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
              {scorePercent === 100
                ? 'Outstanding! You have mastered this concept completely.'
                : scorePercent >= 66
                ? 'Great job! You have a solid grasp of this material.'
                : 'Good effort! Review the explanations below to reinforce your knowledge.'}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuizData(null);
                  setSelectedAnswers({});
                  setSubmitted(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate New Quiz</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review Cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>Detailed Answer Review & Explanations</span>
            </h3>

            {quizData.questions.map((q, idx) => {
              const userSelection = selectedAnswers[idx];
              const isCorrect = userSelection === q.answer;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border shadow-2xs transition-all ${
                    isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-4 leading-snug">
                    {q.question}
                  </h4>

                  {/* Options breakdown */}
                  <div className="space-y-2 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const wasSelectedByUser = userSelection === opt;
                      const isTargetCorrect = q.answer === opt;

                      let badgeStyle = 'bg-slate-50 border-slate-200 text-slate-600';
                      if (isTargetCorrect) {
                        badgeStyle = 'bg-emerald-50/90 border-emerald-300 text-emerald-900 font-semibold';
                      } else if (wasSelectedByUser && !isTargetCorrect) {
                        badgeStyle = 'bg-rose-50/90 border-rose-300 text-rose-900 font-semibold line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2 ${badgeStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs w-5 text-slate-400">
                              {['A', 'B', 'C', 'D'][optIdx]}.
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isTargetCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700 shrink-0 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Correct Answer</span>
                            </span>
                          )}
                          {wasSelectedByUser && !isTargetCorrect && (
                            <span className="text-[11px] font-bold text-rose-700 shrink-0">
                              Your Selection
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Short educational explanation */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                    <span className="font-bold text-slate-900 block mb-1">Explanation:</span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Learn More link */}
          {onNavigateTo && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigateTo('explain', { topic })}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                Need to review this concept in depth? Open Concept Explainer →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
