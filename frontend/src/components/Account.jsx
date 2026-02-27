import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

function Account({ logout, dropdownOpen }) {
	return ( 
		<section>
			<div className="absolute right-0 mt-10 w-50 bg-neutral-50 rounded shadow-lg py-1 z-30" style={{ display: dropdownOpen ? "block" : "none" }}>
				<Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
					<Icon icon="material-symbols:person" width={20} height={20} className="inline-block mr-2" />
					<span>Profile</span>
				</Link>
				<hr className="border-t mx-3 text-neutral-200" />
				<Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
					<Icon icon="material-symbols:settings" width={20} height={20} className="inline-block mr-2" />
					<span>Setting</span>
				</Link>
				<hr className="border-t mx-3 text-neutral-200" />
				<Link className="flex items-center px-4 py-2 text-sm text-error-600 hover:bg-gray-100" onClick={logout}>
					<Icon icon="material-symbols:logout" width={20} height={20} className="inline-block mr-2" />
					<span>Logout</span>
				</Link>
			</div>
		</section>
	);
}

export default Account;