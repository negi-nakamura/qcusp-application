import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function LoginActivity() {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchActivities = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await axios.get("/api/session/activities?limit=50"); 
			const data = response.data;

			const transformed = data.activities.map((act) => ({
				location: `${act.city}, ${act.country}`,
				session_id: act.session_id.toString().padStart(6, "0"),
				ip: act.ip_address,
				os: act.os,
				browser: act.browser,
				lastAccessed: act.last_access,
				device: act.device
			}));

			setActivities(transformed);
		} catch (err) {
			console.error("Failed to fetch activities:", err);
			setError("Failed to load login activity");
		} finally {
			setLoading(false);
		}
		};

		fetchActivities();
	}, []);

	if (loading) {
		return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px]">
			<div className="flex justify-center items-center h-64 text-gray-500">
			Loading activity activities...
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

	if (activities.length === 0) {
		return (
		<div className="flex justify-center items-center h-32 text-gray-500">
			No login activity available.
		</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px] items-center flex flex-col mb-10">

			{/* Title */}
			<h1 className="mb-3 sm:mb-4 font-semibold flex items-center justify-center gap-3 text-gray-800 mt-4 sm:mt-5">

				<div className="flex flex-col items-center">
					<span className="wrap-break-words text-xl sm:text-xl block sm:inline font-semibold text-primary-500">Login Activity</span>
					<span className="wrap-break-words text-sm sm:text-base block font-normal">All recorded login sessions and account activity.</span>
				</div>

			</h1>

			<div className="flex flex-col w-full gap-2 bg-neutral-50 p-2 shadow-lg rounded-lg max-w-[900px] sm:h-full">
				{activities.map((session, idx) => (
					<section
						key={idx}
						className="
							grid
							grid-cols-2
							md:grid-cols-4
							gap-4
							gap-y-2
							bg-white
							shadow-sm
							hover:shadow-md
							transition
							rounded-lg
							p-3
							items-center
						"
					>
						{/* Session ID */}
						<div className="flex flex-col text-[12px] sm:text-sm">
							<p className="font-semibold text-gray-700 md:text-gray-800">
								{session.session_id}
							</p>
							<p className="text-gray-500 md:text-xs">Session ID</p>
						</div>

						{/* Location */}
						<div className="flex flex-col text-[12px] sm:text-sm">
							<p className="font-semibold text-gray-800">{session.location}</p>
							<p className="text-gray-500">{session.ip}</p>
						</div>

						{/* Device */}
						<div className="flex flex-col text-[12px] sm:text-sm">
							<p className="font-semibold text-gray-700">{session.os}</p>
							<p className="text-gray-500">
								{session.browser} ({session.device})
							</p>
						</div>

						{/* Activity */}
						<div className="flex flex-col text-[12px] sm:text-sm">
							<p className="font-semibold text-gray-700">{session.lastAccessed}</p>
							<p className="text-gray-500">Last Access</p>
						</div>

					</section>
				))}
			</div>

		</div>
	);
}

export default LoginActivity;