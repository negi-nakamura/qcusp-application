import { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";
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
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px] flex flex-col mb-10 mt-5">
				<div className="mb-2 sm:mb-4 self-start flex items-center gap-2 animate-pulse">
					<div className="hidden sm:block w-7 h-7 bg-gray-200 rounded-full"></div>
					<div className="h-6 w-60 bg-gray-200 rounded"></div>
				</div>

				<div className="overflow-x-auto bg-neutral-50 shadow-lg rounded-lg w-full max-w-[1000px]">
					<table className="min-w-full text-sm text-left">
						<thead className="bg-neutral-50 text-gray-700 uppercase text-xs sm:text-sm">
							<tr>
								<th className="hidden sm:block px-4 py-3 text-neutral-50">ID</th>
								<th className="px-4 py-3 text-neutral-50">Location & IP</th>
								<th className="px-2 py-3 sm:px-4 text-neutral-50">Browser & Device</th>
								<th className="px-4 py-3 text-neutral-50">Last Access</th>
								<th className="hidden sm:block px-4 py-3 text-neutral-50">Login Time</th>
							</tr>
						</thead>
						<tbody>
							{[...Array(9)].map((_, idx) => (
								<tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
									<td className="hidden sm:block px-4 py-3">
										<div className="h-4 bg-gray-200 w-14 rounded animate-pulse"></div>
									</td>
									<td className="px-4 py-3">
										<div className="h-4 bg-gray-200 w-3/4 mb-1 rounded animate-pulse"></div>
										<div className="h-3 bg-gray-300 w-1/2 rounded animate-pulse"></div>
									</td>
									<td className="px-2 py-3 sm:px-4">
										<div className="h-4 bg-gray-200 w-1/2 mb-1 rounded animate-pulse"></div>
										<div className="h-3 bg-gray-300 w-3/4 rounded animate-pulse"></div>
									</td>
									<td className="hidden sm:table-cell px-4 py-3">
										<div className="h-4 bg-gray-200 w-20 rounded animate-pulse"></div>
									</td>
									<td className="hidden sm:table-cell px-4 py-3">
										<div className="h-4 bg-gray-200 w-24 rounded animate-pulse"></div>
									</td>

									{/* mobile combined */}
									<td className="sm:hidden px-4 py-2">
										<div className="h-4 bg-gray-200 w-20 mb-1 rounded animate-pulse"></div>
										<div className="h-3 bg-gray-300 w-24 rounded animate-pulse"></div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
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

	if (activities.length === 0) {
		return (
		<div className="flex justify-center items-center h-40 text-gray-500">
			No login activity available.
		</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px] items-center flex flex-col mb-10">

			{/* Title */}
			<div className="mb-2 sm:mb-4 self-start">
				<h1 className="text-[18px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
					<Icon
						icon="material-symbols:login-rounded"
						width={24}
						height={24}
						className="hidden sm:w-7 sm:h-7 sm:block text-neutral-800"
					/>
					<span className="wrap-break-words">Account Login Activity</span>
				</h1>
			</div>

			<div className="overflow-x-auto bg-neutral-50 shadow-lg rounded-lg w-full max-w-[1000px]">
				<table className="min-w-full text-sm text-left">
				<thead className="bg-neutral-50 text-gray-700 uppercase text-xs sm:text-sm">
					<tr>
					<th className="hidden sm:block px-4 py-3">ID</th>
					<th className="px-4 py-3">Location & IP</th>
					<th className="px-2 py-3 sm:px-4">Browser & Device</th>
					<th className="px-4 py-3">Last Access</th>
					<th className="hidden sm:block px-4 py-3">Login Time</th>
					</tr>
				</thead>
				<tbody>
					{activities.map((session, idx2) => (
						<tr key={idx2} className={idx2 % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
							<td className="hidden sm:block px-4 py-3 font-semibold text-gray-700 ">{session.id}</td>
							<td className="px-4 py-3">
								<div className="font-medium text-gray-800">{session.location}</div>
								<div className="text-gray-500 text-xs">{session.ip}</div>
							</td>
							<td className="px-2 py-3 sm:px-4">
								<div className="font-medium text-gray-800">{session.browser}</div>
								<div className="text-gray-500 text-xs">{session.device} ({session.os})</div>
							</td>

							{/* desktop */}
							<td className="hidden sm:table-cell px-4 py-3 text-gray-600">
								{session.lastAccess}
							</td>
							<td className="hidden sm:table-cell px-4 py-3 text-gray-600">
								{session.created}
							</td>

							{/* mobile combined */}
							<td className="sm:hidden px-4 py-2">
								<div className="text-gray-800 text-sm">
									{session.lastAccess}
								</div>
								<div className="text-gray-500 text-xs">
									Login: {session.created}
								</div>
							</td>
						</tr>
					))}
				</tbody>
				</table>
			</div>
		</div>
	);

}
export default LoginActivity;