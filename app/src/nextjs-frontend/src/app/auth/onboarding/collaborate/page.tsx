'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const collaborateOptions = [
    {
        value: "solo",
        label: "I'm flying solo"
    },
    {
        value: "team",
        label: "I'm joining a team"
    }
];

export default function OnboardingCollaboratePage() {
    const [selectedCollaborateOption, setSelectedCollaborateOption] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCollaborateOption) {
            setError('Please select an option or skip for now.');
            return;
        }
        // Save collaborate option to user profile here if needed
        router.push('/');
    };

    const handleSkip = () => {
        router.push('/');
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
                <h2 className="text-2xl text-pawlicy-green mb-2 text-center">Do you plan to collaborate with others?</h2>
                <div className="text-gray-600 text-sm mb-4 text-center">
                    Select one option to set up sharing and task features on Pawlicy Pal. You can update these settings later.
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xs w-full mx-auto">
                    <div className="space-y-3">
                        {collaborateOptions.map(option => (
                            <label key={option.value} className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="collaborateOption"
                                    value={option.value}
                                    checked={selectedCollaborateOption === option.value}
                                    onChange={() => { setSelectedCollaborateOption(option.value); setError(''); }}
                                    className="mt-1 accent-pawlicy-green"
                                />
                                <div>
                                    <span className="text-sm text-gray-900">{option.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                    {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</div>}
                    <button
                        type="submit"
                        disabled={!selectedCollaborateOption}
                        className={`w-full py-2 px-3 rounded-lg text-sm text-white font-medium transition-colors ${selectedCollaborateOption
                            ? "bg-pawlicy-green hover:bg-green-700"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Finish
                    </button>
                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="text-xs text-gray-500 underline hover:text-pawlicy-green"
                        >
                            Skip for now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}