import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/courses", authenticateToken, async (req, res) => {
	try {
		const year = req.query.year;
		const semester = req.query.semester;
		const limit = parseInt(req.query.limit) || 50;

		const query = `
		SELECT 
			so.subject_course_id AS id,
			s.id AS subject_id,
			s.subject_code,
			s.subject_name,
			s.description,
			sc.year_level AS year,
			sc.semester,
			s.units,

			STRING_AGG(DISTINCT 
			CONCAT(p.first_name, ' ', p.last_name), 
			' | '
			) AS professors,

			STRING_AGG(DISTINCT so.day_of_week, ' | ') AS day_of_week,

			STRING_AGG(
			TO_CHAR(so.start_time, 'HH12:MI AM') || ' - ' ||
			TO_CHAR(so.end_time, 'HH12:MI AM'),
			' | '
			) AS time_range,

			STRING_AGG(DISTINCT so.room, ' | ') AS rooms

		FROM subject_offerings so
		JOIN subject_courses sc ON sc.id = so.subject_course_id
		JOIN subjects s ON s.id = sc.subject_id
		LEFT JOIN professors p ON p.id = so.professor_id

		WHERE so.status = 'active'
		AND ($1::text IS NULL OR sc.year_level = $1)
		AND ($2::text IS NULL OR sc.semester = $2)

		GROUP BY 
			so.subject_course_id,
			s.id,
			s.subject_code,
			s.subject_name,
			s.description,
			s.units,
			sc.year_level,
			sc.semester

		ORDER BY sc.year_level, sc.semester
		LIMIT $3
		`;

		const result = await pool.query(query, [
		year || null,
		semester || null,
		limit
		]);

		res.json({
		total_subject_course: result.rows.length,
		subjects: result.rows
		});

	} catch (err) {
		console.error("Error fetching subject offerings:", err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;