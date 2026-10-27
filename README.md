# CareerConnect — Full-Stack Job Portal System

> **Cognetix Technology Full Stack Developer Internship — Task 5**  
> **Intern / Author:** Tejaswini Rakhunde  
> **GitHub Username:** [Tejaswini-2006](https://github.com/Tejaswini-2006)  
> **Repository:** [https://github.com/Tejaswini-2006/Cognetix_JobPortalSystem](https://github.com/Tejaswini-2006/Cognetix_JobPortalSystem)  
> **Tagline:** *"Discover Opportunities. Build Your Future."*

---

## 📌 Project Overview

**CareerConnect** is an enterprise-grade, responsive full-stack recruitment and career marketplace engineered with the MERN stack (**MongoDB, Express.js, React.js with Vite, and Node.js**). Designed with modern aesthetics (Deep Navy `#0A192F`, Crisp White, Soft Slate, and Vibrant Teal accents), CareerConnect provides a secure, role-based platform catering to three distinct user archetypes:

1. **Candidates:** Discover approved positions, filter across technical and business categories, submit applications with authenticated PDF resume uploads and personalized cover letters, and track application review milestones.
2. **Employers:** Create and manage company job requisitions, view real-time applicant counts, inspect candidate credentials, stream PDF resumes securely, and update hiring statuses with feedback notes.
3. **Administrators:** Supervise platform health and operations, review pending employer requisitions before public release, audit candidate applications, manage registered accounts, and toggle user activation.

---

## 🚀 Key Features by User Role

### 👨‍💼 Candidate Features
- **Account Registration & Authentication:** Secure registration and JWT token session handling with encrypted passwords (bcryptjs).
- **Public & Filtered Search:** Search approved listings by title, company, or skills keyword; filter by job category, location, employment type, and experience level.
- **Job Details View:** Complete breakdown of role descriptions, requirements, responsibilities, compensation range, and application deadlines.
- **Application Submission:** Apply with a PDF resume (enforcing genuine PDF validation and 5MB size limits) and custom cover letter.
- **Application Tracking:** Track progression through `pending`, `reviewed`, `shortlisted`, and `accepted` states.
- **Duplicate Prevention:** Database constraints and backend validation prevent submitting multiple applications to the same job.
- **Candidate Profile:** Customize name, contact phone, desired role headline, bio, experience years, and technical competencies.

### 🏢 Employer Features
- **Employer Dashboard:** Aggregate metrics including total job requisitions, active/approved postings, pending moderation count, and total applicants received.
- **Job Posting Management:** Publish new job listings with extensive metadata (category, compensation, skills, responsibilities). Newly created jobs default to **Pending Approval**.
- **Requisition Moderation Lifecycle:** Jobs are hidden from public board until approved by an administrator. Modifications trigger re-evaluation.
- **Ownership Protection:** Strict backend authorization checks verify employers can only edit or delete jobs created by their own account.
- **Applicant Review Hub:** Inspect applicants for each job posting, read cover letters, view candidate profiles, stream PDF resumes through authenticated endpoints, and update applicant statuses with feedback notes.

### 🛡️ Administrator Features
- **Operations Dashboard:** Real-time visibility into total registered users, candidate/employer breakdown, active job counts, and platform applications.
- **Job Moderation Board:** Filter jobs by status (`all`, `pending`, `approved`, `rejected`), review specifications, and approve/reject with one click.
- **Application Audit:** Inspect all candidate submissions across the platform with status overrides.
- **User Directory:** View all accounts, filter by role, search by name/email, and toggle active/inactive account status with self-deactivation protection.
- **Admin Initialization Security:** Regular self-registration as `admin` is blocked at the API level. Initial admin accounts are securely provisioned via environment variables and dedicated setup scripts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide React Icons |
| **Styling** | Vanilla CSS3 Design System with CSS Custom Properties, Glassmorphism & Responsive Breakpoints |
| **Backend** | Node.js, Express.js REST API |
| **Database** | MongoDB, Mongoose ODM with Compound Indexes & Text Search |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs (salt rounds = 10) |
| **File Handling** | Multer with disk storage, sanitized random filenames, and PDF MIME/extension verification |
| **Architecture** | Decoupled Client-Server with CORS and Environment-driven configuration |

---

## 📂 Project Directory Structure

```text
Cognetix_JobPortalSystem/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Current User
│   │   ├── userController.js     # Profile retrieval & update
│   │   ├── jobController.js      # Public browse, employer job CRUD
│   │   ├── applicationController.js # PDF application submission & resume streaming
│   │   └── adminController.js    # Platform metrics, moderation & user directory
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   ├── uploadMiddleware.js   # Multer PDF storage & size limits (5MB)
│   │   └── errorMiddleware.js    # Global error handling & 404 handler
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hooks & safe JSON
│   │   ├── Job.js                # Job schema with text indexes & status
│   │   └── Application.js        # Application schema with compound unique index
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/
│   │   └── resumes/              # Storage directory for candidate resumes (.gitkeep)
│   ├── utils/
│   │   ├── seedAdmin.js          # One-time administrator setup utility
│   │   └── seedData.js           # Comprehensive sample data generation
│   ├── test_api.js               # 16-point automated integration test suite
│   ├── .env.example              # Backend environment template
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # CareerConnect vector brand logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx  # Reusable confirmation dialog
│   │   │   ├── EmptyState.jsx    # Clean empty list state with actions
│   │   │   ├── ErrorAlert.jsx    # Alert notification banner
│   │   │   ├── Footer.jsx        # Platform brand footer & GitHub links
│   │   │   ├── JobCard.jsx       # Metadata cards with chips and status
│   │   │   ├── LoadingSpinner.jsx # Animated spinner
│   │   │   ├── Navbar.jsx        # Sticky navigation with role awareness & mobile drawer
│   │   │   ├── ProtectedRoute.jsx # Role-based route guard
│   │   │   ├── SearchFilterBar.jsx # Search input, category, type & location filters
│   │   │   ├── Sidebar.jsx       # Dashboard sidebar navigation
│   │   │   ├── StatCard.jsx      # Metric cards with iconography
│   │   │   └── StatusBadge.jsx   # Color-coded status tokens
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context & role helpers
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Public landing page with hero & featured jobs
│   │   │   ├── BrowseJobs.jsx    # Public job board with pagination & search
│   │   │   ├── JobDetails.jsx    # Detailed job specifications & application modal
│   │   │   ├── Login.jsx         # Sign in with one-click demo credentials
│   │   │   ├── Register.jsx      # Candidate & Employer onboarding
│   │   │   ├── candidate/
│   │   │   │   ├── CandidateDashboard.jsx
│   │   │   │   ├── CandidateProfile.jsx
│   │   │   │   └── MyApplications.jsx
│   │   │   ├── employer/
│   │   │   │   ├── EmployerDashboard.jsx
│   │   │   │   ├── CreateJob.jsx
│   │   │   │   ├── EditJob.jsx
│   │   │   │   ├── MyJobs.jsx
│   │   │   │   └── JobApplicants.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminJobs.jsx
│   │   │       ├── AdminApplications.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── styles/
│   │   │   └── index.css         # Complete CareerConnect design system
│   │   ├── App.jsx               # Main router and route definitions
│   │   └── main.jsx              # React DOM mounting
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example              # Frontend environment template
│   └── package.json
├── .gitignore                    # Git ignore file protecting .env, uploads, and node_modules
└── README.md
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or later (v22.x recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: Local MongoDB community server running on port `27017` OR a MongoDB Atlas cluster URI
- **Git**: For version control and GitHub synchronization

---

## 📥 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Tejaswini-2006/Cognetix_JobPortalSystem.git
cd Cognetix_JobPortalSystem
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory by copying the provided template:
```bash
cp .env.example .env
```

Configure your backend `.env` variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/careerconnect_db
JWT_SECRET=your_super_secret_jwt_key_careerconnect_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_SETUP_SECRET=careerconnect_admin_setup_secret_key_2026
MAX_FILE_SIZE_MB=5
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```bash
cp .env.example .env
```

Configure your frontend `.env` variable:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 Database Seeding & Administrator Initialization

### Option A: Complete Sample Dataset (Recommended for Demo)
To seed the database with an Admin, Employers, Candidates, Approved Jobs, Pending Jobs, and Applications:
```bash
cd backend
npm run seed
```

**Seeded Credentials:**
| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@careerconnect.com` | `AdminPassword@123` |
| **Employer** | `sarah@cloudscale.io` | `EmployerPassword@123` |
| **Employer** | `marcus@luminahealth.com` | `EmployerPassword@123` |
| **Candidate** | `alex.rivera@example.com` | `CandidatePassword@123` |
| **Candidate** | `elena.ui@example.com` | `CandidatePassword@123` |

### Option B: Seed Only the First Administrator
```bash
cd backend
npm run seed:admin
```
*(Optionally provide `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` in `.env` before executing).*

---

## 🏃‍♂️ Running the Application

### 1. Start the Backend API
```bash
cd backend
npm run dev   # or: npm start
```
*Backend runs at:* `http://localhost:5000`  
*API Base URL:* `http://localhost:5000/api`

### 2. Start the Frontend Client
```bash
cd frontend
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new candidate or employer account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user session data |

### 👤 User Profiles (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Private | Get profile details of current user |
| `PUT` | `/api/users/me` | Private | Update profile details (role changes prohibited) |

### 💼 Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Browse approved jobs with search, category/location filters, and pagination |
| `GET` | `/api/jobs/:id` | Public / Auth | View job details (private if pending/rejected) |
| `GET` | `/api/jobs/employer/my-jobs` | Private (Employer) | List all jobs created by current employer with applicant counts |
| `POST` | `/api/jobs` | Private (Employer) | Submit a new job (defaults to `pending` status) |
| `PUT` | `/api/jobs/:id` | Private (Employer Owner) | Edit job posting (submits for re-approval) |
| `DELETE`| `/api/jobs/:id` | Private (Employer Owner) | Delete job posting and associated applications |

### 📄 Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/:jobId` | Private (Candidate) | Apply for approved job with PDF resume & cover letter |
| `GET` | `/api/applications/my-applications`| Private (Candidate) | Retrieve candidate's submitted applications |
| `GET` | `/api/applications/job/:jobId` | Private (Employer Owner, Admin)| View applicants for a specific employer job |
| `GET` | `/api/applications/:id/resume` | Private (Authorized) | Stream PDF resume securely with authorization check |
| `PATCH`| `/api/applications/:id/status`| Private (Employer Owner, Admin)| Update applicant status (`reviewed`, `shortlisted`, `accepted`, `rejected`) |

### 🛡️ Administrator Operations (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Private (Admin) | Platform overview metrics (users, jobs, applications) |
| `GET` | `/api/admin/jobs` | Private (Admin) | View all jobs across platform with status filter |
| `PATCH`| `/api/admin/jobs/:id/status` | Private (Admin) | Approve, reject, or reset job status |
| `GET` | `/api/admin/applications` | Private (Admin) | View and audit all candidate applications |
| `PATCH`| `/api/admin/applications/:id/status`| Private (Admin) | Override application status with notes |
| `GET` | `/api/admin/users` | Private (Admin) | Directory of all registered platform users |
| `PATCH`| `/api/admin/users/:id/status` | Private (Admin) | Toggle account active/deactivated state |

---

## 🔒 Security & Resume Upload Architecture

1. **Password Encryption:** All passwords are salted and hashed using `bcryptjs` with 10 salt rounds before persistence.
2. **JWT Authorization:** Tokens carry user ID and role with an expiration period. Protected routes enforce authentication headers.
3. **Role Self-Escalation Prevention:** The registration endpoint rejects any request specifying `role: "admin"`.
4. **Ownership Verification:**
   - Employers can only edit or delete jobs where `job.employer === req.user._id`.
   - Employers can only view applications for jobs they own.
   - Candidates can only view their own applications.
5. **PDF Resume Security:**
   - Uploads are accepted only in `.pdf` format with MIME validation (`application/pdf`).
   - File size is restricted to 5MB (`MAX_FILE_SIZE_MB`).
   - Filenames are sanitized and randomized (`resume-<timestamp>-<hash>.pdf`) to prevent path traversal.
   - Resumes are stored outside public directories and served exclusively through authenticated streaming routes with strict authorization checks.

---

## 🧪 Testing Verification & Actual Results

### Automated Backend Test Suite (`npm test`)
An end-to-end integration test suite is located in `backend/test_api.js`. Run tests with:
```bash
cd backend
npm test
```

**Actual Test Execution Results:**
```text
====================================================
   CAREERCONNECT COMPREHENSIVE API TEST SUITE
====================================================

[PASS] 1. Server Health Check API
[PASS] 2. Security: Prevent user self-registration as "admin" role
[PASS] 3. Candidate Registration
[PASS] 4. Employer Registration
[PASS] 5. Validation: Reject duplicate email registration
[PASS] 6. Admin Login with initialized credentials
[PASS] 7. Employer creates job posting (defaults to "pending" approval)
[PASS] 8. Moderation: Pending job is hidden from public job board
[PASS] 9. Admin approves job posting
[PASS] 10. Moderation: Approved job is now visible in public job board
[PASS] 11. Candidate submits application with PDF resume & cover letter
[PASS] 12. Constraint: Candidate cannot submit duplicate applications for the same job
[PASS] 13. Candidate retrieves their submitted applications
[PASS] 14. Employer retrieves candidate applications for their own job posting
[PASS] 15. Access Control: Employer cannot modify another employer's job posting
[PASS] 16. Admin Dashboard aggregates accurate platform-wide metrics

====================================================
TEST SUMMARY: 16 PASSED, 0 FAILED
====================================================
```

### Browser & Responsive Design Tests
Verified across multiple viewports:
- **Mobile Viewports (360px & 390px):** Responsive navigation collapses into hamburger drawer; tables utilize horizontal scrolling; cards stack cleanly.
- **Tablet Viewport (768px):** Dashboard sidebar and cards re-arrange responsively.
- **Desktop Viewport (1024px & 1440px):** Full dashboard grid, multi-column filters, and modal dialogues.

---

## 🌐 Production Deployment Considerations

1. **Frontend Hosting (Vercel / Netlify / AWS S3 + CloudFront):**
   - Build production assets using `npm run build`.
   - Set environment variable `VITE_API_URL=https://api.yourdomain.com/api`.
2. **Backend Hosting (Render / Railway / AWS EC2):**
   - Configure Node.js runtime and set production environment variables (`NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`).
3. **Database (MongoDB Atlas):**
   - Provision a managed M0/M10 Atlas cluster and whitelist production server IP addresses.
4. **Persistent Resume Storage (AWS S3 / Cloudinary):**
   - In local development, resumes are stored in `backend/uploads/resumes/`. For multi-instance cloud deployments, configure an S3 bucket with signed URLs or private access.

---

## 📸 Interface Screenshots

| Screen | Description |
| :--- | :--- |
| **Landing Page** | Hero section with quick job search, category cards, and featured approved listings |
| **Browse Jobs** | Multi-attribute search and filter bar with pagination controls |
| **Job Details & Application** | Position specifications, requirements, and PDF resume upload modal |
| **Candidate Dashboard** | Metric summaries, recent application milestones, and profile manager |
| **Employer Dashboard** | Active job counts, pending moderation notices, and applicant review hub |
| **Admin Operations Portal** | Platform statistics overview, job requisition moderation, and user management |

---

## 📄 License & Internship Notice

This project was built for the **Cognetix Technology Full Stack Developer Internship — Task 5**.  
Developed with pride by **Tejaswini Rakhunde**.
