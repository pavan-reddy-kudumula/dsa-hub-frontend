"use client";

import api from "@/lib/axios";
import ConfirmModal from "@/components/ConfirmModal";
import CompanyModalComponent from "@/components/companies/CompanyModalComponent";
import CreateCompanyComponent from "@/components/companies/CreateCompanyComponent";
import { UserContext } from "@/context/UserContext";
import { Pencil, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function companyId(company) {
    return company.id ?? company.company_id;
}

function companyName(company, index) {
    return company.name ?? company.company_name ?? `Company ${index + 1}`;
}

export default function CompaniesComponent() {
    const { userDetails } = useContext(UserContext);
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [companyToEdit, setCompanyToEdit] = useState(null);
    const [editName, setEditName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");
    const isAdmin = userDetails?.user?.role === "admin";

    async function fetchCompanies() {
        const { data } = await api.get("/companies");
        setCompanies(Array.isArray(data) ? data : data.companies ?? []);
    }

    useEffect(() => {
        let isMounted = true;
        Promise.resolve().then(() => fetchCompanies()).catch((requestError) => {
            console.error(requestError);
            if (isMounted) setError("Unable to load companies right now.");
        }).finally(() => {
            if (isMounted) setIsLoading(false);
        });
        return () => { isMounted = false; };
    }, []);

    async function handleDelete() {
        if (!companyToDelete) return;
        setIsSubmitting(true);
        setError("");
        try {
            await api.delete(`/companies/${companyId(companyToDelete)}`);
            setCompanies((currentCompanies) => currentCompanies.filter((company) => companyId(company) !== companyId(companyToDelete)));
            setCompanyToDelete(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError("Unable to delete the company right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function openEdit(company) {
        setCompanyToEdit(company);
        setEditName(companyName(company, 0));
        setModalError("");
    }

    async function handleUpdate(event) {
        event.preventDefault();
        if (!companyToEdit) return;
        setIsSubmitting(true);
        setModalError("");
        try {
            const { data } = await api.put(`/companies/${companyId(companyToEdit)}`, { name: editName.trim() });
            const updatedCompany = data.company ?? data;
            setCompanies((currentCompanies) => currentCompanies.map((company) => companyId(company) === companyId(companyToEdit) ? { ...company, ...updatedCompany } : company));
            setCompanyToEdit(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setModalError("Unable to update the company right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Study library</p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Companies</h1>
                    <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">Browse and manage the companies used to organize questions.</p>
                </div>
                {isAdmin && <CreateCompanyComponent onCreated={fetchCompanies} />}
                {!isLoading && error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
                {isLoading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading companies">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />)}</div>}
                {!isLoading && !error && companies.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">No companies yet.</div>}
                {!isLoading && !error && companies.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{companies.map((company, index) => {
                    const id = companyId(company);
                    const name = companyName(company, index);
                    return <article key={id ?? name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="min-w-0 flex-1 text-xl font-bold text-slate-900 dark:text-white">{name}</h2>
                        {isAdmin && <div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => openEdit(company)} aria-label={`Edit ${name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"><Pencil size={17} aria-hidden="true" /></button><button type="button" onClick={() => setCompanyToDelete(company)} aria-label={`Delete ${name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"><Trash2 size={17} aria-hidden="true" /></button></div>}
                    </article>;
                })}</div>}
            </div>
            {companyToDelete && <ConfirmModal msg={`Are you sure you want to delete "${companyName(companyToDelete, 0)}"?`} onCancel={() => !isSubmitting && setCompanyToDelete(null)} onOk={handleDelete} />}
            {companyToEdit && <CompanyModalComponent name={editName} isSubmitting={isSubmitting} error={modalError} onClose={() => !isSubmitting && setCompanyToEdit(null)} onSubmit={handleUpdate} onNameChange={setEditName} />}
        </main>
    );
}