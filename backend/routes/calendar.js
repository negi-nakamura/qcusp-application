import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/calendar/university", authenticateToken, async (req, res) => {
	try {
		const { school_year, semester, event_type } = req.query;

		const currentYear = new Date().getFullYear();
		const defaultSchoolYear = `${currentYear - 1}-${currentYear}`;
		const selectedSchoolYear = school_year || defaultSchoolYear;

		let uniQuery = `
			SELECT 
				id,
				title,
				semester,
				TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
				TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
				event_type,
				'University' AS source
			FROM university_calendar
			WHERE school_year = $1
		`;

		const values = [selectedSchoolYear];
		let index = 2;

		if (semester) {
			uniQuery += ` AND semester = $${index++}`;
			values.push(semester);
		}

		if (event_type) {
			uniQuery += ` AND event_type = $${index++}`;
			values.push(event_type);
		}

		uniQuery += ` ORDER BY start_date`;

		const universityResult = await pool.query(uniQuery, values);

		res.json({
			school_year: selectedSchoolYear,
			total_events: universityResult.rows.length,
			events: universityResult.rows,
			university_events: universityResult.rows 
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