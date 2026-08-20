import express from 'express';
import { dbQuery } from '../db.js';

const router = express.Router();

// GET /api/graph/nexus - Graph Payload for React Interactive Network Graph Visualization
router.get('/nexus', async (req, res) => {
  try {
    const cases = await dbQuery('SELECT case_id, case_title, crime_type, status, priority FROM cases');
    const suspects = await dbQuery('SELECT suspect_id, case_id, name, risk_level, phone_number FROM suspects');
    const evidence = await dbQuery('SELECT evidence_id, case_id, evidence_type, description FROM evidence');
    const links = await dbQuery('SELECT * FROM relationship_index');

    const nodes = [];
    const edges = [];

    // Add Case Nodes
    cases.forEach((c) => {
      nodes.push({
        id: c.case_id,
        label: `${c.case_id}: ${c.case_title}`,
        type: 'Case',
        crime_type: c.crime_type,
        status: c.status,
        priority: c.priority,
        val: 25
      });
    });

    // Add Suspect Nodes
    suspects.forEach((s) => {
      nodes.push({
        id: s.suspect_id,
        label: `Suspect: ${s.name}`,
        type: 'Suspect',
        risk: s.risk_level,
        phone: s.phone_number,
        val: 18
      });
      // Edge from Suspect to Case
      if (s.case_id) {
        edges.push({
          source: s.suspect_id,
          target: s.case_id,
          label: 'Involved In',
          type: 'Suspect_Link',
          score: 100
        });
      }
    });

    // Add Correlation Edges between Cases from Relationship_Index
    links.forEach((l) => {
      edges.push({
        id: l.link_id,
        source: l.source_case_id,
        target: l.target_case_id,
        label: `${l.match_type}: ${l.match_value}`,
        match_type: l.match_type,
        match_value: l.match_value,
        score: l.score,
        status: l.status,
        type: 'Correlation'
      });
    });

    res.json({ nodes, edges, total_clusters: links.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
