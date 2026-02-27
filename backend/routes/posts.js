import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/posts", authenticateToken, async (req, res) => {
  try {
    
    const limit = parseInt(req.query.limit) || 5;

    const postQuery = `
      SELECT 
        id,
        title,
        message,
        url,
        bg_url,
        TO_CHAR(date_posted, 'YYYY-MM-DD') AS date_posted,
        post_type
      FROM posts
      ORDER BY date_posted DESC
      LIMIT $1
    `;

    const result = await pool.query(postQuery, [limit]);

    res.json({
      total_posts: result.rows.length,
      posts: result.rows
    });

  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;