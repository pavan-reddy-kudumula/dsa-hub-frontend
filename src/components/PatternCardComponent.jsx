"use client"

import api from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PatternCardComponent() {
    const [patterns, setPatterns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchPatterns() {
            try {
                const { data } = await api.get("/patterns");
                const nextPatterns = data.patterns ?? [];

                if (isMounted) {
                    setPatterns(nextPatterns);
                }
            } catch (requestError) {
                console.error(requestError);
                if (isMounted) {
                    setError("Unable to load patterns right now.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchPatterns();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        Study library
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Coding patterns
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                        Build a repeatable approach to solving data structure and algorithm problems.
                    </p>
                </div>

                {isLoading && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading patterns">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
                        ))}
                    </div>
                )}

                {!isLoading && error && (
                    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                        {error}
                    </div>
                )}

                {!isLoading && !error && patterns.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">No patterns yet</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Check back soon for new practice material.</p>
                    </div>
                )}

                {!isLoading && !error && patterns.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {patterns.map((pattern, index) => {
                            const title = pattern.name ?? `Pattern ${index + 1}`;
                            const description = pattern.description ?? "Practice this pattern to strengthen your problem-solving toolkit.";

                            return (
                                <Link key={pattern.id ?? title} href={`/patterns/${pattern.id}`} className="group block">
                                    <article className="flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:border-blue-300 group-hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:group-hover:border-blue-700">
                                        <div className="mb-5 flex items-start justify-between gap-4">
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                Pattern {pattern.display_order ?? index + 1}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                            {title}
                                        </h2>
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                            {description}
                                        </p>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}