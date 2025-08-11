'use client'

import { FolderSearch, PencilLine, FileText, Workflow, Gavel, Users, CalendarClock, ChartLine, ArrowUp, Download, Copy } from "lucide-react";
// import api from "@/api";
import { FormEvent, JSX } from "react";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import BirdLoader from "../components/BirdLoader";
import { useChat } from "../components/ClientLayout"; // adjust path if needed
import Image from "next/image";

type Chat = { id: string; title: string; history: { question: string; answer: string; context?: any; pending?: boolean }[] };

export default function Home() {
  const { chats, setChats, activeChatId, setActiveChatId, chatHistory, setChatHistory, addPolicy } = useChat();
  const [showContext, setShowContext] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showPolicySnackbar, setShowPolicySnackbar] = useState(false);
  const [addedToPolicyTracker, setAddedToPolicyTracker] = useState<number | null>(null);

  // Sync chatHistory changes back to the active chat
  useEffect(() => {
    if (activeChatId && chatHistory.length > 0) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChatId
            ? { ...chat, history: chatHistory }
            : chat
        )
      );
    }
  }, [chatHistory, activeChatId, setChats]);

  function getSessionId() {
    let id = localStorage.getItem("session_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("session_id", id);
    }
    return id;
  }

  const handleCopyResponse = async (responseText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(responseText);
      setCopiedIndex(index);
      setShowSnackbar(true);

      setTimeout(() => setCopiedIndex(null), 2000); // reset copied state after 2 seconds
      setTimeout(() => setShowSnackbar(false), 3000); // hide snackbar after 3 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const extractPolicyInfo = (question: string, answer: string) => {
    // Generate a meaningful policy name from question and answer content
    const generatePolicyName = (question: string, answer: string) => {
      const combinedText = question + " " + answer;

      // Policy type keywords
      const policyTypes = {
        'ban': ['ban', 'prohibit', 'forbid', 'outlaw'],
        'regulation': ['regulate', 'control', 'oversight', 'compliance'],
        'ordinance': ['ordinance', 'municipal', 'local law'],
        'licensing': ['license', 'permit', 'registration', 'certification'],
        'protection': ['protect', 'welfare', 'safety', 'rights'],
        'disclosure': ['disclosure', 'transparency', 'reporting', 'labeling']
      };

      // Animal/subject keywords
      const subjects = [
        'animal', 'dog', 'cat', 'horse', 'circus', 'wildlife', 'pet',
        'fur', 'leather', 'foie gras', 'rodeo', 'carriage', 'tethering',
        'breeding', 'puppy mill', 'backyard', 'enclosure', 'cage',
        'plastic', 'straw', 'bag', 'pollution', 'environment'
      ];

      // Extract jurisdiction
      const jurisdictionRegex = /(New York City|Chicago|Los Angeles|Austin|Boston|Seattle|Portland|San Francisco|SF|Miami|Denver|Phoenix|Philadelphia|Detroit|Baltimore|Atlanta|Dallas|Houston|San Antonio)/gi;
      const jurisdictionMatch = combinedText.match(jurisdictionRegex);
      const jurisdiction = jurisdictionMatch ? jurisdictionMatch[0] : '';

      // Find policy type
      let policyType = '';
      for (const [type, keywords] of Object.entries(policyTypes)) {
        if (keywords.some(keyword => combinedText.toLowerCase().includes(keyword))) {
          policyType = type;
          break;
        }
      }

      // Find main subject
      let mainSubject = '';
      for (const subject of subjects) {
        if (combinedText.toLowerCase().includes(subject)) {
          mainSubject = subject;
          break;
        }
      }

      // Generate name based on extracted information
      if (mainSubject && policyType) {
        const typeWord = policyType === 'ban' ? 'Ban' :
          policyType === 'regulation' ? 'Regulation' :
            policyType === 'ordinance' ? 'Ordinance' :
              policyType === 'licensing' ? 'Licensing' :
                policyType === 'protection' ? 'Protection Act' :
                  policyType === 'disclosure' ? 'Disclosure Rule' : 'Policy';

        if (jurisdiction) {
          return `${jurisdiction} ${mainSubject.charAt(0).toUpperCase() + mainSubject.slice(1)} ${typeWord}`;
        } else {
          return `${mainSubject.charAt(0).toUpperCase() + mainSubject.slice(1)} ${typeWord}`;
        }
      } else if (mainSubject) {
        return jurisdiction ?
          `${jurisdiction} ${mainSubject.charAt(0).toUpperCase() + mainSubject.slice(1)} Policy` :
          `${mainSubject.charAt(0).toUpperCase() + mainSubject.slice(1)} Policy`;
      } else if (policyType) {
        const typeWord = policyType.charAt(0).toUpperCase() + policyType.slice(1);
        return jurisdiction ? `${jurisdiction} ${typeWord}` : `New ${typeWord}`;
      } else {
        // Fallback: extract key nouns from question
        const words = question.toLowerCase().split(/\s+/);
        const keyWords = words.filter(word =>
          word.length > 3 &&
          !['that', 'this', 'with', 'from', 'they', 'have', 'been', 'will', 'can', 'could', 'would', 'should'].includes(word)
        );

        if (keyWords.length > 0) {
          const firstKeyWord = keyWords[0].charAt(0).toUpperCase() + keyWords[0].slice(1);
          return jurisdiction ? `${jurisdiction} ${firstKeyWord} Initiative` : `${firstKeyWord} Initiative`;
        }
      }

      // Final fallback
      return jurisdiction ? `${jurisdiction} Policy Initiative` : 'New Policy Initiative';
    };

    const policyName = generatePolicyName(question, answer);

    // Try to extract jurisdiction from the text
    const jurisdictionRegex = /(New York|NYC|Chicago|Los Angeles|Austin|Boston|Seattle|Portland|San Francisco|SF|Miami|Denver|Phoenix|Philadelphia|Detroit|Baltimore|Atlanta|Dallas|Houston|San Antonio)/gi;
    const jurisdictionMatch = (question + " " + answer).match(jurisdictionRegex);
    const jurisdiction = jurisdictionMatch ? jurisdictionMatch[0] : "TBD";

    // Determine policy type and set appropriate defaults
    let stage = "Draft";
    let requiredDocs = ["Fiscal Note", "Sponsor Memo"];

    if (answer.includes("ordinance") || answer.includes("legislation")) {
      stage = "Draft";
    } else if (answer.includes("review") || answer.includes("analysis")) {
      stage = "In Review";
    }

    return {
      name: policyName,
      jurisdiction: jurisdiction,
      stage: stage,
      status: "On Track",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 30 days from now
      assignees: ["User"],
      requiredDocs: requiredDocs,
      attachments: 0,
      notes: `Generated from chat on ${new Date().toLocaleDateString()}`
    };
  };

  const handleAddToPolicyTracker = (msg: any, index: number) => {
    const policyInfo = extractPolicyInfo(msg.question, msg.answer);

    // Add source chat information
    const policyWithSource = {
      ...policyInfo,
      sourceChatId: activeChatId || undefined, // Convert null to undefined
      sourceMessageIndex: index
    };

    addPolicy(policyWithSource);

    setAddedToPolicyTracker(index);
    setShowPolicySnackbar(true);

    setTimeout(() => setAddedToPolicyTracker(null), 3000);
    setTimeout(() => setShowPolicySnackbar(false), 3000);
  };

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

  const lastMsgRef = useRef<HTMLDivElement | null>(null);

  // Scroll to last message when chatHistory changes
  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const [sessionId, setSessionId] = useState<string | null>(null);

  // Set sessionId only on client
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const submitQuestion = async (questionText: string) => {
    if (!sessionId) return; // Don't send request until sessionId is set

    if (!activeChatId) {
      // Create a new chat
      const newId = Math.random().toString(36).substring(2, 15);
      const chatTitle = questionText.length > 30
        ? questionText.substring(0, 30) + "..."
        : questionText;

      const newChat = {
        id: newId,
        title: chatTitle, // Use first question as title
        history: [],
      };
      setChats((prev) => [...prev, newChat]);
      setActiveChatId(newId);
    }

    // Add pending message
    setChatHistory((prev) => [
      ...prev,
      { question: questionText, answer: "Thinking...", context: null, pending: true },
    ]);
    setQuestion(""); // Clear input after submit

    // if the environment variable exists, use it; otherwise, default to hardocded local or production URL
    const localServer = "http://localhost:8000";
    const prodServer = "https://pawlicy-gpt-production.up.railway.app";

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/ask`
      : `${process.env.NODE_ENV === 'production'
        ? prodServer
        : localServer}/ask`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: questionText, session_id: sessionId }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", res.status, text);
      return;
    }
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
    <div className="h-full flex flex-col">
      {/* HEADER */}
      {chatHistory.length === 0 && (
        <div className="w-full flex justify-center items-center flex-shrink-0">
          <h1 className="text-[40px] text-pawlicy-green p-4 flex justify-center items-center w-full text-center pt-22 pb-8">
            How can I help move your policy idea forward?
          </h1>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* INPUT FIELD (top, only if no answer) */}
        {chatHistory.length === 0 && (
          <div className="flex-shrink-0 w-full max-w-5xl mx-auto px-4">
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
          </div>
        )}

        {/* CHAT HISTORY - This should be the scrollable area */}
        {chatHistory.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 pb-60">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
              {chatHistory.map((msg, idx) => (
                <div key={idx} ref={idx === chatHistory.length - 1 ? lastMsgRef : null}>
                  {/* User query bubble */}
                  <div className="flex justify-end my-8">
                    <div className="bg-pawlicy-lightgreen text-gray-900 rounded-3xl px-6 py-4 max-w-lg shadow-md">
                      <div className="text-left">
                        <ReactMarkdown>{msg.question}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  {/* AI answer bubble */}
                  <div className="mt-2 flex justify-start">
                    <div className="px-4 prose prose-pawlicy max-w-3xl">
                      {msg.pending ? (
                        <span>
                          <BirdLoader /> Thinking...
                        </span>
                      ) : (
                        <div>
                          <ReactMarkdown>{msg.answer}</ReactMarkdown>
                          <div className="mt-4 pt-4 border-t text-sm text-gray-800 italic">
                            Prepared by Pawlicy Pal. Please consult City Counsel before filing to confirm compliance with state pre‑emption rules and charter procedures.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.context && (
                    <div className="flex items-center pl-4 gap-2 mb-2 mt-4">
                      {/* Download icon (left) */}
                      <button
                        className="text-[#66991D] hover:text-green-900 cursor-pointer transition-colors rounded"
                        title="Download"
                      >
                        <Download className="w-6 h-6" />
                      </button>

                      {/* Copy icon (second) */}
                      <button
                        className="text-[#66991D] hover:text-green-900 cursor-pointer transition-colors rounded"
                        title={copiedIndex === idx ? "Copied!" : "Copy response"}
                        onClick={() => handleCopyResponse(msg.answer, idx)}
                      >
                        <Copy className={`w-6 h-6 ${copiedIndex === idx ? 'text-green-600' : ''}`} />
                      </button>

                      {/* Pen icon (middle) */}
                      <button
                        className="text-[#66991D] hover:text-green-900 cursor-pointer transition-colors p-1 rounded"
                        title="Edit"
                      >
                        <PencilLine className="w-6 h-6" />
                      </button>

                      {/* Add to policy tracker icon (right) */}
                      <button
                        className="hover:text-green-900 cursor-pointer transition-colors rounded"
                        onClick={() => handleAddToPolicyTracker(msg, idx)}
                        title={showContext === idx ? "Hide context" : "Add to policy tracker"}
                      >
                        <Image
                          src="/add-policy-tracker.svg"
                          alt="Toggle context"
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
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
          </div>
        )}

        {/* PROMPT SUGGESTIONS (only when no chat history) */}
        {chatHistory.length === 0 && (
          <div className="flex-shrink-0 px-4">
            {/* INSTRUCTIONS */}
            <div className="w-full flex justify-center pt-12 pb-4 text-gray-500 font-semibold text-md">
              Don't know where to start? Here are some examples of things you can ask me:
            </div>

            {/* PROMPT SUGGESTIONS */}
            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto mt-4 mb-32">
              {promptSuggestions.map((p) => (
                <div
                  key={p.id}
                  className="border-[#D7E8CD] border-2 rounded-4xl p-3 text-gray-500 text-sm cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => onPromptClick(p.text.replace(/\*\*/g, ""))}
                >
                  <div className="flex items-center justify-center gap-2">
                    {iconMap[p.icon]}
                    <ReactMarkdown>{p.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FIXED INPUT FIELD (bottom, only if answer exists) */}
      {chatHistory.length > 0 && (
        <div
          className="fixed bottom-8 bg-white border-[#D7E8CD] flex-shrink-0"
          style={{ left: "15.5rem", width: "calc(100% - 15.5rem)" }}
        >
          <div className="max-w-5xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="text-sm text-center text-gray-500 font-medium pt-4">
              Pawlicy Pal can make mistakes. Check important information.
            </div>
          </div>
        </div>
      )}

      {/* Snackbar for copy notification */}
      {showSnackbar && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium">Copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Snackbar for policy tracker notification */}
      {showPolicySnackbar && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            <Image
              src="/add-policy-tracker.svg"
              alt="Policy added"
              width={16}
              height={16}
              className="filter invert"
            />
            <span className="text-sm font-medium">Added to Policy Tracker!</span>
          </div>
        </div>
      )}
    </div>
  );
}
