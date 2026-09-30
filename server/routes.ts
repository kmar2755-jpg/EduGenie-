import { Router, Request, Response } from 'express';
import { config } from './config.js';
import {
  generateQaAnswer,
  generateConceptExplanation,
  generateQuiz,
  generateSummary,
  generateLearningRecommendations,
} from './gemini.js';

export const apiRouter = Router();

// GET /health
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: config.appName,
    version: config.appVersion,
    model: config.geminiModel,
    maxInputLength: config.maxInputLength,
    geminiConfigured: !!(process.env.GEMINI_API_KEY || config.geminiApiKey),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /qa or POST /api/qa
 * Request: { text?: string, question?: string }
 * Response: { answer: string }
 */
apiRouter.post(['/qa', '/api/qa'], async (req: Request, res: Response) => {
  try {
    const rawText = req.body?.text ?? req.body?.question;
    const result = await generateQaAnswer(rawText);
    res.json(result);
  } catch (error: any) {
    const status = error.message?.includes('exceeds the maximum') || error.message?.includes('cannot be empty') ? 400 : 500;
    res.status(status).json({
      error: error.message || 'Something went wrong while generating your answer. Please try again.',
    });
  }
});

/**
 * POST /explain or POST /api/explain
 * Request: { text?: string, topic?: string, level?: string, preference?: string }
 * Response: { answer: string, sections: { ... } }
 */
apiRouter.post(['/explain', '/api/explain'], async (req: Request, res: Response) => {
  try {
    const rawText = req.body?.text ?? req.body?.topic;
    const level = req.body?.level || 'beginner';
    const preference = req.body?.preference || 'simple';
    const result = await generateConceptExplanation(rawText, level, preference);
    res.json(result);
  } catch (error: any) {
    const status = error.message?.includes('exceeds the maximum') || error.message?.includes('cannot be empty') ? 400 : 500;
    res.status(status).json({
      error: error.message || 'Something went wrong while explaining this concept. Please try again.',
    });
  }
});

/**
 * POST /quiz or POST /api/quiz
 * Request: { text?: string, topic?: string, difficulty?: string }
 * Response: { questions: [...] }
 */
apiRouter.post(['/quiz', '/api/quiz'], async (req: Request, res: Response) => {
  try {
    const rawText = req.body?.text ?? req.body?.topic;
    const difficulty = req.body?.difficulty || 'medium';
    const result = await generateQuiz(rawText, difficulty);
    res.json(result);
  } catch (error: any) {
    const status = error.message?.includes('exceeds the maximum') || error.message?.includes('cannot be empty') ? 400 : 500;
    res.status(status).json({
      error: error.message || 'Something went wrong while generating the quiz. Please try again.',
    });
  }
});

/**
 * POST /summarize or POST /api/summarize
 * Request: { text?: string, length?: string }
 * Response: { summary: string, sections: { ... } }
 */
apiRouter.post(['/summarize', '/api/summarize'], async (req: Request, res: Response) => {
  try {
    const rawText = req.body?.text;
    const length = req.body?.length || 'medium';
    const result = await generateSummary(rawText, length);
    res.json(result);
  } catch (error: any) {
    const status = error.message?.includes('exceeds the maximum') || error.message?.includes('cannot be empty') ? 400 : 500;
    res.status(status).json({
      error: error.message || 'Something went wrong while summarizing your material. Please try again.',
    });
  }
});

/**
 * POST /learn/recommendations, POST /recommendations, POST /api/recommendations
 * Request: { topic?: string, text?: string, level?: string, goal?: string, study_time?: string, studyTime?: string }
 * Response: { recommendations: [...], summaryOverview: string }
 */
apiRouter.post(
  ['/learn/recommendations', '/recommendations', '/api/recommendations', '/api/learn/recommendations'],
  async (req: Request, res: Response) => {
    try {
      const topic = req.body?.topic ?? req.body?.text;
      const level = req.body?.level || 'beginner';
      const goal = req.body?.goal || 'skill development';
      const studyTime = req.body?.study_time || req.body?.studyTime || '30 minutes/day';
      const result = await generateLearningRecommendations(topic, level, goal, studyTime);
      res.json(result);
    } catch (error: any) {
      const status = error.message?.includes('exceeds the maximum') || error.message?.includes('cannot be empty') ? 400 : 500;
      res.status(status).json({
        error: error.message || 'Something went wrong while generating recommendations. Please try again.',
      });
    }
  }
);
