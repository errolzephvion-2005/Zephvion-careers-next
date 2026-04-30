# Database Architecture & Connection Guide

This document outlines how the Zephvion Careers platform connects to the Supabase PostgreSQL database and details the exact schema structures used for the core platform.

---

## 1. Database Connection

The application uses **Supabase** as its backend database and utilizes the `@supabase/ssr` (Server-Side Rendering) package for secure connections in Next.js App Router.

### Environment Setup
To connect, the following variables must be defined in your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
```

### Quick Start: How to Run
1.  **Install dependencies:** `npm install`
2.  **Set up Env:** Create `.env.local` with the keys above.
3.  **Run Server:** `npm run dev`
4.  **Database Setup:** Run the SQL scripts found in `Docs/DataBase/SupabasePolicy.md` in your Supabase SQL Editor.

### Connection Modules (`lib/supabase/`)
We utilize a modular approach with two distinct connection clients:

1. **Client-Side Connection (`client.ts`)**
   - **Usage:** Used inside React Client Components (e.g., `useEffect` hooks).
   - **Mechanism:** Creates a browser-safe Supabase client using `createBrowserClient`.

2. **Server-Side Connection (`server.ts`)**
   - **Usage:** Used inside Server Actions (`actions.ts`), API Routes, and Server Components.
   - **Mechanism:** Uses `createServerClient` and passes the Next.js `cookies()` object. This allows the server to securely read/write auth sessions and bypass CORS restrictions safely.

---

## 2. Table Structures

The database is built on PostgreSQL and relies on a relational model to ensure data integrity and deduplication.

### `jobs`
Stores all available job listings.
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  job_title TEXT NOT NULL,
  job_reference_code TEXT UNIQUE NOT NULL, -- The public ID used in URLs (e.g. INFSYS-EXTERNAL-243494)
  work_experience TEXT,
  location TEXT NOT NULL,
  educational_requirements TEXT,
  service_line TEXT NOT NULL,
  category TEXT NOT NULL,
  responsibilities TEXT NOT NULL,
  technical_requirements TEXT,
  preferred_skills TEXT,
  job_type TEXT NOT NULL,
  salary TEXT DEFAULT 'NOT DISCLOSED',     -- Added via Migration 001
  is_trending BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,          -- Used to hide jobs from the frontend
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `candidates`
Stores unique candidate profiles identified by email.
```sql
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,              -- Primary identifier (Strictly Unique)
  contact_number TEXT,                     -- Not unique (allows updates/re-use)
  linkedin TEXT,
  github TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```
**Policy:** If a candidate applies with an existing email, their latest details (Name, Phone, Links) will **overwrite** the old data to ensure the recruitment team has the most up-to-date contact info.

### `applications`
A relational junction table mapping a specific `candidate` to a specific `job`.
```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL,                     -- Internal INT reference to jobs.id
  candidate_id INT NOT NULL,               -- Internal INT reference to candidates.id
  motivation TEXT NOT NULL,                
  resume_url TEXT NOT NULL,                
  cover_letter_url TEXT,                   
  status TEXT DEFAULT 'applied',           
  created_at TIMESTAMP DEFAULT NOW(),

  -- Relationships
  CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
```
**Policy:** Candidates are **permitted to apply multiple times** for the same job and for different jobs. Every submission creates a fresh application record. The `unique_application` constraint has been removed to facilitate this flexibility. 
