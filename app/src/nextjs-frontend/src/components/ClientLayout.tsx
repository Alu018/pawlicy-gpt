'use client'

import React, { useState, useContext, createContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";

// Define types and context
type Chat = { id: string; title: string; history: { question: string; answer: string; context?: any; pending?: boolean }[] };

type Policy = {
  id: string;
  name: string;
  jurisdiction: string;
  stage: string;
  status: string;
  dueDate: string;
  assignees: string[];
  requiredDocs: string[];
  attachments: number;
  notes: string;
  sourceChatId?: string; // Track which chat this policy came from
  sourceMessageIndex?: number; // Track which message in the chat
};

type ChatContextType = {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChatId: string | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chatHistory: { question: string; answer: string; context?: any; pending?: boolean }[];
  setChatHistory: React.Dispatch<React.SetStateAction<{ question: string; answer: string; context?: any; pending?: boolean }[]>>;
  policies: Policy[];
  setPolicies: React.Dispatch<React.SetStateAction<Policy[]>>;
  addPolicy: (policy: Omit<Policy, 'id'>) => void;
  openDraftThread: (policy: Policy) => void; // New function to navigate to source chat
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string; context?: any; pending?: boolean }[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([
    // Default policies (existing data)
    {
      id: "FG-NYC-25",
      name: "NYC Foie Gras Procurement Ban",
      jurisdiction: "New York City",
      stage: "In Review",
      status: "At Risk",
      dueDate: "Aug 20, 2025",
      assignees: ["Maria", "Alex"],
      requiredDocs: ["Fiscal Note", "Sponsor Memo"],
      attachments: 2,
      notes: "Legal concerns about state preemption need to be addressed."
    }
  ]);

  const addPolicy = (newPolicy: Omit<Policy, 'id'>) => {
    const id = `POL-${Date.now()}`;
    setPolicies(prev => [...prev, { ...newPolicy, id }]);
  };

  const openDraftThread = (policy: Policy) => {
    if (policy.sourceChatId && chats.find(chat => chat.id === policy.sourceChatId)) {
      // Chat exists, navigate to it
      setActiveChatId(policy.sourceChatId);
      const sourceChat = chats.find(chat => chat.id === policy.sourceChatId);
      if (sourceChat) {
        setChatHistory(sourceChat.history);
      }
      // Router navigation will be handled in the layout component
    }
  };

  return (
    <ChatContext.Provider value={{ 
      chats, 
      setChats, 
      activeChatId, 
      setActiveChatId, 
      chatHistory, 
      setChatHistory,
      policies,
      setPolicies,
      addPolicy,
      openDraftThread
    }}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}

// Main layout content
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { chats, activeChatId, setActiveChatId, setChatHistory, chatHistory, setChats } = useChat();
  const router = useRouter();

  const handleNewChat = () => {
    setActiveChatId(null);
    setChatHistory([]);
    router.push('/');

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    const selectedChat = chats.find(chat => chat.id === id);
    if (selectedChat) {
      setChatHistory(selectedChat.history);
    }
    router.push('/');
  };

  const handleDeleteChat = (id: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== id));
    
    if (activeChatId === id) {
      setActiveChatId(null);
      setChatHistory([]);
      router.push('/');
    }
  };

  const mainOverflow = chatHistory.length > 0 ? 'overflow-y-auto' : 'overflow-auto';

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        activeChatId={activeChatId}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={`flex-1 ${mainOverflow}`}>
          <div className="h-full p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <LayoutContent>{children}</LayoutContent>
    </ChatProvider>
  );
}