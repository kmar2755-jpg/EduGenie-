import React, { useState } from 'react';
import { AppRoute, ActivityItem } from '../types';
import {
  Sparkles,
  HelpCircle,
  BrainCircuit,
  FileText,
  Compass,
  ArrowRight,
  CheckCircle2,
  Zap,
  BookOpen,
  Send,
  Layers,
  Clock
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (route: AppRoute, payload?: any) => void;
  recentItems?: ActivityItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, recentItems = [] }) => {
  const [activeTask, setActiveTask] = useState<AppRoute>('qa');
  const [quickInput, setQuickInput] = useState('');

  const featureCards = [
    {
      route: 'qa' as AppRoute,
      title: 'Ask Anything',
      icon: HelpCircle,
      description: 'Get clear AI-powered answers to your questions.',
      color: 'from-sky-500/10 to-sky-500/5 text-sky-600 border-sky-200/80',
      badge: 'Q&A',
    },
    {
      route: 'explain' as AppRoute,
      title: 'Explain a Concept',
      icon: BrainCircuit,
      description: 'Understand difficult concepts with simple explanations.',
      color: 'from-purple-500/10 to-purple-500/5 text-purple-600 border-purple-200/80',
      badge: 'Step-by-Step',
    },
    {
      route: 'quiz' as AppRoute,
      title: 'Generate Quiz',
      icon: Sparkles,
      description: 'Test your knowledge with AI-generated quizzes.',
      color: 'from-amber-500/10 to-amber-500/5 text-amber-600 border-amber-200/80',
      badge: 'Interactive',
    },
    {
      route: 'summarize' as AppRoute,
      title: 'Summarize',
      icon: FileText,
      description: 'Turn long study material into concise key points.',
      color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-200/80',
      badge: 'Revision',
    },
    {
      route: 'recommendations' as AppRoute,
      title: 'Learning Path',
      icon: Compass,
      description: 'Get personalized recommendations for what to learn next.',
      color: 'from-indigo-500/10 to-indigo-500/5 text-indigo-600 border-indigo-200/80',
      badge: 'Curriculum',
    },
  ];

  const workflowSteps = [
    {
      step: '1',
      title: 'Choose a learning task',
      description: 'Select Q&A, concept breakdown, quiz check, text summary, or curriculum planning.',
    },
    {
      step: '2',
      title: 'Enter your topic or notes',
      description: 'Type any question, paste lecture excerpts, or enter the subject you wish to master.',
    },
    {
      step: '3',
      title: 'EduGenie analyzes with AI',
      description: 'Google Gemini breaks down information into digestible, student-friendly structures.',
    },
    {
      step: '4',
      title: 'Receive clear learning results',
      description: 'Get step-by-step cards, multiple-choice quizzes, or 30-second revision summaries.',
    },
    {
      step: '5',
      title: 'Continue your learning path',
      description: 'Follow recommended next topics and test knowledge retention effortlessly.',
    },
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      onNavigate(activeTask);
      return;
    }
    if (activeTask === 'qa') {
      onNavigate('qa', { initialQuestion: quickInput });
    } else if (activeTask === 'explain') {
      onNavigate('explain', { initialTopic: quickInput });
    } else if (activeTask === 'quiz') {
      onNavigate('quiz', { initialTopic: quickInput });
    } else if (activeTask === 'summarize') {
      onNavigate('summarize', { initialText: quickInput });
    } else if (activeTask === 'recommendations') {
      onNavigate('recommendations', { initialTopic: quickInput });
    }
  };

  const getPlaceholder = () => {
    switch (activeTask) {
      case 'qa':
        return "Ask any question (e.g., 'Why do stars twinkle at night?')";
      case 'explain':
        return "Enter a concept to explain (e.g., 'Photosynthesis', 'Blockchain')";
      case 'quiz':
        return "Topic to test yourself on (e.g., 'Python Loops', 'Cell Biology')";
      case 'summarize':
        return "Paste text or notes you need summarized into key bullet points...";
      case 'recommendations':
        return "Enter what subject you are studying (e.g., 'Machine Learning')";
      default:
        return "Enter your study topic...";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-4 shadow-2xs">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>Powered by Google Gemini 3.8</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Learn Smarter with{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
            EduGenie
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 text-slate-600 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto">
          Your AI-powered learning assistant for questions, explanations, quizzes, summaries, and personalized learning.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate('qa')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('quiz')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Try a Quiz</span>
          </button>
        </div>
      </section>

      {/* Central Learning Workspace (Section 4) */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 mb-16 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            How can EduGenie help you today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select a learning task below to jump straight in
          </p>
        </div>

        {/* Task Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {[
            { id: 'qa' as AppRoute, label: 'Ask a Question', icon: HelpCircle },
            { id: 'explain' as AppRoute, label: 'Explain Concept', icon: BrainCircuit },
            { id: 'quiz' as AppRoute, label: 'Generate Quiz', icon: Sparkles },
            { id: 'summarize' as AppRoute, label: 'Summarize Text', icon: FileText },
            { id: 'recommendations' as AppRoute, label: 'Learning Path', icon: Compass },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTask === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTask(t.id)}
                className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-50/90 border-indigo-300 text-indigo-700 shadow-xs ring-2 ring-indigo-400/20'
                    : 'bg-slate-50/60 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-center leading-tight">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Quick Input Box */}
        <form onSubmit={handleQuickSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full rounded-2xl border border-slate-300 p-4 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-400 font-medium">
              Press enter or click launch to open the full interactive tool
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Launch Workspace</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </section>

      {/* Five Feature Cards (Section 3) */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Designed for Comprehensive Student Mastery
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Everything you need to learn, clarify, test, summarize, and roadmap your academic success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.route}
                onClick={() => onNavigate(feat.route)}
                className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center border shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base mb-2 group-hover:text-indigo-600 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-700 gap-1">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How EduGenie Works (Section 3) */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Zap className="w-3.5 h-3.5" />
            <span>Simple 5-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            How EduGenie Works
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            From confusing textbooks to crisp, permanent comprehension in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {workflowSteps.map((step) => (
            <div key={step.step} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 font-black text-sm flex items-center justify-center mb-3">
                  {step.step}
                </div>
                <h3 className="font-bold text-white text-sm sm:text-base mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity Quick Section (if any exists) */}
      {recentItems.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-lg text-slate-900">Jump Back Into Recent Sessions</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.type as AppRoute, item.data)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {item.type}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {item.snippet}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
