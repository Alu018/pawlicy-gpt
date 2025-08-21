'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const roles = [
    {
        value: "grassroots",
        label: "Grassroots advocate"
    },
    {
        value: "legal",
        label: "Legal professional"
    },
    {
        value: "lead",
        label: "Campaign or program lead"
    },
    {
        value: "researcher",
        label: "Policy researcher or analyst"
    }
];

export default function OnboardingRolePage() {
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) {
            setError('Please select a role or skip for now.');
            return;
        }
        // Save role to user profile here if needed
        router.push('/auth/onboarding/collaborate'); // Or next onboarding step
    };

    const handleSkip = () => {
        router.push('/auth/onboarding/collaborate');
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
                <h2 className="text-2xl text-pawlicy-green mb-2 text-center">Which role best describes your work?</h2>
                <div className="text-gray-600 text-sm mb-4 text-center">
                    This allows Pawlicy Pal to tailor the language depth, legal detail, and task guidance you see. You can always adjust this later in your account settings.
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xs w-full mx-auto">
                    <div className="space-y-3">
                        {roles.map(role => (
                            <label key={role.value} className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value={role.value}
                                    checked={selectedRole === role.value}
                                    onChange={() => { setSelectedRole(role.value); setError(''); }}
                                    className="mt-1 accent-pawlicy-green"
                                />
                                <div>
                                    <span className="text-sm text-gray-900">{role.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                    {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</div>}
                    <button
                        type="submit"
                        disabled={!selectedRole}
                        className={`w-full py-2 px-3 rounded-lg text-sm text-white font-medium transition-colors ${selectedRole
                            ? "bg-pawlicy-green hover:bg-green-700"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Next
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