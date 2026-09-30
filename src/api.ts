import {
  HealthStatus,
  QaResponse,
  ExplanationResponse,
  QuizResponse,
  SummaryResponse,
  RecommendationsResponse,
} from './types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Fallback
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse<HealthStatus>(res);
}

export async function askQuestion(question: string): Promise<QaResponse> {
  const res = await fetch(`${API_BASE_URL}/qa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: question }),
  });
  return handleResponse<QaResponse>(res);
}

export async function explainConcept(
  topic: string,
  level: string = 'beginner',
  preference: string = 'simple'
): Promise<ExplanationResponse> {
  const res = await fetch(`${API_BASE_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: topic, level, preference }),
  });
  return handleResponse<ExplanationResponse>(res);
}

export async function generateQuiz(topic: string, difficulty: string = 'medium'): Promise<QuizResponse> {
  const res = await fetch(`${API_BASE_URL}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: topic, difficulty }),
  });
  return handleResponse<QuizResponse>(res);
}

export async function summarizeText(text: string, length: string = 'medium'): Promise<SummaryResponse> {
  const res = await fetch(`${API_BASE_URL}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, length }),
  });
  return handleResponse<SummaryResponse>(res);
}

export async function getLearningRecommendations(
  topic: string,
  level: string = 'beginner',
  goal: string = 'skill development',
  studyTime: string = '30 minutes/day'
): Promise<RecommendationsResponse> {
  const res = await fetch(`${API_BASE_URL}/learn/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, level, goal, study_time: studyTime }),
  });
  return handleResponse<RecommendationsResponse>(res);
}
