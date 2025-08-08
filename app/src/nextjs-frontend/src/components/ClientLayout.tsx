'use client'

import React, { useState, useContext, createContext } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";

// Define types and context
type Chat = { id: string; title: string; history: { question: string; answer: string; context?: any; pending?: boolean }[] };
type ChatContextType = {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  activeChatId: string | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chatHistory: { question: string; answer: string; context?: any; pending?: boolean }[];
  setChatHistory: React.Dispatch<React.SetStateAction<{ question: string; answer: string; context?: any; pending?: boolean }[]>>;
};
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component (still in this file)
function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string; context?: any; pending?: boolean }[]>([]);

  return (
    <ChatContext.Provider value={{ chats, setChats, activeChatId, setActiveChatId, chatHistory, setChatHistory }}>
      {children}
    </ChatContext.Provider>
  );
}

// 3. Custom hook (still in this file)
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}

// 4. Main layout content
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { chats, activeChatId, setActiveChatId, setChatHistory, chatHistory } = useChat();
  const router = useRouter();

  const handleNewChat = () => {
    setActiveChatId(null);
    setChatHistory([]); // Clear chat history to go back to home screen

    // Navigate to home page
    router.push('/');

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    // Load the selected chat's history
    const selectedChat = chats.find(chat => chat.id === id);
    if (selectedChat) {
      setChatHistory(selectedChat.history);
    }

    // Navigate to home page to show the chat
    router.push('/');
  };

  // Determine overflow based on chat history
  const mainOverflow = chatHistory.length > 0 ? 'overflow-y-auto' : 'overflow-auto';

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
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

// 5. Exported layout
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <LayoutContent>{children}</LayoutContent>
    </ChatProvider>
  );
}