import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function LoginActivityPreview() {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchActivities = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await axios.get("/api/session/activities?limit=2"); 
			const data = response.data;

			const transformed = data.activities.map((act) => ({
				location: act.city ? `${act.city}, ${act.country || "Unknown"}` : "Unknown",
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
			<div className="flex flex-col w-full gap-2 bg-neutral-50 p-2 shadow-lg rounded-lg max-h-[300px] sm:h-full flex-2">
				
				{[...Array(2)].map((_, idx) => (
					<section
						key={idx}
						className="grid grid-cols-2 gap-4 gap-y-2 bg-white shadow-sm rounded-lg p-3 flex-1 items-center animate-pulse"
					>

						{/* Column 1 */}
						<div className="flex flex-col space-y-1">
							<div className="h-3 w-24 bg-gray-300 rounded"></div>
							<div className="h-3 w-20 bg-gray-200 rounded"></div>
						</div>

						{/* Column 2 */}
						<div className="flex flex-col space-y-1">
							<div className="h-3 w-16 bg-gray-300 rounded"></div>
							<div className="h-3 w-20 bg-gray-200 rounded"></div>
						</div>

						{/* Column 3 */}
						<div className="flex flex-col space-y-1">
							<div className="h-3 w-20 bg-gray-300 rounded"></div>
							<div className="h-3 w-28 bg-gray-200 rounded"></div>
						</div>

						{/* Column 4 */}
						<div className="flex flex-col space-y-1">
							<div className="h-3 w-24 bg-gray-300 rounded"></div>
							<div className="h-3 w-16 bg-gray-200 rounded"></div>
						</div>

					</section>
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

	if (activities.length === 0) {
		return (
		<div className="flex justify-center items-center h-32 text-gray-500">
			No login activity available.
		</div>
		);
	}

	return (
		<div className="flex flex-col w-full gap-2 bg-neutral-50 p-2 shadow-lg rounded-lg max-h-[300px] sm:h-full flex-2">
			{activities.map((session, idx) => (
				<section key={idx} className="grid grid-cols-2 gap-4 gap-y-2 bg-white shadow-sm hover:shadow-md transition rounded-lg p-3 flex-1 items-center">

				{/* Column 1: Location */}
				<div className="flex flex-col text-[12px] sm:text-sm">
					<p className="font-semibold text-gray-800">{session.location}</p>
					<p className="text-gray-500">{session.ip}</p>
				</div>

				{/* Column 2: Session ID */}
				<div className="flex flex-col text-[12px] sm:text-sm">
					<p className="font-semibold text-gray-700">Session ID</p>
					<p className="text-gray-500">{session.session_id}</p>
				</div>

				{/* Column 3: Device Info */}
				<div className="flex flex-col text-[12px] sm:text-sm">
					<p className="font-semibold text-gray-700">{session.os}</p>
					<p className="text-gray-500">{session.browser} ({session.device})</p>
				</div>

				{/* Column 4: Activity Time */}
				<div className="flex flex-col text-[12px] sm:text-sm">
					<p className="font-semibold text-gray-700">{session.lastAccessed}</p>
					<p className="text-gray-500">Last Access</p>
				</div>
				</section>
			))}

			{ activities.length == 1 && <section className="grid grid-cols-2 gap-4gap-y-2 rounded-lg p-3 flex-1 items-center"></section>}
		</div>
	);
}

export default LoginActivityPreview;