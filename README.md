# TaskTrack QA Testing Portfolio

End-to-End QA Testing Assignment — Manual + Automation + Performance

**Author:** Hafiz Anas Ali — SQA Engineer

---

## Project Overview

Complete QA testing portfolio for **TaskTrack** — a task management web application.

| Phase | Type | Tool | Test Cases | Pass Rate |
|---|---|---|---|---|
| **Phase 1** | UI Automation | Playwright | 22 | 100% |
| **Phase 2** | API Testing | Playwright | 44 | 100% |
| **Phase 3** | Performance | JMeter | Baseline + Load | 100% |

---

## Test Coverage

### Phase 1 — Playwright UI Testing

- **Register Tests (8)** — Validation, duplicate email, weak password
- **Login Tests (8)** — Valid/invalid credentials, empty fields
- **Add Task Tests (5)** — CRUD operations, long titles, special characters
- **E2E Flow (1)** — Register → Login → Task → Logout

**Total:** 22 tests — **100% Pass**

### Phase 2 — Playwright API Testing

- **Auth APIs (16)** — Register, login, invalid inputs, boundaries
- **Task APIs (12)** — CRUD, validation, auth
- **Security (10)** — Missing token, SQL injection, XSS, cross-user access
- **Boundary (6)** — Password length, long titles, Unicode

**Total:** 44 tests — **100% Pass**

### Phase 3 — JMeter Performance Testing

- **Baseline Test** — 1 user, 1 loop
- **Metrics:** Avg 825ms, Min 484ms, Max 1166ms, Error 0%
- **APDEX:** 0.750 (Good)

---

## Folder Structure

TaskTrack_Testing_Assignment/
├── Phase1-Playwright-UI/
│ ├── pages/ # Page Object Models
│ ├── tests/ # UI test cases
│ ├── utils/ # Test data utilities
│ └── playwright.config.ts
├── Phase2-API-Testing/
│ ├── api/ # API helper classes
│ ├── tests/ # API test cases
│ └── playwright.config.ts
├── Phase3-JMeter-Performance/
│ └── TaskTrack_Test.jmx # JMeter test plan
└── Test-Artifacts/ # Documentation and reports


---

## Tech Stack

- **UI/API Automation:** Playwright (TypeScript)
- **Performance Testing:** Apache JMeter
- **Language:** TypeScript, JavaScript
- **Framework:** Playwright Test
- **Environment:** Node.js, Java
- **Database:** MongoDB
- **Backend:** Node.js, Express

---

## How to Run

### Phase 1 — UI Tests

```bash
cd Phase1-Playwright-UI
npm install
npx playwright install
npx playwright test

npx playwright show-report reports/html-report

### Phase 2 — API Tests

cd Phase2-API-Testing
npm install
npx playwright test

### Phase 3 — JMeter Tests

cd Phase3-JMeter-Performance
jmeter -n -t "TaskTrack_Test.jmx" -l "results.jtl" -e -o "report"
report/index.html

Skills Demonstrated
Manual Testing (Functional, Negative, Boundary)

Test Case Design & Documentation

UI Automation with Playwright

API Testing with Playwright

Page Object Model (POM)

Cross-browser Testing

Security Testing (SQL Injection, XSS, Auth)

Performance Testing with JMeter

Stage-level Failure Attribution

Bug Reporting

Contact
Hafiz Anas Ali

Email: hafizanas0313@gmail.com

LinkedIn: linkedin.com/in/hafiz-anas-ali-a52092304

GitHub: github.com/Anasjutt0313

Submitted to: SQA Internship Mentor
Submission Date: 16 October 2026



