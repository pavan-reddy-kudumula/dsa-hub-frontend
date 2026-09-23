"use client"

import api from "@/lib/axios";
import { useState } from "react";

export default function CreatePatternComponent({ onCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [displayOrder, setDisplayOrder] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setFormError("");
        setIsSubmitting(true);

        const pattern = { name: name.trim(), description: description.trim() };
        if (displayOrder !== "") {
            pattern.display_order = Number(displayOrder);
        }

        try {
            await api.post("/patterns", pattern);
            setName("");
            setDescription("");
            setDisplayOrder("");
            onCreated?.();
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setFormError("Unable to create the pattern right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create a pattern</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Add a new topic to the study library.</p>
            </div>

            {formError && (
                <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                    {formError}
                </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="pattern-name" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Name</label>
                    <input
                        id="pattern-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                        placeholder="Two pointers"
                    />
                </div>

                <div>
                    <label htmlFor="pattern-display-order" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Display order <span className="font-normal text-slate-500">(optional)</span>
                    </label>
                    <input
                        id="pattern-display-order"
                        type="number"
                        min="1"
                        step="1"
                        value={displayOrder}
                        onChange={(event) => setDisplayOrder(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                        placeholder="Assigned automatically"
                    />
                </div>
            </div>

            <div className="mt-5">
                <label htmlFor="pattern-description" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
                <textarea
                    id="pattern-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    rows="3"
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Describe when this pattern is useful."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Creating..." : "Create pattern"}
            </button>
        </form>
    );
}
