'use client';

export default function ConfirmModal({ msg, onCancel, onOk }) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			role="presentation"
		>
			<div
				className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800"
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-modal-message"
			>
				<p id="confirm-modal-message" className="text-slate-700 dark:text-slate-200">
					{msg}
				</p>

				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onOk}
						className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);
}
