# Application Form Submission Architecture

This document explains the technical flow of the job application process within the Zephvion Careers platform, detailing how the data flows from the frontend user interface to the database, and why the database is structured the way it is.

## 1. Routing & Data Flow (The Form)

The application process relies entirely on Next.js App Router conventions and utilizes **Server Actions** to ensure database operations are secure and not exposed to the client.

### Client-Side Route (`app/apply/page.tsx`)
- **Route Access:** Users reach this route via a URL query parameter (e.g., `/apply?jobId=INFSYS-EXTERNAL-243494`).
- **Data Hydration:** Upon loading, the client fetches the specific job details using the `jobId` parameter. If the job does not exist, the user is automatically redirected to a 404 Error page.
- **Form Component:** The form collects standard inputs (Name, Email, Phone, LinkedIn, Github) and files (Resume, Cover Letter).
- **Submission:** When the user clicks submit, the form prevents the default browser reload, packages all fields and files into a secure `FormData` object, and directly calls the Server Action `submitApplication()`. No traditional `/api/...` fetch routes are used here.

### Server-Side Route (`features/applications/actions.ts`)
- **Server Action:** The `submitApplication` function is marked with `"use server"`. This means the code only executes in a secure Node.js backend environment.
- **File Handling:** It securely uploads the PDF/DOCX files directly to the Supabase Storage `applications` bucket and retrieves the public URLs.
- **Database Interaction:** It acts as the orchestrator to split the structured data and insert it into the correct Postgres tables.

---

## 2. Data Splitting: Why Two Tables?

When a user submits the form, the data is split across two tables: `candidates` and `applications`.

### The Tables
1. **`candidates`**: Stores the core identity of the person applying.
   - *Fields:* `id`, `full_name`, `email`, `contact_number`, `linkedin`, `github`.
2. **`applications`**: Stores the metadata about a specific instance of a candidate applying for a specific job.
   - *Fields:* `id`, `job_id`, `candidate_id`, `motivation`, `resume_url`, `cover_letter_url`, `status`.

### The Execution Process
When the Server Action receives the payload, it performs a strict sequence:
1. **Candidate Lookup:** It checks the `candidates` table using an `OR` query to see if a candidate with the provided `email` OR `contact_number` already exists.
2. **Upsert Logic:** 
   - If they *do* exist, the system simply grabs their existing `id`.
   - If they *do not* exist, the system creates a new row in the `candidates` table and retrieves the newly generated `id`.
3. **Application Insertion:** The system then creates a new row in the `applications` table, binding the `candidate_id` and the internal `job_id` together, along with the uploaded file URLs.

### Why Do We Do This? (The Use Case)
Splitting the data into a relational structure provides massive benefits for an enterprise-level platform:

1. **Data Normalization & Deduplication**
   - If a candidate applies for *five different jobs* at Zephvion, their personal information (Name, Email, Phone) is only stored **once** in the database.
   - This prevents redundant data and ensures that if a candidate updates their contact info in the future, it reflects globally across all their applications.
2. **Candidate Tracking (CRM Capabilities)**
   - HR and recruiters can easily query the `candidates` table to see a "Profile View" of a person, and then join the `applications` table to see a historical timeline of every single role they have ever applied for.
3. **Unique Constraints**
   - By splitting the tables, we can enforce a composite unique constraint (`UNIQUE (job_id, candidate_id)`) on the `applications` table. This mathematically prevents the same person (same `candidate_id`) from spamming or accidentally applying for the exact same job twice.
4. **Scalability**
   - Resumes and Cover Letters are tied to the *application*, not the *candidate*. This allows a candidate to tailor different resumes for different jobs without overwriting their old resumes.
