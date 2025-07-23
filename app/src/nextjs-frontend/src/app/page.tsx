'use client'

// import Image from "next/image";
import { FolderSearch, PencilLine, FileText, Workflow, Gavel, Users, CalendarClock, ChartLine, ArrowUp } from "lucide-react";
// import Footer from "../components/Footer" // Adjust the path if needed
// import api from "@/api";
import { useState, ChangeEvent, FormEvent, JSX } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [showContext, setShowContext] = useState(false);

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
  const [answer, setAnswer] = useState<string>("");
  const [context, setContext] = useState<any>("");

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setAnswer("Loading...");
  //   const res = await fetch("http://localhost:8000/ask", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ question }),
  //   });
  //   const data = await res.json();
  //   setAnswer(data.answer);
  //   setContext(data.context);
  // };

  const submitQuestion = async (questionText: string) => {
    setAnswer("Loading...");
    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: questionText }),
    });
    const data = await res.json();
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
    <div className="flex flex-col min-h-screen pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        {/* TITLE */}

        {!answer && (
          <div className="w-full flex justify-center items-center">
            <h1 className="text-[40px] text-pawlicy-green p-4 flex justify-center items-center w-full text-center">
              How can I help move your policy idea forward?
            </h1>
          </div>
        )}

        {/* INPUT FIELD */}
        <div className="w-full max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="w-full relative">
              <input
                className="w-full min-w-0 px-3 py-4 pb-26 pr-12 text-lg border border-[#D7E8CD] shadow-md rounded-xl  focus:outline-none focus:ring-2 focus:ring-blue-400"
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

          {answer && (
            <div className="mt-8">
              <div className="mb-4 prose prose-pawlicy max-w-none">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>

              <button
                className="text-sm underline text-blue-600 hover:text-blue-800 mb-2"
                onClick={() => setShowContext(!showContext)}
              >
                {showContext ? "Hide context" : "Show context"}
              </button>

              {showContext && (
                <div>
                  <strong className="block mb-1">Context:</strong>
                  <div>
                    {Array.isArray(context)
                      ? context.map((item, idx) => (
                        <pre
                          key={idx}
                          className="bg-gray-100 p-2 rounded mb-2 text-sm overflow-x-auto"
                        >
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      ))
                      : typeof context === "object"
                        ? (
                          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                            {JSON.stringify(context, null, 2)}
                          </pre>
                        )
                        : context}
                  </div>
                </div>
              )}
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
