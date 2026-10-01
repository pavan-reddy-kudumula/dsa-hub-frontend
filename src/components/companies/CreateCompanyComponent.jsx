"use client";

import api from "@/lib/axios";
import { useState } from "react";

export default function CreateCompanyComponent({ onCreated }) {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await api.post("/companies", { name: name.trim() });
            setName("");
            onCreated?.();
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError("Unable to create the company right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create a company</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Add a company to organize questions.</p>
            {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="company-name" className="sr-only">Company name</label>
                <input id="company-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Google" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100" />
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? "Creating..." : "Create company"}
                </button>
            </div>
        </form>
    );
}