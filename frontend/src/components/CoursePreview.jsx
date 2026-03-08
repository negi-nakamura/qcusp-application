import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function CoursePreview() {

	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const limit = 4;
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
			<div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full gap-3 bg-neutral-50 p-2 shadow-lg rounded-lg">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="bg-white rounded-lg shadow flex flex-col h-full animate-pulse"
					>
						{/* Image skeleton */}
						<div className="w-full h-20 bg-gray-200 rounded-md mb-2"></div>

						{/* Title */}
						<div className="px-3 space-y-2">
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						</div>

						<hr className="mx-3 border-gray-200 my-2" />

						{/* Details */}
						<div className="px-3 space-y-2 mb-3">
							<div className="h-3 bg-gray-200 rounded w-2/3"></div>
							<div className="h-3 bg-gray-200 rounded w-1/2"></div>
							<div className="h-3 bg-gray-200 rounded w-3/4"></div>
							<div className="h-3 bg-gray-200 rounded w-1/3"></div>
						</div>

						{/* Tags */}
						<div className="flex gap-2 px-3 mb-3">
							<div className="h-5 w-16 bg-gray-200 rounded"></div>
							<div className="h-5 w-20 bg-gray-200 rounded"></div>
							<div className="h-5 w-14 bg-gray-200 rounded"></div>
						</div>
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

	if (courses.length === 0) return null;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full gap-3 bg-neutral-50 p-2 shadow-lg rounded-lg">

			{courses.map((course, idx) => (
				<div
					key={idx}
					className="bg-white rounded-lg shadow hover:shadow-md transition flex flex-col h-full"
				>
					{/* Background Image */}
					<div className="w-full h-20 rounded-md overflow-hidden mb-2 relative">
						<span className="text-[12px] sm:text-sm text-blue-600 bg-blue-50 border font-bold border-blue-200 px-2 py-1 rounded absolute top-2 left-2">
							{course.code}
						</span>
						<img
							src={`/course_bg_${course.bg}.jpg`}
							alt="Course Background"
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Course Name */}
					<h2 className="px-3 text-[16px] sm:text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
						{course.name}
					</h2>

					<hr className="mx-3 border-gray-200 mb-2" />

					{/* Course Details */}
					<div className="flex flex-col gap-1 mb-2 text-[13px] sm:text-sm text-gray-600 px-3">

						<div className="flex items-center gap-1">
							<Icon icon="iconamoon:profile-fill" width={14} height={14} className="text-gray-500"/>
							<span>{course.instructor}</span>
						</div>

						<div className="flex items-center gap-1">
							<Icon icon="ix:scheduler-filled" width={14} height={14} className="text-gray-500"/>
							<span>{course.day}</span>
						</div>

						{/* ✅ Schedule Split into Separate Lines */}
						<div className="flex items-start gap-1">
							<Icon icon="material-symbols:schedule" width={14} height={14} className="text-gray-500 mt-0.5"/>
							<div className="flex-col leading-tight hidden sm:flex">
								{course.schedule.split(" | ").map((time, i) => (
									<span key={i}>{time}</span>
								))}
							</div>
							<div className="flex flex-col leading-tight sm:hidden">
								<span>{course.schedule}</span>
							</div>
						</div>

						{/* Room */}
						<div className="flex items-start gap-1">
							<Icon
								icon="mingcute:location-fill"
								width={14}
								height={14}
								className="text-gray-500 mt-0.5"
							/>
							<div className="flex-col leading-tight hidden sm:flex">
								{course.room.split(" | ").map((room, i) => (
									<span key={i}>{room}</span>
								))}
							</div>

							<div className="flex flex-col leading-tight sm:hidden">
								<span>{course.room}</span>
							</div>
						</div>

					</div>

					{/* Course Tags */}
					<div className="flex flex-wrap gap-1 mb-3 px-3">
						<span className="text-[12px] sm:text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
							{course.year}
						</span>
						<span className="text-[12px] sm:text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
							{course.semester}
						</span>
						<span className="text-[12px] sm:text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
							{Number(course.units) } Units
						</span>
					</div>

				</div>
			))}
		</div>
	);
}

export default CoursePreview;