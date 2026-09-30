import React, { useState } from 'react';
import { askQuestion } from '../api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ActivityItem } from '../types';
import {
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Send,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface QaViewProps {
  onSaveActivity?: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  initialQuestion?: string;
  onNavigateTo?: (route: any, payload?: any) => void;
}

export const QaView: React.FC<QaViewProps> = ({
  onSaveActivity,
  initialQuestion = '',
  onNavigateTo,
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleQuestions = [
    "Explain Newton's laws of motion in simple terms with everyday examples.",
    "Why do cells undergo mitosis and how does it differ from meiosis?",
    "How does binary search achieve O(log n) time complexity?",
    "What were the economic causes of the Great Depression?",
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setError('Please enter a question before submitting.');
      return;
    }
    if (trimmed.length > 12000) {
      setError('Question exceeds 12,000 characters. Please shorten your input.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await askQuestion(trimmed);
      setAnswer(res.answer);
      if (onSaveActivity) {
        onSaveActivity({
          type: 'qa',
          title: trimmed.slice(0, 60) + (trimmed.length > 60 ? '...' : ''),
          snippet: res.answer.slice(0, 140) + '...',
          data: { question: trimmed, answer: res.answer },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating your answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setQuestion('');
    setAnswer(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-semibold mb-3">
          <HelpCircle className="w-4 h-4 text-sky-600" />
          <span>AI Question & Answer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ask EduGenie
        </h1>
        <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-2xl">
          Ask any educational question and get a clear, step-by-step, and student-friendly answer.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8 transition-all">
        <form onSubmit={handleSubmit}>
          <label htmlFor="qa-input" className="block text-sm font-bold text-slate-800 mb-2">
            Your Question
          </label>
          <div className="relative">
            <textarea
              id="qa-input"
              rows={4}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Example: Explain Newton's laws of motion in simple terms..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all resize-y"
              disabled={loading}
            />
          </div>

          {/* Character counter & quick samples */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <span className={question.length > 12000 ? 'text-rose-600 font-bold' : ''}>
                {question.length.toLocaleString()} / 12,000 characters
              </span>
            </div>
            {question && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Quick sample prompts */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Or try a quick sample:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuestion(sample);
                    if (error) setError(null);
                  }}
                  disabled={loading}
                  className="text-left text-xs bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-indigo-200 transition-colors cursor-pointer"
                >
                  {sample.length > 45 ? sample.slice(0, 45) + '...' : sample}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>EduGenie is thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask EduGenie</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 sm:p-8 animate-pulse mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="h-4 bg-slate-200 rounded w-36 mb-1"></div>
              <div className="h-3 bg-slate-100 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            <div className="h-20 bg-slate-100 rounded-xl w-full my-4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      )}

      {/* Response Card */}
      {answer && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 mb-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">EduGenie's Answer</h3>
                <p className="text-xs text-slate-500">Structured educational breakdown</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Answer</span>
                </>
              )}
            </button>
          </div>

          <div className="prose prose-slate max-w-none text-slate-800">
            <MarkdownRenderer content={answer} />
          </div>

          {/* Follow-up suggestions */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">Continue studying this topic:</span>
            <div className="flex flex-wrap gap-2">
              {onNavigateTo && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateTo('explain', { topic: question })}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Full Concept Explanation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTo('quiz', { topic: question })}
                    className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Generate Quiz</span>
                    <ArrowRight className="w-3 h-3" />
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
