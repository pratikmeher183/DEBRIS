# System Requirements Specification (SRS)
## DERIS: Dynamic Evidence Relationship Indexing System
**Tagline:** *"A Novel DBMS-Based Evidence Correlation Framework for Crime Investigation."*

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to specify the detailed functional, database, and non-functional requirements for the **Dynamic Evidence Relationship Indexing System (DERIS)**. DERIS is an enterprise criminal evidence management and correlation system that eliminates high-latency multi-table SQL JOIN queries in crime investigations by introducing an automated, pre-indexed relationship layer driven by the **Dynamic Relationship Indexing Algorithm (DRIA)**.

### 1.2 Scope
DERIS covers:
- Complete case and FIR lifecycle management.
- Logging of evidence items across 6 subtypes (Phone, Vehicle, Weapon, Fingerprint, DNA, Location).
- Automated execution of the DRIA engine via database triggers upon evidence registration.
- Instant pre-indexed lookup of connected cases without multi-table scans.
- Interactive visualization of connected case clusters via investigation network graphs.
- Role-based access control for Admins, Investigation Officers, and Forensic Specialists.

---

## 2. Overall Description

### 2.1 Product Perspective
In traditional crime databases, discovering if a newly recovered phone number or vehicle registration exists in prior cases requires scanning 14+ tables using complex SQL `JOIN` clauses. DERIS introduces a novel `Relationship_Index` table. Whenever new evidence is added, DRIA triggers automatically evaluate matches across prior cases, compute confidence scores, and persist pre-indexed relationships.

```
Traditional RDBMS:
Evidence → SQL JOIN → Suspect → SQL JOIN → Vehicle → SQL JOIN → FIR (High Latency)

DERIS DBMS:
Evidence → Relationship Index → Connected Cases (O(1) Instant Lookup)
```

---

## 3. User Classes & Roles

1. **Admin (Commissioner / System Administrator)**
   - Add/manage police stations and officer accounts.
   - Audit system logs and trigger history.

2. **Investigation Officer (Senior Inspector / Detective)**
   - Register FIRs and criminal cases.
   - Add physical and digital evidence.
   - Search pre-indexed connected cases and view investigation network graphs.

3. **Forensic Specialist (Chief Pathologist / Lab Technician)**
   - Register biometric evidence (Fingerprint minutiae hashes, DNA loci profiles, Ballistic signatures).
   - Record and update chain of custody logs.

---

## 4. Functional Requirements

### 4.1 FIR & Case Management
- **FR-1.1:** System shall generate unique FIR Numbers (e.g. `FIR-2026-089`) and Case IDs (e.g. `C250`).
- **FR-1.2:** System shall allow setting case priority (`Medium`, `High`, `Critical`) and tracking status (`Active`, `Under Review`, `Solved`).

### 4.2 Evidence Logging & DRIA Auto-Indexing
- **FR-2.1:** System shall accept evidence subtypes: Phone Number, Vehicle Registration, Weapon Signature, Fingerprint Minutiae, DNA Loci Match Code, and Location.
- **FR-2.2:** System shall immediately execute the DRIA trigger upon evidence insertion to check for matching signatures across all historical cases.
- **FR-2.3:** If a match is detected, the system shall insert/update records in `Relationship_Index` with match confidence scores (85%-99%).

### 4.3 Relationship Index & Investigation Graph
- **FR-3.1:** System shall provide a searchable matrix of pre-computed correlations filtered by match type and score.
- **FR-3.2:** System shall render an interactive node-edge graph representing connected cases, suspects, and shared evidence.

---

## 5. Non-Functional Requirements

- **Performance:** Relationship lookup latency shall remain under 10ms for datasets up to 100,000 cases.
- **Data Integrity:** Strict foreign key constraint enforcement across 14 domain tables and 4 novel relationship tables.
- **Security:** Hashed user passwords (bcrypt) and role-based API endpoint authorization.
