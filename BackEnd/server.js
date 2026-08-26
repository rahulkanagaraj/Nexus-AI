const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration for PDF Proposal Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Serve static uploads
app.use("/uploads", express.static(uploadsDir));

// Database connection configuration with serverless resilience
let useMockData = true;
let db = null;

if (process.env.DB_HOST) {
  try {
    db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "campus_research_db",
      port: process.env.DB_PORT || 3306,
    });
    db.connect((err) => {
      if (!err) {
        console.log("Connected to cloud MySQL database successfully");
        useMockData = false;
      } else {
        console.warn("Cloud MySQL connection failed, using memory state fallback:", err.message);
      }
    });
  } catch (e) {
    console.warn("DB init error, using memory fallback");
  }
}

// Mock state fallback when database is not active
let mockUsers = [
  { id: 1, full_name: "Alex Johnson", email: "alex.student@campus.edu", password_hash: "student123", role: "STUDENT", department: "Computer Science & Engineering" },
  { id: 2, full_name: "Sarah Williams", email: "sarah.student@campus.edu", password_hash: "student123", role: "STUDENT", department: "AI & Data Science" },
  { id: 3, full_name: "Dr. Robert Vance", email: "robert.faculty@campus.edu", password_hash: "faculty123", role: "FACULTY", department: "Computer Science & Engineering" },
  { id: 4, full_name: "Dr. Emily Carter", email: "emily.faculty@campus.edu", password_hash: "faculty123", role: "FACULTY", department: "AI & Data Science" },
  { id: 5, full_name: "Administrator", email: "admin@campus.edu", password_hash: "admin123", role: "ADMIN", department: "Research & Development" },
];

let mockProjects = [
  {
    id: 1,
    title: "Autonomous Drone Swarm Navigation via Deep Reinforcement Learning",
    abstract_text: "This project proposes a decentralized deep reinforcement learning algorithm for real-time trajectory optimization in multi-agent drone swarms under GPS-denied environments.",
    department: "Computer Science & Engineering",
    domain: "Artificial Intelligence & Robotics",
    status: "UNDER_REVIEW",
    current_milestone: "Faculty Evaluation",
    student_id: 1,
    student_name: "Alex Johnson",
    faculty_id: 3,
    faculty_name: "Dr. Robert Vance",
    file_name: "Drone_Swarm_Navigation_Proposal.pdf",
    file_url: "/uploads/sample_drone_proposal.pdf",
    created_at: "2026-08-15 10:30:00",
  },
  {
    id: 2,
    title: "Blockchain-Based Secure Medical Record Vault with Zero-Knowledge Proofs",
    abstract_text: "A privacy-preserving electronic health records sharing platform leveraging ZK-SNARKs and IPFS for decentralized encryption and HIPAA compliance.",
    department: "AI & Data Science",
    domain: "Cybersecurity & Cryptography",
    status: "READY_FOR_IP",
    current_milestone: "Ready for IP Filing",
    student_id: 2,
    student_name: "Sarah Williams",
    faculty_id: 4,
    faculty_name: "Dr. Emily Carter",
    file_name: "Medical_Vault_ZKProofs_Proposal.pdf",
    file_url: "/uploads/sample_medical_proposal.pdf",
    created_at: "2026-08-18 14:15:00",
  },
  {
    id: 3,
    title: "Low-Power IoT Edge Sensor Nodes for Agricultural Soil Health Monitoring",
    abstract_text: "Designing an ultra-low energy LoRaWAN sensor node array capable of harvesting solar energy and predicting crop yield through machine learning.",
    department: "Computer Science & Engineering",
    domain: "Internet of Things (IoT)",
    status: "APPROVED",
    current_milestone: "Proposal Approved",
    student_id: 1,
    student_name: "Alex Johnson",
    faculty_id: 3,
    faculty_name: "Dr. Robert Vance",
    file_name: "IoT_Edge_Sensor_Nodes_Design.pdf",
    file_url: "/uploads/sample_iot_proposal.pdf",
    created_at: "2026-08-20 09:00:00",
  },
];

let mockReviews = [
  {
    id: 1,
    project_id: 2,
    faculty_id: 4,
    faculty_name: "Dr. Emily Carter",
    status_change: "APPROVED",
    feedback_text: "Excellent methodology on Zero-Knowledge Proof integration. The architecture is novel and suitable for patent filing under IP track.",
    reviewed_at: "2026-08-22 16:45:00",
  },
];

let mockIpFilings = [
  {
    id: 1,
    project_id: 2,
    project_title: "Blockchain-Based Secure Medical Record Vault with Zero-Knowledge Proofs",
    student_name: "Sarah Williams",
    ip_type: "PATENT",
    application_no: "IN202641098234",
    filing_status: "DRAFTED",
    filing_date: "2026-08-20",
    inventors: "Sarah Williams, Dr. Emily Carter",
    notes: "Patent abstract and claims submitted to campus IP cell.",
  },
];

// --- REST API ENDPOINTS ---

// 1. Role-Based Auth Endpoint (Login)
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const foundUser = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() || u.email.split("@")[0] === email.toLowerCase()
  );

  if (foundUser) {
    return res.json({
      message: "Login successful",
      user: {
        id: foundUser.id,
        name: foundUser.full_name,
        email: foundUser.email,
        role: foundUser.role,
        department: foundUser.department,
      },
      token: "jwt-token-campus-" + foundUser.id,
    });
  }

  if (!useMockData && db) {
    const query = "SELECT id, full_name, email, role, department FROM users WHERE email = ? AND password_hash = ?";
    db.query(query, [email, password], (err, results) => {
      if (!err && results && results.length > 0) {
        const u = results[0];
        return res.json({
          message: "Login successful",
          user: { id: u.id, name: u.full_name, email: u.email, role: u.role, department: u.department },
          token: "jwt-token-campus-" + u.id,
        });
      }
      return res.status(401).json({ message: "Invalid email or password" });
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

// 1b. Role-Based User Registration Endpoint
app.post("/api/auth/register", (req, res) => {
  const { fullName, email, password, role, department } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Full name, email, and password are required" });
  }

  const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  const newUser = {
    id: mockUsers.length + 1,
    full_name: fullName,
    email: email,
    password_hash: password,
    role: role || "STUDENT",
    department: department || "Computer Science & Engineering",
  };
  mockUsers.push(newUser);

  if (!useMockData && db) {
    const checkSql = "SELECT id FROM users WHERE email = ?";
    db.query(checkSql, [email], (err, results) => {
      if (!err) {
        const sql = "INSERT INTO users (full_name, email, password_hash, role, department) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [fullName, email, password, role || "STUDENT", department || "Computer Science & Engineering"], (err2, result) => {
          if (!err2 && result) {
            newUser.id = result.insertId;
          }
        });
      }
    });
  }

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
    },
    token: "jwt-token-campus-" + newUser.id,
  });
});

// 2. Fetch Projects (Role-Aware)
app.get("/api/projects", (req, res) => {
  const { role, userId } = req.query;

  if (useMockData || !db) {
    let list = [...mockProjects];
    if (role === "STUDENT" && userId) {
      list = list.filter((p) => String(p.student_id) === String(userId));
    }
    return res.json(list);
  }

  let sql = `
    SELECT p.*, u1.full_name AS student_name, u2.full_name AS faculty_name,
           pr.file_name, pr.file_path AS file_url
    FROM projects p
    LEFT JOIN users u1 ON p.student_id = u1.id
    LEFT JOIN users u2 ON p.faculty_id = u2.id
    LEFT JOIN proposals pr ON p.id = pr.project_id
  `;
  const params = [];

  if (role === "STUDENT" && userId) {
    sql += " WHERE p.student_id = ?";
    params.push(userId);
  } else if (role === "FACULTY" && userId) {
    sql += " WHERE p.faculty_id = ? OR p.status IN ('SUBMITTED', 'UNDER_REVIEW')";
    params.push(userId);
  }

  sql += " ORDER BY p.created_at DESC";

  db.query(sql, params, (err, results) => {
    if (err) return res.json(mockProjects);
    res.json(results);
  });
});

// 3. Create Project & Proposal PDF Upload
app.post("/api/projects", upload.single("proposalFile"), (req, res) => {
  const { title, abstractText, department, domain, studentId, facultyId } = req.body;
  const file = req.file;

  const fileName = file ? file.originalname : "Abstract_Proposal.pdf";
  const fileUrl = file ? `/uploads/${file.filename}` : "/uploads/default_abstract.pdf";

  const studentObj = mockUsers.find((u) => String(u.id) === String(studentId)) || { full_name: "Student User" };
  const facultyObj = mockUsers.find((u) => String(u.id) === String(facultyId)) || { full_name: "Dr. Faculty Mentor" };

  const newProject = {
    id: mockProjects.length + 1,
    title: title || "Untitled Campus Research",
    abstract_text: abstractText || "",
    department: department || "Computer Science",
    domain: domain || "AI & Software Systems",
    status: "SUBMITTED",
    current_milestone: "Proposal Submitted",
    student_id: Number(studentId) || 1,
    student_name: studentObj.full_name,
    faculty_id: Number(facultyId) || 3,
    faculty_name: facultyObj.full_name,
    file_name: fileName,
    file_url: fileUrl,
    created_at: new Date().toISOString(),
  };
  mockProjects.unshift(newProject);

  if (!useMockData && db) {
    const sqlProject = "INSERT INTO projects (title, abstract_text, department, domain, status, current_milestone, student_id, faculty_id) VALUES (?, ?, ?, ?, 'SUBMITTED', 'Proposal Submitted', ?, ?)";
    db.query(sqlProject, [title, abstractText, department, domain, studentId, facultyId], (err, result) => {
      if (!err && result) {
        const projectId = result.insertId;
        const sqlProposal = "INSERT INTO proposals (project_id, file_name, file_path) VALUES (?, ?, ?)";
        db.query(sqlProposal, [projectId, fileName, fileUrl]);
      }
    });
  }

  return res.status(201).json({ message: "Project proposal submitted successfully", project: newProject });
});

// 4. Faculty Review & Decision Endpoint
app.post("/api/reviews", (req, res) => {
  const { projectId, facultyId, statusChange, feedbackText } = req.body;

  const project = mockProjects.find((p) => String(p.id) === String(projectId));
  const faculty = mockUsers.find((u) => String(u.id) === String(facultyId)) || { full_name: "Dr. Faculty Mentor" };

  if (project) {
    project.status = statusChange;
    if (statusChange === "APPROVED") project.current_milestone = "Proposal Approved";
    else if (statusChange === "REVISION_REQUESTED") project.current_milestone = "Revision Requested";
    else if (statusChange === "READY_FOR_IP") project.current_milestone = "Ready for IP Filing";
    else if (statusChange === "UNDER_REVIEW") project.current_milestone = "Under Faculty Review";

    const review = {
      id: mockReviews.length + 1,
      project_id: Number(projectId),
      faculty_id: Number(facultyId),
      faculty_name: faculty.full_name,
      status_change: statusChange,
      feedback_text: feedbackText,
      reviewed_at: new Date().toISOString(),
    };
    mockReviews.unshift(review);

    if (statusChange === "READY_FOR_IP") {
      const existingIp = mockIpFilings.find((i) => String(i.project_id) === String(projectId));
      if (!existingIp) {
        mockIpFilings.push({
          id: mockIpFilings.length + 1,
          project_id: project.id,
          project_title: project.title,
          student_name: project.student_name,
          ip_type: "PATENT",
          application_no: "TEMP-IN-" + Date.now().toString().slice(-6),
          filing_status: "DRAFTED",
          filing_date: new Date().toISOString().split("T")[0],
          inventors: `${project.student_name}, ${faculty.full_name}`,
          notes: "Initiated upon faculty approval.",
        });
      }
    }
  }

  if (!useMockData && db) {
    const sqlReview = "INSERT INTO reviews (project_id, faculty_id, status_change, feedback_text) VALUES (?, ?, ?, ?)";
    db.query(sqlReview, [projectId, facultyId, statusChange, feedbackText], (err) => {
      if (!err) {
        const sqlUpdateProject = "UPDATE projects SET status = ? WHERE id = ?";
        db.query(sqlUpdateProject, [statusChange, projectId]);
      }
    });
  }

  return res.json({ message: "Review feedback saved successfully" });
});

// 5. Fetch Reviews Log
app.get("/api/projects/:id/reviews", (req, res) => {
  const { id } = req.params;
  if (useMockData || !db) {
    const list = mockReviews.filter((r) => String(r.project_id) === String(id));
    return res.json(list);
  }

  const sql = "SELECT r.*, u.full_name AS faculty_name FROM reviews r JOIN users u ON r.faculty_id = u.id WHERE r.project_id = ? ORDER BY r.reviewed_at DESC";
  db.query(sql, [id], (err, results) => {
    if (err) {
      const list = mockReviews.filter((r) => String(r.project_id) === String(id));
      return res.json(list);
    }
    res.json(results);
  });
});

// 6. IP Filing Tracker Endpoints
app.get("/api/ip-filings", (req, res) => {
  if (useMockData || !db) {
    return res.json(mockIpFilings);
  }

  const sql = `
    SELECT ip.*, p.title AS project_title, u.full_name AS student_name
    FROM ip_filings ip
    JOIN projects p ON ip.project_id = p.id
    JOIN users u ON p.student_id = u.id
    ORDER BY ip.updated_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.json(mockIpFilings);
    res.json(results);
  });
});

app.post("/api/ip-filings", (req, res) => {
  const { projectId, ipType, applicationNo, filingStatus, filingDate, inventors, notes } = req.body;

  const proj = mockProjects.find((p) => String(p.id) === String(projectId));
  const newIp = {
    id: mockIpFilings.length + 1,
    project_id: Number(projectId),
    project_title: proj ? proj.title : "Research Project",
    student_name: proj ? proj.student_name : "Student Author",
    ip_type: ipType || "PATENT",
    application_no: applicationNo || "IN-" + Date.now(),
    filing_status: filingStatus || "DRAFTED",
    filing_date: filingDate || new Date().toISOString().split("T")[0],
    inventors: inventors || "",
    notes: notes || "",
  };
  mockIpFilings.unshift(newIp);

  if (!useMockData && db) {
    const sql = "INSERT INTO ip_filings (project_id, ip_type, application_no, filing_status, filing_date, inventors, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [projectId, ipType, applicationNo, filingStatus, filingDate, inventors, notes]);
  }

  return res.status(201).json({ message: "IP filing record created successfully", ipFiling: newIp });
});

app.put("/api/ip-filings/:id", (req, res) => {
  const { id } = req.params;
  const { ipType, applicationNo, filingStatus, filingDate, inventors, notes } = req.body;

  const filing = mockIpFilings.find((item) => String(item.id) === String(id));
  if (filing) {
    if (ipType) filing.ip_type = ipType;
    if (applicationNo) filing.application_no = applicationNo;
    if (filingStatus) filing.filing_status = filingStatus;
    if (filingDate) filing.filing_date = filingDate;
    if (inventors) filing.inventors = inventors;
    if (notes) filing.notes = notes;
  }

  if (!useMockData && db) {
    const sql = "UPDATE ip_filings SET ip_type = ?, application_no = ?, filing_status = ?, filing_date = ?, inventors = ?, notes = ? WHERE id = ?";
    db.query(sql, [ipType, applicationNo, filingStatus, filingDate, inventors, notes, id]);
  }

  return res.json({ message: "IP filing updated successfully", filing });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Campus Research REST API Server running on port ${PORT}`);
  });
}

module.exports = app;
