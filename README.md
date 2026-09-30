# EduGenie – AI Learning Assistant

EduGenie is a production-ready, mobile-first educational web application powered by **Google Gemini AI**. It empowers students to understand complex topics, test their knowledge with interactive quizzes, summarize dense lecture material, and follow structured learning paths tailored to their personal goals.

---

## 🌟 Core Features

1. **AI Question & Answer (`/qa`)**
   - Direct, high-clarity answers formatted with Markdown, code blocks, lists, and takeaways.
   - Built-in one-click "Copy Answer" and follow-up suggestions into Explanations or Quizzes.

2. **Concept Explanation (`/explain`)**
   - Deep, structured breakdowns into 7 educational cards:
     1. Simple Definition
     2. Core Concept
     3. Step-by-Step Explanation
     4. Practical Example
     5. Important Points
     6. Common Mistakes to Avoid
     7. Quick Recap (Memorize This)
   - Configurable for Beginner, Intermediate, or Advanced students.

3. **AI Quiz Generator (`/quiz`)**
   - Generates exactly 3 multiple-choice questions with 4 options each and a verified answer.
   - Interactive question cards with instant touch-friendly selection.
   - Live score calculation, percentage breakdown, celebration confetti, and detailed answer explanations.
   - "Try Again" and "Generate New Quiz" support.

4. **Text Summarizer (`/summarize`)**
   - Condenses long notes, papers, or articles into:
     - Main Idea
     - Key Points
     - Important Terms & Vocabulary
     - Concrete Facts & Figures
     - Quick 30-Second Revision Summary
   - Length options: Short, Medium, Detailed.

5. **Personalized Learning Path (`/recommendations`)**
   - Progressive curriculum timeline spanning Prerequisites, Fundamentals, Core Concepts, Practical Examples, Intermediate Topics, Advanced Topics, Practice/Projects, and Revision.
   - Estimates learning time and provides immediate deep links to explore each subtopic.

6. **Recent Activity & Local Persistence**
   - Saves recent Q&As, quizzes, summaries, and roadmaps to browser `localStorage` without requiring sign-in hurdles.

---

## 🛠 Technology Stack

- **AI Provider**: Google Gemini (`@google/genai` TypeScript SDK, defaulting to `gemini-3.8-flash`)
- **Backend**: Node.js & Express (`server.ts`, `server/gemini.ts`, `server/routes.ts`)
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Testing**: Vitest (`tests/api.test.ts`)

---

## 📁 Project Structure

```
EduGenie/
├── index.html                   # HTML entry point with SEO metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── server.ts                    # Full-stack Express & Vite dev/prod server
├── server/
│   ├── config.ts                # Environment and app configuration
│   ├── gemini.ts                # Gemini AI client, prompts & strict JSON validation
│   └── routes.ts                # API router (/health, /qa, /explain, /quiz, /summarize, /recommendations)
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Main app router, header, breadcrumbs, history drawer
│   ├── api.ts                   # Frontend API client
│   ├── types.ts                 # Shared TypeScript interfaces
│   ├── index.css                # Tailwind CSS styling & custom scrollbars
│   ├── components/
│   │   ├── Header.tsx           # Navigation bar, mobile hamburger menu, health status
│   │   ├── Footer.tsx           # Educational footer & resource links
│   │   ├── MarkdownRenderer.tsx # Safe custom Markdown parser with code copy
│   │   └── RecentActivity.tsx   # Study session history drawer
│   └── views/
│       ├── HomeView.tsx         # Hero banner, quick workspace, 5 feature cards, how it works
│       ├── QaView.tsx           # AI Q&A workspace
│       ├── ExplainView.tsx      # Step-by-step concept explainer
│       ├── QuizView.tsx         # Interactive 3-question MCQ quiz & scoring
│       ├── SummarizeView.tsx    # Text summarizer
│       ├── RecommendationsView.tsx # Step-by-step curriculum visualizer
│       └── AboutView.tsx        # Story, mission, and future roadmap (v2)
└── tests/
    └── api.test.ts              # Unit tests for input validation, quiz schemas & error handling
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`:

```bash
# Application details
APP_NAME="EduGenie"
APP_VERSION="1.0.0"
PORT=3000

# Google Gemini API Key (injected automatically in Google AI Studio)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Gemini Model (default: gemini-3.8-flash)
GEMINI_MODEL="gemini-3.8-flash"

# Maximum input character threshold
MAX_INPUT_LENGTH=12000

# Optional separate backend URL (empty for same-origin relative endpoints)
VITE_API_BASE_URL=""
```

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development

Run the full-stack server (Express + Vite with hot module support):

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 3. Run Tests

Verify validation, schemas, and quiz JSON parser:

```bash
npm run test
```

### 4. Production Build & Start

```bash
npm run build
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System status, version, and Gemini engine readiness |
| `POST` | `/qa` | Ask an educational question (`{ "text": "..." }`) |
| `POST` | `/explain` | Deep explanation (`{ "text": "...", "level": "...", "preference": "..." }`) |
| `POST` | `/quiz` | 3-question MCQ quiz (`{ "text": "...", "difficulty": "..." }`) |
| `POST` | `/summarize` | Summarize notes (`{ "text": "...", "length": "..." }`) |
| `POST` | `/learn/recommendations` | Curriculum roadmap (`{ "topic": "...", "level": "...", "goal": "..." }`) |

---

## 🛡️ Security

- **Server-Side API Key**: The `GEMINI_API_KEY` is loaded strictly on the server and is never exposed to the frontend bundle.
- **Input Validation**: All payloads are checked for empty submissions and enforced under `MAX_INPUT_LENGTH=12000`.
- **Safe Rendering**: Markdown parsing avoids unsafe HTML injection.
