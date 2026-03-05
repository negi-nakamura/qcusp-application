import { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";

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

				const transformed = data.activities.map((act) => {
				const lastAccessDT = DateTime.fromFormat(act.last_access, "yyyy-MM-dd | hh:mm a", { zone: "Asia/Manila" });
				const loginDT = DateTime.fromFormat(act.login_time, "yyyy-MM-dd | hh:mm a", { zone: "Asia/Manila" });
				const now = DateTime.now().setZone("Asia/Manila");

				let lastAccessDisplay;
				const diffSeconds = now.diff(lastAccessDT, "seconds").seconds;

				if (!act.logout_time && diffSeconds < 60) {
					lastAccessDisplay = "Just now";
				} else if (diffSeconds < 3600) {
					const mins = Math.floor(diffSeconds / 60);
					lastAccessDisplay = `${mins} minute${mins > 1 ? "s" : ""} ago`;
				} else if (diffSeconds < 86400) {
					const hours = Math.floor(diffSeconds / 3600);
					lastAccessDisplay = `${hours} hour${hours > 1 ? "s" : ""} ago`;
				} else if (diffSeconds < 172800) {
					lastAccessDisplay = "Yesterday";
				} else {
					lastAccessDisplay = lastAccessDT.toFormat("LLL dd, yyyy");
				}

				return {
					id: act.session_id.toString().padStart(6, "0"),
					location: act.city ? `${act.city}, ${act.country || "Unknown"}` : "Unknown",
					ip: act.ip_address,
					browser: act.browser,
					device: act.device,
					os: act.os,
					lastAccess: lastAccessDisplay,
					created: loginDT.toFormat("LLL dd, yyyy hh:mm a"),
				};
				});

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
		<div className="flex justify-center items-center h-40 text-gray-500">
			Loading login activity...
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

	if (activities.length === 0) {
		return (
		<div className="flex justify-center items-center h-40 text-gray-500">
			No login activity available.
		</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px] items-center flex flex-col mb-10">

			{/* Title */}
			<h1 className="mb-3 sm:mb-4 font-semibold flex items-center justify-center gap-3 text-gray-800 mt-4 sm:mt-5">

				<div className="flex flex-col items-center">
					<span className="wrap-break-words mb-1 text-xl sm:text-xl block sm:inline font-semibold text-primary-500">Account Login Activity</span>
					<span className="wrap-break-words text-[13px] sm:text-base block font-normal text-center text-neutral-300">View all recorded login sessions and account activities related to your account.</span>
				</div>

			</h1>

			<div className="overflow-x-auto bg-neutral-50 shadow-lg rounded-lg w-full max-w-[1000px]">
				<table className="min-w-full text-sm text-left">
				<thead className="bg-neutral-50 text-gray-700 uppercase text-xs sm:text-sm">
					<tr>
					<th className="px-4 py-3">ID</th>
					<th className="px-4 py-3">Location & IP</th>
					<th className="px-4 py-3">Browser & Device</th>
					<th className="px-4 py-3">Last Access</th>
					<th className="px-4 py-3">Login Time</th>
					</tr>
				</thead>
				<tbody>
					{activities.map((session, idx2) => (
						<tr key={idx2} className={idx2 % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
							<td className="px-4 py-3 font-semibold text-gray-700 ">{session.id}</td>
							<td className="px-4 py-3">
								<div className="font-medium text-gray-800">{session.location}</div>
								<div className="text-gray-500 text-xs">{session.ip}</div>
							</td>
							<td className="px-4 py-3">
								<div className="font-medium text-gray-800">{session.browser}</div>
								<div className="text-gray-500 text-xs">{session.device} ({session.os})</div>
							</td>
							<td className="px-4 py-3 text-gray-600">{session.lastAccess}</td>
							<td className="px-4 py-3 text-gray-600">{session.created}</td>
						</tr>
					))}
				</tbody>
				</table>
			</div>
		</div>
	);

}
export default LoginActivity;