'use client'

import api from "@/lib/axios";
import Link from "next/link";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

export default function BookmarksComponent() {
    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchBookmarks() {
            try {
                const response = await api.get("/bookmarks");
                if (isMounted) {
                    setBookmarks(response?.data?.bookmarks ?? []);
                }
            } catch (requestError) {
                console.error(requestError?.response?.data?.message);
                if (isMounted) {
                    setError("Unable to load your bookmarks right now.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchBookmarks();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                        <Bookmark size={23} aria-hidden="true" />
                    </div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        Your study list
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Bookmarked questions
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                        Keep the questions you want to revisit close at hand.
                    </p>
                </div>

                {isLoading && (
                    <div className="space-y-3" aria-label="Loading bookmarks">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
                        ))}
                    </div>
                )}

                {!isLoading && error && (
                    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                        {error}
                    </div>
                )}

                {!isLoading && !error && bookmarks.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                        <Bookmark className="mx-auto text-slate-400 dark:text-slate-500" size={28} aria-hidden="true" />
                        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No bookmarks yet</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Save questions while you practice and they will appear here.</p>
                        <Link href="/patterns" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                            Browse patterns
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                )}

                {!isLoading && !error && bookmarks.length > 0 && (
                    <div className="space-y-3">
                        {bookmarks.map((bookmark) => (
                            <Link
                                key={bookmark.question_id}
                                href={`/patterns/${bookmark.pattern_id}/questions/${bookmark.question_id}`}
                                className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                            >
                                <div className="min-w-0">
                                    <h2 className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-lg">
                                        {bookmark.title}
                                    </h2>
                                    <div className="mt-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                                            {bookmark.difficulty}
                                        </span>
                                        <span>Question {bookmark.question_id}</span>
                                    </div>
                                </div>
                                <ArrowUpRight className="shrink-0 text-slate-400 transition group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" size={20} aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}