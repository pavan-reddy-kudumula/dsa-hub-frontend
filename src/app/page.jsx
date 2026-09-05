'use client';

import NavbarComponent from '@/components/NavbarComponent';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Navigation Header */}
      <NavbarComponent />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <span className="text-blue-600 dark:text-blue-300 text-sm font-semibold">Welcome to DSA Hub</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Master Data Structures & Algorithms
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  Learn, practice, and ace your coding interviews with our comprehensive DSA learning platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105 text-center"
                >
                  Get Started Free
                </Link>
                <button className="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Learn More
                </button>
              </div>
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">500+</p>
                  <p className="text-slate-600 dark:text-slate-400">Problems</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">10k+</p>
                  <p className="text-slate-600 dark:text-slate-400">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">95%</p>
                  <p className="text-slate-600 dark:text-slate-400">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl opacity-20 blur-3xl"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="font-mono text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <p>
                        <span className="text-purple-600">function</span>
                        <span className="text-slate-700 dark:text-slate-300"> reverseArray</span>
                        <span className="text-slate-700 dark:text-slate-300">(arr) {"{"}</span>
                      </p>
                      <p className="ml-4">
                        <span className="text-purple-600">let</span>
                        <span className="text-slate-700 dark:text-slate-300"> left = </span>
                        <span className="text-orange-600">0</span>
                        <span className="text-slate-700 dark:text-slate-300">;</span>
                      </p>
                      <p className="ml-4">
                        <span className="text-purple-600">let</span>
                        <span className="text-slate-700 dark:text-slate-300"> right = arr.length - </span>
                        <span className="text-orange-600">1</span>
                        <span className="text-slate-700 dark:text-slate-300">;</span>
                      </p>
                      <p className="ml-4">
                        <span className="text-purple-600">while</span>
                        <span className="text-slate-700 dark:text-slate-300"> (left &lt; right) {"{"}</span>
                      </p>
                      <p className="ml-8">
                        <span className="text-slate-700 dark:text-slate-300">[arr[left], arr[right]] = [arr[right], arr[left]];</span>
                      </p>
                      <p className="ml-8">
                        <span className="text-slate-700 dark:text-slate-300">left++; right--;</span>
                      </p>
                      <p className="ml-4">
                        <span className="text-slate-700 dark:text-slate-300">{"}"}</span>
                      </p>
                      <p>
                        <span className="text-slate-700 dark:text-slate-300">{"}"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose DSA Hub?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need to become a DSA expert
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Comprehensive Learning</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Learn all essential data structures and algorithms with detailed explanations and visualizations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Practice Problems</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Solve hundreds of problems with varying difficulty levels, from easy to hard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Progress Tracking</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Monitor your progress with detailed analytics and personalized learning recommendations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Expert Solutions</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Access solutions, explanations, and optimal approaches from experienced instructors.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Community</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Join a vibrant community of learners, discuss problems, and help each other grow.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl border border-pink-200 dark:border-pink-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Interview Prep</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Get interview-ready with company-specific questions and mock interview sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to start your DSA journey?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of developers who have already mastered data structures and algorithms.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
          >
            Sign Up for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DSA</span>
                </div>
                <span className="font-bold text-white">DSA Hub</span>
              </div>
              <p className="text-sm text-slate-400">Master DSA with our comprehensive learning platform.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Courses</a></li>
                <li><a href="#" className="hover:text-white transition">Problems</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8">
            <p className="text-center text-sm text-slate-400">
              © 2026 DSA Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}