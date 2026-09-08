# InnoFlow – Academic Research & IP Filing Lifecycle Platform 🔬🎓

> **A centralized full-stack platform to digitize, automate, and govern the entire academic research lifecycle—from student proposal submissions and mentor evaluations to milestone tracking, document archiving, and collaborative IP patent filings.**

---

## 🏗️ Architecture Overview

```
                 +-------------------------------------------------------------+
                 |                     InnoFlow Web Client                     |
                 |  - Student Workspace   - Mentor Review Panel                |
                 |  - IP Cell Collaborative Tracker  - Instant Demo Switcher   |
                 +-------------------------------------------------------------+
                                               | (RESTful APIs + JSON)
                                               v
                 +-------------------------------------------------------------+
                 |               Java Spring Boot 3.2.3 Backend                |
                 |  - Strict RBAC: Student, Faculty, IP_Cell, Admin            |
                 |  - Automated Milestone Engine (Auto-Triggers IP Filing)     |
                 |  - File Storage Engine & Document Versioning                |
                 |  - Spring Data JPA Repositories                             |
                 +-------------------------------------------------------------+
                                               | (Hibernate / JPA)
                                               v
                 +-------------------------------------------------------------+
                 |                     MySQL 8.x Database                      |
                 |  - users, projects, proposals, milestones, reviews, filings |
                 |  - Auto-seeded with realistic campus research portfolios    |
                 +-------------------------------------------------------------+
```

---

## ✨ Core Features & Capabilities

### 🛡️ 1. Strict Role-Based Access Control (RBAC)
- Distinct portals and workflows for **Student Researchers**, **Faculty Mentors**, and **Institutional IP Cell Officers**.
- Built-in **Demo Quick Switcher** in the top navigation bar to toggle between personas instantly during demonstrations.

### 🎓 2. Student Researcher Workspace
- **Initiate Projects**: Submit research title, domain, department, abstract objectives, and mentor selection.
- **Document Archiving**: Upload PDF abstracts and proposal attachments with automatic version tracking.
- **Visual Milestone Stepper**: Real-time progress bar tracking project evolution:
  $$\text{Proposal Submitted} \longrightarrow \text{Faculty Evaluation} \longrightarrow \text{Approved / Revision} \longrightarrow \text{Ready for IP} \longrightarrow \text{Patent Granted}$$
- **Centralized Feedback History**: View mentor evaluation notes, suggestions, and timestamped reviews.

### 👨‍🏫 3. Faculty & Mentor Review Panel
- **Proposal Queue**: Filter by department and domain or search by student name.
- **Interactive Review Modal**: Read abstracts, preview/download PDF attachments, and write structured feedback.
- **Decision Engine**:
  - `Approved`: Marks milestone completed.
  - `Revision Requested`: Flags required modifications.
  - `Ready for IP Filing`: **Automatically triggers** an IP filing asset in the collaborative IP tracker.

### 🏛️ 4. Institutional IP Cell Collaborative Tracker
- **Permanent Searchable Repository**: Filter by IP category (*Patent, Copyright, Trade Secret, Industrial Design*) and lifecycle status (*Drafted, Filed, Under Examination, Granted*).
- **Application Lifecycle Management**: Assign and track official application numbers, filing dates, co-inventors, and examiner notes.
- **Portfolio Analytics**: Live KPI metrics for granted patents, active examinations, and drafting queues.
- **Audit Export**: 1-click export of the complete IP catalog to CSV for institutional reporting.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite 6 | Lucide Icons, Material UI, Google Fonts (Inter) |
| **Backend** | Java 17+, Spring Boot 3.2.3 | Spring Data JPA, Spring Security, Hibernate |
| **Database** | MySQL 8.x | Auto-migrated schema with comprehensive relations |
| **DevOps** | Docker, Docker Compose, Nginx | Multi-stage production builds, healthchecks |

---

## ⚡ Quickstart Guide

### Option 1: Docker Compose (Full Stack with MySQL)
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Build and start containers
docker-compose up -d --build

# 3. Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api/projects
```

### Option 2: Standalone Local Development
```powershell
# 1. Start Spring Boot Backend (with zero-config dev profile)
cd BackEnd
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 2. In another terminal, start React Frontend
npm install
npm run dev -- --port 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Pre-Seeded Demo Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| **Student** | Alex Johnson | `alex.student@campus.edu` | `student123` |
| **Student** | Sarah Williams | `sarah.student@campus.edu` | `student123` |
| **Faculty Mentor** | Dr. Robert Vance | `robert.faculty@campus.edu` | `faculty123` |
| **Faculty Mentor** | Dr. Emily Carter | `emily.faculty@campus.edu` | `faculty123` |
| **Institutional IP Cell** | IP Cell Officer | `ipcell@campus.edu` | `admin123` |

---

## 📄 Complete Documentation
For cloud deployment blueprints (Render.com, Railway, AWS ECS) and configuration guidelines, see [DEPLOYMENT.md](file:///d:/IQOOHack/S5-Mini_project/DEPLOYMENT.md).
