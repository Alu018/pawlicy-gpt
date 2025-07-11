'use client'

// import Image from "next/image";
import { Send } from "lucide-react";
// import Footer from "../components/Footer" // Adjust the path if needed
// import api from "@/api";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Home() {
  const [query, setQuery] = useState("")

  const promptSuggestions = [
    { id: 1, text: "Alert when government subsidies are allocated to factory farms" },
    { id: 2, text: "Monitor corporate donations to lawmakers voting on animal welfare" },
    { id: 3, text: "Track upcoming votes on wildlife protections in Congress" },
    { id: 4, text: "Notify whenever there is a new bill affecting factory farming regulations" },
    { id: 5, text: "Track penalties issued to companies violating animal welfare laws" },
    { id: 6, text: "Alert when public sentiment shifts on animal testing policies" },
    { id: 7, text: "Monitor new trade agreements impacting live animal exports" },
    { id: 8, text: "Notify when fast food chains update their animal welfare commitments" },
    { id: 9, text: "Track lawsuits filed against companies for animal cruelty" },
  ];

  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [context, setContext] = useState<any>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAnswer("Loading...");
    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setContext(data.context);
  };

  // Update the query state
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  // Submit the query
  //   const submitQuery = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault()
  //     await api.post("query", { text: query })
  //   }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <div className="w-full max-w-4xl flex justify-center items-center">
          {/* <Image
              src="/open-paws-logo.png"
              alt="open paws logo"
              width={75}
              height={38}
              priority
            /> */}
          <h1 className="text-4xl font-bold p-4">Welcome to your Watchdog, Sam</h1>
        </div>
        <div className="flex justify-center text-xl text-center">Watchdog is your personal assistant for researching, monitoring, and reporting on regulatory changes impacting the treatment of animals</div>

        <div className="max-w-xl mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Pawlicy Pal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full px-3 py-2 text-lg border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              type="submit"
            >
              Ask
            </button>
          </form>
          {answer && (
            <div className="mt-8">
              <strong className="block mb-1">Answer:</strong>
              <div className="mb-4">{answer}</div>
              <strong className="block mb-1">Context:</strong>
              {/* <div>
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
              </div> */}
            </div>
          )}
        </div>

        <div className="w-full flex justify-center text-lg">Need inspiration? Here are some things you can ask me:</div>

        {/* PROMPT SUGGESTIONS */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {promptSuggestions.map((p) => (
            <div key={p.id} className="border-gray-300 border-2 italic p-3 text-center text-sm rounded-lg">
              {p.text}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
