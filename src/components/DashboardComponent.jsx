"use client";

import { ArrowRight, BookOpen, Bookmark, CheckCircle2, CircleDot, FileText, Flame, LockKeyhole, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import NavbarComponent from "./NavbarComponent";
import { UserContext } from "@/context/UserContext";

const statusLabels = {
    solved: "Solved",
    in_progress: "In progress",
    attempted: "Attempted",
};

function getQuestionStatus(question) {
    if (question?.solved === true || question?.isSolved === true || question?.is_solved === true) {
        return "solved";
    }

    return question?.status ?? "not_attempted";
}

function getQuestionTitle(question) {
    return question?.title ?? question?.question_title ?? question?.name ?? `Question ${question?.question_id ?? ""}`;
}

function getQuestionHref(question) {
    const questionId = question?.question_id ?? question?.questionId ?? question?.id;

    if (!questionId) return "/patterns";

    return `/questions/${questionId}`;
}

export default function DashboardComponent() {
    const { userDetails } = useContext(UserContext);

    if (!userDetails) {
        return (
            <>
                <NavbarComponent />
                <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl animate-pulse">
                        <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((item) => <div key={item} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />)}
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const user = userDetails.user ?? {};
    const questions = Array.isArray(userDetails.userQuestions) ? userDetails.userQuestions : [];
    const solvedQuestions = questions.filter((question) => getQuestionStatus(question) === "solved");
    const inProgressQuestions = questions.filter((question) => getQuestionStatus(question) === "in_progress");
    const attemptedQuestions = questions.filter((question) => getQuestionStatus(question) === "attempted");
    const trackedQuestions = solvedQuestions.length + inProgressQuestions.length + attemptedQuestions.length;
    const completionPercentage = questions.length ? Math.round((solvedQuestions.length / questions.length) * 100) : 0;
    const continueQuestions = [...inProgressQuestions, ...attemptedQuestions].slice(0, 4);
    const firstName = user.username?.split(" ")[0] ?? "there";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
            <NavbarComponent />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <section className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[32px] border-blue-400/15" />
                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Your learning dashboard</p>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {firstName}.</h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Keep building momentum. Every problem you understand makes the next one easier.</p>
                        </div>
                        <Link href="/patterns" className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
                            Practice questions <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Learning progress">
                    <MetricCard icon={<Trophy size={20} />} label="Total XP" value={user.total_xp ?? 0} tone="blue" />
                    <MetricCard icon={<CheckCircle2 size={20} />} label="Solved" value={solvedQuestions.length} tone="emerald" />
                    <MetricCard icon={<CircleDot size={20} />} label="In progress" value={inProgressQuestions.length} tone="amber" />
                    <MetricCard icon={<Target size={20} />} label="Tracked questions" value={trackedQuestions} tone="slate" />
                </section>

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8" aria-labelledby="continue-heading">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Pick up where you left off</p>
                                <h2 id="continue-heading" className="mt-2 text-2xl font-bold">Continue practicing</h2>
                            </div>
                            <Flame className="shrink-0 text-amber-500" size={24} aria-hidden="true" />
                        </div>

                        {continueQuestions.length > 0 ? (
                            <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
                                {continueQuestions.map((question, index) => {
                                    const status = getQuestionStatus(question);
                                    return (
                                        <Link key={`${question.question_id ?? question.id}-${index}`} href={getQuestionHref(question)} className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">{String(index + 1).padStart(2, "0")}</span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">{getQuestionTitle(question)}</span>
                                                <span className="mt-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{statusLabels[status] ?? "Practice"}</span>
                                            </span>
                                            <ArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" size={18} aria-hidden="true" />
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-5 py-8 text-center dark:border-slate-700">
                                <BookOpen className="mx-auto text-slate-400" size={28} aria-hidden="true" />
                                <p className="mt-3 font-semibold">Ready for your first practice session?</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose a pattern and start solving.</p>
                                <Link href="/patterns" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">Browse patterns <ArrowRight size={16} /></Link>
                            </div>
                        )}
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-labelledby="progress-heading">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Overall progress</p>
                                    <h2 id="progress-heading" className="mt-2 text-xl font-bold">{completionPercentage}% complete</h2>
                                </div>
                                <div className="grid h-16 w-16 place-items-center rounded-full" style={{ background: `conic-gradient(#10b981 ${completionPercentage}%, #e2e8f0 ${completionPercentage}% 100%)` }} aria-label={`${completionPercentage}% complete`}>
                                    <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-xs font-bold dark:bg-slate-900">{solvedQuestions.length}/{questions.length}</div>
                                </div>
                            </div>
                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completionPercentage}%` }} /></div>
                            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Solve more questions to grow your XP and progress.</p>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-labelledby="shortcuts-heading">
                            <h2 id="shortcuts-heading" className="text-xl font-bold">Quick access</h2>
                            <div className="mt-4 grid gap-2">
                                <QuickLink href="/patterns" icon={<BookOpen size={18} />} label="Browse patterns" />
                                <QuickLink href="/bookmarks" icon={<Bookmark size={18} />} label="Review bookmarks" />
                                <QuickLink href="/notes" icon={<FileText size={18} />} label="Open notes" />
                                <QuickLink href="/profile" icon={<LockKeyhole size={18} />} label="View profile" />
                            </div>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}

function MetricCard({ icon, label, value, tone }) {
    const toneClasses = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
        slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>{icon}</div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}

function QuickLink({ href, icon, label }) {
    return (
        <Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400">
            <span className="text-blue-600 dark:text-blue-400">{icon}</span>{label}<ArrowRight className="ml-auto" size={16} aria-hidden="true" />
        </Link>
    );
}