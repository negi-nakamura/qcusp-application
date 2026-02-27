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

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL
//axios.defaults.baseURL = "https://qcuspbackend.vercel.app"
//axios.defaults.baseURL = "http://192.168.111.15:5000";

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
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios.get("/api/auth/me");
				setUser(response.data.user);
			} catch (err) {
				setUser(null);
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
			{!isLoginPage && <Header setUser={setUser} />}

			<main className="grow flex justify-center">
				<Routes>
					<Route path="/login" element={<Login setUser={setUser}/>} />
            		<Route path="/" element={<Dashboard />} />	
					<Route path="/courses" element={<Course />} />
					<Route path="/grades" element={<Grades/>} />
					<Route path="/calendar" element={<UniversityCalendar />} />
					<Route path="/profile" element={<h1>Profile</h1>} />
					<Route path="/settings" element={<h1>Settings</h1>} />
					<Route path="*" element={<h1>404 Not Found</h1>} />
				</Routes>
			</main>

			{!isLoginPage && <Footer />}
		</div>
	);
}

export default App;
