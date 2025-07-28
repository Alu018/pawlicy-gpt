import { Route, SquarePen, Search } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="h-full w-62 bg-[#F9FBF1] flex flex-col p-4">
      {/* Search Bar */}
      <div className="mb-4 mt-8">
        <div className="relative">
          <Search className="absolute left-4 top-2 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search all chats and files"
            className="w-full text-sm pl-11 pr-3 py-2 rounded-3xl border border-pawlicy-lightgreen bg-white focus:outline-none focus:ring-2 focus:ring-pawlicy-green"
          />
        </div>
      </div>
      <nav className="flex flex-col gap-4">
        <a
          href="#"
          className="flex items-center gap-2 text-gray-700 rounded-2xl px-3 py-2 transition hover:bg-pawlicy-lightgreen focus:bg-pawlicy-green focus:text-white focus:outline-none"
        >
          <SquarePen className="w-5 h-5" /> New Policy
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-gray-700 rounded-2xl px-3 py-2 transition hover:bg-pawlicy-lightgreen focus:bg-pawlicy-green focus:text-white focus:outline-none"
        >
          <Route className="w-5 h-5" /> Policy Tracker
        </a>
      </nav>
    </aside>
  );
}