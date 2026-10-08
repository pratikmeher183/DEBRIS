import express from 'express';
import { dbGet, dbQuery, dbRun } from '../db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, badge, username, role } = req.body;
    const identifier = email || badge || username;
    
    if (!identifier) {
      return res.status(400).json({ error: 'Officer Badge ID or Email is required.' });
    }

    // Find officer by email or badge_number
    let officer = await dbGet(
      'SELECT * FROM officers WHERE email = ? OR badge_number = ? OR officer_id = ?', 
      [identifier, identifier, identifier]
    );

    if (!officer && role) {
      officer = await dbGet('SELECT * FROM officers WHERE role = ? LIMIT 1', [role]);
    }
    
    if (!officer) {
      return res.status(401).json({ error: 'Invalid officer credentials or badge ID.' });
    }

    // Verify password if provided
    if (password && officer.password_hash && officer.password_hash !== password) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const station = await dbGet('SELECT * FROM police_stations WHERE station_id = ?', [officer.station_id]);

    const userPayload = {
      officer_id: officer.officer_id,
      badge_number: officer.badge_number,
      name: officer.name,
      rank: officer.rank,
      email: officer.email,
      role: officer.role,
      station_name: station ? station.name : (officer.station_name || 'Central HQ')
    };

    return res.json({
      token: `demo-jwt-token-${officer.officer_id}`,
      user: userPayload
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register - Register new Officer
router.post('/register', async (req, res) => {
  try {
    const { name, badge_number, email, password, rank, role, station_name } = req.body;
    
    if (!name || !badge_number || !email || !password) {
      return res.status(400).json({ error: 'Name, Badge Number, Email, and Password are required.' });
    }

    // Check if officer already exists
    const existing = await dbGet('SELECT * FROM officers WHERE email = ? OR badge_number = ?', [email, badge_number]);
    if (existing) {
      return res.status(400).json({ error: 'An officer with this Email or Badge Number already exists.' });
    }

    const officerId = `OFF-${Date.now().toString().slice(-4)}`;
    const officerRank = rank || 'Senior Inspector';
    const officerRole = role || 'Investigation Officer';
    const stName = station_name || 'Central Crime Branch HQ';

    await dbRun(
      `INSERT INTO officers (officer_id, badge_number, name, rank, station_id, phone, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'STN-01', '+91-674-2500100', ?, ?, ?)`,
      [officerId, badge_number, name, officerRank, email, password, officerRole]
    );

    const userPayload = {
      officer_id: officerId,
      badge_number: badge_number,
      name: name,
      rank: officerRank,
      email: email,
      role: officerRole,
      station_name: stName
    };

    return res.status(201).json({
      message: 'Officer account registered successfully',
      token: `demo-jwt-token-${officerId}`,
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
