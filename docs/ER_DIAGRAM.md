# DERIS Entity-Relationship & BCNF Normalization Document

## 1. System Overview
**DERIS (Dynamic Evidence Relationship Indexing System)** uses a normalized relational model consisting of **14 Core Domain Tables** and **4 Novel DERIS Innovation Tables**.

---

## 2. Entity-Relationship Schema Diagram (Textual Representation)

```
 [Police_Stations] 1 ──── N [Officers]
                          │ 1
                          │ N
 [FIRs] 1 ─────────────── N [Cases] 1 ──── N [Suspects]
                            │ 1    1 ──── N [Victims]
                            │ N    1 ──── N [Witnesses]
                            │
                     [Evidence] (Parent)
                            │ 1
       ┌───────────┬────────┴──────────┬───────────┐
       │ 1         │ 1                 │ 1         │ 1
   [Phones]    [Vehicles]          [Weapons]   [Fingerprints] ...
       │           │                   │           │
       └───────────┴────────┬──────────┴───────────┘
                            │ DRIA Triggers
                            ▼
                ┌────────────────────────┐
                │   Relationship_Index   │ (Novel Pre-Indexed Correlation Layer)
                └───────────┬────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
  [Relationship_History]     [Investigation_Graph]
```

---

## 3. Database Table Specifications

### 3.1 Core Domain Tables
1. `police_stations` (`station_id` PK, `station_code` UNIQUE, `name`, `city`, `state`, `contact_phone`)
2. `officers` (`officer_id` PK, `badge_number` UNIQUE, `name`, `rank`, `station_id` FK, `role`)
3. `firs` (`fir_id` PK, `fir_number` UNIQUE, `station_id` FK, `incident_date`, `incident_type`, `location`, `status`)
4. `cases` (`case_id` PK, `fir_id` FK, `case_title`, `crime_type`, `status`, `priority`, `lead_officer_id` FK)
5. `suspects` (`suspect_id` PK, `case_id` FK, `name`, `alias`, `phone_number`, `national_id`, `risk_level`)
6. `victims` (`victim_id` PK, `case_id` FK, `name`, `phone_number`, `statement`)
7. `witnesses` (`witness_id` PK, `case_id` FK, `name`, `phone_number`, `statement`, `reliability_score`)
8. `evidence` (`evidence_id` PK, `case_id` FK, `evidence_type`, `description`, `collected_by` FK, `storage_location`)
9. `weapons` (`weapon_id` PK, `evidence_id` FK, `weapon_type`, `serial_number`, `match_signature`)
10. `vehicles` (`vehicle_id` PK, `evidence_id` FK, `registration_number`, `vehicle_type`, `model_color`, `vin_number`)
11. `phones` (`phone_id` PK, `evidence_id` FK, `phone_number`, `imei_number`, `service_provider`)
12. `fingerprints` (`fingerprint_id` PK, `evidence_id` FK, `pattern_type`, `minutiae_hash`)
13. `dna_samples` (`dna_id` PK, `evidence_id` FK, `loci_profile`, `match_code`)
14. `locations` (`location_id` PK, `evidence_id` FK, `address`, `latitude`, `longitude`)

### 3.2 Novel DERIS Tables (Patentable Innovation)
15. **`relationship_index`**: `link_id` PK, `source_case_id` FK, `target_case_id` FK, `evidence_id` FK, `match_type`, `match_value`, `score`, UNIQUE(`source_case_id`, `target_case_id`, `match_type`, `match_value`)
16. **`relationship_history`**: `history_id` PK, `link_id` FK, `old_score`, `new_score`, `action_type`, `trigger_source`
17. **`investigation_graph`**: `cluster_id` PK, `case_id` FK, `connected_case_id` FK, `cluster_score`, `key_evidence_types`
18. **`query_cache`**: `cache_id` PK, `query_hash` UNIQUE, `parameter_value`, `result_payload`, `hit_count`

---

## 4. Normalization Analysis (Up to BCNF)

- **1NF Compliance:** All attributes contain atomic values (e.g. phone numbers, VIN numbers, minutiae hashes are single values; multi-valued attributes like loci profiles are structured as explicit single strings).
- **2NF Compliance:** All non-key attributes are fully functionally dependent on the primary key. Subtype entities (`phones`, `vehicles`, `weapons`) reference `evidence_id` directly, eliminating partial dependencies.
- **3NF Compliance:** No transitive dependencies exist. Attributes like `station_name` are not stored redundantly in `cases` or `officers`; they are derived via foreign keys to `police_stations`.
- **BCNF Compliance:** For every functional dependency $X \rightarrow Y$, $X$ is a superkey. For instance, in `officers`, `badge_number` and `email` are unique candidate keys, and all other attributes depend entirely on them.
