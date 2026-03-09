import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PdfModal from "./PdfModal";
import axios from "axios";

function Grades() {

	const [grade, setGrade] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [pdfFile, setPdfFile] = useState(null);

	useEffect(() => {
		const fetchGrades = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await axios.get("/api/grades");
			const data = response.data;

			const transformed = data.reports.map((report) => ({
				id: report.id,
				title: report.title,
				course: report.course,
				campus: report.campus,
				yearLevel: report.yearLevel,
				dateSubmitted: report.dateSubmitted,
				schoolYear: report.schoolYear,
				semester: report.semester,
				grades: report.grades.map((g) => ({
					description: g.description,
					code: g.code,
					unit: g.unit,
					grade: g.grade,
					remarks: g.remarks,
					professor: g.professor
				})),
				totalUnits: report.totalUnits,
				gwa: report.gwa,
				overallRemarks: report.overallRemarks,
				card_url: report.card_url
			}));

			setGrade(transformed);

		} catch (err) {
			console.error("Failed to fetch grades:", err);
			setError("Failed to load grades");
		} finally {
			setLoading(false);
		}
		};

		fetchGrades();
	}, []);

	const downloadPDF = async (pdfUrl, title) => {
		try {

			const response = await fetch(pdfUrl);
			if (!response.ok) throw new Error("Failed to fetch PDF");

			const blob = await response.blob();

			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = `${title}.pdf`;
			document.body.appendChild(link);
			link.click();

			link.remove();
			window.URL.revokeObjectURL(link.href);

		} catch (err) {
			console.error("PDF download failed:", err);
			alert("Unable to download PDF. Make sure the URL is HTTPS.");
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px] mt-5">

				<div className="mb-2 sm:mb-4 self-start flex items-center gap-2 animate-pulse">
					<div className="hidden sm:block w-7 h-7 bg-gray-200 rounded-full"></div>
					<div className="h-6 w-60 bg-gray-200 rounded"></div>
				</div>
				
				{Array.from({ length: 2 }).map((_, idx) => (
					<div key={idx} className="w-full mx-auto mt-2 mb-10 rounded-sm bg-neutral-50 shadow animate-pulse">

						{/* Table Header Skeleton */}
						<section className="h-10 bg-gray-300 rounded-t-md px-4 py-3 mb-3"></section>

						{/* Info Section Skeleton */}
						<section className="px-4 py-3 sm:px-6 sm:py-4">
							<div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
								{/* Left Column */}
								<div className="space-y-2">
									<div className="h-4 bg-gray-200 rounded w-full"></div>
									<div className="h-4 bg-gray-200 rounded w-5/6"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
								</div>

								{/* Right Column */}
								<div className="space-y-2">
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									<div className="h-4 bg-gray-200 rounded w-2/3"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
								</div>
							</div>

							{/* Grades Table Skeleton */}
							<div className="overflow-x-hidden mb-3">
								<table className="w-full min-w-full border border-gray-200">
									<thead>
										<tr>
											{Array.from({ length: 6 }).map((_, i) => (
												<th key={i} className="py-2 px-3">
													<div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{Array.from({ length: 4 }).map((_, i) => (
											<tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}>
												{Array.from({ length: 6 }).map((_, j) => (
													<td key={j} className="py-2 px-3">
														<div className="h-3 bg-gray-200 rounded w-full"></div>
													</td>
												))}
											</tr>
										))}
										{/* Totals row skeleton */}
										<tr className="bg-gray-300">
											{Array.from({ length: 6 }).map((_, j) => (
												<td key={j} className="py-2 px-3">
													<div className="h-3 bg-gray-200 rounded w-full"></div>
												</td>
											))}
										</tr>
									</tbody>
								</table>
							</div>

							{/* Notes Skeleton */}
							<div className="mt-4 h-10 bg-gray-200 rounded mb-3"></div>

							{/* Buttons Skeleton */}
							<div className="mt-4 flex gap-2">
								<div className="h-8 bg-gray-200 rounded w-24"></div>
								<div className="h-8 bg-gray-200 rounded w-32"></div>
							</div>
						</section>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px]">
			<div className="flex justify-center items-center h-64 text-red-500">
			{error}
			</div>
		</div>
		);
	}

	if (grade.length === 0) return null;

	return ( 

		<>
			<PdfModal
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
				pdfFile={pdfFile}
				title="Report Card Preview"
			/>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px] h-f">

				{/* Title */}
				<div className="mb-2 sm:mb-4">
					<h1 className="text-[18px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
						<Icon
							icon="tabler:clipboard-text-filled"
							width={24}
							height={24}
							className="hidden sm:w-7 sm:h-7 sm:block text-neutral-800"
						/>
						<span className="wrap-break-words">Grade Report Card</span>
					</h1>
				</div>

				{ grade.map((report, idx) => {

					return (

					<div key={idx} className="w-full max-w-[1000px] mx-auto mt-2 mb-10 rounded-sm select-none bg-neutral-50 shadow-[0_13px_34px_rgba(0,0,0,0.1)]">

						{/* Table Header */}
						<section className="flex items-center justify-center bg-primary-500 text-white px-4 py-3 rounded-t-md">
							<span className="text-sm sm:text-base sm:font-semibold">{report.title}</span>
						</section>

						{/* Table Contents*/}
						<section className="px-4 py-3 sm:px-6 sm:py-4">
							
							{/* Information Section*/}
							<div className="mb-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
									{/* Left Column */}
									<div className="sm:space-y-2">
										<div className="pb-0 sm:pb-2 border-b border-gray-100">
											<p className="text-xs text-neutral-900 font-bold uppercase tracking-wide inline sm:block">Course <span className="sm:hidden">: </span> </p>
											<p className="text-sm text-gray-700 inline sm:block">{report.course}</p>
										</div>
										<div className="pb-0 sm:pb-2 border-b border-gray-100">
											<p className="text-xs text-neutral-900 font-bold uppercase tracking-wide inline sm:block">Campus <span className="sm:hidden">: </span> </p>
											<p className="text-sm text-gray-700 inline sm:block">{report.campus}</p>
										</div>
										<div className="pb-0 sm:pb-2 border-b border-gray-100">
											<p className="text-xs text-neutral-900 font-bold uppercase tracking-wide inline sm:block">Year Level <span className="sm:hidden">: </span> </p>
											<p className="text-sm text-gray-700 inline sm:block">{report.yearLevel}</p>
										</div>
									</div>

									{/* Right Column */}
									<div className="sm:space-y-2">
										<div className="pb-0 sm:pb-2 border-b border-gray-100">
											<p className="text-xs text-neutral-900 font-bold uppercase tracking-wide inline sm:block">Date Submitted <span className="sm:hidden">: </span></p>
											<p className="text-sm text-gray-700 inline sm:block">{report.dateSubmitted}</p>
										</div>
										<div className="pb-0 sm:pb-2 border-b border-gray-100">
											<p className="text-xs text-neutral-900 font-bold uppercase tracking-wide inline sm:block">School Year <span className="sm:hidden">: </span></p>
											<p className="text-sm text-gray-700 inline sm:block">{report.schoolYear}</p>
										</div>
										<div className="pb-0 sm:pb-2 border-b border-gray-100">
											<p className="text-xs text-neutral-900 font-bold uppercase tracking-wide inline sm:block">Semester <span className="sm:hidden">: </span></p>
											<p className="text-sm text-gray-700 inline sm:block">{report.semester}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Grades Table */}
							<div className="overflow-x-auto">
								<table className="w-full min-w-full">
									<thead className="bg-gray-100">
										<tr>
											{["DESCRIPTION", "CODE", "UNIT", "GRADE", "REMARKS", "PROFESSOR"].map((header) => (
												<th 
													key={header}
													className="border border-gray-300 py-2 px-3 text-xs font-semibold text-gray-700 wrap-break-words whitespace-normal sm:whitespace-nowrap"
												>
													<span className="block sm:inline">
														{header}
													</span>
												</th>
											))}
										</tr>
									</thead>

									<tbody>
										{report.grades.map((grade, idx2) => (
											<tr
												key={idx2}
												className={idx2 % 2 === 0 ? "bg-white" : "bg-gray-50"}
											>
												<td className="border border-gray-300 py-2 px-3 text-xs">{grade.description}</td>
												<td className="border border-gray-300 py-2 px-3 text-xs">{grade.code}</td>
												<td className="border border-gray-300 py-2 px-3 text-xs text-center">{grade.unit}</td>
												<td className="border border-gray-300 py-2 px-3 text-xs text-center">{grade.grade}</td>
												<td className="border border-gray-300 py-2 px-3 text-xs text-center text-green-700 font-semibold">{grade.remarks}</td>
												<td className="border border-gray-300 py-2 px-3 text-xs">{grade.professor}</td>
											</tr>
										))}
											<tr className="bg-gray-100 font-semibold text-xs text-gray-900">
											<td colSpan={2} className="px-3 py-2 border border-gray-300">Total Units:</td>
											<td className="text-center border border-gray-300 py-2">{report.totalUnits}</td>
											<td className="text-center border border-gray-300 py-2">GWA: {report.gwa}</td>
											<td className="text-center border border-gray-300 py-2" colSpan={2}>Remarks: {report.overallRemarks} </td>
										</tr>
									</tbody>

								</table>
							</div>

							{/* Important Notes */}
							<div className="mt-4 bg-yellow-50 border border-yellow-300 rounded px-3 py-3 text-[10px] text-yellow-900 text-justify">
								<strong>IMPORTANT NOTES:</strong> NO CHANGES OF GRADES SHALL BE MADE UNLESS APPROVED BY THE COLLEGE DEPARTMENT CHAIR,
								VPO AND VPAA. NATIONAL SERVICE TRAINING PROGRAM IS NOT INCLUDED IN THE COMPUTATION OF GWA.
							</div>

							{/* Actions Button*/}
							<div className="mt-4 flex sm:flex-row justify-end gap-2 sm:gap-3">
								<button
									onClick={() => {
										setPdfFile(report.card_url);
										setIsPreviewOpen(true);
									}}
									className="flex items-center justify-center gap-2 border border-gray-400 rounded-lg px-3 sm:px-6 py-3 text-gray-900 hover:bg-gray-100 transition cursor-pointer select-none sm:w-auto"
									type="button"
								>
									<span className="text-sm sm:text-base text-neutral-500">Preview</span>
								</button>

								<button
									onClick={() => downloadPDF(report.card_url, report.title)}
									className="flex items-center justify-center gap-2 bg-primary-500 text-white rounded-lg px-4 py-3 hover:bg-blue-800 transition cursor-pointer select-none sm:w-auto"
									type="button"
								>
									<Icon icon="material-symbols:download" width={20} height={20} className="sm:w-5 sm:h-5 text-white"/>
									<span className="text-sm sm:text-base">Download Grades</span>
								</button>
							</div>

						</section>

					</div>

					)

				})}

			</div>
		</>

	);
}

export default Grades;