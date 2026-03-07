import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";
import { formatDateToObject } from "../utils/dateFormatter.js";

const router = express.Router();

router.get("/profile", authenticateToken, async (req, res) => {
	try {
		const userId = req.user.id;

		const profileQuery = `
			SELECT 
				u.id AS user_id,
				u.role,
				s.id AS student_id,
				s.first_name,
				s.middle_name,
				s.last_name,
				s.student_number,
				s.learner_reference_number,
				s.email,
				s.profile_image_url,
				s.home_address,
				s.contact_number,
				s.birthday,
				s.created_at AS student_created,
				c.course_name AS course
			FROM users u
			LEFT JOIN students s
				ON u.student_id = s.student_number
			LEFT JOIN courses c
				ON s.course_id = c.id
			WHERE u.id = $1
		`;

		const result = await pool.query(profileQuery, [userId]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Profile not found" });
		}

		const profile = result.rows[0];

		const formattedProfile = {
			...profile,
			birthday: profile.birthday ? formatDateToObject(profile.birthday).date : null
		};

		res.json({ profile: formattedProfile });

	} catch (err) {
		console.error("Error fetching profile:", err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;