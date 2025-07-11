'use client'

// import Image from "next/image";
import { Send } from "lucide-react";
// import Footer from "../components/Footer" // Adjust the path if needed
// import api from "@/api";
import { useState, ChangeEvent } from "react";

export default function Home() {
  const [query, setQuery] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)

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
    <>
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

          <div className="w-full flex justify-center">
            <form
              className="w-full max-w-2xl"
              // onSubmit={submitQuery}
              action="https://a6tzysf4.rpcld.app/webhook-test/7d977fcf-05e7-4248-bf9e-04db99380c87"
              method="POST"
              >
              <div className="relative">
                <input
                  type="text"
                  name="text"
                  placeholder="Ask me about any animal welfare topic to start setting up your animal alert campaign"
                  className="border rounded-lg px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  onChange={onChange}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
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
    </>
  );
}
