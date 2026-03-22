import { NextRequest, NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";
import kb from "@/data/dsa.json";

const client = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

type KBItem = (typeof kb)[number];

// scoring
function score(item: KBItem, query: string) {
  const text = `
    ${item.topic}
    ${item.title}
    ${item.question}
    ${item.pattern}
  `.toLowerCase();

  let score = 0;

  for (const word of query.toLowerCase().split(/\W+/)) {
    if (text.includes(word)) score += 2;
  }

  if (query.toLowerCase().includes(item.difficulty)) score += 1;

  return score;
}

// retrieve
function retrieve(query: string) {
  return (kb as KBItem[])
    .map((item) => ({
      item,
      score: score(item, query),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.item);
}

// context builder
function buildContext(items: KBItem[]) {
  return items
    .map(
      (i, idx) => `
[Problem ${idx + 1}]
Title: ${i.title}
Topic: ${i.topic}
Difficulty: ${i.difficulty}
Pattern: ${i.pattern}

Question:
${i.question}

Hints:
- ${i.hints.join("\n- ")}

Solution:
${i.solution}

Explanation:
${i.explanation}

Complexity:
Time: ${i.time_complexity}
Space: ${i.space_complexity}
`
    )
    .join("\n====================\n");
}

const SYSTEM_PROMPT = `
You are AlgoMentor, a strict DSA interviewer.

Rules:
1. ONLY answer from given context
2. If not found → say "Not in dataset"
3. Default → give HINTS only
4. Give solution ONLY if explicitly asked
5. Always mention pattern
6. Mention complexity ONLY in solution mode

Output format:

Hint:
- ...

Solution:
Approach:
Pattern:
Time Complexity:
Space Complexity:
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message || "";
    const mode = body?.mode || "hint";

    if (!message.trim()) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const results = retrieve(message);

    if (!results.length) {
      return NextResponse.json({
        text: "Not in dataset",
        sources: [],
      });
    }

    const context = buildContext(results);

    let instruction = "Give hint only";
    if (mode === "solution") {
      instruction =
        "Give full solution with approach, pattern, and complexity";
    }

    const prompt = `
${SYSTEM_PROMPT}

CONTEXT:
${context}

USER:
${instruction}
${message}

ASSISTANT:
`;

    const response = await client.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      temperature: 0.3,
      maxTokens: 1000,
    });

    // debug once (remove after confirm)
    console.log("COHERE RESPONSE:", response);

    // 🔥 robust parsing (handles all cases)
     const text = response.text?.trim() || "No response";

    return NextResponse.json({
      text,
      sources: results.map((r) => ({
        title: r.title,
        topic: r.topic,
      })),
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}