import React from 'react';
import { ActivityItem, AppRoute } from '../types';
import {
  HelpCircle,
  BrainCircuit,
  Sparkles,
  FileText,
  Compass,
  Clock,
  Trash2,
  X,
  ExternalLink
} from 'lucide-react';

interface RecentActivityProps {
  isOpen: boolean;
  onClose: () => void;
  items: ActivityItem[];
  onSelect: (item: ActivityItem) => void;
  onClear: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  isOpen,
  onClose,
  items,
  onSelect,
  onClear,
}) => {
  if (!isOpen) return null;

  const getTypeIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'qa':
        return <HelpCircle className="w-4 h-4 text-sky-600" />;
      case 'explain':
        return <BrainCircuit className="w-4 h-4 text-purple-600" />;
      case 'quiz':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'summarize':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'recommendations':
        return <Compass className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getTypeBadge = (type: ActivityItem['type']) => {
    switch (type) {
      case 'qa':
        return <span className="bg-sky-50 text-sky-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-sky-100">Q&A</span>;
      case 'explain':
        return <span className="bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-100">Explanation</span>;
      case 'quiz':
        return <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-100">Quiz</span>;
      case 'summarize':
        return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-100">Summary</span>;
      case 'recommendations':
        return <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-100">Roadmap</span>;
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Recent Learning Activity</h3>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">No recent activity yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Ask a question, generate a quiz, or explain a concept. Your study sessions will be saved here automatically.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="group border border-slate-200 hover:border-indigo-300 rounded-xl p-3.5 bg-white hover:bg-indigo-50/30 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {getTypeIcon(item.type)}
                    {getTypeBadge(item.type)}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <h5 className="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h5>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {item.snippet}
                </p>
                <div className="mt-2 flex items-center justify-end text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">Saved locally in browser</span>
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
