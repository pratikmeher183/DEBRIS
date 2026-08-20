-- ============================================================================
-- DERIS: Views Specification for Analytical & Correlation Reporting
-- ============================================================================

-- 1. View: Complete Case Correlation Matrix
CREATE OR REPLACE VIEW v_case_correlations AS
SELECT 
    ri.link_id,
    ri.source_case_id,
    c1.case_title AS source_case_title,
    c1.crime_type AS source_crime_type,
    ri.target_case_id,
    c2.case_title AS target_case_title,
    c2.crime_type AS target_crime_type,
    ri.match_type,
    ri.match_value,
    ri.score,
    ri.status,
    ri.created_at
FROM relationship_index ri
JOIN cases c1 ON ri.source_case_id = c1.case_id
JOIN cases c2 ON ri.target_case_id = c2.case_id;

-- 2. View: Evidence Distribution Summary per Case
CREATE OR REPLACE VIEW v_evidence_summary AS
SELECT 
    c.case_id,
    c.case_title,
    c.crime_type,
    c.status AS case_status,
    COUNT(e.evidence_id) AS total_evidence_count,
    SUM(CASE WHEN e.evidence_type = 'Phone' THEN 1 ELSE 0 END) AS phone_count,
    SUM(CASE WHEN e.evidence_type = 'Vehicle' THEN 1 ELSE 0 END) AS vehicle_count,
    SUM(CASE WHEN e.evidence_type = 'Weapon' THEN 1 ELSE 0 END) AS weapon_count,
    SUM(CASE WHEN e.evidence_type = 'Fingerprint' THEN 1 ELSE 0 END) AS fingerprint_count,
    SUM(CASE WHEN e.evidence_type = 'DNA' THEN 1 ELSE 0 END) AS dna_count
FROM cases c
LEFT JOIN evidence e ON c.case_id = e.case_id
GROUP BY c.case_id, c.case_title, c.crime_type, c.status;

-- 3. View: High Confidence Correlations (Score >= 90)
CREATE OR REPLACE VIEW v_high_confidence_links AS
SELECT * 
FROM v_case_correlations
WHERE score >= 90;
