'use client';

export default function PatternModalComponent({
    name,
    description,
    displayOrder,
    isSubmitting,
    error,
    onClose,
    onSubmit,
    onNameChange,
    onDescriptionChange,
    onDisplayOrderChange,
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSubmitting) onClose();
            }}
        >
            <form
                onSubmit={onSubmit}
                className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pattern-modal-title"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="pattern-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                            Update pattern
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Edit this study pattern.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close modal"
                        className="text-2xl leading-none text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed dark:hover:text-slate-200"
                    >
                        &times;
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => onNameChange(event.target.value)}
                            required
                            autoFocus
                            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Display order
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={displayOrder}
                            onChange={(event) => onDisplayOrderChange(event.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Description
                        <textarea
                            value={description}
                            onChange={(event) => onDescriptionChange(event.target.value)}
                            required
                            rows={5}
                            className="mt-1.5 w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </label>
                </div>

                {error && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}