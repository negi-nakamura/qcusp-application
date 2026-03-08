import NewsPreview from "./NewsPreview";
import LoginActivityPreview from "./LoginActivityPreview";
import CoursePreview from "./CoursePreview";
import CalendarPreview from "./CalendarPreview";
import GradePreview from "./GradePreview"
import WelcomeBanner from "./WelcomeBanner";

function Dashboard() {
	return (

		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px]">

			{/*Welcome Banner*/}
			<WelcomeBanner/>

			{/*Announcements*/}
			<div className="mb-5">
				<NewsPreview />
			</div>

			{/*Grades and Login*/}
			<div className="grid grid-cols-1 lg:grid-cols-2 mb-5 gap-5 sm:gap-7 ">

				<section className="flex flex-col h-full">
					<GradePreview/>
				</section>

				<section className="flex flex-col h-full">
					<LoginActivityPreview/>
				</section>

			</div>

			{/*Courses and Calendar*/}
			<div className="grid grid-cols-1 lg:grid-cols-2 mb-5 gap-5 sm:gap-7"> 
				
				<section className="flex flex-col h-full">	
					<CoursePreview/>		
				</section>

				<section className="flex flex-col h-full">	
					<CalendarPreview/>
				</section>

			</div>

		</div>
	);
}

export default Dashboard;