import React from 'react';
import {
  Sparkles,
  HelpCircle,
  BrainCircuit,
  FileText,
  Compass,
  Mic,
  Languages,
  Smartphone,
  BarChart3,
  Flame,
  Network,
  Share2,
  FileUp,
  ShieldCheck,
  Zap,
  GraduationCap
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const currentFeatures = [
    {
      title: "AI Question & Answer",
      description: "Direct, student-friendly answers with code formatting, bullet points, and foundational explanations.",
      icon: HelpCircle,
      color: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      title: "Concept Explanation",
      description: "Step-by-step breakdowns covering definitions, core concepts, practical analogies, common pitfalls, and quick recap rules.",
      icon: BrainCircuit,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Quiz Generator",
      description: "Dynamic 3-question multiple-choice assessments with immediate scoring, visual percentages, and detailed explanations.",
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Text Summarizer",
      description: "Converts long study materials into structured revision notes: main ideas, key points, vocabulary terms, and 30-second reviews.",
      icon: FileText,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Personalized Learning Path",
      description: "Progressive curriculum roadmaps matching individual student pace, target goals, and existing knowledge levels.",
      icon: Compass,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
  ];

  const futureFeatures = [
    {
      title: "Voice Interaction & Real-time Tutoring",
      description: "Live verbal dialogue with EduGenie using low-latency Gemini Live API speech capabilities.",
      icon: Mic,
    },
    {
      title: "Multilingual Learning & Localization",
      description: "Translate explanations and study guides into 50+ regional languages on the fly.",
      icon: Languages,
    },
    {
      title: "Native Mobile Apps (iOS & Android)",
      description: "Offline study decks, native push revision reminders, and mobile widgets.",
      icon: Smartphone,
    },
    {
      title: "Learning Analytics & Progress Dashboards",
      description: "Longitudinal tracking of mastery curves, retention rates, and subject weak spots.",
      icon: BarChart3,
    },
    {
      title: "Gamification & Study Streaks",
      description: "Daily study streaks, badge unlocks, and peer challenges for motivation.",
      icon: Flame,
    },
    {
      title: "Adaptive Spaced Repetition",
      description: "SM-2 style spaced interval quizzes automatically scheduled before memory decay.",
      icon: Network,
    },
    {
      title: "LMS & Classroom Integration",
      description: "Direct sync with Canvas, Google Classroom, and Blackboard assignment feeds.",
      icon: Share2,
    },
    {
      title: "Multimodal Image & PDF Syllabus Input",
      description: "Upload handwritten exam questions, diagrams, and textbook PDFs for instant parsing.",
      icon: FileUp,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Banner */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>About EduGenie</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Empowering Every Student to Master Complex Ideas
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          EduGenie is an AI-powered learning assistant designed to help students learn faster, retain information longer, and understand concepts more clearly.
        </p>
      </div>

      {/* Mission Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-12">
        <h2 className="text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Our Educational Philosophy</span>
        </h2>
        <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            Standard textbooks and internet searches often bury core educational insights beneath dry jargon and walls of text. EduGenie takes a student-first approach: break down any concept into digestible steps, provide relatable real-world analogies, and verify comprehension through targeted interactive quizzes.
          </p>
          <p>
            Whether preparing for high school exams, university STEM finals, or technical career transitions, EduGenie adapts its language and depth to meet you at your exact level.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-6 h-6 text-indigo-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm">Truth & Accuracy</h3>
            <p className="text-xs text-slate-500 mt-1">Grounding explanations in foundational science and verified academic sources.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <Zap className="w-6 h-6 text-amber-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm">Zero Friction</h3>
            <p className="text-xs text-slate-500 mt-1">Instant answers and mobile-first responsive layout with no mandatory sign-in hurdles.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <Compass className="w-6 h-6 text-emerald-600 mb-2" />
            <h3 className="font-bold text-slate-900 text-sm">Structured Mastery</h3>
            <p className="text-xs text-slate-500 mt-1">From prerequisite foundations all the way to advanced application.</p>
          </div>
        </div>
      </div>

      {/* Implemented Features */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Live Production Features</h2>
        <p className="text-sm text-slate-500 mb-6">Fully operational and available in EduGenie right now.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Roadmap Section */}
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Planned Future Roadmap</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">The Future of EduGenie</h2>
        <p className="text-indigo-200 text-sm sm:text-base max-w-2xl mb-8">
          We are committed to continuous evolution. Below are features planned for future releases (clearly differentiated from current live capabilities):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {futureFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Icon className="w-4 h-4 text-sky-400 shrink-0" />
                  <h3 className="font-bold text-white text-sm">{feat.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                  Planned for v2.0
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture & Security */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Enterprise-Grade Architecture</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          EduGenie runs a secure full-stack TypeScript architecture. All AI calls to Google Gemini are executed strictly on the server-side via Node/Express, ensuring secret API keys are never leaked to client bundles. Input validation sanitizes all payloads against configurable constraints to protect against malicious injections.
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-600">
          <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">Google Gemini 3.8</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">React 19 & TypeScript</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">Express Full-Stack</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">Tailwind CSS v4</span>
        </div>
      </div>
    </div>
  );
};
