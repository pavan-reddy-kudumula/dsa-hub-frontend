"use client"

import api from "@/lib/axios"
import Link from "next/link"
import NavbarComponent from "./NavbarComponent"
import { ArrowUpRight, ListChecks } from "lucide-react"
import { useState, useEffect } from "react"

export default function QuestionsComponent() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [difficultySort, setDifficultySort] = useState("asc");

    useEffect(() => {
        let isMount = true;

        async function fetchQuestions() {
            try {
                const response = await api.get("/questions");
                
                if(isMount) {
                    setQuestions(response?.data?.questions ?? []);
                }
            } catch (error) {
                console.error(error)
                if(isMount) {
                    setError("Unable to load questions right now.")
                }
            } finally {
                if (isMount) {
                    setIsLoading(false);
                }
            }
        }

        fetchQuestions();

        return () => {
            isMount = false;
        }
    }, [])

    const difficulties = Array.from(
        new Set(questions.map((question) => question.difficulty).filter(Boolean))
    );

    const filteredQuestions = selectedDifficulty === "all"
        ? questions
        : questions.filter((question) => question.difficulty === selectedDifficulty);
    const difficultyRank = { basic: 1, easy: 2, medium: 3, hard: 4 };
    const sortedQuestions = difficultySort === "asc"
        ? filteredQuestions
        : [...filteredQuestions].sort((firstQuestion, secondQuestion) => {
            const firstDifficulty = String(firstQuestion.difficulty ?? "").toLowerCase();
            const secondDifficulty = String(secondQuestion.difficulty ?? "").toLowerCase();

            const firstRank = difficultyRank[firstDifficulty] ?? 999;
            const secondRank = difficultyRank[secondDifficulty] ?? 999;

            return firstRank === secondRank
                ? secondDifficulty.localeCompare(firstDifficulty)
                : secondRank - firstRank;
        });
    
    return (
        <>
            <NavbarComponent />
            <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-8">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                            <ListChecks size={23} aria-hidden="true" />
                        </div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                            Practice library
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            All questions
                        </h1>
                        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                            Browse every question and open one to start solving.
                        </p>
                    </header>

                    {isLoading && (
                        <div className="space-y-3" aria-label="Loading questions">
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

                    {!isLoading && !error && questions.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                            No questions are available yet.
                        </div>
                    )}

                    {!isLoading && !error && questions.length > 0 && (
                        <>
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <label htmlFor="difficulty-filter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Filter by difficulty
                                    </label>
                                    <select
                                        id="difficulty-filter"
                                        value={selectedDifficulty}
                                        onChange={(event) => setSelectedDifficulty(event.target.value)}
                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="all">All difficulties</option>
                                        {difficulties.map((difficulty) => (
                                            <option key={difficulty} value={difficulty}>
                                                {difficulty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <label htmlFor="difficulty-sort" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Sort by difficulty
                                    </label>
                                    <select
                                        id="difficulty-sort"
                                        value={difficultySort}
                                        onChange={(event) => setDifficultySort(event.target.value)}
                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="asc">Easy to hard</option>
                                        <option value="desc">Hard to easy</option>
                                    </select>
                                </div>
                            </div>

                            {sortedQuestions.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                    No questions match this difficulty.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sortedQuestions.map((question, index) => (
                                <Link
                                    key={question.id}
                                    href={`/questions/${question.id}`}
                                    className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <div className="min-w-0">
                                            <h2 className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-lg">
                                                {question.title ?? `Question ${index + 1}`}
                                            </h2>
                                            <div className="mt-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                <span>{question.difficulty ?? "Practice question"}</span>
                                                <span>{question.xp} xp</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="shrink-0 text-slate-400 transition group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" size={20} aria-hidden="true" />
                                </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    )
}