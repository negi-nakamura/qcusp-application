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

			const response = await axios.get("/api/session/activities?limit=2"); 
			const data = response.data;

			const transformed = data.activities.map((act) => ({
				location: `${act.city}, ${act.country}`,
				session_id: act.session_id.toString().padStart(6, "0"),
				ip: act.ip_address,
				os: act.os,
				browser: act.browser,
				lastAccessed: act.formattedDate,
				type: act.type,
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
		<div className="flex flex-col w-full gap-2 bg-neutral-50 p-2 shadow-lg rounded-lg max-h-[300px] sm:h-full ">
		{activities.map((session, idx) => (
			<section
			key={idx}
			className="
				grid 
				grid-cols-2 
				gap-4
				gap-y-2 
				bg-white 
				shadow-sm 
				hover:shadow-md 
				transition 
				rounded-lg 
				p-3
				flex-1
				items-center
			"
			>
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
				<p className="text-gray-500">{session.type == "last_access"? "Last Access" : session.type.charAt(0).toUpperCase() + session.type.slice(1)}</p>
			</div>
			</section>
		))}
		</div>
	);
}

export default LoginActivity;