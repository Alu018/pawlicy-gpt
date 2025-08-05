'use client'

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useChat } from "./ClientLayout";

export default function Header() {
    const router = useRouter();
    const { setChatHistory, setActiveChatId } = useChat();

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default Link behavior
        
        // Reset chat state (same as handleNewPolicy)
        setActiveChatId(null);
        setChatHistory([]);
        
        // Navigate to home page
        router.push('/');
        
        // Scroll to top
        setTimeout(() => {
            const mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <header className="w-full py-2 px-6 border-b border-pawlicy-lightgreen bg-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo and Title */}
                <Link href="/" onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
                    <Image
                        src="/logo2.png" // Make sure this file exists in /public
                        alt="Pawlicy Pal logo"
                        width={48}
                        height={48}
                    />
                    <span className="text-lg">
                        <b>Pawlicy</b> Pal
                    </span>
                </Link>

                {/* ACCOUNT */}
                <div className="flex items-center gap-3 flex-row-reverse">
                    <Image
                        src="/profile-pic.svg"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                    <div className="flex flex-col leading-tight text-right">
                        <span className="text-sm font-medium text-gray-800">Patricia Peters</span>
                        <span className="text-xs text-gray-500">Animal Welfare League</span>
                    </div>
                </div>
            </div>
        </header>
    );
}