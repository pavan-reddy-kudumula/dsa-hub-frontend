"use client";

import { useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

export default function QuestionExampleModal({ questionId, example = null, onClose, onSaved }) {
    const [form, setForm] = useState({
        input: example?.input ?? "",
        output: example?.output ?? "",
        explanation: example?.explanation ?? "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const isEditing = Boolean(example?.id);

    function updateField(field, value) {
        setForm((currentForm) => ({ ...currentForm, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        const payload = {
            input: form.input.trim(),
            output: form.output.trim(),
            explanation: form.explanation.trim(),
        };

        try {
            const response = isEditing
                ? await api.patch(`/questions/${questionId}/examples/${example.id}`, payload)
                : await api.post(`/questions/${questionId}/examples`, payload);
            const savedExample = response.data?.example ?? response.data;
            onSaved?.({ ...example, ...payload, ...savedExample }, example?.id);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError(requestError?.response?.data?.message || `Unable to ${isEditing ? "update" : "create"} the example right now.`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSubmitting) onClose();
            }}
        >
            <form onSubmit={handleSubmit} className="my-8 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900" role="dialog" aria-modal="true" aria-labelledby="question-example-modal-title">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="question-example-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? "Update example" : "Add example"}</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Show the expected input and output for this question.</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close modal" className="text-slate-400 transition hover:text-slate-700 disabled:opacity-60 dark:hover:text-slate-200"><X size={22} /></button>
                </div>

                <div className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Input
                        <textarea value={form.input} onChange={(event) => updateField("input", event.target.value)} required autoFocus rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Output
                        <textarea value={form.output} onChange={(event) => updateField("output", event.target.value)} required rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Explanation <span className="font-normal text-slate-500">(optional)</span>
                        <textarea value={form.explanation} onChange={(event) => updateField("explanation", event.target.value)} rows={4} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                    </label>
                </div>

                {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
                <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add example"}</button></div>
            </form>
        </div>
    );
}
