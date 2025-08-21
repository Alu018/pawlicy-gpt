'use client'

import { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function CreateAccountPage() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isSignIn) {
      // Sign in logic
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      router.push('/');
    } else {
      // Sign up logic
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Registration failed');
          setIsLoading(false);
          return;
        }

        // Auto sign in after registration
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        });

        if (signInResult?.error) {
          setError('Registration successful, but sign-in failed. Please try signing in manually.');
          setIsLoading(false);
          return;
        }

        router.push('/auth/onboarding/region');
      } catch (err) {
        setError('Account creation failed. Please try again.');
        setIsLoading(false);
      }
    }

    setIsLoading(false);
  };

  const handleSignInClick = () => {
    setIsSignIn(!isSignIn);
    setError('');
    setFormData({
      fullName: '',
      organizationName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg-account.svg')",
          backgroundSize: '100%',
          backgroundColor: '#f8faf6'
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-20" />

      {/* Modal Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full h-full overflow-y-auto">
          {/* Modal Header */}
          <div className="relative px-8 pt-8 pb-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Logo and Title */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Image
                  src="/logo2.png"
                  alt="Pawlicy Pal logo"
                  width={40}
                  height={40}
                />
                <span className="text-xl">
                  <span className="font-semibold">Pawlicy</span> Pal
                </span>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-8 pb-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name - only for sign up */}
              {!isSignIn && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-pawlicy-lightgreen rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pawlicy-green focus:border-pawlicy-green transition-colors"
                    placeholder="Name"
                  />
                </div>
              )}

              {/* Organization Name - only for sign up */}
              {!isSignIn && (
                <div>
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-pawlicy-lightgreen rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pawlicy-green focus:border-pawlicy-green transition-colors"
                    placeholder="(e.g. The Humane League)"
                  />
                </div>
              )}

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-pawlicy-lightgreen rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pawlicy-green focus:border-pawlicy-green transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 pr-10 border border-pawlicy-lightgreen rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pawlicy-green focus:border-pawlicy-green transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {!isSignIn && <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>}
              </div>

              {/* Re-enter Password - only for sign up */}
              {!isSignIn && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Re-enter Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 pr-10 border border-pawlicy-lightgreen rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pawlicy-green focus:border-pawlicy-green transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit (create account) Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-pawlicy-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pawlicy-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isSignIn ? 'Signing in...' : 'Creating account...'}
                    </div>
                  ) : (
                    isSignIn ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>

              {/* Toggle between sign in/sign up */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 font-semibold">
                  {isSignIn ? "DON'T HAVE AN ACCOUNT?" : "ALREADY HAVE AN ACCOUNT?"}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSignInClick}
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border-2 border-pawlicy-green text-sm font-medium rounded-lg text-pawlicy-green bg-white hover:bg-pawlicy-green hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pawlicy-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
                >
                  {isSignIn ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}