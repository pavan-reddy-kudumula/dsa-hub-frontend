import Link from "next/link";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";

export default function QuestionListComponent({ questions, isAdmin, onEdit, onDelete }) {
    return (
        <div className="space-y-3">
            {questions.map((question, index) => (
                <div key={question.id} className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
                    <Link href={`/questions/${question.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                            <h2 className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-lg">
                                {question.title ?? `Question ${index + 1}`}
                            </h2>
                            <div className="mt-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <span>{question.difficulty ?? "Practice question"}</span>
                                <span>{question.xp} xp</span>
                            </div>
                        </div>
                    </Link>
                    <div className="flex shrink-0 items-center gap-1">
                        {isAdmin && (
                            <>
                                <button type="button" onClick={() => onEdit(question)} aria-label={`Edit ${question.title ?? "question"}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-400">
                                    <Pencil size={18} aria-hidden="true" />
                                </button>
                                <button type="button" onClick={() => onDelete(question)} aria-label={`Delete ${question.title ?? "question"}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400">
                                    <Trash2 size={18} aria-hidden="true" />
                                </button>
                            </>
                        )}
                        <ArrowUpRight className="text-slate-400 transition group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" size={20} aria-hidden="true" />
                    </div>
                </div>
            ))}
        </div>
    );
}