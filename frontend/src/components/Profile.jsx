import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function Profile() {
	// const [activities, setActivities] = useState([]);
	// const [loading, setLoading] = useState(false);
	// const [error, setError] = useState(null);

	// if (loading) {
	// 	return (
	// 	<div className="flex justify-center items-center h-40 text-gray-500">
	// 		Loading login activity...
	// 	</div>
	// 	);
	// }

	// if (error) {
	// 	return (
	// 	<div className="flex justify-center items-center h-40 text-red-500">
	// 		{error}
	// 	</div>
	// 	);
	// }

	// if (activities.length === 0) {
	// 	return (
	// 	<div className="flex justify-center items-center h-40 text-gray-500">
	// 		No login activity available.
	// 	</div>
	// 	);
	// }

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px] items-center flex flex-col mb-5">

			{/* Title */}
			<h1 className="mb-3 sm:mb-4 font-semibold flex items-center justify-center gap-3 text-gray-800 mt-4 sm:mt-5">

				<div className="flex flex-col items-center">
					<span className="wrap-break-words mb-1 text-xl sm:text-xl block sm:inline font-semibold text-primary-500">Personal Information</span>
					<span className="wrap-break-words text-[13px] sm:text-base block font-normal text-center text-neutral-300">Access and view all your student profile details and account information.</span>
				</div>

			</h1>

			<div className=" space-y-0.5 w-full max-w-[600px] py-2">

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5 rounded-t-2xl">
					<Icon icon="solar:camera-bold" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div className="flex items-center justify-between flex-1">
						<p className="text-neutral-800 font-semibold text-sm">Profile Image</p>
						<img src="https://res.cloudinary.com/djbdsrwcz/image/upload/v1772728195/profile_1.jpg" alt="Profile Image" width={60} className="rounded-4xl" />
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="material-symbols:person" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Name</p>
						<p className="text-neutral-500 text-sm">Christian Postrado Regalado</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="tabler:id-filled" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Student Number</p>
						<p className="text-neutral-500 text-sm">250333</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="fa7-solid:id-card-alt" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Learner Reference Number</p>
						<p className="text-neutral-500 text-sm">012345678910</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="boxicons:book-filled" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Course Program</p>
						<p className="text-neutral-500 text-sm">Bachelor of Science in Information Technology</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="ic:round-email" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div className="flex-1 min-w-0">
						<p className="text-neutral-800 font-semibold text-sm">Email Address</p>
						<p className="text-neutral-500 text-sm truncate">regaladochristian@gmail.com</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="tdesign:home-filled" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Home Address</p>
						<p className="text-neutral-500 text-sm">J.P. Rizal Street, Bagong Silangan, Quezon City</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="mynaui:telephone-out-solid" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Contact Number</p>
						<p className="text-neutral-500 text-sm">09123456789</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5 rounded-b-2xl">
					<Icon icon="mingcute:cake-fill" width={30} height={30} className="text-neutral-600 flex-shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Birthday</p>
						<p className="text-neutral-500 text-sm">12/16/2006</p>
					</div>
				</section>

			</div>

		</div>
	);

}
export default Profile;