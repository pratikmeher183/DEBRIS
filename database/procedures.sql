-- ============================================================================
-- DERIS: Stored Procedures & Functions Specification
-- ============================================================================

-- Stored Procedure: Recalculate Composite Cluster Score for a Case pair
CREATE OR REPLACE PROCEDURE sp_recalculate_cluster_score(
    p_source_case VARCHAR(50),
    p_target_case VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_score INT := 0;
    v_link_count INT := 0;
    v_types TEXT := '';
    v_rec RECORD;
BEGIN
    FOR v_rec IN 
        SELECT match_type, score 
        FROM relationship_index 
        WHERE (source_case_id = p_source_case AND target_case_id = p_target_case)
           OR (source_case_id = p_target_case AND target_case_id = p_source_case)
    LOOP
        v_total_score := v_total_score + v_rec.score;
        v_link_count := v_link_count + 1;
        IF v_types = '' THEN
            v_types := v_rec.match_type;
        ELSE
            v_types := v_types || ', ' || v_rec.match_type;
        END IF;
    END LOOP;

    IF v_link_count > 0 THEN
        INSERT INTO investigation_graph (cluster_id, case_id, connected_case_id, cluster_score, key_evidence_types)
        VALUES ('GRP-' || gen_random_uuid(), p_source_case, p_target_case, (v_total_score / v_link_count), v_types)
        ON CONFLICT (case_id, connected_case_id)
        DO UPDATE SET cluster_score = EXCLUDED.cluster_score, 
                      key_evidence_types = EXCLUDED.key_evidence_types, 
                      updated_at = CURRENT_TIMESTAMP;
    END IF;
END;
$$;


-- Function: Use Cursor to Traverse and Retrieve All Connected Cases for a Target Case
CREATE OR REPLACE FUNCTION fn_get_connected_cases_cursor(p_case_id VARCHAR(50))
RETURNS TABLE (
    linked_case_id VARCHAR(50),
    case_title VARCHAR(200),
    match_type VARCHAR(50),
    match_value VARCHAR(255),
    score INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    cur_links CURSOR FOR 
        SELECT 
            CASE WHEN source_case_id = p_case_id THEN target_case_id ELSE source_case_id END AS conn_case,
            ri.match_type,
            ri.match_value,
            ri.score
        FROM relationship_index ri
        WHERE ri.source_case_id = p_case_id OR ri.target_case_id = p_case_id;
    
    r_link RECORD;
    v_title VARCHAR(200);
BEGIN
    OPEN cur_links;
    LOOP
        FETCH cur_links INTO r_link;
        EXIT WHEN NOT FOUND;

        SELECT c.case_title INTO v_title FROM cases c WHERE c.case_id = r_link.conn_case;

        linked_case_id := r_link.conn_case;
        case_title := v_title;
        match_type := r_link.match_type;
        match_value := r_link.match_value;
        score := r_link.score;
        RETURN NEXT;
    END LOOP;
    CLOSE cur_links;
END;
$$;
