import express from 'express';
import { dbQuery, dbGet, dbRun, runDRIAEngine } from '../db.js';

const router = express.Router();

// GET /api/evidence - Get all evidence items with case context
router.get('/', async (req, res) => {
  try {
    const items = await dbQuery(`
      SELECT e.*, c.case_title, c.crime_type, o.name AS collected_by_name
      FROM evidence e
      JOIN cases c ON e.case_id = c.case_id
      LEFT JOIN officers o ON e.collected_by = o.officer_id
      ORDER BY e.collection_date DESC
    `);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/evidence - Register new evidence item & trigger DRIA Auto-Indexing
router.post('/', async (req, res) => {
  try {
    const { case_id, evidence_type, description, collected_by, storage_location, details } = req.body;

    const evidenceId = `E${Date.now().toString().slice(-4)}-${evidence_type.charAt(0)}`;

    // Insert Parent Evidence
    await dbRun(
      `INSERT INTO evidence (evidence_id, case_id, evidence_type, description, collected_by, storage_location, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Analyzing')`,
      [evidenceId, case_id, evidence_type, description, collected_by || 'OFF-102', storage_location || 'Vault A']
    );

    // Insert Evidence Subtype Details
    if (evidence_type === 'Phone') {
      const phoneId = `PH-${Date.now().toString().slice(-4)}`;
      await dbRun(
        `INSERT INTO phones (phone_id, evidence_id, phone_number, imei_number, service_provider)
         VALUES (?, ?, ?, ?, ?)`,
        [phoneId, evidenceId, details.phone_number, details.imei_number || '', details.service_provider || 'Airtel']
      );
    } else if (evidence_type === 'Vehicle') {
      const vehicleId = `VH-${Date.now().toString().slice(-4)}`;
      await dbRun(
        `INSERT INTO vehicles (vehicle_id, evidence_id, registration_number, vehicle_type, model_color, vin_number)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [vehicleId, evidenceId, details.registration_number, details.vehicle_type || 'SUV', details.model_color || '', details.vin_number || '']
      );
    } else if (evidence_type === 'Weapon') {
      const weaponId = `WP-${Date.now().toString().slice(-4)}`;
      await dbRun(
        `INSERT INTO weapons (weapon_id, evidence_id, weapon_type, serial_number, caliber_spec, match_signature)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [weaponId, evidenceId, details.weapon_type || 'Firearm', details.serial_number || '', details.caliber_spec || '', details.match_signature || details.serial_number]
      );
    } else if (evidence_type === 'Fingerprint') {
      const fpId = `FP-${Date.now().toString().slice(-4)}`;
      await dbRun(
        `INSERT INTO fingerprints (fingerprint_id, evidence_id, pattern_type, minutiae_hash, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [fpId, evidenceId, details.pattern_type || 'Whorl', details.minutiae_hash, details.image_url || '/uploads/fp.png']
      );
    } else if (evidence_type === 'DNA') {
      const dnaId = `DNA-${Date.now().toString().slice(-4)}`;
      await dbRun(
        `INSERT INTO dna_samples (dna_id, evidence_id, loci_profile, match_code)
         VALUES (?, ?, ?, ?)`,
        [dnaId, evidenceId, details.loci_profile || 'STR Profile', details.match_code]
      );
    } else if (evidence_type === 'Location') {
      const locId = `LOC-${Date.now().toString().slice(-4)}`;
      await dbRun(
        `INSERT INTO locations (location_id, evidence_id, address, latitude, longitude, area_code)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [locId, evidenceId, details.address, details.latitude || 20.2961, details.longitude || 85.8245, details.area_code || '751001']
      );
    }

    // AUTOMATED PATENTABLE DRIA ENGINE EXECUTION
    await runDRIAEngine(evidenceId, evidence_type, details);

    res.status(201).json({
      message: 'Evidence registered successfully and DRIA Relationship Index updated!',
      evidence_id: evidenceId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
