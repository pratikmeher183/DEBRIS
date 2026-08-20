import express from 'express';
import { dbGet, dbQuery } from '../db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find officer by email or default role lookup
    let officer = await dbGet('SELECT * FROM officers WHERE email = ?', [email]);
    if (!officer && role) {
      officer = await dbGet('SELECT * FROM officers WHERE role = ? LIMIT 1', [role]);
    }
    
    if (!officer) {
      return res.status(401).json({ error: 'Invalid officer credentials or role.' });
    }

    const station = await dbGet('SELECT * FROM police_stations WHERE station_id = ?', [officer.station_id]);

    const userPayload = {
      officer_id: officer.officer_id,
      badge_number: officer.badge_number,
      name: officer.name,
      rank: officer.rank,
      email: officer.email,
      role: officer.role,
      station_name: station ? station.name : 'Central HQ'
    };

    return res.json({
      token: `demo-jwt-token-${officer.officer_id}`,
      user: userPayload
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/officers
router.get('/officers', async (req, res) => {
  try {
    const officers = await dbQuery(`
      SELECT o.officer_id, o.badge_number, o.name, o.rank, o.role, o.email, o.phone, ps.name AS station_name 
      FROM officers o
      LEFT JOIN police_stations ps ON o.station_id = ps.station_id
    `);
    res.json(officers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
