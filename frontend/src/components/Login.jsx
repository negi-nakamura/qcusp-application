import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser, setProfile }) { 
	const [studentId, setStudentId] = useState("");
  	const [password, setPassword] = useState("");
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
			
			if (response.data.user.role === "student") {
				try {
					const profileResponse = await axios.get("/api/profile");
					setProfile(profileResponse.data.profile);
				} catch (profileError) {
					console.error("Error fetching profile:", profileError);
					setProfile(null);
				}
			} else {
				setProfile(null);
			}
			
			navigate("/");
		} catch (error) {
			setUser(null);
			setProfile(null);
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

			<div className="w-full min-w-80 max-w-90 mx-5 -mt-20 sm:mt-0 pt-8 pb-5 px-5 sm:px-6 space-y-6 bg-[rgba(243,243,255,0.9)] backdrop-blur-[3px] rounded shadow">

				<div className="space-y-2">
					<h2 className="text-[22px] sm:text-2xl font-semibold text-center">Quezon City University Student Portal</h2>
					<p className="text-center text-sm text-neutral-600">Sign in to your student account.</p>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-[14px] pl-1 mb-0.5 font-medium text-neutral-600">Student ID</label>
						<input type="text" value={studentId} onChange={(e) => { setStudentId(e.target.value); setErrorMessage(""); }} required className={`w-full h-12 px-3 py-2 border rounded-[7px] focus:outline-none bg-[#F7FBFF] border-[#D4D7E3] focus:ring focus:border-primary-200 ${errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-[#D4D7E3]"}`} />
					</div>
					<div>
						<label className="block text-[14px] pl-1 mb-0.5 font-medium text-neutral-600">Password</label>
						<input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }} required className={`w-full h-12 px-3 py-2 border rounded-[7px] focus:outline-none bg-[#F7FBFF] border-[#D4D7E3] focus:ring focus:border-primary-200 ${errorMessage ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-[#D4D7E3]"}`} />
					</div>
					{/* <div className="flex justify-end text-[13px] -mt-1 text-primary-500"><a href="">Forgot Password?</a></div> */}
					<button type="submit" className="w-full h-12 py-2 px-4 text-lg bg-primary-500 text-white font-semibold rounded-[7px] hover:bg-primary-700 focus:outline-none focus:ring focus:border-primary-200">{loading ? "Logging in..." : "Login"}</button>
				</form>

				{errorMessage && <p className="text-center -mt-2 text-[14px] text-red-500">{errorMessage}</p>}

				<p className="text-center text-[11px] mt-9 text-neutral-600">© {new Date().getFullYear()} Quezon City University. All rights reserved.</p>

			</div>

		</div>
	);
}

export default Login;