import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function Course() {

	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const limit = 10;
	const year = "1st Year"; 
	const semester = "2nd Semester";

	useEffect(() => {
		const fetchCourses = async () => {
		try {
			setLoading(true);
			setError(null);

			const params = { limit };
			if (year) params.year = year;
			if (semester) params.semester = semester;

			const response = await axios.get("/api/courses", { params });
			const data = response.data;

			const transformed = data.subjects.map((c, idx) => ({
				id: c.id,
				name: c.subject_name,
				code: c.subject_code,
				units: c.units,
				instructor: c.professors || "TBA",
				day: c.day_of_week || "TBA",
				schedule: c.time_range || "TBA",
				room: c.rooms || "TBA",
				course_description: c.description || "No description available.",
				year: c.year || "TBA",
				semester: c.semester || "TBA",
				bg: (idx % 4) + 1, 
			}));

			setCourses(transformed);
		} catch (err) {
			console.error("Failed to fetch courses:", err);
			setError("Failed to load courses");
		} finally {
			setLoading(false);
		}
		};

		fetchCourses();
	}, [limit, year, semester]);

	if (loading) {
		return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px]">
			<div className="flex justify-center items-center h-64 text-gray-500">
			Loading courses...
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

	if (courses.length === 0) return null;


	return (

		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px]">

			{/* Title */}
			<div className="mb-2 sm:mb-4">
				<h1 className="text-[15px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
					<Icon
						icon="tabler:clipboard-text-filled"
						width={24}
						height={24}
						className="hidden sm:w-7 sm:h-7 sm:block text-neutral-800"
					/>
					<span className="wrap-break-words">My Courses</span>
				</h1>
			</div>

			{/* Course List */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full mx-auto mt-2 mb-10 bg-neutral-50 p-4 sm:p-6 rounded-lg shadow-sm">

				{courses.map((course, idx) => (
				<div key={idx} className="bg-white rounded-lg shadow hover:shadow-md transition flex flex-col h-full">

					{/* Background Image */}
					<div className="w-full h-20 sm:h-30 rounded-md overflow-hidden mb-3 relative">
						<span className="text-sm text-blue-600 bg-blue-50 border font-bold border-blue-200 px-2 py-1 rounded absolute top-3 left-3">{course.code}</span>
						<img
							src={`/course_bg_${course.bg}.jpg`}
							alt="Course Background"
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Course Name */}
					<h2 className="px-4 text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
					{course.name}
					</h2>

					<hr className="mx-4 border-gray-200 mb-2" />

					{/* Course Details */}
					<div className="flex flex-col gap-1 mb-3 text-gray-600 text-sm px-4">
						<div className="flex items-center gap-2">
							<Icon icon="iconamoon:profile-fill" width={18} height={18} className="text-gray-500"/>
							<span>{course.instructor}</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="ix:scheduler-filled" width={18} height={18} className="text-gray-500"/>
							<span>{course.day}</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="material-symbols:schedule" width={18} height={18} className="text-gray-500"/>
							<span>{course.schedule}</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="mingcute:location-fill" width={18} height={18} className="text-gray-500"/>
							<span>{course.room}</span>
						</div>
						</div>

						{/* Course Description with Scroll */}
						<div className="mb-3 px-4">
						<h3 className="text-sm font-medium text-gray-800 mb-1">Course Description</h3>
						<div className="text-gray-700 text-sm max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-2 bg-gray-50 rounded">
							{course.course_description}
						</div>
					</div>

					{/* Course Tags */}
					<div className="flex flex-wrap gap-2 mb-3 px-4">
					<span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded">{course.year}</span>
					<span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded">{course.semester}</span>
					<span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded">{Number(course.units)} Units</span>
					</div>

					{/* Action Buttons */}
					<div className="mt-auto flex flex-col md:flex-row justify-end gap-2 px-4 pb-4">
						<button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm w-full sm:w-auto">
							<Icon icon="charm:eye" width={20} height={20} className="text-gray-700"/>
							Preview
						</button>

						<button className="flex items-center justify-center gap-2 bg-primary-500 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition text-sm w-full sm:w-auto">
							<Icon icon="material-symbols:download" width={20} height={20} className="text-white"/>
							Download Syllabus
						</button>
					</div>

				</div>
				))}

			</div>

		</div>

	);
}

export default Course;