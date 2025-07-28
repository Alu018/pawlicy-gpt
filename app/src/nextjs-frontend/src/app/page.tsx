'use client'

import { FolderSearch, PencilLine, FileText, Workflow, Gavel, Users, CalendarClock, ChartLine, ArrowUp } from "lucide-react";
// import api from "@/api";
import { useState, ChangeEvent, FormEvent, JSX } from "react";
import ReactMarkdown from "react-markdown";
import { useRef, useEffect } from "react";
import BirdLoader from "../components/BirdLoader";

export default function Home() {
  const [showContext, setShowContext] = useState<number | null>(null);

  const iconMap: Record<string, JSX.Element> = {
    "magnifying-glass-chart": <FolderSearch className="w-8 h-8 inline mr-2" />,
    "pencil-paper": <PencilLine className="w-8 h-8 inline mr-2" />,
    "document-review": <FileText className="w-8 h-8 inline mr-2" />,
    "roadmap": <Workflow className="w-8 h-8 inline mr-2" />,
    "gavel-search": <Gavel className="w-8 h-8 inline mr-2" />,
    "group-mobilize": <Users className="w-8 h-8 inline mr-2" />,
    "calendar-clock": <CalendarClock className="w-8 h-8 inline mr-2" />,
    "bar-chart-forecast": <ChartLine className="w-8 h-8 inline mr-2" />,
  };
  const promptSuggestions = [
    {
      id: 1,
      icon: "magnifying-glass-chart", // icon for research
      text: "**Research** every U.S. city that bans wild-animal circuses and why each law passed or failed"
    },
    {
      id: 2,
      icon: "pencil-paper", // icon for drafting
      text: "Draft a ready-to-file tethering ordinance for dogs in Austin, TX—with fiscal-impact statement"
    },
    {
      id: 3,
      icon: "document-review", // icon for reviewing documents
      text: "Review this Chicago carriage-horse ban draft and flag any potential conflicts with Illinois state law"
    },
    {
      id: 4,
      icon: "roadmap", // icon for roadmap/flowchart
      text: "Create a roadmap that includes a complete legislative timeline to pass a plastic-straw ban in Miami Beach"
    },
    {
      id: 5,
      icon: "gavel-search", // icon for legal precedent
      text: "Find precedent that helped NYC pass its fur-products disclosure rule"
    },
    {
      id: 6,
      icon: "group-mobilize", // icon for mobilizing people
      text: "Mobilize volunteers by creating a task list to lobby Phoenix council members on a rodeo cruelty ban"
    },
    {
      id: 7,
      icon: "calendar-clock", // icon for tracking deadlines
      text: "Track all initiative-petition deadlines for the Denver backyard-hen permit proposal"
    },
    {
      id: 8,
      icon: "bar-chart-forecast", // icon for estimating costs
      text: "Estimate enforcement costs for a Seattle program licensing outdoor cat enclosures"
    }
  ];

  const [question, setQuestion] = useState<string>("");
  // const [lastQuestion, setLastQuestion] = useState<string>(""); // NEW
  const [answer, setAnswer] = useState<string>("");
  const [context, setContext] = useState<any>("");

  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string; context?: any; pending?: boolean }[]
  >([]);

  const lastMsgRef = useRef<HTMLDivElement | null>(null);

  // Scroll to last message when chatHistory changes
  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const submitQuestion = async (questionText: string) => {
    // Add pending message
    setChatHistory((prev) => [
      ...prev,
      { question: questionText, answer: "Thinking...", context: null, pending: true },
    ]);
    setQuestion(""); // Clear input after submit

    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: questionText }),
    });
    const data = await res.json();

    // Replace the last (pending) message with the real answer
    setChatHistory((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        question: questionText,
        answer: data.answer,
        context: data.context,
      };
      return updated;
    });

    setAnswer(data.answer);
    setContext(data.context);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitQuestion(question);
  };

  const onPromptClick = async (promptText: string) => {
    setQuestion(promptText);
    await submitQuestion(promptText);
  };


  return (
    <div className="flex flex-col min-h-screen pb-20 gap-16 sm:p-20 h-screen">
      <main className="flex flex-col gap-8 items-center sm:items-start overflow-none">
        {/* HEADER */}
        {!answer && (
          <div className="w-full flex justify-center items-center">
            <h1 className="text-[40px] text-pawlicy-green p-4 flex justify-center items-center w-full text-center">
              How can I help move your policy idea forward?
            </h1>
          </div>
        )}

        {/* INPUT FIELD */}
        <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">

          {/* INPUT FIELD (top, only if no answer) */}
          {!answer && (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="w-full relative">
                <input
                  className="w-full min-w-0 px-4 py-4 pb-26 pr-12 text-md border border-[#D7E8CD] shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Be specific when sharing your policy goals with me so I can assist you to the best of my knowledge and ability."
                />
                <button
                  type="submit"
                  className="absolute bottom-2 right-2 bg-black rounded-full p-2 flex items-center justify-center hover:bg-gray-700 transition cursor-pointer disabled:bg-gray-300 disabled:cursor-default"
                  aria-label="Send"
                  disabled={!question.trim()}
                >
                  <ArrowUp className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          )}

          {/* INPUT FIELD (bottom, only if answer exists) */}
          {answer && (
            <div
              className="fixed bottom-12 bg-white border-[#D7E8CD]"
              style={{ left: "14rem", width: "calc(100% - 16rem)" }}
            >
              <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit} className="max-w-5xl space-y-4">
                  <div className="w-full relative">
                    <input
                      className="w-full min-w-0 px-4 py-4 pb-26 pr-12 text-md border border-[#D7E8CD] shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything"
                    />
                    <button
                      type="submit"
                      className="absolute bottom-2 right-2 bg-black rounded-full p-2 flex items-center justify-center hover:bg-gray-700 transition cursor-pointer disabled:bg-gray-300 disabled:cursor-default"
                      aria-label="Send"
                      disabled={!question.trim()}
                    >
                      <ArrowUp className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ANSWER + CHAT HISTORY */}
          {answer && chatHistory.length > 0 && (
            <div className="flex flex-col gap-6 overflow-y-auto pb-32" style={{ maxHeight: "calc(100vh - 12rem)" }}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} ref={idx === chatHistory.length - 1 ? lastMsgRef : null}>
                  {/* User query bubble */}
                  <div className="flex justify-end">
                    <div className="bg-pawlicy-lightgreen text-gray-900 rounded-3xl px-6 py-4 max-w-lg text-right shadow-md">
                      <ReactMarkdown>{msg.question}</ReactMarkdown>
                    </div>
                  </div>
                  {/* AI answer bubble */}
                  <div className="mt-2 flex justify-start">
                    <div className="px-4 prose prose-pawlicy max-w-3xl">
                      {msg.pending ? (
                        <span>
                          <BirdLoader /> Thinking...
                          {/* Thinking... */}
                        </span>
                      ) : (
                        <ReactMarkdown>{msg.answer}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                  {/* Context toggle for each message (optional) */}
                  {msg.context && (
                    <button
                      className="text-sm underline text-blue-500 hover:text-blue-800 pl-4 mb-2 cursor-pointer"
                      onClick={() => setShowContext(showContext === idx ? null : idx)}
                    >
                      {showContext === idx ? "Hide context" : "Show context"}
                    </button>
                  )}
                  {showContext === idx && msg.context && (
                    <div>
                      <strong className="block mb-1">Context:</strong>
                      <div>
                        {Array.isArray(msg.context)
                          ? msg.context.map((item, cidx) => (
                            <pre
                              key={cidx}
                              className="bg-gray-100 p-2 rounded mb-2 text-sm overflow-x-auto"
                            >
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          ))
                          : typeof msg.context === "object"
                            ? (
                              <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                                {JSON.stringify(msg.context, null, 2)}
                              </pre>
                            )
                            : msg.context}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!answer && (
          <>
            {/* INSTRUCTIONS */}
            <div className="w-full flex justify-center pt-4 text-gray-500 font-semibold text-md">Don’t know where to start? Here are some examples of things you can ask me:</div>

            {/* PROMPT SUGGESTIONS */}
            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
              {promptSuggestions.map((p) => (
                <div
                  key={p.id}
                  className="border-[#D7E8CD] border-2 rounded-4xl p-3 text-gray-500 text-sm cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => onPromptClick(p.text.replace(/\*\*/g, ""))} // remove markdown ** for input text if needed
                >
                  <div className="flex items-center justify-center gap-2">
                    {iconMap[p.icon]}
                    <ReactMarkdown>{p.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
