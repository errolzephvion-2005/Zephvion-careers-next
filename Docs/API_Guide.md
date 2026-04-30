# Zephvion Careers - API & Route Guide

This document lists all the routes (pages), core data-fetching functions (Queries), and server-side operations (Actions) used across the platform.

---

## 1. Application Routes
These are the URLs accessible in the browser.

### `/` (Homepage)
*   **Purpose:** The entry point of the platform.
*   **Features:** Real-time job search, "Trending Jobs" carousel, and "Explore by Category" marquee.
*   **Data Used:** Calls `getJobs()` and `getFilters()`.

### `/apply` (Application Form)
*   **Purpose:** Where candidates submit their applications.
*   **Dynamic Parameter:** Expects a `jobId` in the URL (e.g., `/apply?jobId=INFSYS-INTERNAL-001`).
*   **Features:** Multi-step validation, real-time URL checking, and secure file uploads.
*   **Data Used:** Calls `submitApplication()` on submit.

---

## 2. Job Discovery (Queries)
These functions are used to pull data from Supabase to show on the website.

### `getJobs()`
*   **Location:** `features/jobs/queries.ts`
*   **What it does:** Fetches all active job listings from the database.
*   **Key Features:**
    *   Automatically transforms database codes into user-friendly text.
    *   Formats the data specifically for the Cyber-Minimalist UI cards.
    *   Ensures only "Active" jobs are shown.

### `getFilters()`
*   **Location:** `features/jobs/queries.ts`
*   **What it does:** Scans the database to create a list of all available job titles, locations, and categories.
*   **Usage:** Used to populate the search bar and the "Explore by Category" section on the homepage.

---

## 3. Application Submission (Server Actions)
These functions handle data sent by the user (like forms and files).

### `submitApplication(formData)`
*   **Location:** `features/applications/actions.ts`
*   **What it does:** This is the "Engine" that handles job applications.
*   **How it works:**
    1.  **Validation:** Re-checks every field (Email, LinkedIn, etc.) to ensure data quality.
    2.  **File Upload:** Securely uploads Resumes and Cover Letters to Supabase Storage.
    3.  **Candidate Logic:** 
        *   If the email is new, it creates a profile.
        *   If the email exists, it updates the profile with the latest contact info only if changed.
    4.  **Submission:** Creates a fresh application record in the database.
*   **Security:** Uses a secure "Admin Client" to bypass public restrictions and save data safely.

---

## 4. Data Validation (Utilities)
Internal logic used to keep the system clean.

### `validateField(name, value, isTechnical)`
*   **Location:** `features/applications/validation.ts`
*   **What it does:** The source of truth for all form rules.
*   **Rules handled:**
    *   Mandatory protocol (`https://`) for social links.
    *   Character limits for motivation letters (1024 chars).
    *   Strict Indian phone number format (10 digits).
    *   Mandatory GitHub links for technical roles.

---

## 5. Database Connection Helpers
Used by developers to connect to the database securely.

*   **`createClient()`**: Used in the browser (Frontend) to read public data like jobs.
*   **`createAdminClient()`**: Used in the background (Server) to handle sensitive tasks like saving applications.
*   **`createServerClient()`**: Used for standard server-side operations like checking login status or cookies.
