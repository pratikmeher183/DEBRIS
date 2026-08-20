# Comprehensive Academic Project Report
## DERIS (Dynamic Evidence Relationship Indexing System)
**Tagline:** *"A Novel DBMS-Based Evidence Correlation Framework for Crime Investigation."*

---

## Executive Summary
This report presents the complete design, architectural specification, database implementation, and frontend interface for **DERIS (Dynamic Evidence Relationship Indexing System)**. DERIS is an innovative DBMS-driven criminal investigation platform that replaces traditional high-latency multi-table SQL JOIN queries with a pre-indexed correlation layer powered by the **Dynamic Relationship Indexing Algorithm (DRIA)**.

---

## 1. Project Background & Problem Statement

### 1.1 Existing System Limitations
In standard Crime Management Systems, data is split across multiple tables (`Cases`, `Evidence`, `Phones`, `Vehicles`, `Fingerprints`, `DNA`, `Weapons`, `Suspects`). When a police officer opens a new case and searches if a phone number or vehicle registration has appeared before, the database must join 14+ tables on every query execution. This creates:
1. High query latency as case volume scales.
2. Heavy database CPU/RAM utilization.
3. Delayed identification of serial offenders and linked crimes across cities.

### 1.2 The DERIS Solution
DERIS introduces a novel `Relationship_Index` table maintained automatically by database triggers (DRIA engine). Whenever new evidence is added, DERIS immediately checks prior cases, computes match confidence scores (85%-99%), and persists the link. Future searches query the indexed table directly in $O(1)$ time.

---

## 2. Technology Stack

- **Database:** PostgreSQL / SQLite (14 Core domain tables + 4 Novel patentable tables, Triggers, Views, Procedures)
- **Backend API:** Node.js + Express.js REST API
- **Frontend UI:** React.js (Vite) + Tailwind CSS + Lucide Icons + Interactive Canvas Graph Engine
- **Authentication:** Role-based access control (Admin, Investigation Officer, Forensic Specialist)

---

## 3. Database Architecture (18 Tables)

### Core Tables (14)
`police_stations`, `officers`, `firs`, `cases`, `suspects`, `victims`, `witnesses`, `evidence`, `weapons`, `vehicles`, `phones`, `fingerprints`, `dna_samples`, `locations`, `chain_of_custody`.

### Novel Patentable Tables (4)
1. `relationship_index`: Pre-indexed correlation links with confidence scores.
2. `relationship_history`: Dynamic audit log of link additions and score changes.
3. `investigation_graph`: Connected case cluster nodes and edge weights.
4. `query_cache`: Optimized query path cache.

---

## 4. Key User Interfaces

1. **Login Screen:** Role selection with demo credentials for instant testing.
2. **Executive Dashboard:** Live metrics, recent DRIA auto-correlations, quick actions.
3. **Case Management:** FIR creation, status tracking, pre-indexed connected cases list.
4. **Evidence Vault:** Evidence logging with real-time DRIA trigger execution toasts.
5. **⭐ Relationship Index & Evidence Nexus (Hero Screen):** Interactive 2D HTML5 Canvas node-link network graph, live DRIA simulator playground, and searchable correlation matrix.
6. **DBMS Benchmark Analytics:** Empirical latency comparison charts.
7. **Documentation Hub:** In-app viewer for SRS, ER diagram, IEEE paper, and project report.

---

## 5. Verification & Testing

- **Schema Validation:** Executed SQL DDL scripts and validated foreign key constraints.
- **DRIA Trigger Validation:** Inserted duplicate phone numbers (`9876543210`) and vehicle registration numbers (`OD05AB1234`) across cases, confirming immediate auto-insertion into `relationship_index`.
- **API Endpoint Verification:** Validated all Express REST routes (`/api/cases`, `/api/evidence`, `/api/relationships`, `/api/graph`).
- **Frontend Verification:** Verified responsive modern dark theme UI rendering seamlessly in Vite.
