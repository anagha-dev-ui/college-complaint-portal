# College Complaint Portal

> A modern, responsive, and full-featured Campus Grievance Redressal Management System built with React, TypeScript, Tailwind CSS, and Vite.

Designed for universities, colleges, and educational institutes to empower students to submit grievances, receive a unique tracking ID, and monitor resolution progress in real time—while providing campus administrators with a robust dashboard for grievance triage, staff assignment, and analytics.

---

## 🌟 Key Features

### 1. Student Registration & Authentication
- Secure student sign-in with **Register Number** (e.g. `REG-2024-CS042`) or college email.
- Student registration form with **Department**, **Semester**, and contact credentials.
- 1-Click Demo autofill for rapid testing.

### 2. Comprehensive Student Dashboard
- View personal grievance statistics (Total Logged, Pending, In Progress, Resolved).
- Interactive segmented filter tabs and live search bar.
- Direct links to track status milestones and review official administration feedback.

### 3. Complaint Submission with 7 Standard Categories
- Submit complaints with:
  - **Student Name**
  - **Register Number / Roll No**
  - **Department** (8 accredited engineering & business departments)
  - **Complaint Category**:
    - `Infrastructure` (Power, water, buildings, corridors)
    - `Classroom` (Projectors, smartboards, benches, ventilation)
    - `Laboratory` (Apparatus, test benches, safety gear, chemicals)
    - `Hostel` (Rooms, hot water, catering, hygiene)
    - `Transportation` (College buses, timings, routes)
    - `Faculty` (Course scheduling, syllabus queries)
    - `Other Issues` (Library, canteen, sports grounds)
  - **Urgency / Priority Level** (Low, Medium, High, Urgent)
  - **Specific Venue / Location** (e.g., *Block B, 3rd Floor, LH-304*)
  - **Subject Title & Detailed Description**
  - **Optional File / Document Attachment**

### 4. Unique Complaint ID Generator
- Instantly generates an institutional tracking ID (e.g., `CMP-2026-1042`, `CMP-2026-1043`).
- Printable and copyable ticket confirmation docket with one-click clipboard copy.

### 5. Live Complaint Status Tracking
- Public and authenticated tracker: enter any Complaint ID or Register Number to see live milestones:
  - 🟢 **Submitted**: Date and student registration timestamp.
  - 🔵 **In Progress**: Assigned campus department officer & inspection remarks.
  - 🟢 **Resolved**: Formal resolution note and completion verification.
- Complete chronological audit log of all actions taken.

### 6. Administrator Portal & Control Console
- Secure Admin login (`admin@college.edu`).
- Admin Dashboard featuring:
  - **Multi-dimensional filters**: by Status (`Pending`, `In Progress`, `Resolved`), Category, Department, Priority, and Sort Order.
  - **Live Search**: search across ticket IDs, student names, register numbers, and descriptions.
  - **Status Updates**: update ticket status directly, record administrative action taken, and assign responsible maintenance units.
  - **CSV Report Export**: download complete grievance logs with one click for administrative compliance and UGC reporting.
  - **Delete / Archive**: remove obsolete or duplicate records.

### 7. Complaint Statistics & Performance Analytics
- Real-time resolution rate (%) and average turnaround time (1.8 Days).
- Grievances by category progress bar charts.
- Departmental volume breakdown across campus faculties.
- Priority distribution and 12h / 24h / 48h SLA response metrics.

### 8. Grievance Guidelines & Three-Tier Escalation Matrix
- Clear university grievance charter adhering to UGC guidelines.
- Three-tier escalation timeline (Tier 1: 0-48h, Tier 2: 48-96h, Tier 3: >96h).
- Interactive FAQ accordion for students.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (Clean Royal Blue `#1E3A8A` / `#2563EB` and crisp white theme)
- **Icons**: Lucide React
- **Build Tool**: Vite 8
- **Data Persistence**: LocalStorage persistence layer with pre-seeded demo database and instant reset capability
- **Deployment Targets**: GitHub & Vercel (SPA rewrite included in `vercel.json`)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed on your machine.
- npm or pnpm or yarn.

### Installation Steps

1. **Clone or download this repository**:
   ```bash
   git clone https://github.com/your-username/college-complaint-portal.git
   cd college-complaint-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to `http://localhost:3000` (or the port shown in your terminal).

---

## 🔑 Demo Login Credentials

The portal is pre-loaded with sample demo data. You can either use the **1-Click Quick Demo** buttons in the interface or enter the credentials below:

### 1. Student Access
- **Register Number**: `REG-2024-CS042` or `alex.rivers@student.college.edu`
- **Password**: `password123`
- *Alternative Student*: `REG-2024-EC108` (Sarah Chen - Electronics & Communication)

### 2. Administrator Access
- **Admin Email**: `admin@college.edu`
- **Password**: `password123`
- *Role*: Dr. Jonathan Vance (Chief Grievance Officer & Dean of Student Affairs)

---

## 📦 How to Upload to GitHub

Follow these steps to push this project to a new repository on GitHub:

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g. `college-complaint-portal`).
   - Leave it public or private, and **do not** check "Initialize with a README" (this repo already has one).
   - Click **Create repository**.

2. **Initialize git and push from your terminal**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: College Complaint Management System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/college-complaint-portal.git
   git push -u origin main
   ```

---

## 🌐 How to Deploy to Vercel

Deploying this Vite + React application on Vercel is completely free and takes under 2 minutes:

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your GitHub repository (`college-complaint-portal`) and click **"Import"**.
4. Configure Project settings (Vercel automatically detects Vite):
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**.
6. In ~30 seconds, your website will be live at `https://your-project.vercel.app`!

*Note: The included `vercel.json` ensures all client-side routes (like deep linking or refreshes) route seamlessly to `/index.html` without 404 errors.*

### Method 2: Deploy using Vercel CLI

```bash
npm install -g vercel
vercel
```
Follow the interactive prompts to deploy directly from your terminal.

---

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── assets/             # Generated campus imagery
│   │   └── images/
│   ├── components/         # Modular React components
│   │   ├── AdminDashboard.tsx      # Admin console, triage & status updates
│   │   ├── AnalyticsView.tsx       # Graphs, KPI metrics & department statistics
│   │   ├── AuthModal.tsx           # Student login/registration & admin login
│   │   ├── ComplaintDetailModal.tsx# Comprehensive ticket docket & timeline
│   │   ├── ComplaintForm.tsx       # Complaint submission with ID generator
│   │   ├── ComplaintTracker.tsx    # Real-time grievance tracker
│   │   ├── Footer.tsx              # University contacts, cells, demo reset
│   │   ├── GuidelinesView.tsx      # Redressal charter, escalation & FAQs
│   │   ├── Hero.tsx                # Hero banner with fast tracking search
│   │   ├── Navbar.tsx              # Top bar contract navigation & profile
│   │   ├── StatusBadge.tsx         # Semantic status and priority badges
│   │   └── StudentDashboard.tsx    # Student personal grievance history
│   ├── context/
│   │   └── AppContext.tsx          # LocalStorage persistence & global state
│   ├── data/
│   │   └── mockData.ts             # Pre-seeded complaints, departments & users
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces and type definitions
│   ├── App.tsx                     # Main application entry & view routing
│   ├── index.css                   # Tailwind CSS v4 styling & typography
│   └── main.tsx                    # React DOM root mounting
├── index.html                      # HTML entry with Plus Jakarta Sans font
├── metadata.json                   # AI Studio app metadata
├── package.json                    # Project dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel SPA routing configuration
└── README.md                       # Documentation & deployment guide
```

---

## 📄 License

This project is licensed under the Apache-2.0 License.
