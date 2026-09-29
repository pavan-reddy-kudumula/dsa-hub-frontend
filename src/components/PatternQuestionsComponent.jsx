"use client";

import api from "@/lib/axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import QuestionModal from "./QuestionModal";
import ConfirmModal from "./ConfirmModal";
import QuestionListComponent from "./QuestionListComponent";

export default function PatternQuestionsComponent({ patternId }) {
    const { userDetails } = useContext(UserContext);
    const [pattern, setPattern] = useState(null);
    const [patternQuestions, setPatternQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [questionToEdit, setQuestionToEdit] = useState(null);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const isAdmin = userDetails?.user?.role === "admin";

    useEffect(() => {
        let isMounted = true;

        async function fetchPatternQuestions() {
            try {
                const [patternResponse, questionsResponse] = await Promise.all([
                    api.get(`/patterns/${patternId}`),
                    api.get(`/patterns/${patternId}/questions`),
                ]);

                const nextPattern = patternResponse.data.pattern ?? {};
                const nextQuestions = questionsResponse.data.questions ?? [];

                if (isMounted) {
                    setPattern(nextPattern);
                    setPatternQuestions(nextQuestions);
                }
            } catch (requestError) {
                console.error(requestError);
                if (isMounted) {
                    setError("Unable to load this pattern right now.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchPatternQuestions();

        return () => {
            isMounted = false;
        };
    }, [patternId]);

    async function refreshQuestions() {
        const response = await api.get(`/patterns/${patternId}/questions`);
        setPatternQuestions(response.data.questions ?? []);
    }

    function openEditModal(question) {
        setQuestionToEdit(question);
        setIsQuestionModalOpen(true);
    }

    async function handleQuestionSaved() {
        await refreshQuestions();
        setIsQuestionModalOpen(false);
        setQuestionToEdit(null);
    }

    async function handleDeleteQuestion() {
        if (!questionToDelete) return;

        setIsDeleting(true);
        setError("");

        try {
            await api.delete(`/questions/${questionToDelete.id}`);
            setPatternQuestions((currentQuestions) => currentQuestions.filter((question) => question.id !== questionToDelete.id));
            setQuestionToDelete(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError("Unable to delete the question right now.");
        } finally {
            setIsDeleting(false);
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl animate-pulse">
                    <div className="h-8 w-2/5 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-4 h-4 w-3/5 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-10 space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
                <div role="alert" className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                </div>
            </main>
        );
    }

    const patternName = pattern?.name ?? pattern?.title ?? "Coding pattern";
    const patternDescription = pattern?.description ?? pattern?.problem_statement ?? "Practice these questions to strengthen your problem-solving toolkit.";

    return (
        <>
            <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <Link href="/patterns" className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    ← All patterns
                </Link>

                <header className="mt-6 border-b border-slate-200 pb-8 dark:border-slate-800">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        Pattern {pattern?.display_order ?? patternId}
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        {patternName}
                    </h1>
                    <p className="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
                        {patternDescription}
                    </p>
                </header>

                <section className="pt-8" aria-labelledby="questions-heading">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 id="questions-heading" className="text-xl font-bold text-slate-900 dark:text-white">Questions</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Work through the problems in order.</p>
                        </div>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{patternQuestions.length} questions</span>
                    </div>

                    {patternQuestions.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                            No questions have been added to this pattern yet.
                        </div>
                    ) : (
                        <QuestionListComponent questions={patternQuestions} isAdmin={isAdmin} onEdit={openEditModal} onDelete={setQuestionToDelete} />
                    )}
                </section>
            </div>
            </main>
            {isQuestionModalOpen && <QuestionModal question={questionToEdit} onClose={() => setIsQuestionModalOpen(false)} onSaved={handleQuestionSaved} />}
            {questionToDelete && (
                <ConfirmModal
                    msg={`Are you sure you want to delete "${questionToDelete.title ?? "this question"}"?`}
                    onCancel={() => !isDeleting && setQuestionToDelete(null)}
                    onOk={handleDeleteQuestion}
                />
            )}
        </>
    );
}