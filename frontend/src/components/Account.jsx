import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

function Account({ logout, dropdownOpen, setDropdownOpen, profile }) {
	const [view, setView] = useState("main");
	const [securityView, setSecurityView] = useState("main");

	useEffect(() => {
		if (!dropdownOpen) {
			setView("main");
			setSecurityView("main");
		}
	}, [dropdownOpen]);

	const closeDropdown = () => setDropdownOpen(false);

	return (
		<section
			className="absolute right-0 top-13.5 w-full max-w-[340px] sm:max-w-[360px] px-3 z-30"
			style={{ display: dropdownOpen ? "block" : "none" }}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="bg-neutral-50 rounded-lg shadow-[0_0_10px_rgba(0,0,5,0.25)] overflow-hidden text-xs">

				{/* MAIN MENU */}
				{view === "main" && (
					<div>
						{/* Profile Card */}
						<div className="flex items-center w-full px-4 py-2 gap-3 bg-neutral-50 rounded-b-none rounded-t-lg">
							<img
								src={profile?.profile_image_url || "/default_profile.jpg"}
								alt={`${profile.first_name} ${profile.last_name}`}
								className="w-12 h-12 rounded-full object-cover border border-gray-300"
							/>
							<div className="flex flex-col overflow-hidden">
								<p className="font-semibold text-[13px] text-primary-500 truncate">
									{`${profile.first_name} ${profile.middle_name == null ? "" : profile.middle_name } ${profile.last_name}`}
								</p>
								<p className="text-gray-500 truncate">
									{profile.student_number}
								</p>
							</div>
						</div>

						<hr className="border-t mx-3 text-neutral-200" />

						{/* Settings Button */}
						<button
							onClick={() => setView("settings")}
							className="flex items-center justify-between w-full px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
						>
							<div className="flex items-center gap-2">
								<Icon icon="material-symbols:settings" width={22} />
								<span>Settings</span>
							</div>
							<Icon icon="weui:arrow-filled" width={14} />
						</button>

						<hr className="border-t mx-3 text-neutral-200" />

						{/* Logout */}
						<button
							onClick={logout}
							className="flex items-center w-full px-4 pt-2 pb-3 font-medium text-red-600 hover:bg-gray-200 cursor-pointer"
						>
							<Icon icon="material-symbols:logout" width={22} className="mr-2" />
							<span>Logout</span>
						</button>
					</div>
				)}

				{/* SETTINGS MENU */}
				{view === "settings" && securityView === "main" && (
					<div>
						<button
							onClick={() => setView("main")}
							className="flex items-center px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 cursor-pointer"
						>
							<Icon icon="material-symbols:arrow-back" width={20} className="mr-2" />
							Back
						</button>

						<hr className="border-t mx-3 text-neutral-200" />

						<NavLink
							to="/profile"
							className="flex items-center justify-between w-full px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
							onClick={closeDropdown}
						>
							<div className="flex items-center gap-2">
								<Icon icon="material-symbols:person" width={22} />
								<span>Profile</span>
							</div>
						</NavLink>

						<button
							onClick={() => setSecurityView("security")}
							className="flex items-center justify-between w-full px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
						>
							<div className="flex items-center gap-2">
								<Icon icon="material-symbols:lock" width={22} />
								<span>Security</span>
							</div>
							<Icon icon="weui:arrow-filled" width={14} />
						</button>
					</div>
				)}

				{/* SECURITY SUB-MENU */}
				{securityView === "security" && (
					<div>
						<button
							onClick={() => setSecurityView("main")}
							className="flex items-center px-4 py-2 font-medium text-gray-500 hover:bg-gray-200 cursor-pointer"
						>
							<Icon icon="material-symbols:arrow-back" width={20} className="mr-2" />
							Back
						</button>

						<hr className="border-t mx-3 text-neutral-200" />

						<NavLink
							to="/login_activity"
							className="flex items-center justify-between w-full px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
							onClick={closeDropdown}
						>
							<div className="flex items-center gap-2">
								<Icon icon="material-symbols:history" width={22} />
								<span>Login Activity</span>
							</div>
						</NavLink>
					</div>
				)}

			</div>
		</section>
	);
}

export default Account;