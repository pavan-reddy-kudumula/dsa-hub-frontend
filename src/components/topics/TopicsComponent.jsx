"use client";

import api from "@/lib/axios";
import ConfirmModal from "@/components/ConfirmModal";
import CreateTopicComponent from "@/components/topics/CreateTopicComponent";
import TopicModalComponent from "@/components/topics/TopicModalComponent";
import { UserContext } from "@/context/UserContext";
import { Pencil, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function topicId(topic) {
    return topic.id ?? topic.topic_id;
}

function topicName(topic, index) {
    return topic.name ?? topic.topic_name ?? `Topic ${index + 1}`;
}

export default function TopicsComponent() {
    const { userDetails } = useContext(UserContext);
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [topicToDelete, setTopicToDelete] = useState(null);
    const [topicToEdit, setTopicToEdit] = useState(null);
    const [editName, setEditName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");
    const isAdmin = userDetails?.user?.role === "admin";

    async function fetchTopics() {
        const { data } = await api.get("/topics");
        setTopics(Array.isArray(data) ? data : data.topics ?? []);
    }

    useEffect(() => {
        let isMounted = true;
        Promise.resolve().then(() => fetchTopics()).catch((requestError) => {
            console.error(requestError);
            if (isMounted) setError("Unable to load topics right now.");
        }).finally(() => {
            if (isMounted) setIsLoading(false);
        });
        return () => { isMounted = false; };
    }, []);

    async function handleDelete() {
        if (!topicToDelete) return;
        setIsSubmitting(true);
        setError("");
        try {
            await api.delete(`/topics/${topicId(topicToDelete)}`);
            setTopics((currentTopics) => currentTopics.filter((topic) => topicId(topic) !== topicId(topicToDelete)));
            setTopicToDelete(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError("Unable to delete the topic right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function openEdit(topic) {
        setTopicToEdit(topic);
        setEditName(topicName(topic, 0));
        setModalError("");
    }

    async function handleUpdate(event) {
        event.preventDefault();
        if (!topicToEdit) return;
        setIsSubmitting(true);
        setModalError("");
        try {
            const { data } = await api.patch(`/topics/${topicId(topicToEdit)}`, { name: editName.trim() });
            const updatedTopic = data.topic ?? data;
            setTopics((currentTopics) => currentTopics.map((topic) => topicId(topic) === topicId(topicToEdit) ? { ...topic, ...updatedTopic } : topic));
            setTopicToEdit(null);
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setModalError("Unable to update the topic right now.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Study library</p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Topics</h1>
                    <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">Browse and manage the topics used to organize questions.</p>
                </div>
                {isAdmin && <CreateTopicComponent onCreated={fetchTopics} />}
                {isLoading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading topics">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />)}</div>}
                {!isLoading && error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
                {!isLoading && !error && topics.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">No topics yet.</div>}
                {!isLoading && !error && topics.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{topics.map((topic, index) => {
                    const id = topicId(topic);
                    const name = topicName(topic, index);
                    return <article key={id ?? name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="min-w-0 flex-1 text-xl font-bold text-slate-900 dark:text-white">{name}</h2>
                        {isAdmin && <div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => openEdit(topic)} aria-label={`Edit ${name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"><Pencil size={17} aria-hidden="true" /></button><button type="button" onClick={() => setTopicToDelete(topic)} aria-label={`Delete ${name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"><Trash2 size={17} aria-hidden="true" /></button></div>}
                    </article>;
                })}</div>}
            </div>
            {topicToDelete && <ConfirmModal msg={`Are you sure you want to delete "${topicName(topicToDelete, 0)}"?`} onCancel={() => !isSubmitting && setTopicToDelete(null)} onOk={handleDelete} />}
            {topicToEdit && <TopicModalComponent name={editName} isSubmitting={isSubmitting} error={modalError} onClose={() => !isSubmitting && setTopicToEdit(null)} onSubmit={handleUpdate} onNameChange={setEditName} />}
        </main>
    );
}