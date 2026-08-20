-- ============================================================================
-- DERIS: Master Sample Data Seed Script
-- Realistic Crime Investigation Dataset with Inter-Case Correlations
-- ============================================================================

-- 1. Police Stations
INSERT INTO police_stations (station_id, station_code, name, city, state, contact_phone) VALUES
('STN-01', 'PS-CENTRAL', 'Central Crime Branch HQ', 'Bhubaneswar', 'Odisha', '+91-674-2500100'),
('STN-02', 'PS-METRO', 'Metro Zone Police Station', 'Cuttack', 'Odisha', '+91-671-2400200');

-- 2. Officers
INSERT INTO officers (officer_id, badge_number, name, rank, station_id, phone, email, password_hash, role) VALUES
('OFF-101', 'BADGE-001', 'Rajesh Sharma', 'Commissioner', 'STN-01', '9800000001', 'admin@deris.gov', '$2b$10$YourHashedPasswordHere1234567890', 'Admin'),
('OFF-102', 'BADGE-102', 'Rahul Verma', 'Senior Inspector', 'STN-01', '9800000002', 'rahul.verma@deris.gov', '$2b$10$YourHashedPasswordHere1234567890', 'Investigation Officer'),
('OFF-103', 'BADGE-103', 'Ananya Sen', 'Inspector', 'STN-02', '9800000003', 'ananya.sen@deris.gov', '$2b$10$YourHashedPasswordHere1234567890', 'Investigation Officer'),
('OFF-104', 'BADGE-104', 'Dr. Vikram Adani', 'Chief Forensic Specialist', 'STN-01', '9800000004', 'vikram.forensic@deris.gov', '$2b$10$YourHashedPasswordHere1234567890', 'Forensic Officer');

-- 3. FIRs
INSERT INTO firs (fir_id, fir_number, station_id, incident_date, incident_type, location, status) VALUES
('FIR-101', 'FIR-2026-001', 'STN-01', '2026-01-15 10:30:00', 'Armed Robbery', 'Commercial Street Bank Vault', 'Investigating'),
('FIR-204', 'FIR-2026-042', 'STN-02', '2026-02-10 22:15:00', 'Grand Theft Auto', 'Highway NH-16 Toll Plaza', 'Investigating'),
('FIR-250', 'FIR-2026-089', 'STN-01', '2026-03-01 02:45:00', 'Homicide & Extortion', 'Tech Park Tower B Parking', 'Investigating'),
('FIR-121', 'FIR-2025-310', 'STN-02', '2025-11-20 23:00:00', 'Nightclub Assault', 'Downtown Lounge Alley', 'Under Review'),
('FIR-300', 'FIR-2026-105', 'STN-01', '2026-04-05 14:00:00', 'Organized Drug Cartel', 'Seaport Container Yard', 'Investigating');

-- 4. Cases
INSERT INTO cases (case_id, fir_id, case_title, crime_type, status, priority, lead_officer_id) VALUES
('C101', 'FIR-101', 'Commercial Bank Vault Armed Heist', 'Armed Robbery', 'Active', 'Critical', 'OFF-102'),
('C204', 'FIR-204', 'Highway Armored Car Hijacking', 'Grand Theft', 'Active', 'High', 'OFF-103'),
('C250', 'FIR-250', 'Tech Park Tower Homicide & Syndicate Extortion', 'Homicide', 'Active', 'Critical', 'OFF-102'),
('C121', 'FIR-121', 'Downtown Lounge Shooting & Assault', 'Attempted Murder', 'Under Review', 'Medium', 'OFF-103'),
('C300', 'FIR-300', 'Seaport Narcotics & Weapons Smuggling Ring', 'Organized Crime', 'Active', 'High', 'OFF-102');

-- 5. Suspects
INSERT INTO suspects (suspect_id, case_id, name, alias, phone_number, national_id, address, status, risk_level) VALUES
('SUS-101', 'C101', 'Vikram Singh', 'Vicky Viper', '9876543210', 'NID-99201-X', 'Plot 45, Sector 9, Bhubaneswar', 'Under Investigation', 'High'),
('SUS-102', 'C250', 'Rohan Mehta', 'Shadow', '9876543210', 'NID-88102-Y', 'Flat 302, Royal Residency, Cuttack', 'Suspect', 'Severe'),
('SUS-103', 'C300', 'Tariq Ahmed', 'Bossman', '9933221100', 'NID-77203-Z', 'Villa 12, Seaport View', 'Arrested', 'Severe');

-- 6. Victims
INSERT INTO victims (victim_id, case_id, name, phone_number, address, statement) VALUES
('VIC-101', 'C101', 'Suresh Mohanty', '9437012345', 'Commercial Bank Manager', 'Two masked gunman entered holding tactical weapons at 10:30 AM.'),
('VIC-250', 'C250', 'Amitabh Roy', '9437099999', 'Tech Corp Executive', 'Victim found deceased in parking garage with multiple stab wounds.');

-- 7. Witnesses
INSERT INTO witnesses (witness_id, case_id, name, phone_number, statement, reliability_score) VALUES
('WIT-101', 'C101', 'Priya Das', '9123456789', 'Saw a blue pickup truck with reg OD05AB1234 speed away.', 90),
('WIT-250', 'C250', 'Karan Nair', '9123456790', 'Heard heated argument regarding phone number 9876543210 right before incident.', 85);

-- 8. Evidence Items
INSERT INTO evidence (evidence_id, case_id, evidence_type, description, collected_by, storage_location, status) VALUES
('E101-P', 'C101', 'Phone', 'Burner smartphone seized near bank entrance', 'OFF-102', 'Locker A-12', 'Analyzing'),
('E101-V', 'C101', 'Vehicle', 'Blue Pickup getaway truck logged in CCTV', 'OFF-102', 'Impound Lot 2', 'Logged'),
('E101-W', 'C101', 'Weapon', 'Combat knife with custom serial signature K102', 'OFF-102', 'Forensic Vault B', 'Analyzing'),
('E250-P', 'C250', 'Phone', 'Cellular call records extracted from victim phone', 'OFF-102', 'Digital Evidence Room', 'Analyzing'),
('E250-V', 'C250', 'Vehicle', 'Surveillance clip of blue pickup truck near scene', 'OFF-102', 'Impound Lot 2', 'Logged'),
('E250-F', 'C250', 'Fingerprint', 'Latent thumbprint recovered from elevator button', 'OFF-104', 'Biometric Archive', 'Analyzing'),
('E121-W', 'C121', 'Weapon', 'Knife recovered from lounge alley matching signature K102', 'OFF-103', 'Forensic Vault B', 'Archived'),
('E300-F', 'C300', 'Fingerprint', 'Print found on narcotics package', 'OFF-104', 'Biometric Archive', 'Analyzing'),
('E204-D', 'C204', 'DNA', 'Blood swab from broken glass', 'OFF-104', 'Bio-Lab Freezer 4', 'Analyzing'),
('E300-D', 'C300', 'DNA', 'DNA sample extracted from cigarette butt', 'OFF-104', 'Bio-Lab Freezer 4', 'Analyzing');

-- 9. Phones
INSERT INTO phones (phone_id, evidence_id, phone_number, imei_number, service_provider) VALUES
('PH-101', 'E101-P', '9876543210', '864201049281045', 'Airtel'),
('PH-250', 'E250-P', '9876543210', '864201049281045', 'Airtel');

-- 10. Vehicles
INSERT INTO vehicles (vehicle_id, evidence_id, registration_number, vehicle_type, model_color, vin_number) VALUES
('VH-101', 'E101-V', 'OD05AB1234', 'Pickup Truck', 'Mahindra Bolero Blue', 'VIN-MAH-2024-9981'),
('VH-250', 'E250-V', 'OD05AB1234', 'Pickup Truck', 'Mahindra Bolero Blue', 'VIN-MAH-2024-9981');

-- 11. Weapons
INSERT INTO weapons (weapon_id, evidence_id, weapon_type, serial_number, caliber_spec, match_signature) VALUES
('WP-101', 'E101-W', 'Tactical Knife', 'SN-K102-BLD', '8-inch serrated', 'SIG-K102-TACTICAL'),
('WP-121', 'E121-W', 'Tactical Knife', 'SN-K102-BLD', '8-inch serrated', 'SIG-K102-TACTICAL');

-- 12. Fingerprints
INSERT INTO fingerprints (fingerprint_id, evidence_id, pattern_type, minutiae_hash, image_url) VALUES
('FP-250', 'E250-F', 'Whorl', 'HASH-FP-9982-MINUTIAE', '/uploads/fp250.png'),
('FP-300', 'E300-F', 'Whorl', 'HASH-FP-9982-MINUTIAE', '/uploads/fp300.png');

-- 13. DNA Samples
INSERT INTO dna_samples (dna_id, evidence_id, loci_profile, match_code) VALUES
('DNA-204', 'E204-D', 'D13S317: 11,12; D16S539: 9,13; TH01: 6,9.3', 'DNA-MATCH-STR-441'),
('DNA-300', 'E300-D', 'D13S317: 11,12; D16S539: 9,13; TH01: 6,9.3', 'DNA-MATCH-STR-441');

-- 14. Locations
INSERT INTO locations (location_id, evidence_id, address, latitude, longitude, area_code) VALUES
('LOC-101', 'E101-P', 'Commercial Street Bank Branch', 20.2961, 85.8245, '751001'),
('LOC-250', 'E250-P', 'Infocity Tech Park Tower B', 20.3588, 85.8163, '751024');

-- 15. DERIS Pre-indexed Relationship Layer (Novel Feature)
INSERT INTO relationship_index (link_id, source_case_id, target_case_id, evidence_id, match_type, match_value, score, status) VALUES
('LNK-101-250-PH', 'C250', 'C101', 'E250-P', 'Phone', '9876543210', 98, 'Active'),
('LNK-101-250-VH', 'C250', 'C101', 'E250-V', 'Vehicle', 'OD05AB1234', 95, 'Active'),
('LNK-101-121-WP', 'C121', 'C101', 'E121-W', 'Weapon', 'SIG-K102-TACTICAL', 92, 'Active'),
('LNK-250-300-FP', 'C300', 'C250', 'E300-F', 'Fingerprint', 'HASH-FP-9982-MINUTIAE', 96, 'Active'),
('LNK-204-300-DN', 'C300', 'C204', 'E300-D', 'DNA', 'DNA-MATCH-STR-441', 99, 'Active');

-- 16. Relationship History
INSERT INTO relationship_history (history_id, link_id, old_score, new_score, action_type, trigger_source) VALUES
('HST-001', 'LNK-101-250-PH', NULL, 98, 'INSERT', 'DRIA_PHONE_TRIGGER'),
('HST-002', 'LNK-101-250-VH', NULL, 95, 'INSERT', 'DRIA_VEHICLE_TRIGGER'),
('HST-003', 'LNK-101-121-WP', NULL, 92, 'INSERT', 'DRIA_WEAPON_TRIGGER'),
('HST-004', 'LNK-250-300-FP', NULL, 96, 'INSERT', 'DRIA_FINGERPRINT_TRIGGER'),
('HST-005', 'LNK-204-300-DN', NULL, 99, 'INSERT', 'DRIA_DNA_TRIGGER');

-- 17. Investigation Graph Clusters
INSERT INTO investigation_graph (cluster_id, case_id, connected_case_id, cluster_score, key_evidence_types) VALUES
('GRP-001', 'C250', 'C101', 96, 'Phone, Vehicle'),
('GRP-002', 'C121', 'C101', 92, 'Weapon'),
('GRP-003', 'C300', 'C250', 96, 'Fingerprint'),
('GRP-004', 'C300', 'C204', 99, 'DNA');
