"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/axios";

function topicId(topic) {
    return topic.id ?? topic.topic_id;
}

function topicName(topic, index) {
    return topic.name ?? topic.topic_name ?? `Topic ${index + 1}`;
}

export default function QuestionTopicModal({ questionId, topics: initialTopics = [], onClose, onSaved }) {
    const [topics, setTopics] = useState([]);
    const [selectedTopicIds, setSelectedTopicIds] = useState(() => initialTopics.map(topicId).filter(Boolean));
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const isEditing = selectedTopicIds.length > 0;

    useEffect(() => {
        let isMounted = true;

        async function loadTopics() {
            try {
                const [{ data: allTopicsData }, { data: questionTopicsData }] = await Promise.all([
                    api.get("/topics"),
                    api.get(`/questions/${questionId}/topics`),
                ]);
                const allTopics = Array.isArray(allTopicsData) ? allTopicsData : allTopicsData?.topics ?? [];
                const questionTopics = Array.isArray(questionTopicsData) ? questionTopicsData : questionTopicsData?.topics ?? [];

                if (isMounted) {
                    setTopics(allTopics);
                    if (questionTopics.length) {
                        setSelectedTopicIds(questionTopics.map(topicId).filter(Boolean));
                    }
                }
            } catch (requestError) {
                console.error(requestError?.response?.data?.message || requestError);
                if (isMounted) setError("Unable to load topics right now.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadTopics();
        return () => { isMounted = false; };
    }, [questionId]);

    function toggleTopic(topic) {
        const id = topicId(topic);
        setSelectedTopicIds((currentIds) => currentIds.includes(id)
            ? currentIds.filter((currentId) => currentId !== id)
            : [...currentIds, id]);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!selectedTopicIds.length) {
            setError("Select at least one topic.");
            return;
        }

        setError("");
        setIsSubmitting(true);
        try {
            const method = isEditing ? "put" : "post";
            await api[method](`/questions/${questionId}/topics`, { topicIds: selectedTopicIds });
            onSaved?.(topics.filter((topic) => selectedTopicIds.includes(topicId(topic))));
        } catch (requestError) {
            console.error(requestError?.response?.data?.message || requestError);
            setError(requestError?.response?.data?.message || `Unable to ${isEditing ? "update" : "add"} the topics right now.`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}>
            <form onSubmit={handleSubmit} className="my-8 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900" role="dialog" aria-modal="true" aria-labelledby="question-topic-modal-title">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="question-topic-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? "Update topics" : "Add topics"}</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select one or more topics for this question.</p>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close modal" className="text-slate-400 transition hover:text-slate-700 disabled:opacity-60 dark:hover:text-slate-200"><X size={22} /></button>
                </div>

                <div className="mt-6 max-h-72 space-y-2 overflow-y-auto">
                    {isLoading && <p className="text-sm text-slate-500">Loading topics...</p>}
                    {!isLoading && topics.length === 0 && <p className="text-sm text-slate-500">No topics available.</p>}
                    {!isLoading && topics.map((topic, index) => {
                        const id = topicId(topic);
                        const isSelected = selectedTopicIds.includes(id);
                        return <label key={id ?? index} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                            <input type="checkbox" checked={isSelected} onChange={() => toggleTopic(topic)} disabled={isSubmitting} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <span>{topicName(topic, index)}</span>
                        </label>;
                    })}
                </div>

                {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
                <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button><button type="submit" disabled={isSubmitting || isLoading || !topics.length} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add topics"}</button></div>
            </form>
        </div>
    );
}