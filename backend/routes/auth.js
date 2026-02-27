import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";
import { formatDateToObject } from "../utils/dateFormatter.js";

const router = express.Router();

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	maxAge: 30 * 24 * 60 * 60 * 1000
};

function generateToken(user, sessionId) {
	const payload = { id: user.id, role: user.role, session_id: sessionId };
	if (user.role === "student") payload.student_id = user.student_id;
	if (user.role === "admin") payload.admin_id = user.admin_id;
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
}

router.post("/register", async (req, res) => {
	const { student_id, admin_id, password, role } = req.body;

	if ( !password || !role || (role === "student" && !student_id) || (role === "admin" && !admin_id) ) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	const userExists = await pool.query(
		"SELECT * FROM users WHERE (student_id = $1 AND role = $2) OR (admin_id = $3 AND role = $4)",
		[student_id, "student", admin_id, "admin"],
	);

	if (userExists.rows.length > 0) {
		return res.status(400).json({ message: "User already exists" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await pool.query(
		"INSERT INTO users (student_id, admin_id, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
		[
			role === "student" ? student_id : null,
			role === "admin" ? admin_id : null,
			hashedPassword,
			role,
		],
	);

	const response = {
		id: newUser.rows[0].id,
		...(role === "student" ? { student_id: newUser.rows[0].student_id } : { admin_id: newUser.rows[0].admin_id }),
		role: newUser.rows[0].role,
		created_at: formatDateToObject(newUser.rows[0].created_at),
	};

	res.status(201).json({ message: "User registered successfully", user: response });
});

router.post("/login", async (req, res) => {
	const { student_id, admin_id, password, role } = req.body;

	if (!password || !role || (role === "student" && !student_id) || (role === "admin" && !admin_id)) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	const userQuery = await pool.query(
		"SELECT * FROM users WHERE (student_id = $1 AND role = $2) OR (admin_id = $3 AND role = $4)",
		[student_id, "student", admin_id, "admin"]
	);

	if (userQuery.rows.length === 0) {
		return res.status(400).json({ message: "Invalid credentials" });
	}

	const user = userQuery.rows[0];
	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

	let activeSessionQuery = await pool.query(`
		SELECT s.id
		FROM sessions s
		LEFT JOIN user_activities ua 
		ON ua.session_id = s.id AND ua.activity_type = 'logout'
		WHERE s.user_id = $1 AND s.ip_address = $2 AND s.user_agent = $3
		GROUP BY s.id
		HAVING COUNT(ua.id) = 0`,
		[user.id, req.ip, req.headers["user-agent"]]
	);

	let sessionId;

	if (activeSessionQuery.rows.length > 0) {
		sessionId = activeSessionQuery.rows[0].id;

		await pool.query(
			"INSERT INTO user_activities (session_id, activity_type) VALUES ($1, 'login')",
			[sessionId]
		);
	} else {
		const newSession = await pool.query(
			"INSERT INTO sessions (user_id, ip_address, user_agent) VALUES ($1, $2, $3) RETURNING id",
			[user.id, req.ip, req.headers["user-agent"]]
		);

		sessionId = newSession.rows[0].id;

		await pool.query(
			"INSERT INTO user_activities (session_id, activity_type) VALUES ($1, 'login')",
			[sessionId]
		);
	}

	const response = {
		id: user.id,
		...(role === "student" ? { student_id: user.student_id } : { admin_id: user.admin_id }),
		role: user.role,
		created_at: formatDateToObject(user.created_at),
		session_id: sessionId
	};

	const token = generateToken(response, sessionId);
	res.cookie("token", token, cookieOptions);
	res.json({ message: "Login successful", user: response });
});

router.post("/logout", authenticateToken, async (req, res) => {
	const sessionId = req.user.session_id;

	try {
		await pool.query(
			"INSERT INTO user_activities (session_id, activity_type) VALUES ($1, 'logout')",
			[sessionId]
		);

		res.clearCookie("token", cookieOptions);
		res.json({ message: "Logout successful" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

router.get("/me", authenticateToken, async (req, res) => {
	const sessionId = req.user.session_id;

	try {
		await pool.query(
			"INSERT INTO user_activities (session_id, activity_type) VALUES ($1, 'last_access')",
			[sessionId]
		);

		res.json({ message: "User retrieved successfully", user: req.user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;