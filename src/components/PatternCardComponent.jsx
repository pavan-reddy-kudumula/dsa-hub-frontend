"use client"

import api from "@/lib/axios";
import CreatePatternComponent from "@/components/CreatePatternComponent";
import PatternModalComponent from "@/components/PatternModalComponent";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import ConfirmModal from "@/components/ConfirmModal";

export default function PatternCardComponent() {
    const { userDetails } = useContext(UserContext)
    const [patterns, setPatterns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [patternToDelete, setPatternToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [patternToEdit, setPatternToEdit] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDisplayOrder, setEditDisplayOrder] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState("");

    const isAdmin = userDetails?.user?.role === "admin";

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

    async function refreshPatterns() {
        try {
            const { data } = await api.get("/patterns");
            setPatterns(data.patterns ?? []);
        } catch (requestError) {
            console.error(requestError);
            setError("Unable to load patterns right now.");
        }
    }

    async function handleDeletePattern() {
        if (!patternToDelete) return;

        setIsDeleting(true);
        setError("");

        try {
            await api.delete(`/patterns/${patternToDelete.id}`);
            setPatterns((currentPatterns) => currentPatterns.filter((pattern) => pattern.id !== patternToDelete.id));
            setPatternToDelete(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError("Unable to delete the pattern right now.");
        } finally {
            setIsDeleting(false);
        }
    }

    function openEditModal(pattern) {
        setPatternToEdit(pattern);
        setEditName(pattern.name ?? "");
        setEditDescription(pattern.description ?? "");
        setEditDisplayOrder(pattern.display_order?.toString() ?? "");
        setUpdateError("");
    }

    function closeEditModal() {
        if (isUpdating) return;

        setPatternToEdit(null);
        setUpdateError("");
    }

    async function handleUpdatePattern(event) {
        event.preventDefault();
        if (!patternToEdit) return;

        setIsUpdating(true);
        setUpdateError("");

        const pattern = {
            name: editName.trim(),
            description: editDescription.trim(),
        };
        if (editDisplayOrder !== "") {
            pattern.display_order = Number(editDisplayOrder);
        }

        try {
            const { data } = await api.patch(`/patterns/${patternToEdit.id}`, pattern);
            const updatedPattern = data.pattern ?? data;
            setPatterns((currentPatterns) => currentPatterns.map((currentPattern) => (
                currentPattern.id === patternToEdit.id ? { ...currentPattern, ...updatedPattern } : currentPattern
            )));
            setPatternToEdit(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setUpdateError("Unable to update the pattern right now.");
        } finally {
            setIsUpdating(false);
        }
    }

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

                { isAdmin && <CreatePatternComponent onCreated={refreshPatterns} /> }

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
                                <article key={pattern.id ?? title} className="flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <Link href={`/patterns/${pattern.id}`} className="flex min-w-0 flex-1 items-start justify-between gap-4">
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="pt-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                Pattern {pattern.display_order ?? index + 1}
                                            </span>
                                        </Link>
                                        {isAdmin && (
                                            <div className="flex shrink-0 items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(pattern)}
                                                    aria-label={`Edit ${title}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
                                                >
                                                    <Pencil size={17} aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPatternToDelete(pattern)}
                                                    aria-label={`Delete ${title}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                >
                                                    <Trash2 size={17} aria-hidden="true" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <Link href={`/patterns/${pattern.id}`} className="block flex-1">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {title}
                                        </h2>
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                            {description}
                                        </p>
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
            {patternToDelete && (
                <ConfirmModal
                    msg={`Are you sure you want to delete "${patternToDelete.name}"?`}
                    onCancel={() => !isDeleting && setPatternToDelete(null)}
                    onOk={handleDeletePattern}
                />
            )}
            {patternToEdit && (
                <PatternModalComponent
                    name={editName}
                    description={editDescription}
                    displayOrder={editDisplayOrder}
                    isSubmitting={isUpdating}
                    error={updateError}
                    onClose={closeEditModal}
                    onSubmit={handleUpdatePattern}
                    onNameChange={setEditName}
                    onDescriptionChange={setEditDescription}
                    onDisplayOrderChange={setEditDisplayOrder}
                />
            )}
        </main>
    );
}