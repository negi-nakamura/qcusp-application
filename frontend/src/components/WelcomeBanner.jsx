import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function WelcomeBanner() {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true)
				const response = await axios.get(`/api/profile`);
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
			<div className="flex items-center gap-3 mb-5 sm:mb-8 animate-pulse mt-4 sm:mt-5">
				{/* Icon Skeleton */}
				<div className="hidden sm:block w-8 h-8 bg-gray-200 rounded-full"></div>

				{/* Text Skeleton */}
				<div className="flex flex-col gap-1 w-full max-w-[60%]">
					<div className="h-5 w-3/4 bg-gray-200 rounded"></div>
					<div className="h-4 w-1/2 bg-gray-200 rounded"></div>
				</div>
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

		<h1 className="mb-5 sm:mb-8 font-semibold flex items-center gap-3 text-gray-800 mt-4 sm:mt-5">

			<Icon icon="mdi:hand-wave" className="sm:w-8 sm:h-8 hidden sm:block text-neutral-800"/>
			<div>
				<span className="wrap-break-words text-xl sm:text-xl block sm:inline font-semibold text-primary-500"> {`${profile.first_name} ${profile.middle_name == null ? "" : profile.middle_name } ${profile.last_name}`}</span>
				<span className="wrap-break-words text-xs sm:text-base block font-normal">{profile.student_number} | {profile.course}</span>
			</div>

		</h1>

	);

}
export default WelcomeBanner;