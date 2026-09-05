'use client'

import { UserContext } from '@/context/UserContext';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function SignupComponent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // const [success, setSuccess] = useState(false);
    const { getUser } = useContext(UserContext);
    const router = useRouter();

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError('');
        // setSuccess(false);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            await api.post(`/auth/signup`, data);
            await getUser();
            // setSuccess(true);
            router.push("/");
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                        <p className="text-slate-600 dark:text-slate-300">Join us today and get started</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {/* {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            Account created successfully! Redirecting to login...
                        </div>
                    )} */}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                required
                                className="w-full px-4 py-3 text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Choose a username"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="w-full px-4 py-3 text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                className="w-full px-4 py-3 text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Use 8+ characters with a mix of letters, numbers, and symbols
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg disabled:from-blue-400 disabled:to-purple-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
                        <span className="px-3 text-slate-500 dark:text-slate-400 text-sm">or</span>
                        <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 font-semibold">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Text */}
                {/* <p className="text-center text-gray-500 text-xs mt-6">
                    We'll never share your personal data. Read our Privacy Policy
                </p> */}
            </div>
        </div>
    )
}