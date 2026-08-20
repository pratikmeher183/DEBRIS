-- ============================================================================
-- DERIS: Dynamic Relationship Indexing Algorithm (DRIA) Triggers & Procedures
-- PostgreSQL PL/pgSQL Specification
-- ============================================================================

-- Function: DRIA Core Engine for Phone Evidence Auto-Indexing
CREATE OR REPLACE FUNCTION dria_process_phone_evidence()
RETURNS TRIGGER AS $$
DECLARE
    curr_case_id VARCHAR(50);
    matched_record RECORD;
    new_link_id VARCHAR(50);
    score_val INT := 98; -- Phone match baseline confidence score
BEGIN
    -- Get case_id of the newly inserted phone evidence
    SELECT case_id INTO curr_case_id FROM evidence WHERE evidence_id = NEW.evidence_id;

    -- Find matching phone numbers in other cases
    FOR matched_record IN
        SELECT e.case_id AS target_case_id, e.evidence_id AS target_evidence_id, p.phone_number
        FROM phones p
        JOIN evidence e ON p.evidence_id = e.evidence_id
        WHERE p.phone_number = NEW.phone_number
          AND e.case_id <> curr_case_id
    LOOP
        new_link_id := 'LNK-' || gen_random_uuid();
        
        -- Insert into Relationship Index if not already existing
        INSERT INTO relationship_index (link_id, source_case_id, target_case_id, evidence_id, match_type, match_value, score, status)
        VALUES (new_link_id, curr_case_id, matched_record.target_case_id, NEW.evidence_id, 'Phone', NEW.phone_number, score_val, 'Active')
        ON CONFLICT (source_case_id, target_case_id, match_type, match_value) 
        DO UPDATE SET score = EXCLUDED.score, created_at = CURRENT_TIMESTAMP;

        -- Log in Relationship History
        INSERT INTO relationship_history (history_id, link_id, old_score, new_score, action_type, trigger_source)
        VALUES ('HST-' || gen_random_uuid(), new_link_id, NULL, score_val, 'INSERT', 'DRIA_PHONE_TRIGGER');

        -- Update Investigation Graph edge
        INSERT INTO investigation_graph (cluster_id, case_id, connected_case_id, cluster_score, key_evidence_types)
        VALUES ('GRP-' || gen_random_uuid(), curr_case_id, matched_record.target_case_id, score_val, 'Phone')
        ON CONFLICT (case_id, connected_case_id) 
        DO UPDATE SET cluster_score = GREATEST(investigation_graph.cluster_score, score_val), updated_at = CURRENT_TIMESTAMP;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition for phones
CREATE OR REPLACE TRIGGER trg_dria_phone_insert
AFTER INSERT ON phones
FOR EACH ROW
EXECUTE FUNCTION dria_process_phone_evidence();


-- Function: DRIA Core Engine for Vehicle Evidence Auto-Indexing
CREATE OR REPLACE FUNCTION dria_process_vehicle_evidence()
RETURNS TRIGGER AS $$
DECLARE
    curr_case_id VARCHAR(50);
    matched_record RECORD;
    new_link_id VARCHAR(50);
    score_val INT := 95; -- Vehicle reg match confidence score
BEGIN
    SELECT case_id INTO curr_case_id FROM evidence WHERE evidence_id = NEW.evidence_id;

    FOR matched_record IN
        SELECT e.case_id AS target_case_id, v.registration_number
        FROM vehicles v
        JOIN evidence e ON v.evidence_id = e.evidence_id
        WHERE v.registration_number = NEW.registration_number
          AND e.case_id <> curr_case_id
    LOOP
        new_link_id := 'LNK-' || gen_random_uuid();
        
        INSERT INTO relationship_index (link_id, source_case_id, target_case_id, evidence_id, match_type, match_value, score, status)
        VALUES (new_link_id, curr_case_id, matched_record.target_case_id, NEW.evidence_id, 'Vehicle', NEW.registration_number, score_val, 'Active')
        ON CONFLICT (source_case_id, target_case_id, match_type, match_value) DO NOTHING;

        INSERT INTO relationship_history (history_id, link_id, old_score, new_score, action_type, trigger_source)
        VALUES ('HST-' || gen_random_uuid(), new_link_id, NULL, score_val, 'INSERT', 'DRIA_VEHICLE_TRIGGER');
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_dria_vehicle_insert
AFTER INSERT ON vehicles
FOR EACH ROW
EXECUTE FUNCTION dria_process_vehicle_evidence();
