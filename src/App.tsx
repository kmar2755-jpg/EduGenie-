/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppRoute, HealthStatus, ActivityItem } from './types';
import { fetchHealth } from './api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RecentActivity } from './components/RecentActivity';
import { HomeView } from './views/HomeView';
import { QaView } from './views/QaView';
import { ExplainView } from './views/ExplainView';
import { QuizView } from './views/QuizView';
import { SummarizeView } from './views/SummarizeView';
import { RecommendationsView } from './views/RecommendationsView';
import { AboutView } from './views/AboutView';
import { ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'edugenie_activity_v1';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [routePayload, setRoutePayload] = useState<any>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [recentItems, setRecentItems] = useState<ActivityItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Sync initial route from URL path or hash
  useEffect(() => {
    const handleUrlSync = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      if (path === '/qa') setCurrentRoute('qa');
      else if (path === '/explain') setCurrentRoute('explain');
      else if (path === '/quiz') setCurrentRoute('quiz');
      else if (path === '/summarize') setCurrentRoute('summarize');
      else if (path === '/recommendations' || path === '/learn') setCurrentRoute('recommendations');
      else if (path === '/about') setCurrentRoute('about');
      else setCurrentRoute('home');
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  // Fetch health check on mount
  useEffect(() => {
    fetchHealth()
      .then((data) => setHealth(data))
      .catch((err) => {
        console.warn('EduGenie health check issue:', err.message);
        setHealth({
          status: 'error',
          service: 'EduGenie',
          version: '1.0.0',
          model: 'gemini-3.8-flash',
          maxInputLength: 12000,
          geminiConfigured: false,
        });
      });
  }, []);

  // Load recent items from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecentItems(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveActivityItem = (item: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newItem: ActivityItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
    };
    setRecentItems((prev) => {
      const filtered = prev.filter((p) => p.title !== item.title);
      const updated = [newItem, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setRecentItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Fallback
    }
  };

  const navigateTo = (route: AppRoute, payload?: any) => {
    setCurrentRoute(route);
    setRoutePayload(payload || null);

    const path = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecent = (item: ActivityItem) => {
    if (item.type === 'qa') {
      navigateTo('qa', { initialQuestion: item.data?.question });
    } else if (item.type === 'explain') {
      navigateTo('explain', { initialTopic: item.data?.topic });
    } else if (item.type === 'quiz') {
      navigateTo('quiz', { initialTopic: item.data?.topic });
    } else if (item.type === 'summarize') {
      navigateTo('summarize', { initialText: item.data?.text });
    } else if (item.type === 'recommendations') {
      navigateTo('recommendations', { initialTopic: item.data?.topic });
    }
  };

  const getBreadcrumbLabel = (route: AppRoute) => {
    switch (route) {
      case 'qa':
        return 'Ask Q&A';
      case 'explain':
        return 'Concept Explanation';
      case 'quiz':
        return 'AI Quiz Generator';
      case 'summarize':
        return 'Text Summarizer';
      case 'recommendations':
        return 'Learning Path';
      case 'about':
        return 'About EduGenie';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        health={health}
        onOpenHistory={() => setHistoryOpen(true)}
        historyCount={recentItems.length}
      />

      {/* Breadcrumb Navigation on sub-pages */}
      {currentRoute !== 'home' && (
        <div className="bg-white/80 border-b border-slate-200/60 py-2.5 px-4 sm:px-8 text-xs">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-slate-500">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="hover:text-indigo-600 transition-colors font-medium cursor-pointer"
            >
              EduGenie
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">{getBreadcrumbLabel(currentRoute)}</span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomeView onNavigate={navigateTo} recentItems={recentItems} />
        )}

        {currentRoute === 'qa' && (
          <QaView
            onSaveActivity={saveActivityItem}
            initialQuestion={routePayload?.initialQuestion || routePayload?.question || ''}
            onNavigateTo={navigateTo}
          />
        )}

        {currentRoute === 'explain' && (
          <ExplainView
            onSaveActivity={saveActivityItem}
            initialTopic={routePayload?.initialTopic || routePayload?.topic || ''}
            onNavigateTo={navigateTo}
          />
        )}

        {currentRoute === 'quiz' && (
          <QuizView
            onSaveActivity={saveActivityItem}
            initialTopic={routePayload?.initialTopic || routePayload?.topic || ''}
            onNavigateTo={navigateTo}
          />
        )}

        {currentRoute === 'summarize' && (
          <SummarizeView
            onSaveActivity={saveActivityItem}
            initialText={routePayload?.initialText || routePayload?.text || ''}
            onNavigateTo={navigateTo}
          />
        )}

        {currentRoute === 'recommendations' && (
          <RecommendationsView
            onSaveActivity={saveActivityItem}
            initialTopic={routePayload?.initialTopic || routePayload?.topic || ''}
            onNavigateTo={navigateTo}
          />
        )}

        {currentRoute === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Recent Activity Drawer */}
      <RecentActivity
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={recentItems}
        onSelect={handleSelectRecent}
        onClear={handleClearHistory}
      />
    </div>
  );
}
