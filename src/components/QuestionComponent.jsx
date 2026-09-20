"use client";

import { useContext, useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import NavbarComponent from "@/components/NavbarComponent";
import ConfirmModal from "@/components/ConfirmModal";
import { UserContext } from "@/context/UserContext";

function formatValue(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return String(value);
}

const statusDetails = {
    not_attempted: {
        label: "Not attempted",
        className: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
        icon: "○",
    },
    in_progress: {
        label: "In progress",
        className: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
        icon: "◐",
    },
    solved: {
        label: "Solved",
        className: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
        icon: "✓",
    },
    attempted: {
        label: "Attempted",
        className: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
        icon: "↗",
    },
};

export default function QuestionComponent({ questionId }) {
    const { userDetails, getUserDetails } = useContext(UserContext);
    const [questionDetails, setQuestionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [responseError, SetResponseError] = useState(null);
    const [copiedSolutionId, setCopiedSolutionId] = useState(null);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function fetchQuestion() {
            try {
                const { data } = await api.get(`/questions/${questionId}`);

                if (isMounted) {
                    setQuestionDetails(data.questionDetails ?? {});
                }
            } catch (requestError) {
                console.error(requestError);
                if (isMounted) {
                    setError("Unable to load this question right now.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchQuestion();

        return () => {
            isMounted = false;
        };
    }, [questionId]);

    async function handleBookmarkClick(questionId, isBookmarked) {
        try {
            if(!isBookmarked) {
                await api.post("/bookmarks", { questionId });
            } else {
                await api.delete(`/bookmarks/${questionId}`);
            }
            setQuestionDetails((current) => ({
                ...current,
                bookmark: !isBookmarked,
            }));
        } catch (error) {
            console.error(error?.response?.data?.message);
        }
    }

    if (isLoading) {
        return (
            <>
                <NavbarComponent />
                <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl animate-pulse">
                        <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="mt-8 h-12 max-w-2xl rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="mt-4 h-5 max-w-xl rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                            <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavbarComponent />
                <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
                    <div role="alert" className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                        {error}
                    </div>
                </main>
            </>
        );
    }

    const question = questionDetails?.question ?? {};
    const examples = questionDetails?.examples ?? [];
    const solutions = questionDetails?.solutions ?? [];
    const topics = questionDetails?.topics ?? [];
    const platformLinks = questionDetails?.platform_links ?? [];
    const companies = questionDetails?.companies ?? [];
    const isBookmarked = questionDetails?.bookmark ?? false;
    const userQuestions = Array.isArray(userDetails?.userQuestions) ? userDetails.userQuestions : [];
    const userQuestion = userQuestions.find((entry) => String(entry.question_id) === String(question.id ?? questionId));
    const currentStatus = statusDetails[userQuestion?.status] ?? statusDetails.not_attempted;
    const statuses = Object.entries(statusDetails);

    function requestStatusChange(status) {
        if (status === userQuestion?.status || (status === "not_attempted" && !userQuestion)) {
            return;
        }

        setPendingStatus(status);
    }

    async function confirmStatusChange() {
        if (!pendingStatus) return;

        SetResponseError(null)
        setIsUpdatingStatus(true);
        try {
            await api.patch(`/users/me/questions/${questionId}`, { status: pendingStatus });
            await getUserDetails();
        } catch (requestError) {
            console.error(requestError?.response?.data?.message);
            SetResponseError(requestError?.response?.data?.message);
        } finally {
            setIsUpdatingStatus(false);
            setPendingStatus(null);
        }
    }

    async function copySolution(solution) {
        if (!solution?.solution) return;

        await navigator.clipboard.writeText(solution.solution);
        setCopiedSolutionId(solution.id);
        window.setTimeout(() => setCopiedSolutionId(null), 1800);
    }

    return (
        <>
            <NavbarComponent />
            <main className="min-h-screen bg-[#f7f9fc] px-4 pb-16 pt-8 dark:bg-slate-950 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                        <Link href="/patterns" className="transition hover:text-blue-600 dark:hover:text-blue-400">Patterns</Link>
                        <span aria-hidden="true">/</span>
                        <span>Question {formatValue(question.display_order)}</span>
                    </nav>

                    <header className="mt-7 border-b border-slate-200 pb-8 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]">
                                <span className="rounded-full bg-blue-100 px-3 py-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">Question {formatValue(question.id)}</span>
                                <span className="text-emerald-600 dark:text-emerald-400">{formatValue(question.difficulty)}</span>
                                <span className="text-slate-400 dark:text-slate-500">{formatValue(question.estimated_time)} min</span>
                            </div>
                            <button onClick={() => handleBookmarkClick(question.id ?? questionId, isBookmarked)}>
                                <Bookmark fill={isBookmarked ? "blue" : ""} className="hover:cursor-pointer" />
                            </button>
                        </div>
                        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">{formatValue(question.title)}</h1>
                                <p className="mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">Solve it once. Understand the pattern forever.</p>
                            </div>
                            <div className="grid w-full max-w-xs grid-cols-2 gap-2 sm:w-auto" role="group" aria-label="Question status">
                                { responseError && (
                                    <p className="text-red-500 w-fit col-span-2">{responseError}</p>
                                ) }
                                {statuses.map(([status, details]) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => requestStatusChange(status)}
                                        disabled={isUpdatingStatus}
                                        aria-pressed={status === (userQuestion?.status ?? "not_attempted")}
                                        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 ${details.className} ${status === (userQuestion?.status ?? "not_attempted") ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-950" : ""}`}
                                    >
                                        <span aria-hidden="true">{details.icon}</span>
                                        {details.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
                        <div className="min-w-0 space-y-8">
                            <section aria-labelledby="statement-heading">
                                <h2 id="statement-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Problem statement</h2>
                                <p className="mt-4 text-lg leading-8 text-slate-700 dark:text-slate-300">{formatValue(question.problem_statement)}</p>
                            </section>

                            {question.notes && (
                                <aside className="border-l-4 border-amber-400 bg-amber-50 px-5 py-4 dark:bg-amber-950/20">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Key insight</p>
                                    <p className="mt-2 leading-7 text-amber-950 dark:text-amber-100">{question.notes}</p>
                                </aside>
                            )}

                            <section aria-labelledby="examples-heading">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 id="examples-heading" className="text-xl font-bold text-slate-950 dark:text-white">Examples</h2>
                                    <span className="text-sm text-slate-400">{examples.length} example{examples.length === 1 ? "" : "s"}</span>
                                </div>
                                <div className="mt-4 space-y-4">
                                    {examples.length ? examples.map((example, index) => (
                                        <article key={example.id ?? index} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Example {index + 1}</span>
                                                <span className="text-xs font-medium text-slate-400">Example details</span>
                                            </div>
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                <div className="p-5">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Input</p>
                                                    <code className="mt-2 block font-mono text-sm text-slate-800 dark:text-slate-200">{formatValue(example.input)}</code>
                                                </div>
                                                <div className="p-5">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Output</p>
                                                    <code className="mt-2 block font-mono text-sm text-emerald-600 dark:text-emerald-400">{formatValue(example.output)}</code>
                                                </div>
                                                <div className="p-5">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Explanation</p>
                                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{formatValue(example.explanation)}</p>
                                                </div>
                                            </div>
                                        </article>
                                    )) : <p className="text-sm text-slate-500">No examples available.</p>}
                                </div>
                            </section>

                            <section aria-labelledby="solution-heading">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 id="solution-heading" className="text-xl font-bold text-slate-950 dark:text-white">Solution</h2>
                                    <span className="text-sm text-slate-400">{solutions.length} solution{solutions.length === 1 ? "" : "s"}</span>
                                </div>
                                {solutions.length ? (
                                    <div className="mt-4 space-y-3">
                                        {solutions.map((solution, index) => (
                                            <details key={solution.id ?? index} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800/70">
                                                    <span className="flex items-center gap-3">
                                                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">{index + 1}</span>
                                                        <span className="capitalize">{solution.language_name ?? "Code"} solution</span>
                                                    </span>
                                                    <span aria-hidden="true" className="text-lg text-slate-400 transition-transform group-open:rotate-180">⌄</span>
                                                </summary>
                                                <div className="border-t border-slate-200 bg-[#182230] dark:border-slate-800">
                                                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                                                        <span className="font-mono text-xs text-slate-400">{solution.language_name ?? "Code"}</span>
                                                        <button type="button" onClick={() => copySolution(solution)} className="text-xs font-semibold text-blue-300 transition hover:text-white">
                                                            {copiedSolutionId === solution.id ? "Copied" : "Copy code"}
                                                        </button>
                                                    </div>
                                                    <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-200"><code>{formatValue(solution.solution)}</code></pre>
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                ) : <p className="mt-4 text-sm text-slate-500">No solution available yet.</p>}
                            </section>
                        </div>

                        <aside className="space-y-5">
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Question details</h2>
                                <dl className="mt-5 space-y-4 text-sm">
                                    <div className="flex items-center justify-between gap-4"><dt className="text-slate-500">Status</dt><dd className="font-semibold capitalize text-slate-800 dark:text-slate-200">{currentStatus.label}</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-slate-500">Difficulty</dt><dd className="font-semibold capitalize text-slate-800 dark:text-slate-200">{formatValue(question.difficulty)}</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-slate-500">Estimated time</dt><dd className="font-semibold text-slate-800 dark:text-slate-200">{formatValue(question.estimated_time)} min</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-slate-500">Reward</dt><dd className="font-semibold text-amber-600">+{formatValue(question.xp)} XP</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-slate-500">Attempts</dt><dd className="font-semibold text-slate-800 dark:text-slate-200">{formatValue(userQuestion?.attempts ?? 0)}</dd></div>
                                    {userQuestion?.solved_at && <div className="flex justify-between gap-4"><dt className="text-slate-500">Solved on</dt><dd className="text-right font-semibold text-slate-800 dark:text-slate-200">{new Date(userQuestion.solved_at).toLocaleDateString()}</dd></div>}
                                </dl>
                            </section>

                            <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Topics</h2>
                                <div className="mt-4 flex flex-wrap gap-2">{topics.length ? topics.map((topic) => <span key={topic.topic_id} className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">{topic.topic_name}</span>) : <span className="text-sm text-slate-500">No topics listed.</span>}</div>
                            </section>

                            {platformLinks.length > 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Practice elsewhere</h2><div className="mt-4 space-y-3">{platformLinks.map((platformLink) => <a key={platformLink.id} href={platformLink.link} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm font-semibold capitalize text-blue-600 hover:text-blue-700 dark:text-blue-400">{platformLink.platform}<span aria-hidden="true">↗</span></a>)}</div></section>}

                            {companies.length > 0 && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Companies</h2>
                                    <div className="mt-4 space-y-3">
                                        {companies.map((company) => (
                                            <div key={company.company_id ?? company.id ?? company.name} className="flex items-center gap-3">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold uppercase text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">{formatValue(company.name).charAt(0)}</span>
                                                <span className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">{formatValue(company.name)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
            {pendingStatus && (
                <ConfirmModal
                    msg={`Change status to ${statusDetails[pendingStatus].label}?`}
                    onCancel={() => setPendingStatus(null)}
                    onOk={confirmStatusChange}
                />
            )}
        </>
    );
}