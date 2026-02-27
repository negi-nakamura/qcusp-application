import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

const reportData = [
  {
    title: "1st Year Final Grade Report for S.Y. 2025-2026",
    course: "Bachelor of Science in Information and Technology",
    campus: "Batasan Hills, Quezon City",
    yearLevel: "1st Year (Freshman)",
    dateSubmitted: "January 10, 2026 | 09:30 AM",
    schoolYear: "2025 - 2026",
    semester: "1st (Finals)",
    grades: [
      {
        description: "Fundamentals of Programming",
        code: "CC 102",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Olayson, Joel M.",
      },
      {
        description: "Introduction to Computing",
        code: "CC 101",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Carlo, Romero A.",
      },
      {
        description: "National Service Training Program 1",
        code: "NSTP 1",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Junio, Alvin B.",
      },
      {
        description: "Physical Activities Towards Health and Fitness 1",
        code: "PATHFIT 1",
        unit: 2,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Vinluan, Anthony R.",
      },
      {
        description: "The Contemporary World",
        code: "SOCSCI 1",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Suyat, Arcadil C.",
      },
      {
        description: "The Life and Works of Rizal",
        code: "RIZAL",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Cruz, Raymond L.",
      },
      {
        description: "Web Systems and Technologies 1",
        code: "WS 101",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Cagolilan, Noel C.",
      },
    ],
    totalUnits: 23,
    gwa: 1.5,
    overallRemarks: "PASSED",
  },
  {
    title: "1st Year Midterm Grade Report for S.Y. 2025-2026",
    course: "Bachelor of Science in Information and Technology",
    campus: "Batasan Hills, Quezon City",
    yearLevel: "1st Year (Freshman)",
    dateSubmitted: "January 10, 2026 | 09:30 AM",
    schoolYear: "2025 - 2026",
    semester: "1st (Midterm)",
    grades: [
      {
        description: "Fundamentals of Programming",
        code: "CC 102",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Olayson, Joel M.",
      },
      {
        description: "Introduction to Computing",
        code: "CC 101",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Carlo, Romero A.",
      },
      {
        description: "National Service Training Program 1",
        code: "NSTP 1",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Junio, Alvin B.",
      },
      {
        description: "Physical Activities Towards Health and Fitness 1",
        code: "PATHFIT 1",
        unit: 2,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Vinluan, Anthony R.",
      },
      {
        description: "The Contemporary World",
        code: "SOCSCI 1",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Suyat, Arcadil C.",
      },
      {
        description: "The Life and Works of Rizal",
        code: "RIZAL",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Cruz, Raymond L.",
      },
      {
        description: "Web Systems and Technologies 1",
        code: "WS 101",
        unit: 3,
        grade: 1.5,
        remarks: "PASSED",
        professor: "Cagolilan, Noel C.",
      },
    ],
    totalUnits: 23,
    gwa: 1.5,
    overallRemarks: "PASSED",
  },
];

function Grades() {

	const [grade, setGrade] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const limit = 5;
	const year = "1st Year";
	const semester = "1st Semester";

	useEffect(() => {
		const fetchGrades = async () => {
			try {
				setLoading(true);
				setError(null);

				const params = { limit };
				if (year) params.year = year;
				if (semester) params.semester = semester;

				const response = await axios.get("/api/grades", { params });
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
					overallRemarks: report.overallRemarks
				}));

				setGrade(transformed);
				console.log(transformed)

			} catch (err) {
				console.error("Failed to fetch grades:", err);
				setError("Failed to load grades");
			} finally {
				setLoading(false);
			}
		};

		fetchGrades();
	}, [limit, year, semester]);

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
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px]">

			{/* Title */}
			<div className="mb-2 sm:mb-4">
				<h1 className="text-[15px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
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
								className="flex items-center justify-center gap-2 border border-gray-400 rounded-lg px-4 py-3 text-gray-900 hover:bg-gray-100 transition cursor-pointer select-none sm:w-auto"
								type="button"
							>
								<Icon icon="charm:eye" width={20} height={20} className="sm:w-5 sm:h-5 text-neutral-500"/>
								<span className="text-sm sm:text-base text-neutral-500">Preview</span>
							</button>

							<button
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
	);
}

export default Grades;