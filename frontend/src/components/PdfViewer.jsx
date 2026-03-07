import React, { useRef, useEffect, useState } from "react";

function PdfViewer({ pdfFile, height = "600px", width = "100%" }) {
	const containerRef = useRef(null);
	const [containerWidth, setContainerWidth] = useState(width);

	useEffect(() => {
		const updateWidth = () => {
		if (containerRef.current) {
			const w = Math.min(Math.max(containerRef.current.clientWidth * 0.95, 350), 800);
			setContainerWidth(w);
		}
		};
		updateWidth();
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	}, []);

	if (!pdfFile) return <div className="text-center py-10 text-gray-500">No PDF provided</div>;

	return (
		<div ref={containerRef} className="w-full flex justify-center">
		<embed
			src={`${pdfFile}#toolbar=1&navpanes=0&scrollbar=1`}
			type="application/pdf"
			className="border shadow-md w-full h-150"
		/>
		</div>
	);
}

export default PdfViewer;