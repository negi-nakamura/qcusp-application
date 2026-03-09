import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Course from "./Course";
import Grades from "./Grades";
import UniversityCalendar from "./UniversityCalendar";
import Spinner from "./Spinner";
import Dashboard from "./Dashboard";
import LoginActivity from "./LoginActivity";
import News from "./News";
import Profile from "./Profile";
import ScrollToTop from "./ScrollToTop"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL

function App() {
	return (
		<BrowserRouter>
			<AppContent />
			<ScrollToTop/>
		</BrowserRouter>
	);
}

function AppContent() {
	const location = useLocation();
	const isLoginPage = location.pathname === "/login";
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true)
				setProfile(null)
				setUser(null)
				setError(null)
				
				const response = await axios.get("/api/auth/me");
				setUser(response.data.user);

				if (response.data.user.role === "student") {
					const profileResponse = await axios.get("/api/profile");
					setProfile(profileResponse.data.profile);
				} else {
					setProfile(null); 
				}
			} catch (err) {
				setUser(null);
				setProfile(null);
				setError(err.response.data.message);
			} finally {
				setLoading(false);
			}		
		};
		fetchUser();
	}, []);

	if (loading) {
		return <Spinner size={15} text="Loading..." />;
	}

	if (!user && !isLoginPage) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (user && isLoginPage) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="min-h-screen flex flex-col">

			{!isLoginPage && (profile ? ( <Header setUser={setUser} setProfile={setProfile} profile={profile} />) : 
			(
				//Header Skeleton
				<div className="bg-primary-500 h-15 flex items-center justify-between px-5 lg:px-20">
					<div className="flex gap-8">
						<div className="w-10 h-10 bg-gray-200 rounded-4xl animate-pulse" />
						<div className="hidden md:flex gap-7 items-center">
						{Array(4)
							.fill(0)
							.map((_, idx) => (
							<div key={idx} className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
							))}
						</div>
					</div>

					<div className="flex gap-5 items-center">
						<div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
						<div className="w-8 h-8 bg-gray-200 rounded animate-pulse md:hidden"></div>
					</div>
				</div>
			)
			)}

			<main className="grow flex justify-center">
				<Routes>
					<Route path="/login" element={<Login setUser={setUser} setProfile={setProfile} />} />
            		<Route path="/" element={<Dashboard/>} />	
					<Route path="/courses" element={<Course />} />
					<Route path="/grades" element={<Grades/>} />
					<Route path="/calendar" element={<UniversityCalendar />} />
					<Route path="/profile" element={<Profile/>} />
					<Route path="/settings" element={<h1>Settings</h1>} />
					<Route path="/login_activity" element={<LoginActivity/>} />
					<Route path="/news" element={<News/>} />
					<Route path="*" element={<h1>404 Not Found</h1>} />
				</Routes>
			</main>

			{!isLoginPage && <Footer />}

		</div>
	);
}

export default App;