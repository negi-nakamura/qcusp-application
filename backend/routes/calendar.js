import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";
import { formatDateToObject } from "../utils/dateFormatter.js";

const router = express.Router();

router.get("/calendar/university", authenticateToken, async (req, res) => {
	try {
		const { date, semester, event_type } = req.query;
		const targetDate = date || new Date().toISOString().split("T")[0];

		// Find semester whose start is before the date
		let calendarResult = await pool.query(
			`
			SELECT *
			FROM calendar_files
			WHERE semester_start <= $1
			ORDER BY semester_start DESC
			LIMIT 1
			`,
			[targetDate]
		);

		let calendarFile = calendarResult.rows[0];

		// If date is before first semester → return earliest
		if (!calendarFile) {
			const fallback = await pool.query(`
				SELECT *
				FROM calendar_files
				ORDER BY semester_start ASC
				LIMIT 1
			`);
			calendarFile = fallback.rows[0];
		}

		let uniQuery = `
			SELECT 
				u.id,
				u.calendar_file_id,
				u.title,
				u.semester,
				TO_CHAR(u.start_date,'YYYY-MM-DD') AS start_date,
				TO_CHAR(u.end_date,'YYYY-MM-DD') AS end_date,
				u.event_type,
				'University' AS source
			FROM university_calendar u
			LEFT JOIN calendar_files cf
				ON u.calendar_file_id = cf.id
			WHERE u.calendar_file_id = $1
		`;

		const values = [calendarFile.id];
		let index = 2;

		if (semester) {
			uniQuery += ` AND u.semester = $${index++}`;
			values.push(semester);
		}

		if (event_type) {
			uniQuery += ` AND u.event_type = $${index++}`;
			values.push(event_type);
		}

		uniQuery += ` ORDER BY u.start_date`;

		const universityResult = await pool.query(uniQuery, values);

		res.json({
			school_year: calendarFile.school_year,
			semester: calendarFile.semester,
			semester_start: formatDateToObject(calendarFile.semester_start).formatted.split("|")[0].trim(),
			semester_end: formatDateToObject(calendarFile.semester_end).formatted.split("|")[0].trim(),
			calendar_url: calendarFile.calendar_url,
			total_events: universityResult.rows.length,
			events: universityResult.rows
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

router.get("/calendar/holidays", authenticateToken, async (req, res) => {
	try {
		const holidayQuery = `
			SELECT
				id,
				title,
				month,
				day,
				'holiday' AS event_type,
				'Holiday' AS source
			FROM holiday_calendar
			ORDER BY month, day
		`;

		const holidayResult = await pool.query(holidayQuery);

		const holidays = holidayResult.rows.map(holiday => ({
			id: holiday.id,
			title: holiday.title,
			month: holiday.month,
			day: holiday.day,
			event_type: holiday.event_type,
			source: holiday.source,
			formatted_date: `${new Date(2000, holiday.month - 1, holiday.day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
			month_day: `${String(holiday.month).padStart(2, '0')}-${String(holiday.day).padStart(2, '0')}`
		}));

		res.json({
			total_holidays: holidays.length,
			holidays: holidays
		});

	} catch (err) {
		console.error("Error fetching holidays:", err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;