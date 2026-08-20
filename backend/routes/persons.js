import express from 'express';
import { dbQuery, dbRun } from '../db.js';

const router = express.Router();

// GET /api/persons/suspects
router.get('/suspects', async (req, res) => {
  try {
    const list = await dbQuery(`
      SELECT s.*, c.case_title, c.crime_type 
      FROM suspects s
      JOIN cases c ON s.case_id = c.case_id
      ORDER BY s.risk_level DESC
    `);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/persons/victims
router.get('/victims', async (req, res) => {
  try {
    const list = await dbQuery(`
      SELECT v.*, c.case_title 
      FROM victims v
      JOIN cases c ON v.case_id = c.case_id
    `);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/persons/witnesses
router.get('/witnesses', async (req, res) => {
  try {
    const list = await dbQuery(`
      SELECT w.*, c.case_title 
      FROM witnesses w
      JOIN cases c ON w.case_id = c.case_id
    `);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/persons/suspects - Add suspect
router.post('/suspects', async (req, res) => {
  try {
    const { case_id, name, alias, phone_number, national_id, address, risk_level } = req.body;
    const suspectId = `SUS-${Date.now().toString().slice(-4)}`;

    await dbRun(
      `INSERT INTO suspects (suspect_id, case_id, name, alias, phone_number, national_id, address, status, risk_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Under Investigation', ?)`,
      [suspectId, case_id, name, alias || '', phone_number || '', national_id || '', address || '', risk_level || 'Medium']
    );

    res.status(201).json({ message: 'Suspect registered successfully', suspect_id: suspectId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
