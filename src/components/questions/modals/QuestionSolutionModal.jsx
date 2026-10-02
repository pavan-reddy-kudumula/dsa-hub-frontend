"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

export default function QuestionSolutionModal({ questionId, solution = null, onClose, onSaved }) {
    const [form, setForm] = useState({
        language_name: solution?.language_name ?? "",
        solution: solution?.solution ?? "",
        description: solution?.description ?? "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const isEditing = Boolean(solution?.id ?? solution?.solution_id);
    const solutionId = solution?.id ?? solution?.solution_id;

    function updateField(field, value) {
        setForm((currentForm) => ({ ...currentForm, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        const payload = {
            language_name: form.language_name.trim(),
            solution: form.solution.trim(),
        };
        const description = form.description.trim();
        if (description) {
            payload.description = description;
        }

        try {
            const response = isEditing
                ? await api.patch(`/questions/${questionId}/solutions/${solutionId}`, payload)
                : await api.post(`/questions/${questionId}/solutions`, payload);
            const responseData = response.data;
            const savedSolution = responseData?.solution
                ?? responseData?.questionSolution
                ?? (typeof responseData?.data === "object" ? responseData.data : responseData);
            onSaved?.({ ...solution, ...payload, ...savedSolution }, solutionId);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError(requestError?.response?.data?.message || `Unable to ${isEditing ? "update" : "create"} the solution right now.`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}>
            <form onSubmit={handleSubmit} className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900" role="dialog" aria-modal="true" aria-labelledby="question-solution-modal-title">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="question-solution-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? "Update solution" : "Add solution"}</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add a language and the solution code for this question.</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close modal" className="text-slate-400 transition hover:text-slate-700 disabled:opacity-60 dark:hover:text-slate-200"><X size={22} /></button>
                </div>
                <div className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Language name
                        <input value={form.language_name} onChange={(event) => updateField("language_name", event.target.value)} required autoFocus className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Solution
                        <textarea value={form.solution} onChange={(event) => updateField("solution", event.target.value)} required rows={10} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description <span className="font-normal text-slate-500">(optional)</span>
                        <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                </div>
                {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
                <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add solution"}</button></div>
            </form>
        </div>
    );
}