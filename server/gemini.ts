import { GoogleGenAI, Type } from '@google/genai';
import { config } from './config.js';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || config.geminiApiKey;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please ensure the API key is set in your environment.');
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export function validateInput(text: unknown, fieldName = 'input'): string {
  if (text === null || text === undefined || typeof text !== 'string') {
    throw new Error(`Please provide a valid ${fieldName}.`);
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error(`The ${fieldName} cannot be empty. Please enter your topic, question, or text.`);
  }
  if (trimmed.length > config.maxInputLength) {
    throw new Error(`The ${fieldName} exceeds the maximum length of ${config.maxInputLength} characters (current length: ${trimmed.length}).`);
  }
  return trimmed;
}

const SYSTEM_INSTRUCTION = `You are EduGenie, an AI-powered educational assistant designed to help students understand concepts clearly and learn effectively.
Answer accurately.
Use simple language.
Explain difficult topics step-by-step.
Give examples where useful.
Do not invent facts.
If the input is unclear, ask for clarification.
Focus on teaching the student rather than simply giving an answer.
Be supportive, encouraging, and concise.`;

/**
 * Clean markdown JSON code fences if returned by the model
 */
export function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
    cleaned = cleaned.trim();
  }
  return cleaned;
}

/**
 * 1. AI QUESTION & ANSWER
 */
export async function generateQaAnswer(questionText: string): Promise<{ answer: string }> {
  const validated = validateInput(questionText, 'question');
  const ai = getGeminiClient();

  const prompt = `You are EduGenie.
Answer the student's educational question clearly and accurately.

Question:
${validated}

Requirements:
- Explain in simple, student-friendly language.
- Give concrete examples where useful.
- Use markdown formatting with clear headings, bullet points, and numbered steps when appropriate.
- Format code blocks with language indicators if relevant.
- Mention key takeaways and important details.
- Do not invent information.
- If the question is ambiguous, provide the most likely answer and kindly state what is unclear.`;

  const response = await ai.models.generateContent({
    model: config.geminiModel,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  const answer = response.text?.trim() || 'No response generated. Please try asking again.';
  return { answer };
}

export interface ExplanationResponse {
  answer: string;
  sections: {
    definition: string;
    coreConcept: string;
    stepByStep: string[];
    example: string;
    importantPoints: string[];
    commonMistakes: string[];
    quickRecap: string;
  };
}

/**
 * 2. CONCEPT EXPLANATION
 */
export async function generateConceptExplanation(
  topicText: string,
  level: string = 'beginner',
  preference: string = 'simple'
): Promise<ExplanationResponse> {
  const validated = validateInput(topicText, 'topic');
  const ai = getGeminiClient();

  const prompt = `You are EduGenie, an educational tutor.
Explain the following topic thoroughly yet simply:

Topic: ${validated}
Student level: ${level}
Style preference: ${preference} explanation

Provide the explanation in strict JSON format with exactly these fields:
1. "definition": A 1-2 sentence simple definition of the topic.
2. "coreConcept": The fundamental idea behind it explained clearly.
3. "stepByStep": An array of 3 to 5 chronological or logical steps that explain how it works.
4. "example": A realistic, relatable real-world or code/math example.
5. "importantPoints": An array of 3 to 5 key principles or rules to remember.
6. "commonMistakes": An array of 2 to 4 common misconceptions or pitfalls students encounter.
7. "quickRecap": A concise 1-2 sentence final summary for quick memorization.`;

  const response = await ai.models.generateContent({
    model: config.geminiModel,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.6,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          definition: { type: Type.STRING },
          coreConcept: { type: Type.STRING },
          stepByStep: { type: Type.ARRAY, items: { type: Type.STRING } },
          example: { type: Type.STRING },
          importantPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          quickRecap: { type: Type.STRING },
        },
        required: [
          'definition',
          'coreConcept',
          'stepByStep',
          'example',
          'importantPoints',
          'commonMistakes',
          'quickRecap',
        ],
      },
    },
  });

  const rawJson = cleanJsonText(response.text || '{}');
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    throw new Error('Unable to parse the structured explanation from the AI model.');
  }

  const sections = {
    definition: parsed.definition || 'Definition unavailable.',
    coreConcept: parsed.coreConcept || 'Core concept unavailable.',
    stepByStep: Array.isArray(parsed.stepByStep) && parsed.stepByStep.length > 0 ? parsed.stepByStep : ['Key steps to understand.'],
    example: parsed.example || 'Example unavailable.',
    importantPoints: Array.isArray(parsed.importantPoints) && parsed.importantPoints.length > 0 ? parsed.importantPoints : ['Review key terms.'],
    commonMistakes: Array.isArray(parsed.commonMistakes) && parsed.commonMistakes.length > 0 ? parsed.commonMistakes : ['Avoid rushing through fundamentals.'],
    quickRecap: parsed.quickRecap || 'Study consistently to master this topic.',
  };

  const answer = `### 1. Simple Definition\n${sections.definition}\n\n` +
    `### 2. Core Concept\n${sections.coreConcept}\n\n` +
    `### 3. Step-by-Step Explanation\n` + sections.stepByStep.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n') + `\n\n` +
    `### 4. Practical Example\n${sections.example}\n\n` +
    `### 5. Important Points\n` + sections.importantPoints.map((p: string) => `- ${p}`).join('\n') + `\n\n` +
    `### 6. Common Mistakes\n` + sections.commonMistakes.map((m: string) => `- ${m}`).join('\n') + `\n\n` +
    `### 7. Quick Recap\n${sections.quickRecap}`;

  return { answer, sections };
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

/**
 * Validate and normalize quiz questions
 */
export function validateQuizData(data: any): QuizResponse {
  if (!data || !Array.isArray(data.questions)) {
    throw new Error('Invalid quiz response: "questions" array is missing.');
  }

  if (data.questions.length !== 3) {
    throw new Error(`Quiz must contain exactly 3 questions (received ${data.questions.length}).`);
  }

  const validatedQuestions: QuizQuestion[] = [];

  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    if (!q || typeof q.question !== 'string' || !q.question.trim()) {
      throw new Error(`Question #${i + 1} has an invalid or missing question prompt.`);
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Question #${i + 1} must contain exactly 4 options (received ${Array.isArray(q.options) ? q.options.length : 'none'}).`);
    }

    const options = q.options.map((opt: any) => String(opt).trim());
    if (options.some((opt: string) => opt.length === 0)) {
      throw new Error(`Question #${i + 1} contains an empty option.`);
    }

    const rawAnswer = String(q.answer || '').trim();
    let normalizedAnswer = rawAnswer;

    // Check if answer is an index or letter like "A", "0", etc.
    if (rawAnswer === 'A' || rawAnswer === 'a' || rawAnswer === '0') normalizedAnswer = options[0];
    else if (rawAnswer === 'B' || rawAnswer === 'b' || rawAnswer === '1') normalizedAnswer = options[1];
    else if (rawAnswer === 'C' || rawAnswer === 'c' || rawAnswer === '2') normalizedAnswer = options[2];
    else if (rawAnswer === 'D' || rawAnswer === 'd' || rawAnswer === '3') normalizedAnswer = options[3];

    // If answer doesn't match an option, try case-insensitive match
    const matchingOption = options.find((opt: string) => opt.toLowerCase() === normalizedAnswer.toLowerCase());
    if (!matchingOption) {
      // If none matches, fallback to first option or throw
      throw new Error(`Question #${i + 1} answer "${rawAnswer}" does not match any of the 4 provided options.`);
    }

    const explanation = typeof q.explanation === 'string' && q.explanation.trim()
      ? q.explanation.trim()
      : 'Review the question and related concepts to understand why this option is correct.';

    validatedQuestions.push({
      question: q.question.trim(),
      options: [options[0], options[1], options[2], options[3]],
      answer: matchingOption,
      explanation,
    });
  }

  return { questions: validatedQuestions };
}

/**
 * 3. QUIZ GENERATOR
 */
export async function generateQuiz(topicText: string, difficulty: string = 'medium'): Promise<QuizResponse> {
  const validated = validateInput(topicText, 'topic');
  const ai = getGeminiClient();

  const prompt = `You are EduGenie's quiz generator.
Generate EXACTLY 3 multiple-choice questions about:

Topic: ${validated}
Difficulty: ${difficulty}

Rules:
- Exactly 3 questions.
- Exactly 4 options per question.
- Only one correct answer.
- The "answer" field MUST be the exact string of one of the 4 options.
- Include a short, clear educational explanation.
- Return ONLY valid JSON matching the schema.`;

  const response = await ai.models.generateContent({
    model: config.geminiModel,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.5,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['question', 'options', 'answer', 'explanation'],
            },
          },
        },
        required: ['questions'],
      },
    },
  });

  const rawJson = cleanJsonText(response.text || '{}');
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    throw new Error('Invalid JSON received from quiz generator. Please try again.');
  }

  return validateQuizData(parsed);
}

export interface SummaryResponse {
  summary: string;
  sections: {
    mainIdea: string;
    keyPoints: string[];
    importantTerms: { term: string; definition: string }[];
    importantFacts: string[];
    quickRevision: string;
  };
}

/**
 * 4. TEXT SUMMARIZER
 */
export async function generateSummary(text: string, lengthPreference: string = 'medium'): Promise<SummaryResponse> {
  const validated = validateInput(text, 'study material');
  const ai = getGeminiClient();

  const prompt = `You are EduGenie.
Summarize the following educational study material for a student.

Summary length target: ${lengthPreference}

Text:
${validated}

Provide a structured summary in JSON with:
- "mainIdea": A concise overview of the core topic and central message.
- "keyPoints": Array of 3-7 key concepts or takeaways.
- "importantTerms": Array of objects with "term" and "definition" explaining technical vocabulary or key jargon.
- "importantFacts": Array of 2-5 concrete facts, statistics, formulas, or rules mentioned.
- "quickRevision": A quick 2-3 sentence revision summary that can be read in 20 seconds before an exam.

Requirements:
- Do not change the original meaning.
- Remove fluff and unnecessary repetition.
- Keep critical technical information intact.`;

  const response = await ai.models.generateContent({
    model: config.geminiModel,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.5,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mainIdea: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          importantTerms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
              },
              required: ['term', 'definition'],
            },
          },
          importantFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
          quickRevision: { type: Type.STRING },
        },
        required: ['mainIdea', 'keyPoints', 'importantTerms', 'importantFacts', 'quickRevision'],
      },
    },
  });

  const rawJson = cleanJsonText(response.text || '{}');
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    throw new Error('Unable to parse the summary from AI response.');
  }

  const sections = {
    mainIdea: parsed.mainIdea || 'Core summary overview.',
    keyPoints: Array.isArray(parsed.keyPoints) && parsed.keyPoints.length > 0 ? parsed.keyPoints : ['Important study point.'],
    importantTerms: Array.isArray(parsed.importantTerms) ? parsed.importantTerms : [],
    importantFacts: Array.isArray(parsed.importantFacts) ? parsed.importantFacts : [],
    quickRevision: parsed.quickRevision || 'Review notes regularly.',
  };

  const summary = `### Main Idea\n${sections.mainIdea}\n\n` +
    `### Key Points\n` + sections.keyPoints.map((k: string) => `- ${k}`).join('\n') + `\n\n` +
    (sections.importantTerms.length > 0
      ? `### Important Terms\n` + sections.importantTerms.map((t: any) => `- **${t.term}**: ${t.definition}`).join('\n') + `\n\n`
      : '') +
    (sections.importantFacts.length > 0
      ? `### Important Facts\n` + sections.importantFacts.map((f: string) => `- ${f}`).join('\n') + `\n\n`
      : '') +
    `### Quick Revision\n${sections.quickRevision}`;

  return { summary, sections };
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

/**
 * 5. PERSONALIZED LEARNING RECOMMENDATIONS
 */
export async function generateLearningRecommendations(
  topicText: string,
  level: string = 'beginner',
  goal: string = 'skill development',
  studyTime: string = '30 minutes/day'
): Promise<RecommendationsResponse> {
  const validated = validateInput(topicText, 'learning topic');
  const ai = getGeminiClient();

  const prompt = `You are EduGenie, a personalized learning assistant.

Student topic: ${validated}
Current knowledge level: ${level}
Learning goal: ${goal}
Available study time: ${studyTime}

Create a structured learning path organized progressively from basic to advanced.
Organize across these progressive stages:
1. Prerequisites
2. Fundamentals
3. Core Concepts
4. Practical Examples
5. Intermediate Topics
6. Advanced Topics
7. Practice / Projects
8. Revision

For each stage, provide:
- "stage": Name of the learning stage (e.g., "1. Prerequisites", "2. Fundamentals", etc.)
- "topic": Specific focused subtopic name
- "whyItMatters": 1-2 sentence explanation of why this is important for their goal
- "difficulty": "Beginner", "Intermediate", or "Advanced"
- "estimatedTime": Estimated time needed given their pace (e.g., "2 days (1 hr total)")
- "nextTopic": Name of the recommended following topic

Also provide "summaryOverview": A 2-3 sentence personalized introduction and strategy for their study plan.`;

  const response = await ai.models.generateContent({
    model: config.geminiModel,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.6,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summaryOverview: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stage: { type: Type.STRING },
                topic: { type: Type.STRING },
                whyItMatters: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                estimatedTime: { type: Type.STRING },
                nextTopic: { type: Type.STRING },
              },
              required: ['stage', 'topic', 'whyItMatters', 'difficulty', 'estimatedTime', 'nextTopic'],
            },
          },
        },
        required: ['summaryOverview', 'recommendations'],
      },
    },
  });

  const rawJson = cleanJsonText(response.text || '{}');
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    throw new Error('Unable to parse learning recommendations from AI response.');
  }

  const recs = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  const normalizedRecs: LearningRecommendation[] = recs.map((r: any, idx: number) => ({
    stage: r.stage || `Stage ${idx + 1}`,
    topic: r.topic || 'Core Concept',
    whyItMatters: r.whyItMatters || 'Essential foundation for progress.',
    difficulty: (['Beginner', 'Intermediate', 'Advanced'].includes(r.difficulty) ? r.difficulty : 'Intermediate') as any,
    estimatedTime: r.estimatedTime || '1-2 sessions',
    nextTopic: r.nextTopic || 'Next Concept',
  }));

  return {
    recommendations: normalizedRecs,
    summaryOverview: parsed.summaryOverview || `A structured personalized roadmap designed to help you achieve your goal in ${validated}.`,
  };
}
