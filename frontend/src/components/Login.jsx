import { set } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function Login({setUser}) {

	const [studentId, setStudentId] = useState("")
  	const [password, setPassword] = useState("")
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false); 
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");
		setLoading(true);

		try {
			const response = await axios.post("/api/auth/login", { 
				student_id: studentId, 
				admin_id: "", 
				password: password, 
				role: "student" 
			});
			setUser(response.data.user);
			navigate("/");
		} catch (error) {
			setUser(null);
			if (error.response && error.response.data) {
				setErrorMessage(error.response.data.message || "Login failed");
			} else if (error.request) {
				setErrorMessage("Server did not respond. Please try again later.");
			}	else {
				setErrorMessage("An error occurred. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	return ( 
		<div className="flex w-full min-h-screen items-center h-full justify-center">

			<div className="absolute inset-0 -z-10">
				<img src="/qcu_background.jpg" alt="QCU Logo" className="w-full min-h-screen h-full object-cover" />
			</div>

			<div className="absolute inset-0 -z-10 min-h-screen h-full bg-[rgba(255,255,255,0.01)] backdrop-blur-[5px]"></div>

			<div className="w-full max-w-92.5 -mt-20 sm:mt-0 pt-8 pb-5 px-8 space-y-6 bg-[rgba(243,243,255,0.9)] backdrop-blur-[3px] rounded shadow">

				<img src="/qcu_logo.png" alt="QCU Logo" className="w-24 h-24 mx-auto" />

				<div className="space-y-2">
					<h2 className="text-2xl font-semibold text-center">Quezon City University Student Portal</h2>
					<p className="text-center text-sm text-neutral-600">Sign in to your student account.</p>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-md pl-1 font-medium text-neutral-600">Student ID</label>
						<input type="text" value={studentId} onChange={(e) => { setStudentId(e.target.value); setErrorMessage(""); }} required className="w-full h-12 px-3 py-2 border rounded-[7px] focus:outline-none bg-[#F7FBFF] border-[#D4D7E3] focus:ring focus:border-primary-200" />
					</div>
					<div>
						<label className="block text-md pl-1 font-medium text-neutral-600">Password</label>
						<input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }} required className="w-full h-12 px-3 py-2 border rounded-[7px] focus:outline-none bg-[#F7FBFF] border-[#D4D7E3] focus:ring focus:border-primary-200" />
					</div>
					<div className="flex justify-end text-sm text-primary-500"><a href="">Forgot Password?</a></div>
					<button type="submit" className="w-full h-12 py-2 px-4 bg-primary-500 text-white font-semibold rounded-[7px] hover:bg-primary-700 focus:outline-none focus:ring focus:border-primary-200">{loading ? "Logging in..." : "Login"}</button>
				</form>

				{errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}

				<p className="text-center text-[12px] mt-10 text-neutral-600">© {new Date().getFullYear()} Quezon City University. All rights reserved.</p>

			</div>

		</div>
	);
}

export default Login;