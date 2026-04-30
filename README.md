# Zephvion Careers - Next.js Edition

A high-fidelity, cyber-minimalist job application platform designed for modern recruitment. Built with **Next.js 15**, **React 19**, and **Supabase**, this platform offers a premium, industrial aesthetic with robust real-time validation and secure document handling.

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js 18.x or higher
*   npm or yarn
*   A Supabase Project

### 2. Installation
```bash
git clone <your-repo-url>
cd zephvion_careers_next
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
# Public Supabase URL (Found in Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Public Anon Key (Found in Project Settings > API)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Secret Service Role Key (Found in Project Settings > API)
# IMPORTANT: Never share this or commit it to GitHub!
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠 Tech Stack
*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4.
*   **Backend:** Supabase (PostgreSQL, Storage, RLS).
*   **Validation:** Custom real-time validation engine.
*   **Design:** Cyber-minimalist / Industrial aesthetic with glassmorphism and high-fidelity animations.

---

## 📂 Documentation
For detailed information on the system architecture, please refer to the `Docs/` directory:
*   [**Database Guide**](./Docs/DataBase/Database.md): Table structures and ER diagrams.
*   [**Security Policies**](./Docs/DataBase/SupabasePolicy.md): SQL scripts for RLS and Storage permissions.
*   [**API & Route Guide**](./Docs/API_Guide.md): Detailed map of URLs and Server Actions.
*   [**Validation Guide**](./Docs/Form/ValidationGuide.md): Rules for form fields.

---

## 🔒 Security Policy
This platform uses **Row Level Security (RLS)** to protect candidate data. While job listings are public, all sensitive application data is restricted to the system backend using the Supabase `service_role`. 

Refer to [SupabasePolicy.md](./Docs/DataBase/SupabasePolicy.md) for the exact SQL scripts to secure your database.

---

## 📄 License
Internal use only for Zephvion Recruitment Platform.
