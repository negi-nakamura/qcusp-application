import { useState } from "react";
import PdfViewer from "./PdfViewer";

function PdfModal({ pdfFile, title = "PDF Preview", isOpen, onClose }) {
	const [error, setError] = useState(false);

	if (!isOpen) return null;

	return (
		<>
			<div
				className="fixed inset-0 backdrop-blur-sm z-50"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
				onClick={onClose}
			></div>

			<div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-50 z-50 w-[95%] max-w-6xl max-h-[90vh] overflow-auto shadow-lg px-4 py-3 sm:px-4 sm:py-3">

				{/* Header */}
				<div className="flex items-center justify-between mb-2">
					<h3 className="font-semibold text-lg">{title}</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 -mr-1 cursor-pointer"
						aria-label="Close preview modal"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-7 h-7"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.42L10.59 12l-4.9 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.88 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.88a1 1 0 0 0 0-1.41z" />
						</svg>
					</button>
				</div>

				{/* Error State */}
				{error || !pdfFile ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<p className="text-gray-600 text-lg font-medium">
							Unable to load PDF
						</p>
						<p className="text-gray-500 text-sm mt-1 px-3.5">
							The file could not be loaded at this time. It may have been removed, relocated, or is temporarily unavailable.
						</p>
					</div>
				) : (
					<PdfViewer pdfFile={pdfFile} onError={() => setError(true)} />
				)}
			</div>
		</>
	);
}

export default PdfModal;