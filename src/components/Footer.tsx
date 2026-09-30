import React from 'react';
import { AppRoute } from '../types';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-10 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">EduGenie</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your AI-powered learning assistant designed to help students understand concepts clearly, ace quizzes, and learn effectively.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">Core Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button type="button" onClick={() => onNavigate('qa')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Ask Q&A
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('explain')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Concept Explanation
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('quiz')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  AI Quiz Generator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('summarize')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Text Summarizer
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('recommendations')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Personalized Roadmap
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button type="button" onClick={() => onNavigate('about')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  About EduGenie
                </button>
              </li>
              <li>
                <a href="/health" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
                  API Health Status
                </a>
              </li>
              <li>
                <span className="text-slate-400">Powered by Google Gemini</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">Student Focus</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Built with love for high school, college, and lifelong learners worldwide. Mobile-first, zero friction, and always ready to help you understand.
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>for better learning</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} EduGenie Learning Assistant. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate('about')} className="hover:text-slate-600">Privacy & Terms</button>
            <span className="text-slate-200">•</span>
            <button type="button" onClick={() => onNavigate('home')} className="hover:text-slate-600">Back to Top</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
