// src/components/PdfModal.jsx
import React from "react";
import PdfViewer from "./PdfViewer";

function PdfModal({ pdfFile, title = "PDF Preview", isOpen, onClose }) {
  if (!isOpen) return null;

  return (

	<>
		<div className="fixed inset-0 backdrop-blur-sm z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}></div>
		
		<div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-50 z-50 w-[95%] max-w-6xl max-h-[90vh] overflow-auto shadow-lg p-6 sm:p-6">
			<button onClick={onClose} className="absolute top-4 right-3 p-2 text-gray-500 hover:text-gray-700" aria-label="Close preview modal">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-7 h-7"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
				<path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.42L10.59 12l-4.9 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.88 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.88a1 1 0 0 0 0-1.41z" />
				</svg>
			</button>

			<h3 className="font-semibold text-lg mb-2">{title}</h3>

			<PdfViewer pdfFile={pdfFile} />
		</div>
	</>

  );
}

export default PdfModal;