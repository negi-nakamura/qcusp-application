import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

function Account({ logout, dropdownOpen }) {
	return ( 
		<section className="absolute right-0 top-13.5 w-full max-w-[250px] sm:max-w-[360px] px-3 z-30" style={{ display: dropdownOpen ? "block" : "none" }}>
			<div className="bg-neutral-50 rounded-lg shadow-[0_0_10px_rgba(0,0,5,0.25)]">
				<NavLink to="/profile" className="flex items-center px-4 py-3 text-base font-medium text-gray-600">
					<Icon icon="material-symbols:person" width={25} height={25} className="inline-block mr-2" />
					<span>Profile</span>
				</NavLink>
				<hr className="border-t mx-3 text-neutral-200" />
				<NavLink to="/settings" className="flex items-center px-4 py-3 text-base font-medium text-gray-600">
					<Icon icon="material-symbols:settings" width={25} height={25} className="inline-block mr-2" />
					<span>Setting</span>
				</NavLink>
				<hr className="border-t mx-3 text-neutral-200" />
				<NavLink className="flex items-center px-4 py-3 text-base font-medium text-error-600 " onClick={logout}>
					<Icon icon="material-symbols:logout" width={25} height={25} className="inline-block mr-2" />
					<span>Logout</span>
				</NavLink>
			</div>
		</section>
	);
}

export default Account;