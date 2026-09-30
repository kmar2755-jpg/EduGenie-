export type AppRoute = 'home' | 'qa' | 'explain' | 'quiz' | 'summarize' | 'recommendations' | 'about';

export interface HealthStatus {
  status: 'ok' | 'error';
  service: string;
  version: string;
  model: string;
  maxInputLength: number;
  geminiConfigured: boolean;
  timestamp?: string;
}

export interface QaResponse {
  answer: string;
}

export interface ExplanationSections {
  definition: string;
  coreConcept: string;
  stepByStep: string[];
  example: string;
  importantPoints: string[];
  commonMistakes: string[];
  quickRecap: string;
}

export interface ExplanationResponse {
  answer: string;
  sections?: ExplanationSections;
}

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  answer: string;
  explanation: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}

export interface SummarySections {
  mainIdea: string;
  keyPoints: string[];
  importantTerms: { term: string; definition: string }[];
  importantFacts: string[];
  quickRevision: string;
}

export interface SummaryResponse {
  summary: string;
  sections?: SummarySections;
}

export interface LearningRecommendation {
  stage: string;
  topic: string;
  whyItMatters: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  nextTopic: string;
}

export interface RecommendationsResponse {
  recommendations: LearningRecommendation[];
  summaryOverview: string;
}

export interface ActivityItem {
  id: string;
  type: 'qa' | 'explain' | 'quiz' | 'summarize' | 'recommendations';
  title: string;
  snippet: string;
  timestamp: number;
  data: any;
}
