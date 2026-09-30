import React, { useState } from 'react';
import { explainConcept } from '../api';
import { ExplanationSections, ActivityItem } from '../types';
import {
  BrainCircuit,
  Sparkles,
  BookOpen,
  Layers,
  ListOrdered,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Send,
  ArrowRight,
  Zap
} from 'lucide-react';

interface ExplainViewProps {
  onSaveActivity?: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  initialTopic?: string;
  onNavigateTo?: (route: any, payload?: any) => void;
}

export const ExplainView: React.FC<ExplainViewProps> = ({
  onSaveActivity,
  initialTopic = '',
  onNavigateTo,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [preference, setPreference] = useState<'simple' | 'detailed' | 'example-based'>('simple');
  const [result, setResult] = useState<{ answer: string; sections?: ExplanationSections } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleTopics = [
    "Photosynthesis",
    "Recursion in Computer Science",
    "CRISPR Gene Editing",
    "Supply and Demand Equilibrium",
    "Quantum Entanglement",
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {
      setError('Please enter a concept or topic to explain.');
      return;
    }
    if (trimmed.length > 12000) {
      setError('Topic exceeds 12,000 characters. Please provide a shorter input.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await explainConcept(trimmed, level, preference);
      setResult(res);
      if (onSaveActivity) {
        onSaveActivity({
          type: 'explain',
          title: `Explain: ${trimmed}`,
          snippet: res.sections?.definition || res.answer.slice(0, 120) + '...',
          data: { topic: trimmed, level, preference, res },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while explaining this concept. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTopic('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-semibold mb-3">
          <BrainCircuit className="w-4 h-4 text-purple-600" />
          <span>Deep Concept Explanation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explain a Concept
        </h1>
        <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-2xl">
          Understand complex topics through simple, step-by-step explanations, concrete examples, and common pitfalls to avoid.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
        <form onSubmit={handleSubmit}>
          {/* Topic input */}
          <div className="mb-5">
            <label htmlFor="topic-input" className="block text-sm font-bold text-slate-800 mb-2">
              Topic or Concept
            </label>
            <input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Example: Photosynthesis, Blockchain, Black Holes, Neural Networks..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all"
              disabled={loading}
            />
          </div>

          {/* Options: Level & Style Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Learning Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      level === l
                        ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-2xs font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Explanation Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'simple', label: 'Simple' },
                  { id: 'detailed', label: 'Detailed' },
                  { id: 'example-based', label: 'Examples' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPreference(p.id as any)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      preference === p.id
                        ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-2xs font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sample quick pills */}
          <div className="pt-3 border-t border-slate-100 mb-6">
            <span className="text-xs text-slate-500 font-medium mr-2">Popular topics:</span>
            <div className="inline-flex flex-wrap gap-1.5 mt-2 sm:mt-0">
              {sampleTopics.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(s);
                    if (error) setError(null);
                  }}
                  className="text-xs bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 px-2.5 py-1 rounded-md border border-slate-200 hover:border-purple-200 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {topic ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset form</span>
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>EduGenie is thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Explain This</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm animate-pulse space-y-4">
            <div className="h-6 bg-purple-100 rounded w-1/3"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse h-36"></div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse h-36"></div>
          </div>
        </div>
      )}

      {/* Result Cards Section */}
      {result && !loading && (
        <div className="space-y-5 animate-in fade-in duration-300 mb-12">
          {/* Top Bar with Copy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="font-extrabold text-xl text-slate-900 capitalize">{topic}</h2>
              <span className="text-xs text-slate-500 font-medium">
                Level: <span className="capitalize font-semibold text-purple-700">{level}</span> • Style: <span className="capitalize font-semibold text-purple-700">{preference}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Full Guide</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Full Guide</span>
                </>
              )}
            </button>
          </div>

          {result.sections ? (
            <div className="space-y-4">
              {/* 1. Simple Definition */}
              <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent p-5 sm:p-6 rounded-2xl border border-purple-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm mb-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>1. Simple Definition</span>
                </div>
                <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
                  {result.sections.definition}
                </p>
              </div>

              {/* 2. Core Concept */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>2. Core Concept</span>
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {result.sections.coreConcept}
                </p>
              </div>

              {/* 3. Step-by-Step Explanation */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-sky-700 font-bold text-sm mb-3">
                  <ListOrdered className="w-4 h-4 text-sky-600" />
                  <span>3. Step-by-Step Explanation</span>
                </div>
                <div className="space-y-2.5">
                  {result.sections.stepByStep.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Practical Example */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
                  <FlaskConical className="w-4 h-4 text-amber-600" />
                  <span>4. Practical Example</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 text-slate-800 text-sm leading-relaxed">
                  {result.sections.example}
                </div>
              </div>

              {/* 5. Important Points & 6. Common Mistakes Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 5. Important Points */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>5. Important Points</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {result.sections.importantPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 6. Common Mistakes */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>6. Common Mistakes</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {result.sections.commonMistakes.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2"></span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 7. Quick Recap */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl shadow-md">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
                  <Zap className="w-4 h-4" />
                  <span>7. Quick Recap (Memorize This)</span>
                </div>
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                  {result.sections.quickRecap}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm leading-relaxed">{result.answer}</pre>
            </div>
          )}

          {/* Quick Quiz CTA */}
          {onNavigateTo && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm bg-indigo-50/70 p-4 rounded-xl border border-indigo-100">
              <span className="font-semibold text-indigo-900">Want to test your understanding of {topic}?</span>
              <button
                type="button"
                onClick={() => onNavigateTo('quiz', { topic })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>Generate Quiz on this topic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
