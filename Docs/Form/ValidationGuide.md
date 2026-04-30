# Zephvion Careers — Validation Architecture Guide

This document outlines the **Double-Layer Validation** system implemented in the Zephvion Careers platform to ensure data integrity, security, and a premium user experience.

---

## 1. Architectural Overview

We use a "Double-Layer" approach where validation is performed both on the **Client (Frontend)** and the **Server (Backend)**. This ensures that:
1.  **Users** get immediate, helpful feedback while typing.
2.  **The Database** is protected against malicious or malformed data that might bypass the UI.

### Shared Logic
All field-level validation rules (regex, length limits, etc.) are centralized in a single utility file to ensure consistency across the entire application.
*   **File:** `features/applications/validation.ts`

---

## 2. Layer 1: Client-Side Validation (UX Layer)

**Primary Goal:** Instant feedback and preventing unnecessary server requests.

### Key Features:
*   **Real-time Validation:** Validates fields on `onBlur` (when a user moves to the next field), showing error messages immediately below the input.
*   **Auto-Correction/Normalization:** 
    *   Emails are automatically converted to **lowercase**.
    *   Phone numbers are cleaned of extra spaces and hyphens before being sent.
*   **UX Enhancements:** If a user submits an invalid form, the page automatically **scrolls to and focuses** the first error field.
*   **File:** `app/apply/page.tsx`

---

## 3. Layer 2: Server-Side Validation (Security Layer)

**Primary Goal:** Data integrity and security.

Even if a malicious user bypasses the frontend (e.g., via a custom script or Postman), the server re-verifies every piece of data before it touches the database.

### Key Features:
*   **Re-validation:** The server imports the same `validateField` logic used by the frontend.
*   **Storage Guard:** Enforces strict file size and MIME type checks (e.g., ensuring a Resume is actually a PDF and not a renamed image).
*   **Normalization:** Emails are lowercased again on the server to ensure that `USER@MAIL.COM` and `user@mail.com` are treated as the same candidate in the database.
*   **File:** `features/applications/actions.ts`

---

## 4. Key Validation Rules

| Field | Rule | Constraint |
|---|---|---|
| **Full Name** | `pattern` | 2-80 chars, strictly starts/ends with letters. |
| **Email** | `pattern` | Standard format with 2+ char TLD. Normalized to lowercase. |
| **Contact** | `pattern` | Indian format (10 digits, starts with 6-9). Normalized (no spaces/hyphens). |
| **LinkedIn** | `url`     | Strictly requires `http://` or `https://`. Must contain `linkedin.`. |
| **GitHub** | `url`     | Strictly requires `http://` or `https://`. Mandatory for `technical` roles. |
| **Motivation**| `length`  | 30 to 1024 characters. |
| **Resume** | `file`    | PDF only, **max 2MB**. |
| **Cover Letter**| `file`  | PDF/DOC/DOCX, **max 2MB**. |

---

## 5. Maintenance
To update any validation rule (e.g., changing the minimum length of a name), you only need to modify the `VALIDATION_RULES` constant in `features/applications/validation.ts`. Both the frontend and backend will inherit the change automatically.
