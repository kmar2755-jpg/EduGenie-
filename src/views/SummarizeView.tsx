import React, { useState } from 'react';
import { summarizeText } from '../api';
import { SummarySections, ActivityItem } from '../types';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Send,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Tag,
  BookmarkCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface SummarizeViewProps {
  onSaveActivity?: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  initialText?: string;
  onNavigateTo?: (route: any, payload?: any) => void;
}

export const SummarizeView: React.FC<SummarizeViewProps> = ({
  onSaveActivity,
  initialText = '',
  onNavigateTo,
}) => {
  const [text, setText] = useState(initialText);
  const [length, setLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [result, setResult] = useState<{ summary: string; sections?: SummarySections } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const samplePassages = [
    {
      label: "Mitochondria & ATP",
      text: "Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the cell's biochemical reactions. Chemical energy produced by the mitochondria is stored in a small molecule called adenosine triphosphate (ATP). Mitochondria contain their own small chromosomes. Generally, mitochondria, and therefore mitochondrial DNA, are inherited only from the mother. The inner membrane of mitochondria has folds called cristae, which vastly increase surface area for electron transport chains.",
    },
    {
      label: "The Water Cycle",
      text: "The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above, and below the surface of the Earth. The mass of water on Earth remains fairly constant over time, but the partitioning of the water into the major reservoirs of ice, fresh water, saline water, and atmospheric water is variable. Water moves from one reservoir to another through physical processes such as evaporation, condensation, precipitation, infiltration, surface runoff, and subsurface flow.",
    },
    {
      label: "Newton's Universal Gravitation",
      text: "Newton's law of universal gravitation states that every particle attracts every other particle in the universe with a force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers. The formula is F = G*(m1*m2)/r^2, where G is the gravitational constant (6.674×10^-11 N m^2/kg^2). This law explains both planetary motion around stars and ocean tides caused by the moon's gravity.",
    },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please paste or write your study material first.');
      return;
    }
    if (trimmed.length > 12000) {
      setError('Study material exceeds 12,000 characters. Please provide an excerpt within limits.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await summarizeText(trimmed, length);
      setResult(res);
      if (onSaveActivity) {
        onSaveActivity({
          type: 'summarize',
          title: `Summary (${length}): ${trimmed.slice(0, 50)}...`,
          snippet: res.sections?.mainIdea || res.summary.slice(0, 120) + '...',
          data: { text: trimmed, length, res },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while summarizing your material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-3">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Smart Text Summarizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Summarize Your Study Material
        </h1>
        <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-2xl">
          Paste your lecture notes, textbook chapters, or articles to extract key points, technical terms, and quick revision takeaways.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="summary-text" className="block text-sm font-bold text-slate-800">
                Study Notes or Article Text
              </label>
              <span className={`text-xs ${text.length > 12000 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                {text.length.toLocaleString()} / 12,000 characters
              </span>
            </div>
            <textarea
              id="summary-text"
              rows={6}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste your study material here (lecture notes, article, paper excerpt)..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base transition-all resize-y"
              disabled={loading}
            />
          </div>

          {/* Options: Length selector */}
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Summary Length
              </label>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                {(['short', 'medium', 'detailed'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      length === l
                        ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {text && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear text</span>
              </button>
            )}
          </div>

          {/* Quick sample passages */}
          <div className="pt-3 border-t border-slate-100 mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Or load a sample text:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {samplePassages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setText(s.text);
                    if (error) setError(null);
                  }}
                  className="text-xs bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>EduGenie is analyzing text...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Summarize</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
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
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm animate-pulse space-y-3">
            <div className="h-5 bg-emerald-100 rounded w-1/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse h-32"></div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse h-32"></div>
          </div>
        </div>
      )}

      {/* Summarized Output Cards */}
      {result && !loading && (
        <div className="space-y-5 animate-in fade-in duration-300 mb-12">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">Study Summary Overview</h2>
              <p className="text-xs text-slate-500 font-medium capitalize">Length: {length} • Distilled for exam revision</p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          {result.sections ? (
            <div className="space-y-4">
              {/* Main Idea */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-5 sm:p-6 rounded-2xl border border-emerald-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>Main Idea</span>
                </div>
                <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
                  {result.sections.mainIdea}
                </p>
              </div>

              {/* Key Points */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Points to Remember</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {result.sections.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
                      <span className="leading-relaxed">{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Important Terms & Facts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Important Terms */}
                {result.sections.importantTerms && result.sections.importantTerms.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-3">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      <span>Important Terms & Vocabulary</span>
                    </div>
                    <div className="space-y-2.5">
                      {result.sections.importantTerms.map((t, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100/60 text-xs">
                          <span className="font-bold text-indigo-950 block text-xs">{t.term}</span>
                          <span className="text-slate-600">{t.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Facts */}
                {result.sections.importantFacts && result.sections.importantFacts.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-3">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Important Facts & Figures</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {result.sections.importantFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quick Revision Summary Card */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-2">
                  <Zap className="w-4 h-4" />
                  <span>Quick Revision (Read in 30 Seconds)</span>
                </div>
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
                  {result.sections.quickRevision}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm leading-relaxed">{result.summary}</pre>
            </div>
          )}

          {/* Follow-up CTA */}
          {onNavigateTo && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
              <span className="font-semibold text-emerald-900">Want to test how well you remember this summary?</span>
              <button
                type="button"
                onClick={() => onNavigateTo('quiz', { topic: result.sections?.mainIdea.slice(0, 40) || 'Study Summary' })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>Take a Quiz on this</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
