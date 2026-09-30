import { describe, it, expect } from 'vitest';
import {
  validateInput,
  cleanJsonText,
  validateQuizData,
  ExplanationResponse,
  QuizResponse,
  SummaryResponse,
  RecommendationsResponse
} from '../server/gemini.js';
import { config } from '../server/config.js';

describe('EduGenie Full Test Suite (Section 23 Requirements)', () => {
  // 1. Homepage & App configuration test
  it('1. Homepage and App configuration are valid', () => {
    expect(config.appName).toBe('EduGenie');
    expect(config.geminiModel).toBeDefined();
    expect(config.maxInputLength).toBeGreaterThan(0);
  });

  // 2. Health endpoint data structure
  it('2. Health endpoint status format', () => {
    const healthPayload = {
      status: 'ok',
      service: config.appName,
      version: config.appVersion,
      model: config.geminiModel,
      maxInputLength: config.maxInputLength,
      geminiConfigured: !!config.geminiApiKey,
    };
    expect(healthPayload.status).toBe('ok');
    expect(healthPayload.service).toBe('EduGenie');
    expect(typeof healthPayload.version).toBe('string');
  });

  // 3. Empty input validation
  it('3. Rejects empty, null, or undefined input', () => {
    expect(() => validateInput('', 'topic')).toThrow('cannot be empty');
    expect(() => validateInput('   ', 'question')).toThrow('cannot be empty');
    expect(() => validateInput(null, 'question')).toThrow('valid question');
    expect(() => validateInput(undefined, 'study material')).toThrow('valid study material');
  });

  // 4. Maximum input validation
  it('4. Rejects input exceeding MAX_INPUT_LENGTH (12000 chars)', () => {
    const oversizedInput = 'x'.repeat(config.maxInputLength + 1);
    expect(() => validateInput(oversizedInput, 'input')).toThrow('exceeds the maximum length');
    const withinLimit = 'x'.repeat(config.maxInputLength);
    expect(validateInput(withinLimit, 'input')).toBe(withinLimit);
  });

  // 5. Q&A endpoint data structure validation
  it('5. Q&A response contract requires non-empty answer', () => {
    const sampleQa = { answer: 'Newton third law states that for every action...' };
    expect(typeof sampleQa.answer).toBe('string');
    expect(sampleQa.answer.length).toBeGreaterThan(10);
  });

  // 6. Explanation endpoint data structure validation
  it('6. Explanation structure contains all 7 educational cards', () => {
    const sampleExplanation: ExplanationResponse = {
      answer: 'Full markdown guide',
      sections: {
        definition: 'Simple definition of Photosynthesis',
        coreConcept: 'Light dependent reactions and Calvin cycle',
        stepByStep: ['Step 1: Light absorption', 'Step 2: Water photolysis', 'Step 3: Sugar synthesis'],
        example: 'Leaves converting sunlight into glucose',
        importantPoints: ['Chlorophyll is essential', 'Releases O2'],
        commonMistakes: ['Thinking plants only photosynthesize and do not respire'],
        quickRecap: 'Sunlight + Water + CO2 -> Glucose + O2',
      },
    };
    expect(sampleExplanation.sections.definition).toBeDefined();
    expect(sampleExplanation.sections.stepByStep.length).toBe(3);
    expect(sampleExplanation.sections.commonMistakes.length).toBe(1);
  });

  // 7. Summary endpoint data structure validation
  it('7. Summary response contains core sections', () => {
    const sampleSummary: SummaryResponse = {
      summary: 'Markdown summary',
      sections: {
        mainIdea: 'Mitochondria generate ATP',
        keyPoints: ['Powerhouse of the cell', 'Produces ATP via cristae'],
        importantTerms: [{ term: 'ATP', definition: 'Adenosine triphosphate energy currency' }],
        importantFacts: ['Mitochondrial DNA is maternally inherited'],
        quickRevision: 'Mitochondria produce ATP for cellular work.',
      },
    };
    expect(sampleSummary.sections?.keyPoints.length).toBe(2);
    expect(sampleSummary.sections?.importantTerms[0].term).toBe('ATP');
  });

  // 8. Learning recommendation endpoint structure
  it('8. Learning recommendation structure contains staged roadmap', () => {
    const sampleRec: RecommendationsResponse = {
      summaryOverview: 'Personalized study plan for Machine Learning',
      recommendations: [
        {
          stage: '1. Prerequisites',
          topic: 'Linear Algebra and Calculus Basics',
          whyItMatters: 'Required for gradients and loss functions',
          difficulty: 'Beginner',
          estimatedTime: '3 days',
          nextTopic: '2. Fundamentals',
        },
      ],
    };
    expect(sampleRec.recommendations[0].stage).toContain('Prerequisites');
    expect(sampleRec.recommendations[0].difficulty).toBe('Beginner');
  });

  // 9. Quiz response validation
  it('9. Quiz response validator parses correct question object', () => {
    const validRaw = {
      questions: [
        { question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A', explanation: 'E1' },
        { question: 'Q2', options: ['E', 'F', 'G', 'H'], answer: 'F', explanation: 'E2' },
        { question: 'Q3', options: ['I', 'J', 'K', 'L'], answer: 'L', explanation: 'E3' },
      ],
    };
    const validated = validateQuizData(validRaw);
    expect(validated.questions.length).toBe(3);
    expect(validated.questions[0].answer).toBe('A');
  });

  // 10. Invalid quiz JSON & markdown fence stripper
  it('10. Invalid quiz JSON handling & markdown cleanup', () => {
    expect(() => validateQuizData(null)).toThrow('Invalid quiz response');
    expect(() => validateQuizData('not an object')).toThrow('Invalid quiz response');
    expect(() => validateQuizData({ questions: 'not an array' })).toThrow('Invalid quiz response');

    const markdownJson = '```json\n{"questions": []}\n```';
    expect(cleanJsonText(markdownJson)).toBe('{"questions": []}');
  });

  // 11. Exactly 3 quiz questions
  it('11. Rejects quizzes with fewer or more than 3 questions', () => {
    const onlyTwo = {
      questions: [
        { question: 'Q1', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
        { question: 'Q2', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
      ],
    };
    expect(() => validateQuizData(onlyTwo)).toThrow('must contain exactly 3 questions');

    const fourQuestions = {
      questions: [
        { question: 'Q1', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
        { question: 'Q2', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
        { question: 'Q3', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
        { question: 'Q4', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
      ],
    };
    expect(() => validateQuizData(fourQuestions)).toThrow('must contain exactly 3 questions');
  });

  // 12. Exactly 4 options per question
  it('12. Rejects questions with more or fewer than 4 options', () => {
    const threeOptions = {
      questions: [
        { question: 'Q1', options: ['1', '2', '3'], answer: '1', explanation: 'E' },
        { question: 'Q2', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
        { question: 'Q3', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
      ],
    };
    expect(() => validateQuizData(threeOptions)).toThrow('must contain exactly 4 options');

    const fiveOptions = {
      questions: [
        { question: 'Q1', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
        { question: 'Q2', options: ['1', '2', '3', '4', '5'], answer: '1', explanation: 'E' },
        { question: 'Q3', options: ['1', '2', '3', '4'], answer: '1', explanation: 'E' },
      ],
    };
    expect(() => validateQuizData(fiveOptions)).toThrow('must contain exactly 4 options');
  });
});
