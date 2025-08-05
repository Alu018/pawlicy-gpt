import { Route, SquarePen, Search, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Chat = {
  id: string;
  title: string;
  history: { question: string; answer: string; context?: any; pending?: boolean }[];
};

type SidebarProps = {
  chats: Chat[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  activeChatId: string | null;
};

export default function Sidebar({
  chats,
  onNewChat,
  onSelectChat,
  activeChatId,
}: SidebarProps) {
  const router = useRouter();

  // Helper function to truncate chat titles
  const truncateTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  const handleNewPolicy = () => {
    onNewChat();
    router.push('/'); // Navigate to home page
  };

  const handlePolicyTracker = () => {
    router.push('/policy-tracker');
    // Add a small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <aside className="h-full w-62 bg-[#F9FBF1] flex flex-col p-4">
      {/* Search Bar */}
      <div className="mb-6 mt-8">
        <div className="relative">
          <Search className="absolute left-4 top-2 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search all chats and files"
            className="w-full text-sm pl-11 pr-3 py-2 rounded-3xl border border-pawlicy-lightgreen bg-white focus:outline-none focus:ring-2 focus:ring-pawlicy-green"
          />
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        <button
          onClick={handleNewPolicy}
          className="flex items-center gap-2 text-gray-700 rounded-2xl px-3 py-2 transition hover:bg-pawlicy-lightgreen focus:bg-pawlicy-green focus:text-white focus:outline-none cursor-pointer"
        >
          <SquarePen className="w-5 h-5" /> New Policy
        </button>

        <button
          onClick={handlePolicyTracker}
          className="flex items-center gap-2 text-gray-700 rounded-2xl px-3 py-2 transition hover:bg-pawlicy-lightgreen focus:bg-pawlicy-green focus:text-white focus:outline-none cursor-pointer"
        >
          <Route className="w-5 h-5" /> Policy Tracker
        </button>
      </nav>

      {/* Chats Section */}
      <div className="mt-8">
        <div className="text-xs font-bold text-gray-500 mb-2 pl-2">Chats</div>
        <div className="flex flex-col gap-1">
          {chats.map((chat: Chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm transition cursor-pointer ${activeChatId === chat.id
                ? "bg-pawlicy-lightgreen text-pawlicy-green font-semibold"
                : "text-gray-700 hover:bg-pawlicy-lightgreen"
                }`}
              title={chat.title || "Untitled Chat"} // Show full title on hover
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {truncateTitle(chat.title || "Untitled Chat")}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}