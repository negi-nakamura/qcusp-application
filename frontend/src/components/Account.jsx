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
		<section className="absolute right-0 top-13.5 w-full max-w-[250px] sm:max-w-[360px] px-3 z-30" style={{ display: dropdownOpen ? "block" : "none" }} onClick={(e) => e.stopPropagation()}>
		<div className="bg-neutral-50 rounded-lg shadow-[0_0_10px_rgba(0,0,5,0.25)] overflow-hidden">

			{/* MAIN MENU */}
			{view === "main" && (
			<div>
				{/* Profile Card */}
				<div className="flex items-center w-full px-4 py-3 gap-3 bg-neutral-50 rounded-b-none rounded-t-lg">
				<img src={profile.profile_image_url} alt={`${profile.first_name} ${profile.last_name}`} className="w-12 h-12 rounded-full object-cover border border-gray-300" />
				<div className="flex flex-col overflow-hidden">
					<p className="font-semibold text-gray-800 truncate">{`${profile.first_name} ${profile.last_name}`}</p>
					<p className="text-sm text-gray-500 truncate">{profile.student_number}</p>
				</div>
				</div>

				<hr className="border-t mx-3 text-neutral-200" />

				{/* Settings Button */}
				<button onClick={() => setView("settings")} className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-600 hover:bg-neutral-100 cursor-pointer">
				<div className="flex items-center gap-2"><Icon icon="material-symbols:settings" width={25} /><span>Settings</span></div>
				<Icon icon="weui:arrow-filled" width={15} />
				</button>

				<hr className="border-t mx-3 text-neutral-200" />

				{/* Logout */}
				<button onClick={logout} className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-neutral-100 cursor-pointer">
				<Icon icon="material-symbols:logout" width={25} className="mr-2" /><span>Logout</span>
				</button>
			</div>
			)}

			{/* SETTINGS MENU */}
			{view === "settings" && securityView === "main" && (
			<div>
				<button onClick={() => setView("main")} className="flex items-center px-4 py-3 font-medium text-gray-500 text-sm hover:bg-neutral-100 cursor-pointer">
				<Icon icon="material-symbols:arrow-back" width={22} className="mr-2" />Back
				</button>

				<hr className="border-t mx-3 text-neutral-200" />

				<NavLink to="/profile" className="flex items-center justify-between w-full px-4 py-3 font-medium text-gray-600 hover:bg-neutral-100 cursor-pointer" onClick={closeDropdown}>
				<div className="flex items-center gap-2"><Icon icon="material-symbols:person" width={25} /><span>Profile</span></div>
				</NavLink>

				<button onClick={() => setSecurityView("security")} className="flex items-center justify-between w-full px-4 py-3 font-medium text-gray-600 hover:bg-neutral-100 cursor-pointer">
				<div className="flex items-center gap-2"><Icon icon="material-symbols:lock" width={25} /><span>Security</span></div>
				<Icon icon="weui:arrow-filled" width={15} />
				</button>
			</div>
			)}

			{/* SECURITY SUB-MENU */}
			{securityView === "security" && (
			<div>
				<button onClick={() => setSecurityView("main")} className="flex items-center px-4 py-3 font-medium text-gray-500 text-sm hover:bg-neutral-100 cursor-pointer">
				<Icon icon="material-symbols:arrow-back" width={22} className="mr-2" />Back
				</button>

				<hr className="border-t mx-3 text-neutral-200" />

				<NavLink to="/login_activity" className="flex items-center justify-between w-full px-4 py-3 font-medium text-gray-600 hover:bg-neutral-100 cursor-pointer" onClick={closeDropdown}>
				<div className="flex items-center gap-2"><Icon icon="material-symbols:history" width={25} /><span>Login Activity</span></div>
				</NavLink>
			</div>
			)}

		</div>
		</section>
	);
}

export default Account;