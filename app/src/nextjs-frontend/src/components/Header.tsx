'use client'

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useChat } from "./ClientLayout";
import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, Bug } from "lucide-react";

export default function Header() {
    const router = useRouter();
    const { setChatHistory, setActiveChatId } = useChat();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleAccountClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSettingsClick = () => {
        setIsDropdownOpen(false);
        // Add navigation to settings page when it exists
        console.log("Navigate to settings");
    };

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        // Add logout logic here
        console.log("Logout user");
    };

    const handleDebugAuthClick = () => {
        router.push('/auth');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="w-full py-1 px-6 border-b border-pawlicy-lightgreen bg-white">
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

                {/* Right side container */}
                <div className="flex items-center gap-3">
                    {/* Debug Auth Button */}
                    <button
                        onClick={handleDebugAuthClick}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Debug: Go to Auth Page"
                    >
                        <Bug className="w-3 h-3" />
                        <span>Auth</span>
                    </button>

                    {/* ACCOUNT */}
                    <div className="relative" ref={dropdownRef}>
                        <div 
                            className="flex items-center gap-3 flex-row-reverse cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            onClick={handleAccountClick}
                        >
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

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-58 bg-white border border-gray-200 rounded-3xl shadow-lg z-50">
                                <div className="py-2">
                                    {/* Email */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">patricia.peters@awl.org</span>
                                        </div>
                                    </div>

                                    {/* Settings */}
                                    <button
                                        onClick={handleSettingsClick}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <Settings className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">Settings</span>
                                    </button>

                                    {/* Log Out */}
                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
                                    >
                                        <LogOut className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">Log out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}