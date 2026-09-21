'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import NoteModalComponent from './NoteModalComponent';

export default function CreateNoteComponent({ onCreated }) {
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	function openModal() {
		setError('');
		setIsOpen(true);
	}

	function closeModal() {
		if (isSubmitting) return;

		setIsOpen(false);
		setTitle('');
		setDescription('');
		setError('');
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			await api.post('/notes', { title, description });
			onCreated?.();
			setIsOpen(false);
			setTitle('');
			setDescription('');
		} catch (requestError) {
			console.error(requestError?.response?.data?.message || requestError);
			setError('Unable to create the note right now.');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={openModal}
				className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
			>
				Add Note
			</button>

			<NoteModalComponent
				isOpen={isOpen}
				title={title}
				description={description}
				isSubmitting={isSubmitting}
				error={error}
				onClose={closeModal}
				onSubmit={handleSubmit}
				onTitleChange={setTitle}
				onDescriptionChange={setDescription}
			/>
		</>
	);
}
