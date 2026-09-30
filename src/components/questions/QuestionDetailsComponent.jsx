"use client";

import { useContext, useEffect, useState } from "react";
import { Bookmark, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import NavbarComponent from "@/components/NavbarComponent";
import ConfirmModal from "@/components/ConfirmModal";
import { UserContext } from "@/context/UserContext";
import CreateNoteComponent from "../notes/CreateNoteComponent";
import QuestionExampleModal from "./QuestionExampleModal";
import QuestionPlatformModal from "./QuestionPlatformModal";
import QuestionSolutionModal from "./QuestionSolutionModal";

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

export default function QuestionDetailsComponent({ questionId }) {
    const { userDetails, getUserDetails } = useContext(UserContext);
    const [questionDetails, setQuestionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [responseError, SetResponseError] = useState(null);
    const [copiedSolutionId, setCopiedSolutionId] = useState(null);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [editingExample, setEditingExample] = useState(null);
    const [pendingExampleDeletion, setPendingExampleDeletion] = useState(null);
    const [exampleError, setExampleError] = useState("");
    const [editingPlatformLink, setEditingPlatformLink] = useState(null);
    const [pendingPlatformDeletion, setPendingPlatformDeletion] = useState(null);
    const [platformError, setPlatformError] = useState("");
    const [editingSolution, setEditingSolution] = useState(null);
    const [pendingSolutionDeletion, setPendingSolutionDeletion] = useState(null);
    const [solutionError, setSolutionError] = useState("");

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
    const isAdmin = userDetails?.user?.role === "admin";
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

    function handleExampleSaved(savedExample, originalExampleId) {
        if (!isAdmin) return;

        setQuestionDetails((currentDetails) => {
            const currentExamples = currentDetails?.examples ?? [];
            const savedExampleId = originalExampleId ?? savedExample.id ?? savedExample.example_id;
            const existingExampleIndex = currentExamples.findIndex((example) => {
                const exampleId = example.id ?? example.example_id;
                return savedExampleId && String(exampleId) === String(savedExampleId);
            });
            const nextExamples = existingExampleIndex === -1
                ? [...currentExamples, savedExample]
                : currentExamples.map((example, index) => index === existingExampleIndex ? savedExample : example);

            return { ...currentDetails, examples: nextExamples };
        });
        setEditingExample(null);
    }

    async function confirmExampleDeletion() {
        if (!isAdmin || !pendingExampleDeletion) return;

        const exampleId = pendingExampleDeletion.id ?? pendingExampleDeletion.example_id;
        setExampleError("");
        try {
            await api.delete(`/questions/${questionId}/examples/${exampleId}`);
            setQuestionDetails((currentDetails) => ({
                ...currentDetails,
                examples: (currentDetails?.examples ?? []).filter((example) => {
                    const currentExampleId = example.id ?? example.example_id;
                    return String(currentExampleId) !== String(exampleId);
                }),
            }));
            setPendingExampleDeletion(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setExampleError(requestError?.response?.data?.message || "Unable to delete the example right now.");
        }
    }

    function handlePlatformSaved(savedPlatformLink, originalPlatform) {
        if (!isAdmin) return;

        setQuestionDetails((currentDetails) => {
            const currentPlatformLinks = currentDetails?.platform_links ?? [];
            const savedPlatformId = savedPlatformLink.id ?? savedPlatformLink.platform_id;
            const existingLinkIndex = currentPlatformLinks.findIndex((platformLink) => {
                const platformId = platformLink.id ?? platformLink.platform_id;
                return (savedPlatformId && String(platformId) === String(savedPlatformId)) || platformLink.platform === originalPlatform;
            });
            const nextPlatformLinks = existingLinkIndex === -1
                ? [...currentPlatformLinks, savedPlatformLink]
                : currentPlatformLinks.map((platformLink, index) => index === existingLinkIndex ? savedPlatformLink : platformLink);

            return { ...currentDetails, platform_links: nextPlatformLinks };
        });
        setEditingPlatformLink(null);
    }

    async function confirmPlatformDeletion() {
        if (!isAdmin || !pendingPlatformDeletion) return;

        const platformName = pendingPlatformDeletion.platform;
        setPlatformError("");
        try {
            await api.delete(`/questions/${questionId}/platforms/${encodeURIComponent(platformName)}`);
            setQuestionDetails((currentDetails) => ({
                ...currentDetails,
                platform_links: (currentDetails?.platform_links ?? []).filter((platformLink) => {
                    return platformLink.platform !== platformName;
                }),
            }));
            setPendingPlatformDeletion(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setPlatformError(requestError?.response?.data?.message || "Unable to delete the platform link right now.");
        }
    }

    function handleSolutionSaved(savedSolution, originalSolutionId) {
        if (!isAdmin) return;

        setQuestionDetails((currentDetails) => {
            const currentSolutions = currentDetails?.solutions ?? [];
            const savedSolutionId = originalSolutionId ?? savedSolution.id ?? savedSolution.solution_id;
            const existingSolutionIndex = currentSolutions.findIndex((currentSolution) => {
                const currentSolutionId = currentSolution.id ?? currentSolution.solution_id;
                return savedSolutionId && String(currentSolutionId) === String(savedSolutionId);
            });
            const nextSolutions = existingSolutionIndex === -1
                ? [...currentSolutions, savedSolution]
                : currentSolutions.map((currentSolution, index) => index === existingSolutionIndex ? savedSolution : currentSolution);

            return { ...currentDetails, solutions: nextSolutions };
        });
        setEditingSolution(null);
    }

    async function confirmSolutionDeletion() {
        if (!isAdmin || !pendingSolutionDeletion) return;

        const solutionId = pendingSolutionDeletion.id ?? pendingSolutionDeletion.solution_id;
        setSolutionError("");
        try {
            await api.delete(`/questions/${questionId}/solutions/${solutionId}`);
            setQuestionDetails((currentDetails) => ({
                ...currentDetails,
                solutions: (currentDetails?.solutions ?? []).filter((currentSolution) => {
                    const currentSolutionId = currentSolution.id ?? currentSolution.solution_id;
                    return String(currentSolutionId) !== String(solutionId);
                }),
            }));
            setPendingSolutionDeletion(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setSolutionError(requestError?.response?.data?.message || "Unable to delete the solution right now.");
        }
    }

    return (
        <>
            <NavbarComponent />
            <main className="min-h-screen bg-[#f7f9fc] px-4 pb-16 pt-8 dark:bg-slate-950 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <nav className="flex justify-between items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                        <div className="flex gap-2">
                            <Link href="/patterns" className="transition hover:text-blue-600 dark:hover:text-blue-400">Patterns</Link>
                            <span aria-hidden="true">/</span>
                            <span>Question {formatValue(question.display_order)}</span>
                        </div>
                        <button onClick={() => handleBookmarkClick(question.id ?? questionId, isBookmarked)}>
                            <Bookmark fill={isBookmarked ? "blue" : ""} className="hover:cursor-pointer" />
                        </button>
                        
                    </nav>

                    <header className="mt-7 border-b border-slate-200 pb-8 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]">
                                <span className="rounded-full bg-blue-100 px-3 py-1.5 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">Question {formatValue(question.id)}</span>
                                <span className="text-emerald-600 dark:text-emerald-400">{formatValue(question.difficulty)}</span>
                                <span className="text-slate-400 dark:text-slate-500">{formatValue(question.estimated_time)} min</span>
                            </div>
                            <CreateNoteComponent />
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
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-slate-400">{examples.length} example{examples.length === 1 ? "" : "s"}</span>
                                        {isAdmin && (
                                            <button type="button" onClick={() => setEditingExample({})} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                                <Plus size={16} aria-hidden="true" />
                                                Add example
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {exampleError && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{exampleError}</p>}
                                <div className="mt-4 space-y-4">
                                    {examples.length ? examples.map((example, index) => (
                                        <article key={example.id ?? index} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Example {index + 1}</span>
                                                {isAdmin && (
                                                    <div className="flex items-center gap-3">
                                                        <button type="button" onClick={() => setEditingExample(example)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                                            <Pencil size={14} aria-hidden="true" />
                                                            Edit
                                                        </button>
                                                        <button type="button" onClick={() => setPendingExampleDeletion(example)} aria-label="Delete example" title="Delete example" className="text-slate-400 transition hover:text-red-600 dark:hover:text-red-400">
                                                            <Trash2 size={16} aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                )}
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
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-slate-400">{solutions.length} solution{solutions.length === 1 ? "" : "s"}</span>
                                        {isAdmin && <button type="button" onClick={() => setEditingSolution({})} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><Plus size={16} aria-hidden="true" />Add solution</button>}
                                    </div>
                                </div>
                                {solutionError && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{solutionError}</p>}
                                {solutions.length ? (
                                    <div className="mt-4 space-y-3">
                                        {solutions.map((solution, index) => (
                                            <details key={solution.id ?? index} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800/70">
                                                    <span className="flex items-center gap-3">
                                                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">{index + 1}</span>
                                                        <span className="capitalize">{solution.language_name ?? "Code"} solution</span>
                                                    </span>
                                                    <span className="flex items-center gap-3"><ChevronDown size={18} aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-180" />{isAdmin && <><button type="button" onClick={(event) => { event.preventDefault(); setEditingSolution(solution); }} aria-label="Edit solution" title="Edit solution" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"><Pencil size={15} aria-hidden="true" /></button><button type="button" onClick={(event) => { event.preventDefault(); setPendingSolutionDeletion(solution); }} aria-label="Delete solution" title="Delete solution" className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"><Trash2 size={15} aria-hidden="true" /></button></>}</span>
                                                </summary>
                                                <div className="border-t border-slate-200 bg-[#182230] dark:border-slate-800">
                                                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                                                        <span className="font-mono text-xs text-slate-400">{solution.language_name ?? "Code"}</span>
                                                        <button type="button" onClick={() => copySolution(solution)} className="text-xs font-semibold text-blue-300 transition hover:text-white">
                                                            {copiedSolutionId === solution.id ? "Copied" : "Copy code"}
                                                        </button>
                                                    </div>
                                                    {solution.description && <p className="border-b border-white/10 px-5 py-3 text-sm leading-6 text-slate-300">{solution.description}</p>}
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

                            {(platformLinks.length > 0 || isAdmin) && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between gap-3"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Practice elsewhere</h2>{isAdmin && <button type="button" onClick={() => setEditingPlatformLink({})} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"><Plus size={14} aria-hidden="true" />Add</button>}</div>{platformError && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{platformError}</p>}<div className="mt-4 space-y-3">{platformLinks.length ? platformLinks.map((platformLink) => <div key={platformLink.id ?? platformLink.platform_id} className="flex items-center justify-between gap-3"><a href={platformLink.link} target="_blank" rel="noreferrer" className="min-w-0 truncate text-sm font-semibold capitalize text-blue-600 hover:text-blue-700 dark:text-blue-400">{platformLink.platform}<span aria-hidden="true" className="ml-2">↗</span></a>{isAdmin && <div className="flex shrink-0 items-center gap-2"><button type="button" onClick={() => setEditingPlatformLink(platformLink)} aria-label={`Edit ${platformLink.platform} link`} title="Edit platform link" className="text-slate-400 transition hover:text-blue-600 dark:hover:text-blue-400"><Pencil size={15} aria-hidden="true" /></button><button type="button" onClick={() => setPendingPlatformDeletion(platformLink)} aria-label={`Delete ${platformLink.platform} link`} title="Delete platform link" className="text-slate-400 transition hover:text-red-600 dark:hover:text-red-400"><Trash2 size={15} aria-hidden="true" /></button></div>}</div>) : <p className="text-sm text-slate-500">No platform links available.</p>}</div></section>}

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
            {isAdmin && editingExample && (
                <QuestionExampleModal
                    questionId={questionId}
                    example={editingExample.id ? editingExample : null}
                    onClose={() => setEditingExample(null)}
                    onSaved={handleExampleSaved}
                />
            )}
            {isAdmin && pendingExampleDeletion && (
                <ConfirmModal
                    msg="Delete this example?"
                    onCancel={() => setPendingExampleDeletion(null)}
                    onOk={confirmExampleDeletion}
                />
            )}
            {isAdmin && editingPlatformLink && (
                <QuestionPlatformModal
                    questionId={questionId}
                    platformLink={editingPlatformLink.platform ? editingPlatformLink : null}
                    onClose={() => setEditingPlatformLink(null)}
                    onSaved={handlePlatformSaved}
                />
            )}
            {isAdmin && pendingPlatformDeletion && (
                <ConfirmModal
                    msg="Delete this platform link?"
                    onCancel={() => setPendingPlatformDeletion(null)}
                    onOk={confirmPlatformDeletion}
                />
            )}
            {isAdmin && editingSolution && (
                <QuestionSolutionModal
                    questionId={questionId}
                    solution={editingSolution.id || editingSolution.solution_id ? editingSolution : null}
                    onClose={() => setEditingSolution(null)}
                    onSaved={handleSolutionSaved}
                />
            )}
            {isAdmin && pendingSolutionDeletion && (
                <ConfirmModal
                    msg="Delete this solution?"
                    onCancel={() => setPendingSolutionDeletion(null)}
                    onOk={confirmSolutionDeletion}
                />
            )}
        </>
    );
}