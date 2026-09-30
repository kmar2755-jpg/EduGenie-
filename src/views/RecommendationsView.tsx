import React, { useState } from 'react';
import { getLearningRecommendations } from '../api';
import { RecommendationsResponse, ActivityItem } from '../types';
import {
  Compass,
  Sparkles,
  Target,
  Clock,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Send,
  Copy,
  Check,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface RecommendationsViewProps {
  onSaveActivity?: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  initialTopic?: string;
  onNavigateTo?: (route: any, payload?: any) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  onSaveActivity,
  initialTopic = '',
  onNavigateTo,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [goal, setGoal] = useState<string>('skill development');
  const [studyTime, setStudyTime] = useState<string>('30 minutes/day');
  const [result, setResult] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleTopics = [
    "Machine Learning & Deep Learning",
    "Organic Chemistry",
    "Microeconomics & Game Theory",
    "Full-Stack Web Development",
    "Linear Algebra & Matrices",
  ];

  const goals = [
    { id: 'exam preparation', label: 'Exam Prep' },
    { id: 'academic learning', label: 'Academic Course' },
    { id: 'skill development', label: 'Skill Mastery' },
    { id: 'interview preparation', label: 'Job Interview' },
    { id: 'general understanding', label: 'Curiosity' },
  ];

  const studyTimes = [
    '15 minutes/day',
    '30 minutes/day',
    '1 hour/day',
    '2+ hours/day',
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {
      setError('Please enter what you are learning.');
      return;
    }
    if (trimmed.length > 12000) {
      setError('Topic exceeds character limit.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getLearningRecommendations(trimmed, level, goal, studyTime);
      setResult(res);
      if (onSaveActivity) {
        onSaveActivity({
          type: 'recommendations',
          title: `Roadmap: ${trimmed}`,
          snippet: `${res.recommendations.length} progressive stages for ${trimmed} (${level})`,
          data: { topic: trimmed, level, goal, studyTime, res },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const roadmapText = `Learning Roadmap: ${topic}\nLevel: ${level} | Goal: ${goal} | Pace: ${studyTime}\n\n` +
      `Overview: ${result.summaryOverview}\n\n` +
      result.recommendations.map((r, i) => `${i + 1}. [${r.stage}] ${r.topic} (${r.difficulty} - ${r.estimatedTime})\nWhy: ${r.whyItMatters}\nNext: ${r.nextTopic}`).join('\n\n');

    navigator.clipboard.writeText(roadmapText);
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-3">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Personalized Learning Path</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Your Personalized Learning Path
        </h1>
        <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-2xl">
          Tell EduGenie what you want to master, your current knowledge level, and your goal to receive a structured step-by-step roadmap.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8">
        <form onSubmit={handleSubmit}>
          {/* Topic */}
          <div className="mb-5">
            <label htmlFor="rec-topic" className="block text-sm font-bold text-slate-800 mb-2">
              What are you learning?
            </label>
            <input
              id="rec-topic"
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Example: Machine Learning, Organic Chemistry, World History, Algorithms..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all"
              disabled={loading}
            />
          </div>

          {/* Level & Goal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Current Knowledge Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      level === l
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs font-bold'
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
                Available Study Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {studyTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setStudyTime(time)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer truncate ${
                      studyTime === time
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Goal Selector */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Primary Learning Goal
            </label>
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    goal === g.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sample quick prompts */}
          <div className="pt-3 border-t border-slate-100 mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Popular roadmaps:</span>
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
                  className="text-xs bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {topic ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Building Personalized Path...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate Learning Path</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error state */}
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
          <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm animate-pulse space-y-3">
            <div className="h-5 bg-indigo-100 rounded w-1/3"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-4/5"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse h-28"></div>
            ))}
          </div>
        </div>
      )}

      {/* Result Roadmap */}
      {result && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300 mb-12">
          {/* Top Overview Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-800/80 mb-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-sky-400">
                  Mastery Roadmap
                </span>
                <h2 className="text-2xl font-black capitalize mt-0.5">{topic}</h2>
                <div className="flex flex-wrap gap-2 text-xs text-indigo-200 mt-1">
                  <span>Level: <strong className="text-white capitalize">{level}</strong></span>
                  <span>•</span>
                  <span>Goal: <strong className="text-white capitalize">{goal}</strong></span>
                  <span>•</span>
                  <span>Pace: <strong className="text-white">{studyTime}</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-800/80 hover:bg-indigo-700 text-xs font-semibold text-white cursor-pointer self-start sm:self-auto border border-indigo-700/80"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Plan</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Plan</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-indigo-100 text-sm leading-relaxed">
              {result.summaryOverview}
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Step-by-Step Curriculum ({result.recommendations.length} Stages)</span>
            </h3>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 space-y-6">
              {result.recommendations.map((rec, idx) => {
                const difficultyColor =
                  rec.difficulty === 'Beginner'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : rec.difficulty === 'Intermediate'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200';

                return (
                  <div
                    key={idx}
                    className="relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    {/* Circle Node on Timeline */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white shadow-xs" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                        {rec.stage}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor}`}>
                          {rec.difficulty}
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {rec.estimatedTime}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                      {rec.topic}
                    </h4>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {rec.whyItMatters}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700">Next milestone:</span> {rec.nextTopic}
                      </div>

                      {onNavigateTo && (
                        <button
                          type="button"
                          onClick={() => onNavigateTo('explain', { topic: rec.topic })}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Explain this topic</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
