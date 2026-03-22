# AlgoMentor

AlgoMentor is a DSA-focused chatbot designed to simulate a **real technical interviewer**, not a generic AI assistant.

It helps users practice problem-solving by providing **hints first** and revealing full solutions only when explicitly requested.

---

## Why AlgoMentor?

Most AI tools give direct answers.

But in real interviews:
- You are expected to think
- You are guided with hints
- You must identify patterns

AlgoMentor is built to replicate that experience.

---

## Features

### Interview-style Interaction
- Default: **Hint-first approach**
- Solution only when explicitly selected
- Encourages thinking, not memorization

### Topic-based Learning
- Arrays
- Linked List
- Stack / Queue
- Binary Search
- Dynamic Programming
- Graphs
- Heap
- Trie

###  Structured Responses
Each response includes:
- Pattern
- Approach
- Explanation
- Complexity (only in solution mode)

### Mode Control
- Hint mode (default)
- Solution mode

### Retrieval-based AI
- Uses a **custom knowledge base**
- Avoids hallucinations
- Ensures grounded answers

---

##  UI / Frontend Thinking

This is not a generic chat interface.

Key design decisions:
- Sidebar for topic navigation
- Centered chat for focus
- Mode selector (Hint / Solution)
- Clean structured message formatting
- Smooth scrolling & auto-scroll
- Fixed layout (header + sidebar)

The UI is designed as a **learning tool**, not a chatbot wrapper.

---

##  Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- Custom Retrieval System

---

## Project Structure
```bash
algomentor/
│
├── public/
│ ├── logo.png
│ └── favicon.png
│
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ └── chat/
│ │ │ └── route.ts # Backend (Cohere + retrieval)
│ │ │
│ │ ├── layout.tsx # Metadata + global layout
│ │ ├── page.tsx # Main UI
│ │ ├── globals.css # Styles
│ │ └── icon.png # App icon
│ │
│ ├── data/
│ │ └── dsa.json # Knowledge base
│ │
│ ├── lib/ # (optional utilities)
│ └── types/ # (optional types)
│
├── .env.local
├── package.json
└── README.md


---

## How It Works

1. User asks a question
2. System retrieves top relevant problems from dataset
3. Context is built using structured format
4. Output is constrained:
   - Hint mode → partial guidance
   - Solution mode → full explanation

---

## Run Locally

```bash
npm install
npm run dev

Production:

npm run build
npm start
