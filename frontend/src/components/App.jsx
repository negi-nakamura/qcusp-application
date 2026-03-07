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

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL

function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
}

function AppContent() {
	const location = useLocation();
	const isLoginPage = location.pathname === "/login";
	const isLoginActivity = location.pathname === "/login_activity";
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
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
			{!isLoginPage && <Header setUser={setUser} profile={profile} />}

			<main className="grow flex justify-center">
				<Routes>
					<Route path="/login" element={<Login setUser={setUser}/>} />
            		<Route path="/" element={<Dashboard />} />	
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
