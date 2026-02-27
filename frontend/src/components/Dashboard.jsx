import Carousel from "./Carousel";
import { Icon } from "@iconify/react";
import LoginActivity from "./LoginActivity";
import CoursePreview from "./CoursePreview";
import CalendarPreview from "./CalendarPreview";
import { NavLink } from "react-router-dom";

const student = {
	id: 1,
	student_id: 250333,
	firstName: "Christian",
	middleName: "Postrado",
	lastName: "Regalado",
	get fullName() {
    	return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(" ");
  	},
	course: "Bachelor of Science in Information Technology"
}

function Dashboard() {
	return (

		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px]">

			{/* Title */}
			<h1 className="mb-5 sm:mb-8 font-semibold flex items-center gap-3 text-gray-800 mt-4 sm:mt-5">

				<Icon icon="mdi:hand-wave" className="sm:w-8 sm:h-8 hidden sm:block text-neutral-800"/>
				<div>
					<span className="wrap-break-words text-[13px] sm:text-xl block sm:inline font-medium">{"Welcome Back, "}</span>
					<span className="wrap-break-words text-xl sm:text-xl block sm:inline font-semibold text-primary-500"> {student.fullName}!</span>
					<span className="wrap-break-words text-xs sm:text-base block font-normal">{student.student_id} | {student.course}</span>
				</div>

			</h1>

			{/*Announcements*/}
			<div className="mb-5">
				<div className="flex mb-2 justify-between items-center">
					<div className="flex items-center gap-1.5 text-neutral-800">
						<Icon icon="fluent:news-20-filled" className="sm:w-6 sm:h-6 "/>
						<span className="text-sm font-medium sm:text-base">News and Announcements</span>
					</div>
					<div className="flex items-center gap-1.5 text-primary-500 cursor-pointer">
						<span className="text-xs font-medium sm:text-sm">View All</span>
						<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
					</div>
				</div>
				<Carousel />
			</div>

			{/*Grades and Login*/}
			<div className="grid grid-cols-1 lg:grid-cols-2 mb-5 gap-7">

				<section>
					<NavLink to="/grades" className="flex mb-2 justify-between items-center cursor-pointer">
						<div className="flex items-center gap-1.5 text-neutral-800">
							<Icon icon="tabler:clipboard-text-filled" className="sm:w-6 sm:h-6 "/>
							<span className="text-sm font-medium sm:text-base">Latest Grade Report</span>
						</div>
						<div className="flex items-center gap-1.5 text-primary-500">
							<span className="text-xs font-medium sm:text-sm">View All</span>
							<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
						</div>
					</NavLink>

					<div className="flex flex-col w-full gap-3 bg-neutral-50 p-2 shadow-lg rounded-lg">
						<section className="bg-white shadow-sm hover:shadow-md transition  items-start">
							
							{/* Header */}
							<div className="flex items-center justify-center bg-primary-500 text-white px-4 py-2.5">
								<span className="text-xs sm:text-base font-semibold text-center">
									1st Year Final Grade Report for S.Y. 2025-2026
								</span>
							</div>

							{/* Summary Body */}
							<div className="grid grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 py-3 text-[11px] sm:text-sm">

								{/* Left Column */}
								<div className="space-y-2 sm:space-y-3">
									<div>
										<p className="text-gray-500 text-[10px] sm:text-xs">Program</p>
										<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
											BS Information Technology
										</p>
									</div>

									<div>
										<p className="text-gray-500 text-[10px] sm:text-xs">Campus</p>
										<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
											San Bartolome Campus
										</p>
									</div>

									<div>
										<p className="text-gray-500 text-[10px] sm:text-xs">Total Units</p>
										<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
											36 Units
										</p>
									</div>
								</div>

								{/* Right Column */}
								<div className="space-y-2 sm:space-y-3">
									<div>
										<p className="text-gray-500 text-[10px] sm:text-xs">
											General Weighted Average
										</p>
										<p className="font-semibold text-primary-600 text-[12px] sm:text-sm">
											1.75
										</p>
									</div>

									<div>
										<p className="text-gray-500 text-[10px] sm:text-xs">Remarks</p>
										<p className="font-semibold text-green-600 text-[11px] sm:text-sm">
											PASSED
										</p>
									</div>

									<div>
										<p className="text-gray-500 text-[10px] sm:text-xs">Academic Status</p>
										<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
											Regular Student
										</p>
									</div>
								</div>

							</div>

							{/* Footer */}
							<div className="border-t px-3 sm:px-4 py-2 bg-gray-100 flex justify-between items-center text-[12px] sm:text-xs text-gray-500">
								<span>Submitted on April 20, 2026</span>
							</div>

						</section>
					</div>

				</section>

				<section>
					<div className="flex mb-2 justify-between items-center cursor-pointer">
						<div className="flex items-center gap-1.5 text-neutral-800">
							<Icon icon="material-symbols:login-rounded" className="sm:w-6 sm:h-6 "/>
							<span className="text-sm font-medium sm:text-base">Login Activity</span>
						</div>
						<div className="flex items-center gap-1.5 text-primary-500">
							<span className="text-xs font-medium sm:text-sm">View All</span>
							<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
						</div>
					</div>
					<LoginActivity/>
				</section>

			</div>

			{/*Courses and Calendar*/}
			<div className="grid grid-cols-1 lg:grid-cols-2 mb-5 gap-7"> 
				
				<section>
					<NavLink to="/courses" className="flex mb-2 justify-between items-center cursor-pointer">
						<div className="flex items-center gap-1.5 text-neutral-800">
							<Icon icon="tabler:clipboard-text-filled" className="sm:w-6 sm:h-6 "/>
							<span className="text-sm font-medium sm:text-base">My Courses</span>
						</div>
						<div className="flex items-center gap-1.5 text-primary-500">
							<span className="text-xs font-medium sm:text-sm">View All</span>
							<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
						</div>
					</NavLink>			
					<CoursePreview/>		
				</section>

				<section>
					<NavLink to="/calendar" className="flex mb-2 justify-between items-center cursor-pointer">
						<div className="flex items-center gap-1.5 text-neutral-800">
							<Icon icon="solar:calendar-bold" className="sm:w-6 sm:h-6 "/>
							<span className="text-sm font-medium sm:text-base">University Calendar</span>
						</div>
						<div className="flex items-center gap-1.5 text-primary-500">
							<span className="text-xs font-medium sm:text-sm">View All</span>
							<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
						</div>
					</NavLink>		
					<CalendarPreview/>
				</section>

			</div>

		</div>
	);
}

export default Dashboard;



// import Carousel from "./Carousel";
// import { Icon } from "@iconify/react";
// import LoginActivity from "./LoginActivity";
// import CoursePreview from "./CoursePreview";
// import CalendarPreview from "./CalendarPreview";

// const student = {
// 	id: 1,
// 	student_id: 250333,
// 	firstName: "Christian",
// 	middleName: "Postrado",
// 	lastName: "Regalado",
// 	get fullName() {
//     	return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(" ");
//   	},
// 	course: "Bachelor of Science in Information Technology"
// }

// function Dashboard() {
// 	return (

// 		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px]">

// 			{/* Title */}
// 			<h1 className="mb-5 sm:mb-8 font-semibold flex items-center gap-3 text-gray-800 mt-4 sm:mt-5">

// 				<Icon icon="mdi:hand-wave" className="sm:w-8 sm:h-8 hidden sm:block text-neutral-800"/>
// 				<div>
// 					<span className="wrap-break-words text-[13px] sm:text-xl block sm:inline font-medium">{"Welcome Back, "}</span>
// 					<span className="wrap-break-words text-xl sm:text-xl block sm:inline font-semibold text-primary-500"> {student.fullName}!</span>
// 					<span className="wrap-break-words text-xs sm:text-base block font-normal">{student.student_id} | {student.course}</span>
// 				</div>

// 			</h1>

// 			{/*Announcements*/}
// 			<div className="mb-5">
// 				<div className="flex mb-2 justify-between items-center">
// 					<div className="flex items-center gap-1.5 text-neutral-800">
// 						<Icon icon="fluent:news-20-filled" className="sm:w-6 sm:h-6 "/>
// 						<span className="text-sm font-medium sm:text-base">News and Announcements</span>
// 					</div>
// 					<div className="flex items-center gap-1.5 text-primary-500">
// 						<span className="text-xs font-medium sm:text-sm">View All</span>
// 						<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
// 					</div>
// 				</div>
// 				<Carousel />
// 			</div>

// 			{/*Grades and Login*/}
// 			<div className="grid grid-cols-1 lg:grid-cols-2 mb-5 gap-7">

// 				<div className="flex flex-col gap-5">

// 					<section>
// 						<div className="flex mb-2 justify-between items-center">
// 							<div className="flex items-center gap-1.5 text-neutral-800">
// 								<Icon icon="tabler:clipboard-text-filled" className="sm:w-6 sm:h-6 "/>
// 								<span className="text-sm font-medium sm:text-base">Latest Grade Report</span>
// 							</div>
// 							<div className="flex items-center gap-1.5 text-primary-500">
// 								<span className="text-xs font-medium sm:text-sm">View All</span>
// 								<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
// 							</div>
// 						</div>

// 						<div className="flex flex-col w-full gap-3 bg-neutral-50 p-2 shadow-lg rounded-lg">
// 							<section className="bg-white shadow-sm hover:shadow-md transition  items-start">
								
// 								{/* Header */}
// 								<div className="flex items-center justify-center bg-primary-500 text-white px-4 py-2.5">
// 									<span className="text-xs sm:text-base font-semibold text-center">
// 										1st Year Final Grade Report for S.Y. 2025-2026
// 									</span>
// 								</div>

// 								{/* Summary Body */}
// 								<div className="grid grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 py-3 text-[11px] sm:text-sm">

// 									{/* Left Column */}
// 									<div className="space-y-2 sm:space-y-3">
// 										<div>
// 											<p className="text-gray-500 text-[10px] sm:text-xs">Program</p>
// 											<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
// 												BS Information Technology
// 											</p>
// 										</div>

// 										<div>
// 											<p className="text-gray-500 text-[10px] sm:text-xs">Campus</p>
// 											<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
// 												San Bartolome Campus
// 											</p>
// 										</div>

// 										<div>
// 											<p className="text-gray-500 text-[10px] sm:text-xs">Total Units</p>
// 											<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
// 												36 Units
// 											</p>
// 										</div>
// 									</div>

// 									{/* Right Column */}
// 									<div className="space-y-2 sm:space-y-3">
// 										<div>
// 											<p className="text-gray-500 text-[10px] sm:text-xs">
// 												General Weighted Average
// 											</p>
// 											<p className="font-semibold text-primary-600 text-[12px] sm:text-sm">
// 												1.75
// 											</p>
// 										</div>

// 										<div>
// 											<p className="text-gray-500 text-[10px] sm:text-xs">Remarks</p>
// 											<p className="font-semibold text-green-600 text-[11px] sm:text-sm">
// 												PASSED
// 											</p>
// 										</div>

// 										<div>
// 											<p className="text-gray-500 text-[10px] sm:text-xs">Academic Status</p>
// 											<p className="font-medium text-gray-800 text-[11px] sm:text-sm">
// 												Regular Student
// 											</p>
// 										</div>
// 									</div>

// 								</div>

// 								{/* Footer */}
// 								<div className="border-t px-3 sm:px-4 py-2 bg-gray-100 flex justify-between items-center text-[12px] sm:text-xs text-gray-500">
// 									<span>Submitted on April 20, 2026</span>
// 								</div>

// 							</section>
// 						</div>

// 					</section>

// 					<section>
// 						<div className="flex mb-2 justify-between items-center">
// 							<div className="flex items-center gap-1.5 text-neutral-800">
// 								<Icon icon="tabler:clipboard-text-filled" className="sm:w-6 sm:h-6 "/>
// 								<span className="text-sm font-medium sm:text-base">My Courses</span>
// 							</div>
// 							<div className="flex items-center gap-1.5 text-primary-500">
// 								<span className="text-xs font-medium sm:text-sm">View All</span>
// 								<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
// 							</div>
// 						</div>			
// 						<CoursePreview/>		
// 					</section>

// 					<section>
// 						<div className="flex mb-2 justify-between items-center">
// 							<div className="flex items-center gap-1.5 text-neutral-800">
// 								<Icon icon="material-symbols:login-rounded" className="sm:w-6 sm:h-6 "/>
// 								<span className="text-sm font-medium sm:text-base">Login Activity</span>
// 							</div>
// 							<div className="flex items-center gap-1.5 text-primary-500">
// 								<span className="text-xs font-medium sm:text-sm">View All</span>
// 								<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
// 							</div>
// 						</div>
// 						<LoginActivity/>
// 					</section>

// 				</div>

// 				<section>
// 					<div className="flex mb-2 justify-between items-center">
// 						<div className="flex items-center gap-1.5 text-neutral-800">
// 							<Icon icon="solar:calendar-bold" className="sm:w-6 sm:h-6 "/>
// 							<span className="text-sm font-medium sm:text-base">University Calendar</span>
// 						</div>
// 						<div className="flex items-center gap-1.5 text-primary-500">
// 							<span className="text-xs font-medium sm:text-sm">View All</span>
// 							<Icon icon="iconamoon:arrow-right-2-light" className="w-6 h-6"/>
// 						</div>
// 					</div>		
// 					<CalendarPreview/>
// 				</section>

// 			</div>

// 		</div>
// 	);
// }

// export default Dashboard;