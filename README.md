# Interview AI

> **“Practice like the interview is real.”**

**Interview AI** is an intelligent interview-preparation and placement-readiness platform built with React, Vite, Node.js, Express, Socket.IO, and MongoDB.

Designed for the **Modern Web Technologies** curriculum, the platform models the entire end-to-end placement pipeline:

$$\text{Company Intelligence} \longrightarrow \text{Personalized Preparation} \longrightarrow \text{Realistic Interview} \longrightarrow \text{Multimodal Evaluation} \longrightarrow \text{Interview Autopsy} \longrightarrow \text{Weakness Detection} \longrightarrow \text{Personalized Improvement}$$

---

## 🏛️ The 8 Distinct Core Modules

1. **Command Center (`/app/command-center`)**
   - *“What should I do next?”*
   - Real-time placement readiness score (0-100%) and daily prep streak.
   - **Intelligent Next Best Action** card backed by root-cause diagnostic reasoning.
   - Strongest vs. Priority Focus Gaps breakdown and readiness velocity trend.
   - Recent interview sessions list with direct autopsy forensic links.

2. **Company Intelligence (`/app/company-intelligence`)**
   - *“What does this company expect?”*
   - Verified interview blueprints for Zoho Corporation, TCS Digital, Amazon, Accenture, Infosys, etc.
   - Breakdown of coding intensity, CS Core weight, problem-solving depth, and standard elimination rounds.
   - Verified questions labeled with source metadata (*Verified / Reported Question*, *Reported Interview Pattern*, *Company-Style Question*).
   - Side-by-side **Company Comparison Tool** (e.g. Zoho vs. TCS).

3. **Interview Studio (`/app/interview-studio`)**
   - *“Experience the actual interview.”*
   - Setup wizard: Company, Role, Round, Difficulty, Mode, Duration.
   - Pre-Interview Equipment & Calibration (Camera stream, Live Web Audio mic level visualizer bar, Rules checklist).
   - Live virtual interview room with AI interviewer voice synthesis (`useSpeechSynthesis`), Speech-to-Text transcript (`useSpeechRecognition`), adaptive contextual questioning, and computer vision behavior tracking (`useFaceTracking`: face presence, eye-contact consistency %, gaze deviation).

4. **Resume Defense (`/app/resume-defense`)**
   - *“Can you actually defend everything written on your resume?”*
   - PDF resume upload and claim extractor (Skills, Technologies, Projects, Internships, Architecture).
   - Dedicated cross-examination interrogation session challenging architectural choices and trade-offs.
   - Live **Resume Credibility Map** (*Explained well*, *Partially explained*, *Needs deeper understanding*, *Unable to explain*).

5. **Technical Arena (`/app/technical-arena`)**
   - *“Can you actually solve technical problems?”*
   - Interactive developer coding workspace for DSA, DBMS, CS Core, and Web Technologies.
   - Multi-language sandbox editor (JavaScript, Python) with test case execution engine, time limit checks, and complexity analysis ($O(N)$, $O(1)$).
   - **Code Defense Phase**: Evaluates **Solve → Execute → Explain → Defend**.

6. **Interview Autopsy (`/app/interview-autopsy`)**
   - *“What exactly happened during my interview?”*
   - Forensic breakdown of completed sessions: Overall composite rating, Technical depth, Communication clarity, and Problem Solving scores.
   - Question-by-question scoring: User answer, transcript, correctness, what was good, what was missing, and actionable advice.
   - Communication & behavior analytics: Speaking pace (WPM), filler word count, eye-contact %, and gaze-away incidents.
   - Signature **Interactive Interview Replay Timeline** with clickable timestamped events syncing audio transcripts and metrics.

7. **Placement Readiness (`/app/placement-readiness`)**
   - *“Am I actually becoming placement-ready?”*
   - 8-dimension **Personal Skill Matrix** radar chart (DSA, DBMS, OOP, System Design, Web, Communication, Project Defense, Problem Solving).
   - **Weakness Evolution Over Time**: Proof of genuine learning across sequential sessions.
   - Company Readiness Probability Ratings derived from stored candidate performance.

8. **Interview Challenge Hub (`/app/challenge-hub`)**
   - *“Can I train under different interview conditions?”*
   - 7 distinct training modes:
     1. **Pressure Round** (30-45s fast countdown, rapid follow-ups)
     2. **Technical Deep Dive** (Progressive difficulty on single topic)
     3. **Weakness Attack** (Auto-targets previous failure points)
     4. **Communication Challenge** (STAR / PREP method verbal pacing)
     5. **Project Defense Challenge** (Architecture & failure recovery)
     6. **HR & Behavioral Challenge** (Situational ethics & conflict resolution)
     7. **Final Placement Challenge** (Full-day recruitment marathon simulation)

---

## 💻 Tech Stack

### Frontend
- **React 18** + **Vite**
- **React Router DOM v6**
- **Tailwind CSS** (Custom warm terracotta/copper & studio design system)
- **Lucide React** (Icons)
- **Recharts** (Radar and Area charts)
- **Web APIs**: MediaDevices (Camera/Mic), Web Audio API (`AudioContext`, `AnalyserNode`), Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), HTML5 Canvas for facial cadence analysis.

### Backend
- **Node.js** + **Express.js** (ES Modules)
- **Socket.IO** (Real-time live interview streaming)
- **MongoDB / Mongoose** + High-fidelity file fallback store (`backend/data/db.json`)
- **JWT (JSON Web Tokens)** + **Bcrypt.js** (Secure authentication)
- **Multer** + **pdf-parse** (Resume claim extraction)
- **Sandboxed Test Runner** (Technical Arena code execution)

---

## 🚀 Running the Application Locally

### 1. Backend Server
```powershell
cd D:\InterviewAI\backend
npm install
npm start
```
> Running on **http://localhost:5000** (Health: `http://localhost:5000/api/health`)

### 2. Frontend Client
```powershell
cd D:\InterviewAI\frontend
npm install
npm run dev -- --port 5173
```
> Running on **http://localhost:5173**

---

---

## 🔒 Authentication Flow & Test Credentials

### 👥 5 Verified Candidate Logins + 1 Admin Login

| Role | Name | Email | Password | Target Companies & Details |
|---|---|---|---|---|
| **Admin** | Dr. K. Ramanathan | `admin@interviewai.dev` | `Admin@123` | Placement Officer · Full Access to `/admin/dashboard` |
| **Candidate 1** | Balanithya M | `balanithyam04@gmail.com` | `Candidate@123` | NEC Kovilpatti (IT) · Target: Zoho & TCS Digital |
| **Candidate 2** | Arun Kumar S | `candidate@gmail.com` | `Candidate@123` | PSG Tech (CSE) · Target: Amazon SDE-1 |
| **Candidate 3** | Nithya R | `nithi06@gmail.com` | `Candidate@123` | NEC Kovilpatti (IT) · Target: TCS Digital / Prime |
| **Candidate 4** | Kavitha S | `kavitha.s@nec.edu.in` | `Candidate@123` | NEC Kovilpatti (CSE) · Target: Infosys SP |
| **Candidate 5** | Siddharth M | `siddharth.m@gmail.com` | `Candidate@123` | TCE Madurai (AI & DS) · Target: Amazon & Accenture |

> ⚡ **Tip**: The Sign-In page has a **"Quick Demo Accounts"** accordion. Click any account to instantly populate credentials and test!

---

## 🌟 11 Mandatory Features Implementation Verification

1. **OAuth Authentication**: Google Sign-In with interactive modal and `/google-auth` route, issuing validated JWT credentials.
2. **JWT (JSON Web Tokens)**: Cryptographically signed tokens (`jsonwebtoken`), 7-day TTL, verified via `authenticateToken` middleware with Bearer header.
3. **At least 5 User Logins**: 5 distinct, pre-verified candidate accounts + 1 admin account with authentic university backgrounds.
4. **Admin Dashboard (`/admin/dashboard`)**:
   - Institutional placement KPIs (Total Candidates, Evaluated Interviews, Average Readiness Score).
   - Candidate roster management with real-time readiness meters and removal tools.
   - Forensic Autopsies inspection archive (WPM, Eye-contact %, Filler words).
   - Real-time System Audit Trail and Company Blueprint registry.
   - Dedicated Admin Sign-In portal (`/admin/login`).
5. **API Access**: 11 modular REST API route controllers covering candidates, admins, interviews, code sandbox, and chatbot.
6. **AI Placement Assistant Chatbot**: Floating 24/7 AI coach with Speech Synthesis audio output, quick prompts for Zoho/TCS/Amazon, and English/Tamil support.
7. **Recently Accessed Workspaces**: Global `RecentlyAccessedDrawer` in Navbar + quick-jump recent workspaces strip on the Command Center.
8. **Multi-lingual Support**: Dynamic **English / தமிழ்** toggle in the Navbar adapting navigation, badges, and chatbot responses without page reload.
9. **Authentic Valid Data**: Genuine blueprints for Zoho Corporation, TCS Digital, Amazon, Accenture, Infosys with real placement drive questions, authentic college candidate profiles, and realistic interview autopsies (No sample/dummy data).
10. **Resume-Defending Unique Features**:
    - **Multimodal Web Audio Visualizer**: Real-time microphone audio frequency tracking.
    - **Computer Vision Behavioral Tracking**: Live face detection, gaze deviation, and eye-contact percentage.
    - **Resume Defense Engine**: Automated PDF parsing and architectural cross-examination interrogator.
    - **Interview Autopsy Forensics**: Speaking speed (WPM), filler word detector, and interactive timestamped replay timeline.
11. **Strictly Non-CRUD Architecture**: Signal processing, audio spectrum analysis, speech recognition, speech synthesis, computer vision tracking, and sandboxed test-case execution.
