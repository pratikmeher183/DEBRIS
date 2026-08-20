-- ============================================================================
-- DERIS: Dynamic Evidence Relationship Indexing System
-- Master Database Schema (PostgreSQL / SQLite Compatible DDL)
-- 
-- Innovation: Replaces multi-table SQL JOIN scans with pre-indexed, auto-updated 
-- relationship structures maintained via the Dynamic Relationship Indexing Algorithm (DRIA).
-- ============================================================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS query_cache;
DROP TABLE IF EXISTS investigation_graph;
DROP TABLE IF EXISTS relationship_history;
DROP TABLE IF EXISTS relationship_index;
DROP TABLE IF EXISTS chain_of_custody;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS dna_samples;
DROP TABLE IF EXISTS fingerprints;
DROP TABLE IF EXISTS phones;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS weapons;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS witnesses;
DROP TABLE IF EXISTS victims;
DROP TABLE IF EXISTS suspects;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS firs;
DROP TABLE IF EXISTS officers;
DROP TABLE IF EXISTS police_stations;

-- ----------------------------------------------------------------------------
-- 1. Police Stations
-- ----------------------------------------------------------------------------
CREATE TABLE police_stations (
    station_id VARCHAR(50) PRIMARY KEY,
    station_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(20)
);

-- ----------------------------------------------------------------------------
-- 2. Officers
-- ----------------------------------------------------------------------------
CREATE TABLE officers (
    officer_id VARCHAR(50) PRIMARY KEY,
    badge_number VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    rank VARCHAR(50) NOT NULL,
    station_id VARCHAR(50) REFERENCES police_stations(station_id) ON DELETE SET NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('Admin', 'Investigation Officer', 'Forensic Officer'))
);

-- ----------------------------------------------------------------------------
-- 3. FIR (First Information Report)
-- ----------------------------------------------------------------------------
CREATE TABLE firs (
    fir_id VARCHAR(50) PRIMARY KEY,
    fir_number VARCHAR(50) UNIQUE NOT NULL,
    station_id VARCHAR(50) REFERENCES police_stations(station_id),
    incident_date TIMESTAMP NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Investigating', 'Closed')),
    filing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. Cases
-- ----------------------------------------------------------------------------
CREATE TABLE cases (
    case_id VARCHAR(50) PRIMARY KEY,
    fir_id VARCHAR(50) REFERENCES firs(fir_id) ON DELETE CASCADE,
    case_title VARCHAR(200) NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Open' CHECK (status IN ('Open', 'Active', 'Under Review', 'Closed', 'Solved')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    lead_officer_id VARCHAR(50) REFERENCES officers(officer_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. Suspects
-- ----------------------------------------------------------------------------
CREATE TABLE suspects (
    suspect_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES cases(case_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    alias VARCHAR(100),
    phone_number VARCHAR(20),
    national_id VARCHAR(50),
    address TEXT,
    status VARCHAR(30) DEFAULT 'Under Investigation' CHECK (status IN ('Suspect', 'Under Investigation', 'Arrested', 'Cleared', 'Convicted')),
    risk_level VARCHAR(20) DEFAULT 'Medium' CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe'))
);

-- ----------------------------------------------------------------------------
-- 6. Victims
-- ----------------------------------------------------------------------------
CREATE TABLE victims (
    victim_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES cases(case_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    statement TEXT
);

-- ----------------------------------------------------------------------------
-- 7. Witnesses
-- ----------------------------------------------------------------------------
CREATE TABLE witnesses (
    witness_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES cases(case_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    statement TEXT,
    reliability_score INT DEFAULT 50 CHECK (reliability_score BETWEEN 0 AND 100)
);

-- ----------------------------------------------------------------------------
-- 8. Evidence (Parent Entity)
-- ----------------------------------------------------------------------------
CREATE TABLE evidence (
    evidence_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES cases(case_id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL CHECK (evidence_type IN ('Weapon', 'Vehicle', 'Phone', 'Fingerprint', 'DNA', 'Location', 'Document', 'Other')),
    description TEXT NOT NULL,
    collected_by VARCHAR(50) REFERENCES officers(officer_id),
    collection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    storage_location VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Logged' CHECK (status IN ('Logged', 'In Transit', 'Analyzing', 'Archived', 'Presented'))
);

-- ----------------------------------------------------------------------------
-- 9. Weapons (Subtype)
-- ----------------------------------------------------------------------------
CREATE TABLE weapons (
    weapon_id VARCHAR(50) PRIMARY KEY,
    evidence_id VARCHAR(50) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    weapon_type VARCHAR(50) NOT NULL,
    serial_number VARCHAR(100),
    caliber_spec VARCHAR(50),
    match_signature VARCHAR(100) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 10. Vehicles (Subtype)
-- ----------------------------------------------------------------------------
CREATE TABLE vehicles (
    vehicle_id VARCHAR(50) PRIMARY KEY,
    evidence_id VARCHAR(50) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    registration_number VARCHAR(30) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    model_color VARCHAR(100),
    vin_number VARCHAR(100)
);

-- ----------------------------------------------------------------------------
-- 11. Phones (Subtype)
-- ----------------------------------------------------------------------------
CREATE TABLE phones (
    phone_id VARCHAR(50) PRIMARY KEY,
    evidence_id VARCHAR(50) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    imei_number VARCHAR(30),
    service_provider VARCHAR(50)
);

-- ----------------------------------------------------------------------------
-- 12. Fingerprints (Subtype)
-- ----------------------------------------------------------------------------
CREATE TABLE fingerprints (
    fingerprint_id VARCHAR(50) PRIMARY KEY,
    evidence_id VARCHAR(50) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    pattern_type VARCHAR(50) NOT NULL,
    minutiae_hash VARCHAR(100) NOT NULL,
    image_url VARCHAR(255)
);

-- ----------------------------------------------------------------------------
-- 13. DNA Samples (Subtype)
-- ----------------------------------------------------------------------------
CREATE TABLE dna_samples (
    dna_id VARCHAR(50) PRIMARY KEY,
    evidence_id VARCHAR(50) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    loci_profile TEXT NOT NULL,
    match_code VARCHAR(100) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 14. Locations (Subtype)
-- ----------------------------------------------------------------------------
CREATE TABLE locations (
    location_id VARCHAR(50) PRIMARY KEY,
    evidence_id VARCHAR(50) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    area_code VARCHAR(20)
);

-- ----------------------------------------------------------------------------
-- 15. Chain of Custody
-- ----------------------------------------------------------------------------
CREATE TABLE chain_of_custody (
    custody_id VARCHAR(50) PRIMARY KEY,
    evidence_id VARCHAR(50) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    transferred_from VARCHAR(50) REFERENCES officers(officer_id),
    transferred_to VARCHAR(50) REFERENCES officers(officer_id),
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    purpose TEXT NOT NULL
);

-- ============================================================================
-- NOVEL DERIS PATENTABLE ENGINE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 16. Relationship Index (The Pre-indexed Correlation Layer)
-- ----------------------------------------------------------------------------
CREATE TABLE relationship_index (
    link_id VARCHAR(50) PRIMARY KEY,
    source_case_id VARCHAR(50) REFERENCES cases(case_id) ON DELETE CASCADE,
    target_case_id VARCHAR(50) REFERENCES cases(case_id) ON DELETE CASCADE,
    evidence_id VARCHAR(50) REFERENCES evidence(evidence_id) ON DELETE CASCADE,
    match_type VARCHAR(50) NOT NULL,
    match_value VARCHAR(255) NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'Flagged', 'Verified', 'Dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_case_correlation UNIQUE (source_case_id, target_case_id, match_type, match_value)
);

-- ----------------------------------------------------------------------------
-- 17. Relationship History (Audit & Dynamics Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE relationship_history (
    history_id VARCHAR(50) PRIMARY KEY,
    link_id VARCHAR(50) REFERENCES relationship_index(link_id) ON DELETE CASCADE,
    old_score INT,
    new_score INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    trigger_source VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 18. Investigation Graph (Connected Case Clusters)
-- ----------------------------------------------------------------------------
CREATE TABLE investigation_graph (
    cluster_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES cases(case_id) ON DELETE CASCADE,
    connected_case_id VARCHAR(50) REFERENCES cases(case_id) ON DELETE CASCADE,
    cluster_score INT DEFAULT 50 CHECK (cluster_score BETWEEN 0 AND 100),
    key_evidence_types VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_graph_edge UNIQUE (case_id, connected_case_id)
);

-- ----------------------------------------------------------------------------
-- 19. Query Cache (Path Optimization)
-- ----------------------------------------------------------------------------
CREATE TABLE query_cache (
    cache_id VARCHAR(50) PRIMARY KEY,
    query_hash VARCHAR(100) UNIQUE NOT NULL,
    parameter_value VARCHAR(255) NOT NULL,
    result_payload TEXT NOT NULL,
    hit_count INT DEFAULT 1,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR HIGH-SPEED LOOKUPS
-- ============================================================================
CREATE INDEX idx_rel_source_case ON relationship_index(source_case_id);
CREATE INDEX idx_rel_target_case ON relationship_index(target_case_id);
CREATE INDEX idx_rel_match_type_val ON relationship_index(match_type, match_value);
CREATE INDEX idx_evidence_case ON evidence(case_id);
CREATE INDEX idx_phones_num ON phones(phone_number);
CREATE INDEX idx_vehicles_reg ON vehicles(registration_number);
CREATE INDEX idx_weapons_sig ON weapons(match_signature);
CREATE INDEX idx_fingerprints_hash ON fingerprints(minutiae_hash);
CREATE INDEX idx_dna_code ON dna_samples(match_code);
CREATE INDEX idx_graph_case ON investigation_graph(case_id);