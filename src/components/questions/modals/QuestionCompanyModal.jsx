"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

function companyId(company) {
    return company.id ?? company.company_id;
}

function companyName(company, index) {
    return company.name ?? company.company_name ?? `Company ${index + 1}`;
}

export default function QuestionCompanyModal({ questionId, companies: initialCompanies = [], onClose, onSaved }) {
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyIds, setSelectedCompanyIds] = useState(() => initialCompanies.map(companyId).filter(Boolean));
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const isEditing = selectedCompanyIds.length > 0;

    useEffect(() => {
        let isMounted = true;

        async function loadCompanies() {
            try {
                const [{ data: allCompaniesData }, { data: questionCompaniesData }] = await Promise.all([
                    api.get("/companies"),
                    api.get(`/questions/${questionId}/companies`),
                ]);
                const allCompanies = Array.isArray(allCompaniesData) ? allCompaniesData : allCompaniesData?.companies ?? [];
                const questionCompanies = Array.isArray(questionCompaniesData) ? questionCompaniesData : questionCompaniesData?.companies ?? [];

                if (isMounted) {
                    setCompanies(allCompanies);
                    if (questionCompanies.length) {
                        setSelectedCompanyIds(questionCompanies.map(companyId).filter(Boolean));
                    }
                }
            } catch (requestError) {
                console.error(requestError?.response?.data?.message || requestError);
                if (isMounted) setError("Unable to load companies right now.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadCompanies();
        return () => { isMounted = false; };
    }, [questionId]);

    function toggleCompany(company) {
        const id = companyId(company);
        setSelectedCompanyIds((currentIds) => currentIds.includes(id)
            ? currentIds.filter((currentId) => currentId !== id)
            : [...currentIds, id]);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!selectedCompanyIds.length) {
            setError("Select at least one company.");
            return;
        }

        setError("");
        setIsSubmitting(true);
        try {
            const method = isEditing ? "put" : "post";
            await api[method](`/questions/${questionId}/companies`, { companyIds: selectedCompanyIds });
            onSaved?.(companies.filter((company) => selectedCompanyIds.includes(companyId(company))));
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError(requestError?.response?.data?.message || `Unable to ${isEditing ? "update" : "add"} the companies right now.`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}>
            <form onSubmit={handleSubmit} className="my-8 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900" role="dialog" aria-modal="true" aria-labelledby="question-company-modal-title">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="question-company-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? "Update companies" : "Add companies"}</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select one or more companies for this question.</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close modal" className="text-slate-400 transition hover:text-slate-700 disabled:opacity-60 dark:hover:text-slate-200"><X size={22} /></button>
                </div>

                <div className="mt-6 max-h-72 space-y-2 overflow-y-auto">
                    {isLoading && <p className="text-sm text-slate-500">Loading companies...</p>}
                    {!isLoading && companies.length === 0 && <p className="text-sm text-slate-500">No companies available.</p>}
                    {!isLoading && companies.map((company, index) => {
                        const id = companyId(company);
                        const isSelected = selectedCompanyIds.includes(id);
                        return <label key={id ?? index} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                            <input type="checkbox" checked={isSelected} onChange={() => toggleCompany(company)} disabled={isSubmitting} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <span>{companyName(company, index)}</span>
                        </label>;
                    })}
                </div>

                {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
                <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button><button type="submit" disabled={isSubmitting || isLoading || !companies.length} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add companies"}</button></div>
            </form>
        </div>
    );
}