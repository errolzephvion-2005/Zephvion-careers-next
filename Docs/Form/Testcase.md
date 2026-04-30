# Application Form — Field-wise Validation Rules & Test Cases

---

# 1. Full Name (Required)

## Rules

* Minimum 2 characters, max 80
* Allows letters, spaces, `. ' -`
* Cannot start/end with special characters
* Trim spaces

## Test Cases

| #  | Input               | Expected    |
| -- | ------------------- | ----------- |
| 1  | *(empty)*           | ❌ Required  |
| 2  | `A`                 | ❌ Too short |
| 3  | `Jo`                | ✅ Valid     |
| 4  | `John Doe`          | ✅ Valid     |
| 5  | `Mary-Jane O'Brien` | ✅ Valid     |
| 6  | `Dr. Smith`         | ✅ Valid     |
| 7  | `John123`           | ❌ Invalid   |
| 8  | `John@Doe`          | ❌ Invalid   |
| 9  | 81 chars            | ❌ Too long  |
| 10 | spaces only         | ❌ Required  |
| 11 | `John  Doe`         | ✅ Valid     |
| 12 | `-John`             | ❌ Invalid   |
| 13 | `John-`             | ❌ Invalid   |

---

# 2. Email (Required)

## Rules

* Must follow standard email format
* TLD ≥ 2 chars
* No spaces

## Test Cases

| #  | Input                         | Expected   |
| -- | ----------------------------- | ---------- |
| 1  | *(empty)*                     | ❌ Required |
| 2  | `john`                        | ❌ Invalid  |
| 3  | `john@`                       | ❌ Invalid  |
| 4  | `@domain.com`                 | ❌ Invalid  |
| 5  | `john@domain`                 | ❌ Invalid  |
| 6  | `john@domain.c`               | ❌ Invalid  |
| 7  | `john@domain.com`             | ✅ Valid    |
| 8  | `john.doe+tag@sub.domain.org` | ✅ Valid    |
| 9  | `john doe@domain.com`         | ❌ Invalid  |
| 10 | uppercase email               | ✅ Valid    |
| 11 | double dots                   | ❌ Invalid  |
| 12 | `.john@domain.com`            | ❌ Invalid  |
| 13 | `john@domain..com`            | ❌ Invalid  |

---

# 3. Contact Number (Required — Indian)

## Rules

* 10 digits starting with 6–9
* Optional prefix: +91 / 91
* No leading 0
* Normalize spaces/symbols

## Test Cases

| #  | Input             | Expected    |
| -- | ----------------- | ----------- |
| 1  | *(empty)*         | ❌ Required  |
| 2  | `1234567890`      | ❌ Invalid   |
| 3  | `9876543210`      | ✅ Valid     |
| 4  | `+91 9876543210`  | ✅ Valid     |
| 5  | `91-9876543210`   | ✅ Valid     |
| 6  | `09876543210`     | ❌ Invalid   |
| 7  | `98765 43210`     | ✅ Valid     |
| 8  | `987654321`       | ❌ Too short |
| 9  | `98765432101`     | ❌ Too long  |
| 10 | `+91-98765-43210` | ✅ Valid     |
| 11 | `+91 5876543210`  | ❌ Invalid   |
| 12 | `abcdefghij`      | ❌ Invalid   |
| 13 | `+919876543210`   | ✅ Valid     |

---

# 4. LinkedIn (Optional)

## Rules

* Must be a valid URL starting with `http://` or `https://`
* Domain match required: `linkedin`
* No spaces allowed

## Test Cases

| Input                    | Expected |
| ------------------------ | -------- |
| empty                    | ✅ Valid  |
| https://linkedin.com/in/user | ✅        |
| http://linkedin.com/user | ✅        |
| www.linkedin.com/user    | ❌ (Protocol Required) |
| linkedin.com/user        | ❌ (Protocol Required) |
| lsm.ss/user              | ❌        |

---

# 5. GitHub (Mandatory for Technical Roles)

## Rules

* Must be a valid URL starting with `http://` or `https://`
* Domain match required: `github`
* No spaces allowed
* **MANDATORY** if the job type is `technical`

## Test Cases

| Role Type | Input           | Expected |
| --------- | --------------- | -------- |
| Technical | empty           | ❌ Required |
| Any       | https://github.com/user | ✅        |
| Any       | github.com/user  | ❌ (Protocol Required) |
| Any       | gitlab link     | ❌        |

---

# 6. Motivation (Required)

## Rules

* Min 30 chars, max 1024
* Cannot be empty/whitespace

## Test Cases

| Input           | Expected |
| --------------- | -------- |
| empty           | ❌        |
| short text      | ❌        |
| valid paragraph | ✅        |
| >1024 chars     | ❌        |
| spaces only     | ❌        |
| repeated chars  | ❌        |

---

# 7. Resume (Required)

## Rules

* Only PDF
* **Max 2MB**

## Test Cases

| Input     | Expected |
| --------- | -------- |
| no file   | ❌        |
| valid PDF | ✅        |
| >2MB      | ❌        |
| doc/docx  | ❌        |
| fake pdf  | ❌        |

---

# 8. Cover Letter (Optional)

## Rules

* PDF/DOC/DOCX
* **Max 2MB**

## Test Cases

| Input      | Expected |
| ---------- | -------- |
| empty      | ✅        |
| valid file | ✅        |
| >2MB       | ❌        |
| image      | ❌        |

---

# 9. Terms Checkbox

## Rules

* Must be checked

| Input     | Expected |
| --------- | -------- |
| unchecked | ❌        |
| checked   | ✅        |

---

