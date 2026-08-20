import express from 'express';
import { dbQuery, dbGet, dbRun } from '../db.js';

const router = express.Router();

// GET /api/relationships - Query Relationship Index with filters
router.get('/', async (req, res) => {
  try {
    const { match_type, min_score, case_id } = req.query;

    let sql = `
      SELECT 
        ri.link_id,
        ri.source_case_id,
        c1.case_title AS source_case_title,
        c1.crime_type AS source_crime_type,
        ri.target_case_id,
        c2.case_title AS target_case_title,
        c2.crime_type AS target_crime_type,
        ri.evidence_id,
        ri.match_type,
        ri.match_value,
        ri.score,
        ri.status,
        ri.created_at
      FROM relationship_index ri
      JOIN cases c1 ON ri.source_case_id = c1.case_id
      JOIN cases c2 ON ri.target_case_id = c2.case_id
      WHERE 1=1
    `;

    const params = [];
    if (match_type) {
      sql += ' AND ri.match_type = ?';
      params.push(match_type);
    }
    if (min_score) {
      sql += ' AND ri.score >= ?';
      params.push(Number(min_score));
    }
    if (case_id) {
      sql += ' AND (ri.source_case_id = ? OR ri.target_case_id = ?)';
      params.push(case_id, case_id);
    }

    sql += ' ORDER BY ri.score DESC, ri.created_at DESC';

    const links = await dbQuery(sql, params);
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/relationships/history - Audit trail of DRIA indexing updates
router.get('/history', async (req, res) => {
  try {
    const history = await dbQuery(`
      SELECT rh.*, ri.source_case_id, ri.target_case_id, ri.match_type, ri.match_value
      FROM relationship_history rh
      JOIN relationship_index ri ON rh.link_id = ri.link_id
      ORDER BY rh.changed_at DESC
      LIMIT 50
    `);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/relationships/:linkId/verify - Verify or Dismiss correlation link
router.patch('/:linkId/status', async (req, res) => {
  try {
    const { status } = req.body; // 'Verified', 'Dismissed', 'Flagged'
    await dbRun('UPDATE relationship_index SET status = ? WHERE link_id = ?', [status, req.params.linkId]);

    const histId = `HST-${Date.now()}`;
    await dbRun(
      `INSERT INTO relationship_history (history_id, link_id, old_score, new_score, action_type, trigger_source)
       VALUES (?, ?, 95, 95, ?, 'MANUAL_OFFICER_AUDIT')`,
      [histId, req.params.linkId, status.toUpperCase()]
    );

    res.json({ message: `Relationship link status changed to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
