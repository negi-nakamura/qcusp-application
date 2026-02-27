import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function Grades() {

	const [grade, setGrade] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

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
				totalUnits: report.totalUnits,
				gwa: report.gwa,
				overallRemarks: report.overallRemarks
			}));

			setGrade(transformed[0]);
			console.log(transformed[0]);

		} catch (err) {
			console.error("Failed to fetch grades:", err);
			setError("Failed to load grades");
		} finally {
			setLoading(false);
		}
		};

		fetchGrades();
	}, []);

	if (loading) {
		return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px]">
			<div className="flex justify-center items-center h-64 text-gray-500">
			Loading grades...
			</div>
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
		<div className="flex flex-col w-full gap-3 bg-neutral-50 p-2 shadow-lg rounded-lg">
			<section className="bg-white shadow-sm hover:shadow-md transition  items-start">
				
				{/* Header */}
				<div className="flex items-center justify-center bg-primary-500 text-white px-4 py-2.5">
					<span className="text-xs sm:text-base font-semibold text-center">
						{grade.title}
					</span>
				</div>

				{/* Summary Body */}
				<div className="grid grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 py-3 text-[11px] sm:text-sm">

					{/* Left Column */}
					<div className="space-y-2 sm:space-y-3">
						<div>
							<p className="text-gray-500 text-[10px] sm:text-xs">Program</p>
							<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
								{grade.course}
							</p>
						</div>

						<div>
							<p className="text-gray-500 text-[10px] sm:text-xs">Campus</p>
							<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
								{grade.campus}
							</p>
						</div>

						<div>
							<p className="text-gray-500 text-[10px] sm:text-xs">Total Units</p>
							<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
								{grade.totalUnits}
							</p>
						</div>
					</div>

					{/* Right Column */}
					<div className="space-y-2 sm:space-y-3">
						<div>
							<p className="text-gray-500 text-[10px] sm:text-xs">Semester</p>
							<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
								{grade.semester}
							</p>
						</div>
						
						<div>
							<p className="text-gray-500 text-[10px] sm:text-xs">Remarks</p>
							<p className="font-semibold text-green-600 text-[11px] sm:text-sm">
								{grade.overallRemarks}
							</p>
						</div>

						<div>
							<p className="text-gray-500 text-[10px] sm:text-xs">
								General Weighted Average
							</p>
							<p className="font-semibold text-primary-600 text-[12px] sm:text-sm">
								{grade.gwa}
							</p>
						</div>
					</div>

				</div>

				{/* Footer */}
				<div className="border-t px-3 sm:px-4 py-2 bg-gray-100 flex justify-between items-center text-[12px] sm:text-xs text-gray-500">
					<span>Submitted on {grade.dateSubmitted}</span>
				</div>

			</section>
		</div>
	);
}

export default Grades;