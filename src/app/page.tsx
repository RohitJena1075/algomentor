"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const TOPICS = [
  "Arrays",
  "Linked List",
  "Stack",
  "Queue",
  "Binary Search",
  "DP",
  "Graphs",
  "Heap",
  "Trie",
];

function formatMessage(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("Hint:")) {
      return (
        <div key={i} className="text-blue-400 font-semibold">
          {line}
        </div>
      );
    }
    if (line.startsWith("Solution:")) {
      return (
        <div key={i} className="text-green-400 font-semibold mt-2">
          {line}
        </div>
      );
    }
    if (line.startsWith("-")) {
      return (
        <div key={i} className="ml-4 text-gray-300">
          {line}
        </div>
      );
    }
    if (line.toLowerCase().includes("complexity")) {
      return (
        <div key={i} className="text-yellow-400">
          {line}
        </div>
      );
    }
    return <div key={i}>{line}</div>;
  });
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Start practicing DSA." },
  ]);

  const [mode, setMode] = useState<"hint" | "solution">("hint");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, loading]);

  const send = async (msg?: string, mode?: "hint" | "solution") => {
    const text = msg || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text, mode }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);

    setLoading(false);
  };

  return (
    <main className="h-screen flex bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <aside className="w-60 border-r border-zinc-800 p-4 fixed left-0 top-0 bottom-0 bg-black">
        <h2 className="text-sm text-gray-400 mb-3">Topics</h2>

        <div className="flex flex-col gap-2 overflow-y-auto h-full pr-1">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => send(`Practice ${t}`)}
              className="text-left px-3 py-2 rounded-lg bg-zinc-800/80 hover:bg-blue-600 transition text-sm"
            >
              {t}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1 ml-60 flex flex-col h-screen">
        <header className="fixed top-0 left-60 right-0 bg-black/70 backdrop-blur border-b border-zinc-800 p-4 z-10">
          <h1 className="text-lg font-semibold tracking-tight">AlgoMentor</h1>
          <p className="text-xs text-gray-400">Structured DSA Practice</p>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pt-20 px-4 flex justify-center"
        >
          <div className="w-full max-w-3xl space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-xl ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 border border-zinc-700"
                  }`}
                >
                  {formatMessage(m.content)}
                </div>
              </div>
            ))}

            {loading && <div className="text-gray-400">Thinking...</div>}
          </div>
        </div>

        <div className="bg-black border-t border-zinc-800 p-4">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="flex bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setMode("hint")}
                className={`px-3 py-1 text-sm ${
                  mode === "hint"
                    ? "bg-blue-600 text-white rounded"
                    : "text-gray-400"
                }`}
              >
                Hint
              </button>

              <button
                onClick={() => setMode("solution")}
                className={`px-3 py-1 text-sm ${
                  mode === "solution"
                    ? "bg-green-600 text-white rounded"
                    : "text-gray-400"
                }`}
              >
                Solution
              </button>
            </div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your doubt..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") send(undefined, mode);
              }}
            />

            <button
              onClick={() => send(undefined, mode)}
              className="px-4 py-2 bg-white text-black rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
