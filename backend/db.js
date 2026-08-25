import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const dbPath = isVercel ? path.join('/tmp', 'deris.db') : path.join(__dirname, 'deris.db');
const db = new sqlite3.Database(dbPath);

// Helper for promise-based database queries
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// DRIA Engine Implementation (Dynamic Relationship Indexing Algorithm)
export async function runDRIAEngine(evidenceId, evidenceType, detailPayload) {
  try {
    const ev = await dbGet('SELECT case_id FROM evidence WHERE evidence_id = ?', [evidenceId]);
    if (!ev) return;
    const currentCaseId = ev.case_id;

    let matchType = '';
    let matchValue = '';
    let score = 95;

    if (evidenceType === 'Phone') {
      matchType = 'Phone';
      matchValue = detailPayload.phone_number;
      score = 98;
    } else if (evidenceType === 'Vehicle') {
      matchType = 'Vehicle';
      matchValue = detailPayload.registration_number;
      score = 95;
    } else if (evidenceType === 'Weapon') {
      matchType = 'Weapon';
      matchValue = detailPayload.match_signature;
      score = 92;
    } else if (evidenceType === 'Fingerprint') {
      matchType = 'Fingerprint';
      matchValue = detailPayload.minutiae_hash;
      score = 96;
    } else if (evidenceType === 'DNA') {
      matchType = 'DNA';
      matchValue = detailPayload.match_code;
      score = 99;
    } else if (evidenceType === 'Location') {
      matchType = 'Location';
      matchValue = detailPayload.area_code || detailPayload.address;
      score = 85;
    }

    if (!matchValue) return;

    // Search for matches in existing evidence across OTHER cases
    let matches = [];
    if (matchType === 'Phone') {
      matches = await dbQuery(
        `SELECT e.case_id, e.evidence_id, p.phone_number AS match_val
         FROM phones p 
         JOIN evidence e ON p.evidence_id = e.evidence_id
         WHERE p.phone_number = ? AND e.case_id != ?`,
        [matchValue, currentCaseId]
      );
    } else if (matchType === 'Vehicle') {
      matches = await dbQuery(
        `SELECT e.case_id, e.evidence_id, v.registration_number AS match_val
         FROM vehicles v 
         JOIN evidence e ON v.evidence_id = e.evidence_id
         WHERE v.registration_number = ? AND e.case_id != ?`,
        [matchValue, currentCaseId]
      );
    } else if (matchType === 'Weapon') {
      matches = await dbQuery(
        `SELECT e.case_id, e.evidence_id, w.match_signature AS match_val
         FROM weapons w 
         JOIN evidence e ON w.evidence_id = e.evidence_id
         WHERE w.match_signature = ? AND e.case_id != ?`,
        [matchValue, currentCaseId]
      );
    } else if (matchType === 'Fingerprint') {
      matches = await dbQuery(
        `SELECT e.case_id, e.evidence_id, f.minutiae_hash AS match_val
         FROM fingerprints f 
         JOIN evidence e ON f.evidence_id = e.evidence_id
         WHERE f.minutiae_hash = ? AND e.case_id != ?`,
        [matchValue, currentCaseId]
      );
    } else if (matchType === 'DNA') {
      matches = await dbQuery(
        `SELECT e.case_id, e.evidence_id, d.match_code AS match_val
         FROM dna_samples d 
         JOIN evidence e ON d.evidence_id = e.evidence_id
         WHERE d.match_code = ? AND e.case_id != ?`,
        [matchValue, currentCaseId]
      );
    }

    // For each match, insert or update into Relationship_Index & Investigation_Graph
    for (const m of matches) {
      const targetCaseId = m.case_id;
      const linkId = `LNK-AUTO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Check existing link
      const existingLink = await dbGet(
        `SELECT link_id, score FROM relationship_index 
         WHERE (source_case_id = ? AND target_case_id = ? AND match_type = ? AND match_value = ?)
            OR (source_case_id = ? AND target_case_id = ? AND match_type = ? AND match_value = ?)`,
        [currentCaseId, targetCaseId, matchType, matchValue, targetCaseId, currentCaseId, matchType, matchValue]
      );

      if (!existingLink) {
        await dbRun(
          `INSERT INTO relationship_index (link_id, source_case_id, target_case_id, evidence_id, match_type, match_value, score, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`,
          [linkId, currentCaseId, targetCaseId, evidenceId, matchType, matchValue, score]
        );

        // History Log
        const histId = `HST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await dbRun(
          `INSERT INTO relationship_history (history_id, link_id, old_score, new_score, action_type, trigger_source)
           VALUES (?, ?, NULL, ?, 'INSERT', ?)`,
          [histId, linkId, score, `DRIA_${matchType.toUpperCase()}_AUTO_TRIGGER`]
        );

        // Graph Edge Update
        const clusterId = `GRP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const existingGraph = await dbGet(
          `SELECT cluster_id, key_evidence_types FROM investigation_graph 
           WHERE (case_id = ? AND connected_case_id = ?) OR (case_id = ? AND connected_case_id = ?)`,
          [currentCaseId, targetCaseId, targetCaseId, currentCaseId]
        );

        if (!existingGraph) {
          await dbRun(
            `INSERT INTO investigation_graph (cluster_id, case_id, connected_case_id, cluster_score, key_evidence_types)
             VALUES (?, ?, ?, ?, ?)`,
            [clusterId, currentCaseId, targetCaseId, score, matchType]
          );
        } else {
          const newTypes = existingGraph.key_evidence_types.includes(matchType)
            ? existingGraph.key_evidence_types
            : `${existingGraph.key_evidence_types}, ${matchType}`;
          await dbRun(
            `UPDATE investigation_graph 
             SET cluster_score = MAX(cluster_score, ?), key_evidence_types = ?, updated_at = CURRENT_TIMESTAMP
             WHERE cluster_id = ?`,
            [score, newTypes, existingGraph.cluster_id]
          );
        }
      }
    }
  } catch (err) {
    console.error('DRIA Engine Execution Error:', err);
  }
}

// Database Initialization & Seeding
export async function initDatabase() {
  db.serialize(async () => {
    // Enable Foreign Key constraints in SQLite
    db.run('PRAGMA foreign_keys = ON');

    // Create Tables
    db.run(`
      CREATE TABLE IF NOT EXISTS police_stations (
        station_id TEXT PRIMARY KEY,
        station_code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact_phone TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS officers (
        officer_id TEXT PRIMARY KEY,
        badge_number TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        rank TEXT NOT NULL,
        station_id TEXT,
        phone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS firs (
        fir_id TEXT PRIMARY KEY,
        fir_number TEXT UNIQUE NOT NULL,
        station_id TEXT,
        incident_date TEXT NOT NULL,
        incident_type TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        filing_date TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cases (
        case_id TEXT PRIMARY KEY,
        fir_id TEXT,
        case_title TEXT NOT NULL,
        crime_type TEXT NOT NULL,
        status TEXT DEFAULT 'Open',
        priority TEXT DEFAULT 'Medium',
        lead_officer_id TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS suspects (
        suspect_id TEXT PRIMARY KEY,
        case_id TEXT,
        name TEXT NOT NULL,
        alias TEXT,
        phone_number TEXT,
        national_id TEXT,
        address TEXT,
        status TEXT DEFAULT 'Under Investigation',
        risk_level TEXT DEFAULT 'Medium'
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS victims (
        victim_id TEXT PRIMARY KEY,
        case_id TEXT,
        name TEXT NOT NULL,
        phone_number TEXT,
        address TEXT,
        statement TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS witnesses (
        witness_id TEXT PRIMARY KEY,
        case_id TEXT,
        name TEXT NOT NULL,
        phone_number TEXT,
        statement TEXT,
        reliability_score INTEGER DEFAULT 50
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS evidence (
        evidence_id TEXT PRIMARY KEY,
        case_id TEXT,
        evidence_type TEXT NOT NULL,
        description TEXT NOT NULL,
        collected_by TEXT,
        collection_date TEXT DEFAULT CURRENT_TIMESTAMP,
        storage_location TEXT,
        status TEXT DEFAULT 'Logged'
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS weapons (
        weapon_id TEXT PRIMARY KEY,
        evidence_id TEXT,
        weapon_type TEXT NOT NULL,
        serial_number TEXT,
        caliber_spec TEXT,
        match_signature TEXT NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS vehicles (
        vehicle_id TEXT PRIMARY KEY,
        evidence_id TEXT,
        registration_number TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        model_color TEXT,
        vin_number TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS phones (
        phone_id TEXT PRIMARY KEY,
        evidence_id TEXT,
        phone_number TEXT NOT NULL,
        imei_number TEXT,
        service_provider TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS fingerprints (
        fingerprint_id TEXT PRIMARY KEY,
        evidence_id TEXT,
        pattern_type TEXT NOT NULL,
        minutiae_hash TEXT NOT NULL,
        image_url TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS dna_samples (
        dna_id TEXT PRIMARY KEY,
        evidence_id TEXT,
        loci_profile TEXT NOT NULL,
        match_code TEXT NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS locations (
        location_id TEXT PRIMARY KEY,
        evidence_id TEXT,
        address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        area_code TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS chain_of_custody (
        custody_id TEXT PRIMARY KEY,
        evidence_id TEXT,
        transferred_from TEXT,
        transferred_to TEXT,
        transfer_date TEXT DEFAULT CURRENT_TIMESTAMP,
        purpose TEXT NOT NULL
      );
    `);

    // DERIS Patentable Innovation Tables
    db.run(`
      CREATE TABLE IF NOT EXISTS relationship_index (
        link_id TEXT PRIMARY KEY,
        source_case_id TEXT,
        target_case_id TEXT,
        evidence_id TEXT,
        match_type TEXT NOT NULL,
        match_value TEXT NOT NULL,
        score INTEGER NOT NULL,
        status TEXT DEFAULT 'Active',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(source_case_id, target_case_id, match_type, match_value)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS relationship_history (
        history_id TEXT PRIMARY KEY,
        link_id TEXT,
        old_score INTEGER,
        new_score INTEGER NOT NULL,
        action_type TEXT NOT NULL,
        trigger_source TEXT NOT NULL,
        changed_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS investigation_graph (
        cluster_id TEXT PRIMARY KEY,
        case_id TEXT,
        connected_case_id TEXT,
        cluster_score INTEGER DEFAULT 50,
        key_evidence_types TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(case_id, connected_case_id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS query_cache (
        cache_id TEXT PRIMARY KEY,
        query_hash TEXT UNIQUE NOT NULL,
        parameter_value TEXT NOT NULL,
        result_payload TEXT NOT NULL,
        hit_count INTEGER DEFAULT 1,
        cached_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if initial seeding is needed
    db.get('SELECT COUNT(*) AS count FROM cases', async (err, row) => {
      if (err || !row || row.count === 0) {
        console.log('Seeding initial DERIS sample data...');
        await seedSampleData();
      }
    });
  });
}

async function seedSampleData() {
  try {
    await dbRun(`INSERT OR IGNORE INTO police_stations VALUES 
      ('STN-01', 'PS-CENTRAL', 'Central Crime Branch HQ', 'Bhubaneswar', 'Odisha', '+91-674-2500100'),
      ('STN-02', 'PS-METRO', 'Metro Zone Police Station', 'Cuttack', 'Odisha', '+91-671-2400200')`);

    await dbRun(`INSERT OR IGNORE INTO officers VALUES 
      ('OFF-101', 'BADGE-001', 'Rajesh Sharma', 'Commissioner', 'STN-01', '9800000001', 'admin@deris.gov', 'admin123', 'Admin'),
      ('OFF-102', 'BADGE-102', 'Rahul Verma', 'Senior Inspector', 'STN-01', '9800000002', 'rahul.verma@deris.gov', 'officer123', 'Investigation Officer'),
      ('OFF-103', 'BADGE-103', 'Ananya Sen', 'Inspector', 'STN-02', '9800000003', 'ananya.sen@deris.gov', 'officer123', 'Investigation Officer'),
      ('OFF-104', 'BADGE-104', 'Dr. Vikram Adani', 'Chief Forensic Specialist', 'STN-01', '9800000004', 'vikram.forensic@deris.gov', 'forensic123', 'Forensic Officer')`);

    await dbRun(`INSERT OR IGNORE INTO firs VALUES 
      ('FIR-101', 'FIR-2026-001', 'STN-01', '2026-01-15 10:30:00', 'Armed Robbery', 'Commercial Street Bank Vault', 'Investigating', '2026-01-15 11:00:00'),
      ('FIR-204', 'FIR-2026-042', 'STN-02', '2026-02-10 22:15:00', 'Grand Theft Auto', 'Highway NH-16 Toll Plaza', 'Investigating', '2026-02-10 23:00:00'),
      ('FIR-250', 'FIR-2026-089', 'STN-01', '2026-03-01 02:45:00', 'Homicide & Extortion', 'Tech Park Tower B Parking', 'Investigating', '2026-03-01 04:00:00'),
      ('FIR-121', 'FIR-2025-310', 'STN-02', '2025-11-20 23:00:00', 'Nightclub Assault', 'Downtown Lounge Alley', 'Under Review', '2025-11-21 01:00:00'),
      ('FIR-300', 'FIR-2026-105', 'STN-01', '2026-04-05 14:00:00', 'Organized Drug Cartel', 'Seaport Container Yard', 'Investigating', '2026-04-05 15:30:00')`);

    await dbRun(`INSERT OR IGNORE INTO cases VALUES 
      ('C101', 'FIR-101', 'Commercial Bank Vault Armed Heist', 'Armed Robbery', 'Active', 'Critical', 'OFF-102', '2026-01-15', '2026-01-15'),
      ('C204', 'FIR-204', 'Highway Armored Car Hijacking', 'Grand Theft', 'Active', 'High', 'OFF-103', '2026-02-10', '2026-02-10'),
      ('C250', 'FIR-250', 'Tech Park Tower Homicide & Syndicate Extortion', 'Homicide', 'Active', 'Critical', 'OFF-102', '2026-03-01', '2026-03-01'),
      ('C121', 'FIR-121', 'Downtown Lounge Shooting & Assault', 'Attempted Murder', 'Under Review', 'Medium', 'OFF-103', '2025-11-20', '2025-11-20'),
      ('C300', 'FIR-300', 'Seaport Narcotics & Weapons Smuggling Ring', 'Organized Crime', 'Active', 'High', 'OFF-102', '2026-04-05', '2026-04-05')`);

    await dbRun(`INSERT OR IGNORE INTO suspects VALUES 
      ('SUS-101', 'C101', 'Vikram Singh', 'Vicky Viper', '9876543210', 'NID-99201-X', 'Plot 45, Sector 9, Bhubaneswar', 'Under Investigation', 'High'),
      ('SUS-102', 'C250', 'Rohan Mehta', 'Shadow', '9876543210', 'NID-88102-Y', 'Flat 302, Royal Residency, Cuttack', 'Suspect', 'Severe'),
      ('SUS-103', 'C300', 'Tariq Ahmed', 'Bossman', '9933221100', 'NID-77203-Z', 'Villa 12, Seaport View', 'Arrested', 'Severe')`);

    await dbRun(`INSERT OR IGNORE INTO victims VALUES 
      ('VIC-101', 'C101', 'Suresh Mohanty', '9437012345', 'Commercial Bank Manager', 'Two masked gunman entered holding tactical weapons.'),
      ('VIC-250', 'C250', 'Amitabh Roy', '9437099999', 'Tech Corp Executive', 'Deceased in parking garage with multiple wounds.')`);

    await dbRun(`INSERT OR IGNORE INTO witnesses VALUES 
      ('WIT-101', 'C101', 'Priya Das', '9123456789', 'Saw blue pickup truck OD05AB1234 speed away.', 90),
      ('WIT-250', 'C250', 'Karan Nair', '9123456790', 'Heard argument mentioning phone 9876543210.', 85)`);

    await dbRun(`INSERT OR IGNORE INTO evidence VALUES 
      ('E101-P', 'C101', 'Phone', 'Burner smartphone seized near bank entrance', 'OFF-102', '2026-01-15', 'Locker A-12', 'Analyzing'),
      ('E101-V', 'C101', 'Vehicle', 'Blue Pickup getaway truck in CCTV', 'OFF-102', '2026-01-15', 'Impound Lot 2', 'Logged'),
      ('E101-W', 'C101', 'Weapon', 'Combat knife with serial signature K102', 'OFF-102', '2026-01-15', 'Forensic Vault B', 'Analyzing'),
      ('E250-P', 'C250', 'Phone', 'Cellular call records extracted from victim phone', 'OFF-102', '2026-03-01', 'Digital Evidence Room', 'Analyzing'),
      ('E250-V', 'C250', 'Vehicle', 'Surveillance clip of blue pickup truck', 'OFF-102', '2026-03-01', 'Impound Lot 2', 'Logged'),
      ('E250-F', 'C250', 'Fingerprint', 'Latent thumbprint on elevator button', 'OFF-104', '2026-03-01', 'Biometric Archive', 'Analyzing'),
      ('E121-W', 'C121', 'Weapon', 'Knife matching signature K102', 'OFF-103', '2025-11-20', 'Forensic Vault B', 'Archived'),
      ('E300-F', 'C300', 'Fingerprint', 'Print found on narcotics package', 'OFF-104', '2026-04-05', 'Biometric Archive', 'Analyzing'),
      ('E204-D', 'C204', 'DNA', 'Blood swab from broken glass', 'OFF-104', '2026-02-10', 'Bio-Lab Freezer 4', 'Analyzing'),
      ('E300-D', 'C300', 'DNA', 'DNA sample extracted from cigarette butt', 'OFF-104', '2026-04-05', 'Bio-Lab Freezer 4', 'Analyzing')`);

    await dbRun(`INSERT OR IGNORE INTO phones VALUES 
      ('PH-101', 'E101-P', '9876543210', '864201049281045', 'Airtel'),
      ('PH-250', 'E250-P', '9876543210', '864201049281045', 'Airtel')`);

    await dbRun(`INSERT OR IGNORE INTO vehicles VALUES 
      ('VH-101', 'E101-V', 'OD05AB1234', 'Pickup Truck', 'Mahindra Bolero Blue', 'VIN-MAH-2024-9981'),
      ('VH-250', 'E250-V', 'OD05AB1234', 'Pickup Truck', 'Mahindra Bolero Blue', 'VIN-MAH-2024-9981')`);

    await dbRun(`INSERT OR IGNORE INTO weapons VALUES 
      ('WP-101', 'E101-W', 'Tactical Knife', 'SN-K102-BLD', '8-inch serrated', 'SIG-K102-TACTICAL'),
      ('WP-121', 'E121-W', 'Tactical Knife', 'SN-K102-BLD', '8-inch serrated', 'SIG-K102-TACTICAL')`);

    await dbRun(`INSERT OR IGNORE INTO fingerprints VALUES 
      ('FP-250', 'E250-F', 'Whorl', 'HASH-FP-9982-MINUTIAE', '/uploads/fp250.png'),
      ('FP-300', 'E300-F', 'Whorl', 'HASH-FP-9982-MINUTIAE', '/uploads/fp300.png')`);

    await dbRun(`INSERT OR IGNORE INTO dna_samples VALUES 
      ('DNA-204', 'E204-D', 'D13S317: 11,12; D16S539: 9,13', 'DNA-MATCH-STR-441'),
      ('DNA-300', 'E300-D', 'D13S317: 11,12; D16S539: 9,13', 'DNA-MATCH-STR-441')`);

    // DERIS Relationship Index
    await dbRun(`INSERT OR IGNORE INTO relationship_index VALUES 
      ('LNK-101-250-PH', 'C250', 'C101', 'E250-P', 'Phone', '9876543210', 98, 'Active', '2026-03-01'),
      ('LNK-101-250-VH', 'C250', 'C101', 'E250-V', 'Vehicle', 'OD05AB1234', 95, 'Active', '2026-03-01'),
      ('LNK-101-121-WP', 'C121', 'C101', 'E121-W', 'Weapon', 'SIG-K102-TACTICAL', 92, 'Active', '2025-11-20'),
      ('LNK-250-300-FP', 'C300', 'C250', 'E300-F', 'Fingerprint', 'HASH-FP-9982-MINUTIAE', 96, 'Active', '2026-04-05'),
      ('LNK-204-300-DN', 'C300', 'C204', 'E300-D', 'DNA', 'DNA-MATCH-STR-441', 99, 'Active', '2026-04-05')`);

    await dbRun(`INSERT OR IGNORE INTO relationship_history VALUES 
      ('HST-001', 'LNK-101-250-PH', NULL, 98, 'INSERT', 'DRIA_PHONE_TRIGGER', '2026-03-01'),
      ('HST-002', 'LNK-101-250-VH', NULL, 95, 'INSERT', 'DRIA_VEHICLE_TRIGGER', '2026-03-01'),
      ('HST-003', 'LNK-101-121-WP', NULL, 92, 'INSERT', 'DRIA_WEAPON_TRIGGER', '2025-11-20'),
      ('HST-004', 'LNK-250-300-FP', NULL, 96, 'INSERT', 'DRIA_FINGERPRINT_TRIGGER', '2026-04-05'),
      ('HST-005', 'LNK-204-300-DN', NULL, 99, 'INSERT', 'DRIA_DNA_TRIGGER', '2026-04-05')`);

    await dbRun(`INSERT OR IGNORE INTO investigation_graph VALUES 
      ('GRP-001', 'C250', 'C101', 96, 'Phone, Vehicle', '2026-03-01'),
      ('GRP-002', 'C121', 'C101', 92, 'Weapon', '2025-11-20'),
      ('GRP-003', 'C300', 'C250', 96, 'Fingerprint', '2026-04-05'),
      ('GRP-004', 'C300', 'C204', 99, 'DNA', '2026-04-05')`);

    console.log('Sample data successfully seeded into DERIS database!');
  } catch (err) {
    console.error('Error seeding sample data:', err);
  }
}
