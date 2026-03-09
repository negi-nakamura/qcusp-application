import express from "express";
import pool from "../config/db.js";
import { formatDateToObject } from "../utils/dateFormatter.js";
import { authenticateToken } from "../middleware/auth.js";
import { UAParser } from "ua-parser-js";

const router = express.Router();

router.get("/activities", authenticateToken, async (req, res) => {
	try {
		const userId = req.user.id;
		const limit = parseInt(req.query.limit) || 10;

	const result = await pool.query(
		`
		SELECT 
			id,
			ip_address,
			user_agent,
			country,
			region,
			city,
			created_at,
			last_access,
			logout_time
		FROM sessions
		WHERE user_id = $1
		ORDER BY last_access DESC, created_at DESC
		LIMIT $2
		`,
		[userId, limit]
	);

		const activities = result.rows.map(session => {

			const parser = new UAParser(session.user_agent);
			const ua = parser.getResult();

			let device;

			if (ua.device.type) {
				device =
					ua.device.type.charAt(0).toUpperCase() +
					ua.device.type.slice(1);
			} else if (["Windows", "Mac OS", "Linux"].includes(ua.os.name)) {
				device = "Desktop";
			} else {
				device = "Unknown";
			}

			const browser = ua.browser.name || "Unknown";
			const os = ua.os.name || "Unknown";

			const formattedDate = formatDateToObject(session.last_access);

			return {
				id: session.id,
				session_id: session.id,
				ip_address: session.ip_address,
				country: session.country,
				region: session.region,
				city: session.city,

				login_time: formatDateToObject(session.created_at).formatted,
				last_access: formattedDate.formatted,
				logout_time: session.logout_time
					? formatDateToObject(session.logout_time).formatted
					: null,

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