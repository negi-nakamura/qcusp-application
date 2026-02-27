import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/grades", authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const reportId = parseInt(req.query.report_id);

    const gradeQuery = `
      SELECT 
        rc.id,
        rc.title,
        c.course_name AS course,
        cp.campus_name AS campus,
        rc.year_level AS "yearLevel",
        TO_CHAR(rc.date_submitted, 'Month DD, YYYY | HH12:MI AM') AS "dateSubmitted",
        rc.school_year AS "schoolYear",
        rc.semester,
        rc.total_units AS "totalUnits",
        rc.gwa,
        rc.total_remarks AS "overallRemarks",

        s.subject_name AS description,
        s.subject_code AS code,
        s.units AS unit,
        rci.grade,
        rci.remarks,
        CONCAT(
          p.last_name, ', ', p.first_name,
          COALESCE(' ' || LEFT(p.middle_name,1) || '.', '')
        ) AS professor

      FROM report_card rc
      JOIN courses c ON rc.course_id = c.id
      JOIN campuses cp ON rc.campus_id = cp.id
      JOIN report_card_items rci ON rci.report_card_id = rc.id
      JOIN subjects s ON rci.subject_id = s.id
      LEFT JOIN professors p ON rci.professor_id = p.id

      WHERE rc.student_id = $1
      ${reportId ? "AND rc.id = $2" : ""}

      ORDER BY rc.date_submitted DESC, s.subject_code;
    `;

    const values = reportId ? [studentId, reportId] : [studentId];

    const result = await pool.query(gradeQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No grades found" });
    }

    const reportsMap = {};

    result.rows.forEach(row => {

      if (!reportsMap[row.id]) {
        reportsMap[row.id] = {
          id: row.id,
          title: row.title,
          course: row.course,
          campus: row.campus,
          yearLevel: row.yearLevel,
          dateSubmitted: row.dateSubmitted,
          schoolYear: row.schoolYear,
          semester: row.semester,
          totalUnits: row.totalUnits,
          gwa: row.gwa,
          overallRemarks: row.overallRemarks,
          grades: []
        };
      }

      reportsMap[row.id].grades.push({
        description: row.description,
        code: row.code,
        unit: row.unit,
        grade: row.grade,
        remarks: row.remarks,
        professor: row.professor
      });

    });

    const reports = Object.values(reportsMap);

    res.json({
      total_reports: reports.length,
      reports
    });

  } catch (err) {
    console.error("Error fetching grades:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;