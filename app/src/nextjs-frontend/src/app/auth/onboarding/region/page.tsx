'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const locationSuggestions = [
    "New York City, USA",
    "Los Angeles, USA",
    "Chicago, USA",
    "London, UK",
    "Toronto, Canada",
    "Sydney, Australia",
    "Berlin, Germany",
    "Paris, France",
    "Tokyo, Japan",
    "Mexico City, Mexico"
];

export default function OnboardingRegionPage() {
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const filteredSuggestions = location
        ? locationSuggestions.filter(loc =>
            loc.toLowerCase().includes(location.toLowerCase())
        )
        : [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
        setError('');
        setShowDropdown(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setLocation(suggestion);
        setShowDropdown(false);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) {
            setError('Please enter your city or country');
            return;
        }
        // Save location to user profile here if needed
        router.push('/auth/onboarding/role');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf6] relative">
            {/* Background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/bg-account.svg')",
                    backgroundSize: '100%',
                    backgroundColor: '#f8faf6',
                    zIndex: 0
                }}
            />

            {/* Modal */}
            <div className="bg-white rounded-4xl shadow-2xl max-w-3xl w-full p-8 relative z-10 flex flex-col items-center">
                <h2 className="text-xl text-pawlicy-green mb-2 text-center">Which city or country are you working in?</h2>
                <div className="text-gray-600 text-sm mb-4 text-center">This helps Pawlicy Pal tailor ordinance templates, legal checks, and timeline alerts to your local laws.</div>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xs w-full mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={location}
                            onChange={handleInputChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                            className="block w-full px-3 py-2 border border-pawlicy-lightgreen rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pawlicy-green focus:border-pawlicy-green transition-colors"
                            placeholder="e.g. New York City, USA"
                            required
                            autoComplete="off"
                        />
                        {showDropdown && filteredSuggestions.length > 0 && (
                            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                                {filteredSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion}
                                        className="px-4 py-2 cursor-pointer hover:bg-pawlicy-lightgreen"
                                        onMouseDown={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</div>}
                    <button
                        type="submit"
                        disabled={!location.trim()}
                        className={`w-full py-2 px-3 rounded-lg text-sm text-white font-medium transition-colors ${location.trim()
                                ? "bg-pawlicy-green hover:bg-green-700"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}