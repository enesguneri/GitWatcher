# 🔍 GitWatcher — AI-Powered GitHub Profile Analyzer & Security Auditor

GitWatcher is a modern, security-first full-stack web platform designed to analyze software developers' public GitHub profiles, repository metrics, coding habits, and codebase vulnerabilities using Google Gemini AI.

---

## 🚀 Key Features

*   **🛡️ Automated Security Audits:** Scans repository configurations, README files, and metadata to check for potential secret leaks, lack of security instructions, and OWASP compliance issues.
*   **🤖 AI-Powered Developer Personas:** Dynamically assigns a tailored developer persona title, profile summary, key strengths, and growth paths based on language stats and commit history.
*   **📈 Actionable Codebase Recommendations:** Formulates prioritized suggestions divided into Security, Documentation, Code Quality, Architecture, Testing, and DevOps.
*   **⚡ Smart Cache Layer:** Caches all AI analysis results in MongoDB for **24 hours** to minimize latency and API usage costs.
*   **⛨ Edge-Compatible Route Protection:** Next.js 16 Edge Proxy intercepts requests to ensure secure route guards on `/dashboard` and prevent duplicate auth page access.

---

## 🛠️ Technological Stack

*   **Framework:** Next.js 16 (App Router) & React 19
*   **Backend Communication:** Next.js Server Actions
*   **Database:** MongoDB Atlas (Mongoose ODM)
*   **Authentication:** JWT Session (`jose`) stored in HTTP-Only, SameSite=Lax Cookies
*   **Encryption:** `bcryptjs` (10 rounds salt hashing)
*   **Styling:** Tailwind CSS v4 & custom glassmorphism styles
*   **AI Engine:** Google Gemini API (`@google/generative-ai` using **`gemini-3.1-flash-lite`**)

---

## 📂 Project Structure

```
GitWatcher/
├── src/
│   ├── app/                    # Next.js pages & layouts
│   │   ├── dashboard/          # Protected dashboard views
│   │   │   ├── analysis/       # AI Analysis layouts & components
│   │   │   └── components/     # Statistics, graphs, commit timeline
│   │   ├── login/              # Premium login page
│   │   ├── register/           # Premium registration page
│   │   └── page.tsx            # Premium landing page
│   ├── lib/                    # Shared modules & helper libraries
│   │   ├── actions.ts          # Server Actions (Auth, AI triggering)
│   │   ├── ai.ts               # Gemini API prompt generation
│   │   ├── github.ts           # GitHub API REST connection service
│   │   ├── mongodb.ts          # Cached database connection pool
│   │   ├── session.ts          # JWT session sign/verify
│   │   └── types.ts            # TypeScript shared definitions
│   ├── models/                 # Mongoose models (User, Analysis)
│   └── proxy.ts                # Next.js 16 middleware route protection
├── next.config.ts              # Production configs & security headers
├── tsconfig.json               # TypeScript configurations
└── .env.example                # Local setup configuration file
```

---

## ⚙️ Local Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/enesguneri/GitWatcher.git
cd GitWatcher
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env.local` in the root directory and copy the contents from `.env.example`:
```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/gitwatcher

# JWT Secret
JWT_SECRET=your_random_32_character_signing_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Optional GitHub Token (increases rate limit from 60 to 5000 requests/hour)
# GITHUB_TOKEN=ghp_your_token
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🔒 Security Compliance Features
*   **XSS Protection:** Direct HTML rendering from AI output is disabled; sanitization protocols are strictly followed.
*   **CSRF Protection:** Token sessions are configured with strict `sameSite: 'lax'` cookie restrictions.
*   **Security Headers:** Configured with active `X-Frame-Options (DENY)`, `X-Content-Type-Options (nosniff)`, and `Referrer-Policy` headers.