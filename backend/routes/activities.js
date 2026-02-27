import express from "express";
import pool from "../config/db.js";
import { formatDateToObject } from "../utils/dateFormatter.js";
import { authenticateToken } from "../middleware/auth.js";
import { UAParser } from "ua-parser-js";

const router = express.Router();

router.get("/activities", authenticateToken, async (req, res) => {
	try {
		const userId = req.user.id;

		const result = await pool.query(`
			SELECT 
				ua.id,
				ua.session_id,
				ua.activity_type,
				ua.activity_time,
				s.user_agent
			FROM user_activities ua
			JOIN sessions s ON s.id = ua.session_id
			WHERE s.user_id = $1
			ORDER BY ua.activity_time DESC`, 
			[userId]
		);

		const activities = result.rows.map(act => {
			const parser = new UAParser(act.user_agent);
			const ua = parser.getResult();
			
			let device;

			if (ua.device.type) {
				device = ua.device.type.charAt(0).toUpperCase() + ua.device.type.slice(1);
			} else if (["Windows", "Mac OS", "Linux"].includes(ua.os.name)) {
				device = "Desktop";
			} else {
				device = "Unknown";
			}

			const browser = ua.browser.name || "Unknown";
			const os = ua.os.name || "Unknown";

			const formattedDate = formatDateToObject(act.activity_time);

			return {
				id: act.id,
				session_id: act.session_id,
				type: act.activity_type,
				weekday: formattedDate.weekday,
				date: formattedDate.date,
				time: formattedDate.time,
				device,
				browser,
				os
			};
		});

		res.json({ user_id: userId, activities }); 

	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;