import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import Account from "./Account";

function Header({ setUser }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const logout = async () => {
		setLoading(true);
		try {
			await axios.post("/api/auth/logout");
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setLoading(false);
			setUser(null);
			setDropdownOpen(false);
			setMenuOpen(false);
			navigate("/login");
		}
	};

  	// Disable body scroll when mobile nav is open
	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "auto";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [menuOpen]);

	const desktopNavClass = ({ isActive }) =>
		`flex justify-center items-center gap-1 transition ${
		isActive 
			? "text-accent-400 font-semibold" 
			: "text-white"
		}`;

	const mobileNavClass = ({ isActive }) =>
		`flex items-center gap-2 border-b border-[#DCDCE4] py-2 transition ${
		isActive
			? "text-primary-600 font-semibold"
			: "text-neutral-900"
		}`;

	return (
		<header className="bg-primary-500 h-15 flex items-center justify-between px-5 lg:px-20 sticky top-0 z-50">
		
			{/* Left Section */}
			<div className="flex gap-8">
				<NavLink to="/">
					<img
						src="/src/assets/qcu_logo.png"
						alt="Quezon City University Logo"
						className="w-10"
					/>
				</NavLink>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex gap-7">
					<NavLink to="/" end className={desktopNavClass}>
						<Icon icon="material-symbols:dashboard" width={20} height={20} />
						<span className="text-lg">Dashboard</span>
					</NavLink>

					<NavLink to="/courses" className={desktopNavClass}>
						<Icon icon="flowbite:book-solid" width={20} height={20} />
						<span className="text-lg">Courses</span>
					</NavLink>

					<NavLink to="/grades" className={desktopNavClass}>
						<Icon icon="tabler:clipboard-text-filled" width={20} height={20} />
						<span className="text-lg">Grades</span>
					</NavLink>

					<NavLink to="/calendar" className={desktopNavClass}>
						<Icon icon="solar:calendar-bold" width={20} height={20} />
						<span className="text-lg">Calendar</span>
					</NavLink>
				</nav>
			</div>

			{/* Right Section */}
			<div className="flex gap-5 items-center">
				<div className="flex items-center mr-10 md:mr-0 relative cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
					<div className="overflow-hidden rounded-full border border-white w-8">
						<img src="/src/assets/default_profile.jpg" alt="Default Profile"/>
					</div>
					<Icon icon={dropdownOpen ? "iconamoon:arrow-up-2" : "iconamoon:arrow-down-2"} width={24} height={24} className="text-white"/>
					<Account logout={logout} dropdownOpen={dropdownOpen} />
				</div>
			</div>

			{/* Mobile Hamburger */}
			<button onClick={() => setMenuOpen(!menuOpen)} className="fixed top-3.5 right-5 z-50 md:hidden">
				<img src={ menuOpen ? "/src/assets/hamburger_close.svg" : "/src/assets/hamburger_menu.svg" } alt="Menu" width={32} height={32}/>
			</button>

			{/* Mobile Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full w-64 bg-white z-40 transform transition-transform duration-300 md:hidden ${
				menuOpen 
					? "translate-x-0" 
					: "translate-x-full"
				}`}
			>
				<nav className="flex flex-col px-6 pt-20">
					<NavLink
						to="/"
						end
						onClick={() => setMenuOpen(false)}
						className={mobileNavClass}
					>
						<Icon icon="material-symbols:dashboard" width={20} />
						<span className="text-xl">Dashboard</span>
					</NavLink>

					<NavLink
						to="/courses"
						onClick={() => setMenuOpen(false)}
						className={mobileNavClass}
					>
						<Icon icon="flowbite:book-solid" width={20} />
						<span className="text-xl">Courses</span>
					</NavLink>

					<NavLink
						to="/grades"
						onClick={() => setMenuOpen(false)}
						className={mobileNavClass}
					>
						<Icon icon="tabler:clipboard-text-filled" width={20} />
						<span className="text-xl">Grades</span>
					</NavLink>

					<NavLink
						to="/calendar"
						onClick={() => setMenuOpen(false)}
						className={mobileNavClass}
					>
						<Icon icon="solar:calendar-bold" width={20} />
						<span className="text-xl">Calendar</span>
					</NavLink>
				</nav>
			</div>

			{/* Overlay */}
			{menuOpen && (
				<div className="fixed inset-0 bg-[rgba(68,68,102,0.5)] backdrop-blur-sm z-30 md:hidden" onClick={() => setMenuOpen(false)}/>
			)}

			{loading && <Spinner size={15} text="Logging out..." />}

		</header>
	);
}

export default Header;