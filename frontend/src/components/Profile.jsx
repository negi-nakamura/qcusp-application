import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function Profile() {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true)
				const response = await axios.get(`/api/profile`);
				console.log("Fetched profile:", response.data.profile);
				setProfile(response.data.profile);
				setError(null);
			} catch (error) {
				console.error("Failed to fetch profile:", error);
				setError("Failed to load profile");
			} finally {
				setLoading(false);
			}
		};
    	fetchProfile();
  	}, []);

	if (loading) {
		return (
		<div className="flex justify-center items-center h-40 text-gray-500">
			Loading personal information...
		</div>
		);
	}

	if (error) {
		return (
		<div className="flex justify-center items-center h-40 text-red-500">
			{error}
		</div>
		);
	}

	if (profile === null) {
		return (
		<div className="flex justify-center items-center h-40 text-gray-500">
			Personal information unavailable.
		</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px] items-center flex flex-col mb-5">

			{/* Title */}
			<div className="mb-2 sm:mb-4 self-start">
				<h1 className="text-[18px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
					<Icon
						icon="material-symbols:person"
						width={24}
						height={24}
						className="hidden sm:w-7 sm:h-7 sm:block text-neutral-800"
					/>
					<span className="wrap-break-words">Personal Information</span>
				</h1>
			</div>

			<div className=" space-y-0.5 w-full max-w-[1000px]">

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5 rounded-t-lg">
					<Icon icon="solar:camera-bold" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div className="flex items-center justify-between flex-1">
						<p className="text-neutral-800 font-semibold text-sm">Profile Image</p>
						<img src={profile.profile_image_url} alt="Profile Image" width={60} className="rounded-4xl" />
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="material-symbols:person" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Name</p>
						<p className="text-neutral-500 text-sm">{`${profile.first_name} ${profile != null ? profile.middle_name : ""} ${profile.last_name}`}</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="tabler:id-filled" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Student Number</p>
						<p className="text-neutral-500 text-sm">{profile.student_number}</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="fa7-solid:id-card-alt" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Learner Reference Number</p>
						<p className="text-neutral-500 text-sm">{profile.learner_reference_number}</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="boxicons:book-filled" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Course Program</p>
						<p className="text-neutral-500 text-sm">{profile.course}</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="ic:round-email" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div className="flex-1 min-w-0">
						<p className="text-neutral-800 font-semibold text-sm">Email Address</p>
						<p className="text-neutral-500 text-sm truncate">{profile.email}</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="tdesign:home-filled" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Home Address</p>
						<p className="text-neutral-500 text-sm">{profile.home_address}</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5">
					<Icon icon="mynaui:telephone-out-solid" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Contact Number</p>
						<p className="text-neutral-500 text-sm">{profile.contact_number}</p>
					</div>
				</section>

				<section className="bg-neutral-50 flex w-full items-center py-4 px-5 gap-5 rounded-b-lg">
					<Icon icon="mingcute:cake-fill" width={30} height={30} className="text-neutral-600 shrink-0" />
					<div>
						<p className="text-neutral-800 font-semibold text-sm">Birthday</p>
						<p className="text-neutral-500 text-sm">{profile.birthday}</p>
					</div>
				</section>

			</div>

		</div>
	);

}
export default Profile;