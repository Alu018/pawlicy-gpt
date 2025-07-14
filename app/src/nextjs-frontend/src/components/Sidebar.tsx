import { Home, Search, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="h-full w-48 bg-pawlicy-lightgreen flex flex-col p-4">
      <nav className="flex flex-col gap-4">
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-pawlicy-green">
          <Home className="w-5 h-5" /> New Policy
        </a>
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-pawlicy-green">
          <Search className="w-5 h-5" /> Policy Tracker
        </a>
      </nav>
    </aside>
  );
}