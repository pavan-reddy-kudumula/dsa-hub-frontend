"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

const emptyForm = { pattern_id: "", title: "", problem_statement: "", notes: "", difficulty: "easy", display_order: "", estimated_time: "", xp: "" };

export default function QuestionModal({ question = null, onClose, onSaved }) {
    const [patterns, setPatterns] = useState([]);
    const [form, setForm] = useState(() => ({
        pattern_id: question?.pattern_id?.toString() ?? "",
        title: question?.title ?? "",
        problem_statement: question?.problem_statement ?? "",
        notes: question?.notes ?? "",
        difficulty: question?.difficulty ?? "easy",
        display_order: question?.display_order?.toString() ?? "",
        estimated_time: question?.estimated_time?.toString() ?? "",
        xp: question?.xp?.toString() ?? "",
    }));
    const [isLoadingPatterns, setIsLoadingPatterns] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const isEditing = Boolean(question?.id);

    useEffect(() => {
        let isMounted = true;
        async function fetchPatterns() {
            try {
                const { data } = await api.get("/patterns");
                if (isMounted) setPatterns(data.patterns ?? []);
            } catch (requestError) {
                console.error(requestError);
                if (isMounted) setError("Unable to load patterns right now.");
            } finally {
                if (isMounted) setIsLoadingPatterns(false);
            }
        }
        fetchPatterns();
        return () => { isMounted = false; };
    }, []);

    function updateField(field, value) {
        setForm((currentForm) => ({ ...currentForm, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        const payload = {
            pattern_id: Number(form.pattern_id),
            title: form.title.trim(),
            problem_statement: form.problem_statement.trim(),
            notes: form.notes.trim() || "",
            difficulty: form.difficulty,
            display_order: Number(form.display_order),
            estimated_time: Number(form.estimated_time),
            xp: Number(form.xp),
        };

        try {
            const response = isEditing
                ? await api.patch(`/questions/${question.id}`, payload)
                : await api.post(`/patterns/${form.pattern_id}/questions`, payload);
            onSaved?.(response.data.question ?? response.data);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError(requestError?.response?.data?.message || `Unable to ${isEditing ? "update" : "create"} the question right now.`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}>
            <form onSubmit={handleSubmit} className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900" role="dialog" aria-modal="true" aria-labelledby="question-modal-title">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="question-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? "Update question" : "Create question"}</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add the details learners need to solve this problem.</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close modal" className="text-slate-400 transition hover:text-slate-700 disabled:opacity-60 dark:hover:text-slate-200"><X size={22} /></button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pattern
                        <select value={form.pattern_id} onChange={(event) => updateField("pattern_id", event.target.value)} required disabled={isLoadingPatterns} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><option value="">Select a pattern</option>{patterns.map((pattern) => <option key={pattern.id} value={pattern.id}>{pattern.name}</option>)}</select>
                    </label>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title
                        <input value={form.title} onChange={(event) => updateField("title", event.target.value)} required autoFocus className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2">Problem statement
                        <textarea value={form.problem_statement} onChange={(event) => updateField("problem_statement", event.target.value)} required rows={4} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2">Notes <span className="font-normal text-slate-500">(optional)</span>
                        <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty
                        <select value={form.difficulty} onChange={(event) => updateField("difficulty", event.target.value)} required className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><option value="basic">Basic</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
                    </label>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Display order <span className="font-normal text-slate-500">(optional)</span>
                        <input type="number" min="1" step="1" value={form.display_order} onChange={(event) => updateField("display_order", event.target.value)} required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estimated time (minutes)
                        <input type="number" min="1" step="1" value={form.estimated_time} onChange={(event) => updateField("estimated_time", event.target.value)} required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">XP
                        <input type="number" min="1" step="1" value={form.xp} onChange={(event) => updateField("xp", event.target.value)} required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                </div>
                {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
                <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button><button type="submit" disabled={isSubmitting || isLoadingPatterns} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create question"}</button></div>
            </form>
        </div>
    );
}