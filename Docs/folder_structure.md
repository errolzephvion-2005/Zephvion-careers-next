# Zephvion Careers: Project Architecture & Implementation Guide

This document outlines the **exact** current folder structure of the project and provides a guide on where to implement upcoming database features (Supabase).

## 📁 Current Project Structure

```text
/ (Project Root)
│
├── app/                        # 🚀 NEXT.JS APP ROUTER (Routing Only)
│   ├── apply/                  # Application Page route (/apply)
│   ├── legal/                  # Legal Components
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Main Landing Page
│
├── features/                   # 🔥 VERTICAL SLICES (Business Logic)
│   ├── jobs/                   # Domain: Job Postings
│   │   ├── components/         # UI Components
│   │   └── queries.ts          # Supabase SQL Queries (Fetching jobs)
│   └── applications/           # Domain: Job Applications
│       ├── components/         # ThankYou.tsx
│       ├── actions.ts          # Server Actions (Submitting forms)
│       └── validation.ts       # Shared validation logic
│
├── shared/                     # 🛠️ GLOBAL REUSABLE CODE
├── lib/                        # 🐘 DATABASE CONNECTORS
│   └── supabase/               # client.ts, server.ts, admin.ts
├── Docs/                       # 📄 PROJECT DOCUMENTATION
└── README.md                   # 🚀 GitHub Landing Page
```

---

## 🐘 Implementation Status: FULLY MIGRATED

The application has been successfully migrated from local JSON files to a dynamic **Supabase** backend.

1.  **Database Connection (`lib/supabase/`)**: Implemented `client.ts` for frontend, `server.ts` for standard server operations, and `admin.ts` for secure backend-only tasks (like saving applications).
2.  **Job Retrieval**: `features/jobs/queries.ts` now handles real-time data fetching directly from PostgreSQL.
3.  **Application Engine**: `features/applications/actions.ts` handles multi-file uploads and candidate profile updates (Upsert strategy).
4.  **Validation**: A centralized `validation.ts` ensures data integrity across both the UI and the Server.

