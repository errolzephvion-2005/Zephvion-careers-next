# Supabase Row Level Security (RLS) & Storage Policies

This guide provides the exact SQL scripts to configure security layers in your Supabase dashboard. It ensures job listings are public while candidate data remains strictly private and accessible only by the system.

---

## 1. Core Table Security

Run these scripts in your **Supabase SQL Editor** to set up the required permissions.

### A. Jobs Table (`public.jobs`)
**Goal:** Allow everyone to browse jobs, but keep management restricted.

```sql
-- 1. Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- 2. Create SELECT policy (Public Access)
CREATE POLICY "Allow select for all users" 
ON public.jobs 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 3. Create INSERT policy (Backend Only)
CREATE POLICY "Allow insert for jobs" 
ON public.jobs 
FOR INSERT 
TO service_role 
WITH CHECK (true);

-- 4. Grant Permissions
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;

-- Verify
SELECT * FROM pg_policies WHERE tablename = 'jobs';
```

### B. Candidates & Applications Tables
**Goal:** Strictly private data. No public access (even for logged-in users). Only the `service_role` (backend) can read/write.

```sql
-- 1. Enable RLS
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 2. Remove Public Access (Revoke anon/public access)
REVOKE ALL ON public.candidates FROM anon;
REVOKE ALL ON public.applications FROM anon;

-- 3. Create Full Access Policies for service_role
CREATE POLICY "service_role_full_candidates"
ON public.candidates
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "service_role_full_applications"
ON public.applications
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Grant Full Permissions to service_role
GRANT ALL ON public.candidates TO service_role;
GRANT ALL ON public.applications TO service_role;

-- 5. IMPORTANT: Remove Unique Application Restriction
-- This allows a candidate to apply multiple times for the same job.
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS unique_application;
ALTER TABLE public.candidates DROP CONSTRAINT IF EXISTS candidates_contact_number_key;
```

---

## 2. Storage Bucket Policies

The application uses a bucket named `resume_and_cover_letter` for document storage.

### A. Bucket Configuration
1.  Go to **Storage** in Supabase.
2.  Create a new bucket named `resume_and_cover_letter`.
3.  Set it to **Public** (so the URLs can be retrieved).

### B. Storage Security Policies
Run these in the SQL Editor to allow the backend to upload files:

```sql
-- Allow service_role to upload files to the bucket
CREATE POLICY "Allow service_role to upload"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'resume_and_cover_letter');

-- Allow anyone to read the files (since URLs are stored in DB)
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'resume_and_cover_letter');
```

---

## 3. Verification Script
Use this to check that all policies are active:

```sql
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```
