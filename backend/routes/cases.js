import express from 'express';
import { dbQuery, dbGet, dbRun } from '../db.js';

const router = express.Router();

// GET /api/cases - List all cases with evidence counts & linked case counts
router.get('/', async (req, res) => {
  try {
    const cases = await dbQuery(`
      SELECT 
        c.*, 
        f.fir_number, f.incident_type, f.location,
        o.name AS lead_officer_name,
        (SELECT COUNT(*) FROM evidence e WHERE e.case_id = c.case_id) AS total_evidence,
        (SELECT COUNT(*) FROM relationship_index ri WHERE ri.source_case_id = c.case_id OR ri.target_case_id = c.case_id) AS linked_cases_count
      FROM cases c
      LEFT JOIN firs f ON c.fir_id = f.fir_id
      LEFT JOIN officers o ON c.lead_officer_id = o.officer_id
      ORDER BY c.created_at DESC
    `);
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cases/:id - Get single case detail with evidence, suspects, victims, and auto-discovered links
router.get('/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseData = await dbGet(`
      SELECT c.*, f.fir_number, f.incident_type, f.location, f.incident_date, o.name AS lead_officer_name 
      FROM cases c
      LEFT JOIN firs f ON c.fir_id = f.fir_id
      LEFT JOIN officers o ON c.lead_officer_id = o.officer_id
      WHERE c.case_id = ?
    `, [caseId]);

    if (!caseData) return res.status(404).json({ error: 'Case not found' });

    const evidence = await dbQuery('SELECT * FROM evidence WHERE case_id = ?', [caseId]);
    const suspects = await dbQuery('SELECT * FROM suspects WHERE case_id = ?', [caseId]);
    const victims = await dbQuery('SELECT * FROM victims WHERE case_id = ?', [caseId]);
    const witnesses = await dbQuery('SELECT * FROM witnesses WHERE case_id = ?', [caseId]);

    // DERIS Relationship Index Lookup (Instant Pre-indexed Lookups)
    const connections = await dbQuery(`
      SELECT 
        ri.link_id,
        CASE WHEN ri.source_case_id = ? THEN ri.target_case_id ELSE ri.source_case_id END AS connected_case_id,
        c_conn.case_title AS connected_case_title,
        c_conn.crime_type AS connected_crime_type,
        c_conn.status AS connected_case_status,
        ri.match_type,
        ri.match_value,
        ri.score,
        ri.status AS link_status
      FROM relationship_index ri
      JOIN cases c_conn ON (CASE WHEN ri.source_case_id = ? THEN ri.target_case_id ELSE ri.source_case_id END) = c_conn.case_id
      WHERE ri.source_case_id = ? OR ri.target_case_id = ?
      ORDER BY ri.score DESC
    `, [caseId, caseId, caseId, caseId]);

    res.json({
      ...caseData,
      evidence,
      suspects,
      victims,
      witnesses,
      connections
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cases - Create new FIR & Case
router.post('/', async (req, res) => {
  try {
    const { case_title, crime_type, priority, location, incident_date, lead_officer_id, description } = req.body;
    
    const firId = `FIR-${Date.now()}`;
    const firNumber = `FIR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const caseId = `C${Math.floor(300 + Math.random() * 900)}`;

    await dbRun(
      `INSERT INTO firs (fir_id, fir_number, station_id, incident_date, incident_type, location, status)
       VALUES (?, ?, 'STN-01', ?, ?, ?, 'Investigating')`,
      [firId, firNumber, incident_date || new Date().toISOString(), crime_type, location || 'Bhubaneswar']
    );

    await dbRun(
      `INSERT INTO cases (case_id, fir_id, case_title, crime_type, status, priority, lead_officer_id)
       VALUES (?, ?, ?, ?, 'Active', ?, ?)`,
      [caseId, firId, case_title, crime_type, priority || 'Medium', lead_officer_id || 'OFF-102']
    );

    res.status(201).json({
      message: 'Case registered successfully',
      case_id: caseId,
      fir_number: firNumber
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/cases/:id/status - Update Case Status (e.g. Mark Solved)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const caseId = req.params.id;

    // Update Case status
    await dbRun('UPDATE cases SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE case_id = ?', [status, caseId]);

    // Get fir_id for this case
    const cData = await dbGet('SELECT fir_id FROM cases WHERE case_id = ?', [caseId]);

    // If case is Solved or Closed, automatically update FIR status to Closed
    if (cData && cData.fir_id && (status === 'Solved' || status === 'Closed')) {
      await dbRun('UPDATE firs SET status = ? WHERE fir_id = ?', ['Closed', cData.fir_id]);
    }

    res.json({ message: `Case ${caseId} status updated to ${status} and saved to Solved record.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
