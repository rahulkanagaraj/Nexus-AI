# Automated Campus Research Project Lifecycle Management & Collaborative IP Filing Dashboard 🔬🎓

> **A Comprehensive Full-Stack Academic Platform to Digitize, Evaluate, and Archive Campus Research Initiatives and Intellectual Property Filings.**

---

## ⚠️ Problem Statement

Managing campus research projects and Intellectual Property (IP) filings is traditionally a highly manual, fragmented, and inefficient process. Students rely on decentralized communication methods—such as emails, physical paperwork, and scattered messaging apps—to submit proposals, share documents, and request mentor feedback.

This leads to several critical issues:
- **Lack of Centralized Tracking**: Faculty members struggle to monitor the progress of multiple student projects simultaneously, leading to delayed reviews and missed deadlines.
- **Poor Milestone Visibility**: Students lack a clear, real-time view of their project's approval status or what specific revisions are required by reviewers.
- **Data Loss & Disorganization**: Abstract documents, feedback logs, and IP filing statuses often get lost in email threads, making it difficult for the institution to maintain a proper archive of campus research.

There is an urgent need for a centralized, automated platform that bridges the communication gap between students and faculty while securely managing the entire research lifecycle from proposal submission to final approval and patent filing.

---

## 📝 Project Description

The **Automated Campus Research Project Lifecycle Management and Collaborative IP Filing Dashboard** digitizes and streamlines academic research administration. 

Built using a modern tech stack—**React** for a responsive user interface, **Java Spring Boot** and **Node.js Express** REST APIs mapped to a **MySQL** relational database—the system enforces secure **Role-Based Access Control (RBAC)** across students and faculty reviewers.

---

## ✨ Key Modules & Features

### 🛡️ 1. Role-Based Access Control (RBAC)
- Secure login and registration portals explicitly separated for **Students** and **Faculty Reviewers**.
- Strict authorization checks ensuring users only see data relevant to their access level.

### 👨‍🎓 2. Student Research Workspace
- **Initiate New Projects**: Submit research titles, research domains, department details, abstract objectives, and assigned faculty guides.
- **Document Upload**: Integrated PDF abstract and proposal document uploader.
- **Visual Milestone Tracker**: Real-time stage progress bar tracking project evolution:
  $$\text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Approved / Revision} \longrightarrow \text{Ready for IP} \longrightarrow \text{Patent Granted}$$
- **Feedback History**: Interactive view of faculty evaluation notes and requested revisions.

### 👨‍🏫 3. Faculty Review Panel
- **Consolidated Evaluation Console**: Overview of pending student proposals assigned across departments.
- **Filter & Search**: Quick filtering by status (`Submitted`, `Under Review`, `Approved`, `Ready for IP`) or search by student name/title.
- **PDF Document Inspection**: 1-click preview/download of student proposal files.
- **Dynamic Decision Engine**: Input constructive feedback notes and update project state (`Approve`, `Request Revisions`, `Mark Ready for IP Filing`, `Reject`).

### 📜 4. IP Filing & Patent Repository
- Dedicated module tracking Intellectual Property filings for approved research projects.
- Manage patent details: IP Type (*Patent, Copyright, Trade Secret*), Application Number, Filing Date, Inventors List, and Status (*Drafted, Filed, Under Examination, Granted*).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 19, Vite 6 |
| **UI Library & Styling** | Material UI (`@mui/material`), Bootstrap 5.3, Lucide React Icons |
| **Routing & Auth** | React Router v7 (`react-router-dom`), React Context API (`AuthContext`) |
| **Backend Java Runtime** | Java 17+, Spring Boot 3.2 (Spring Data JPA, Spring Security, Lombok) |
| **Backend Node REST API** | Node.js v24, Express.js, Multer (PDF File Storage) |
| **Database** | MySQL 8.0 (`schema.sql` relational foreign key constraints) |

---

## 📁 Directory Structure

```text
S5-project/
├── BackEnd/
│   ├── pom.xml                        # Spring Boot Maven dependencies
│   ├── schema.sql                     # MySQL schema & initial seed data
│   ├── db.js                          # MySQL connection module
│   ├── server.js                      # Express REST API server & Multer uploader
│   ├── uploads/                       # Uploaded proposal PDF files
│   └── src/main/java/com/campus/research/
│       ├── ResearchPortalApplication.java
│       └── model/                     # User, Project, IpFiling JPA entities
└── src/
    ├── App.jsx                        # RBAC Route Router
    ├── index.css                      # Clean design system styles
    ├── components/
    │   ├── Navbar.jsx                 # MUI + Bootstrap Header
    │   ├── Sidebar.jsx                # Role navigation bar
    │   └── MilestoneTimeline.jsx      # Visual stage progress bar
    ├── context/
    │   └── AuthContext.jsx            # User session & role provider
    └── pages/
        ├── LoginPage.jsx              # Compact Sign In / Sign Up portal
        ├── Student/
        │   ├── StudentDashboard.jsx   # Student projects & milestone tracker
        │   └── NewProjectModal.jsx    # Proposal PDF upload modal
        ├── Faculty/
        │   └── FacultyReviewPanel.jsx # Faculty evaluation console
        └── IpFilingTracker.jsx        # Institutional patent repository
```

---

## 🚀 Getting Started

### 1. Database Setup (MySQL)
Open your MySQL Workbench / Command Line and execute the SQL script in `BackEnd/schema.sql`:
```sql
SOURCE BackEnd/schema.sql;
```
This creates `campus_research_db` with all tables (`users`, `projects`, `proposals`, `milestones`, `reviews`, `ip_filings`) and seeds initial demo data.

### 2. Backend Setup
Navigate to `BackEnd/` and start the Node/Express REST API server:
```bash
cd BackEnd
npm install
node server.js
```
*Server runs on `http://localhost:5000`.*

*(Optional)* Or compile with Java Spring Boot:
```bash
cd BackEnd
mvn spring-boot:run
```

### 3. Frontend Setup
In the root directory, install dependencies and start the Vite dev server:
```bash
npm install
npm run dev
```
*App runs on `http://localhost:5173`.*

---

## 📊 Summary of Week 1–3 Deliverables
- **Problem Formulation & Supervisor Discussion**: Formulated database-level RBAC architecture to eliminate unauthorized data access.
- **Frontend Architecture**: Built role-specific React dashboards, PDF proposal submission modals, and visual milestone timelines.
- **Backend REST API**: Implemented Spring Boot and Express REST endpoints for proposal handling, file upload storage, evaluation reviews, and IP filing tracking.
- **Database Schema**: Created MySQL relational constraints and foreign key relationships across all core research entities.
