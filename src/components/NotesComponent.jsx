'use client';

import { useCallback, useEffect, useState } from 'react';
import { BookOpen, CalendarDays, FileText, Plus, RefreshCw } from 'lucide-react';
import CreateNoteComponent from '@/components/CreateNoteComponent';
import NavbarComponent from '@/components/NavbarComponent';
import api from '@/lib/axios';

function formatDate(date) {
	if (!date) return 'Recently added';

	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(date));
}

export default function NotesComponent() {
	const [notes, setNotes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState('');

	const fetchNotes = useCallback(async (showRefreshState = false) => {
		if (showRefreshState) setIsRefreshing(true);
		else setIsLoading(true);
		setError('');

		try {
			const response = await api.get('/notes');
			setNotes(response.data?.notes ?? []);
		} catch (requestError) {
			console.error(requestError?.response?.data?.message || requestError);
			setError('We could not load your notes. Please try again.');
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		const requestId = window.setTimeout(() => fetchNotes(), 0);

		return () => window.clearTimeout(requestId);
	}, [fetchNotes]);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
			<NavbarComponent />

			<main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<section className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
					<div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-blue-400/20" />
					<div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-950/40">
								<BookOpen size={24} aria-hidden="true" />
							</div>
							<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Your knowledge base</p>
							<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Notes that keep your progress moving.</h1>
							<p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
								Capture the patterns, ideas, and shortcuts worth revisiting while you practice.
							</p>
						</div>
						<CreateNoteComponent onCreated={() => fetchNotes(true)} />
					</div>
				</section>

				<section className="mt-10">
					<div className="mb-5 flex items-center justify-between gap-4">
						<div>
							<h2 className="text-xl font-bold text-slate-900 dark:text-white">All notes</h2>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
								{notes.length} {notes.length === 1 ? 'note' : 'notes'} in your collection
							</p>
						</div>
						<button
							type="button"
							onClick={() => fetchNotes(true)}
							disabled={isRefreshing || isLoading}
							aria-label="Refresh notes"
							className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
						>
							<RefreshCw size={17} className={isRefreshing ? 'animate-spin' : ''} aria-hidden="true" />
						</button>
					</div>

					{error && (
						<div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300" role="alert">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<span>{error}</span>
								<button type="button" onClick={() => fetchNotes()} className="font-semibold underline underline-offset-2">Try again</button>
							</div>
						</div>
					)}

					{isLoading ? (
						<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3].map((item) => (
								<div key={item} className="h-52 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
							))}
						</div>
					) : notes.length === 0 && !error ? (
						<div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
							<FileText className="mx-auto text-slate-400" size={34} aria-hidden="true" />
							<h3 className="mt-4 text-lg font-semibold">Your notes start here</h3>
							<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Create your first note to keep a useful idea close at hand.</p>
							<div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
								<Plus size={16} aria-hidden="true" /> Add your first note above
							</div>
						</div>
					) : (
						<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
							{notes.map((note) => (
								<article key={note.id} className="group flex min-h-52 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
									<div className="flex items-start justify-between gap-4">
										<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
											<FileText size={18} aria-hidden="true" />
										</span>
										<span className="flex items-center gap-1.5 text-xs text-slate-400">
											<CalendarDays size={14} aria-hidden="true" /> {formatDate(note.updated_at || note.created_at)}
										</span>
									</div>
									<h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{note.title}</h3>
									<p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{note.description}</p>
								</article>
							))}
						</div>
					)}
				</section>
			</main>
		</div>
	);
}