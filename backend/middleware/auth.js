import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { formatDateToObject } from '../utils/dateFormatter.js';

export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await pool.query(
            'SELECT id, student_id, admin_id, created_at, role FROM users WHERE id = $1', [decoded.id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userResponse = {
            id: user.rows[0].id,
            ...(user.rows[0].role === 'student' ? { student_id: user.rows[0].student_id } : { admin_id: user.rows[0].admin_id }),
            role: user.rows[0].role,
            created_at: formatDateToObject(user.rows[0].created_at),
            session_id: decoded.session_id
        };
        
        req.user = userResponse;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

