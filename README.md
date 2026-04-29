# OfficeLink — HR Management System

A full-stack Human Resource Management System built with the **MERN stack**, designed to simulate real-world organizational workflows. OfficeLink enables administrators to manage employees, track attendance, and handle leave requests — while giving employees a clean, functional dashboard to interact with their own data.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Route Structure (Frontend)](#route-structure-frontend)
- [Limitations & Planned Improvements](#limitations--planned-improvements)

---

## Overview

OfficeLink is a practical HR tool — not a simple CRUD demo. It incorporates role-based access control, workflow-driven features, business logic validation, and structured data handling to behave like a real internal company tool.

---

## Features

### Authentication & Authorization
- JWT-based secure login
- Role-based routing and protected routes on both frontend and backend
- Two roles: **Admin** and **Employee**

### User Management *(Admin only)*
- Create, update, and delete employee profiles
- Assign roles (`admin` / `employee`) and departments
- Profile picture support (base64-encoded)
- View detailed employee profiles via modal

### Attendance System
- Employee check-in / check-out with automatic timestamp logging
- Daily attendance tracking
- Admin view of all attendance records
- Employee view of personal attendance history
- Dashboard summary: total employees, today's activity, trends

### Leave Management
- Employees can apply for **Sick**, **Casual**, or **Earned** leave
- Admin can approve or reject requests with an optional comment
- Validation rules enforced on submission:
  - No past dates
  - No weekends (Saturday / Sunday)
  - Maximum 2-week range per request
  - No overlapping leave requests for the same employee
- Leave history per employee
- Active leave filtering for admin
- Pending leave count badge

### Data Visualization
- Attendance trends over the last 7 days
- Leave analytics: status distribution (approved / rejected / pending) and leave trends over time
- Built with **Chart.js** via `react-chartjs-2`

### Email Notifications
- Automatic emails on leave approval or rejection
- Styled HTML email templates
- Powered by **Nodemailer** over Gmail SMTP
- Manual email trigger available via dedicated modal

### Other UX Details
- Offline detection banner (real-time network status)
- Toast notifications for all actions (react-hot-toast)
- Global page loader with Suspense
- 404 Not Found page
- Rate limiting on all API routes

---

## Tech Stack

### Frontend

| Package | Version |
|---|---|
| React | ^19.2.5 |
| Vite | ^8.0.9 |
| Tailwind CSS | ^4.2.4 |
| React Router DOM | ^7.14.2 |
| TanStack Query | ^5.99.2 |
| React Hook Form | ^7.73.1 |
| Chart.js + react-chartjs-2 | ^4.5.1 / ^5.3.1 |
| Axios | ^1.15.2 |
| Lucide React | ^1.11.0 |
| React Hot Toast | ^2.6.0 |

### Backend

| Package | Version |
|---|---|
| Node.js | (ESM — `"type": "module"`) |
| Express | ^5.2.1 |
| MongoDB + Mongoose | ^9.5.0 |
| bcryptjs | ^3.0.3 |
| jsonwebtoken | ^9.0.3 |
| Nodemailer | ^8.0.5 |
| express-rate-limit | ^8.4.1 |
| dotenv | ^17.4.2 |
| nodemon (dev) | ^3.1.14 |

---

## Project Structure

```
HR-Management-System/
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── api/              # Axios instance + per-resource API helpers
│       │   ├── axios.js
│       │   ├── authApi.js
│       │   ├── userApi.js
│       │   ├── attendanceApi.js
│       │   ├── leaveApi.js
│       │   └── emailApi.js
│       ├── components/
│       │   ├── charts/       # AttendanceChart, LeaveStatusChart, LeaveTrendChart
│       │   ├── ui/           # Button, Modal (base primitives)
│       │   ├── Header.jsx
│       │   ├── Sidebar.jsx
│       │   ├── UserModal.jsx
│       │   ├── UserDetailsModal.jsx
│       │   ├── EmployeeProfileModal.jsx
│       │   ├── LeaveModal.jsx
│       │   ├── LeaveDetailsModal.jsx
│       │   ├── EmailModal.jsx
│       │   ├── DecisionModal.jsx
│       │   ├── ConfirmModal.jsx
│       │   ├── DeleteModal.jsx
│       │   ├── HoverItem.jsx
│       │   └── PageLoader.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/            # TanStack Query wrappers per domain
│       │   ├── useAuth.js
│       │   ├── useUsers.js
│       │   ├── useAttendance.js
│       │   ├── useLeaves.js
│       │   └── useEmail.js
│       ├── layouts/
│       │   └── DashboardLayout.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Admin.jsx             # Admin dashboard
│       │   ├── Users.jsx             # Employee management
│       │   ├── AdminLeaves.jsx       # Leave approval panel
│       │   ├── LeaveReport.jsx       # Analytics & charts
│       │   ├── Employee.jsx          # Employee dashboard
│       │   ├── MyLeaves.jsx          # Employee leave history
│       │   └── AttendanceHistory.jsx
│       ├── routes/
│       │   └── ProtectedRoute.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   └── emailController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   └── Leave.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── leaveRoutes.js
│   │   └── emailRoutes.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── emailTemplate.js
│   └── server.js
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for email notifications

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hr-management-system.git
cd hr-management-system
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `/server` (see [Environment Variables](#environment-variables) below), then run:

```bash
npm run dev      # Development (nodemon)
npm start        # Production
```

The server starts on `http://localhost:5000` by default.

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev      # Development server (Vite)
npm run build    # Production build → /client/dist
```

The client starts on `http://localhost:5173` by default.

---

## Environment Variables

Create `/server/.env` with the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Note:** `EMAIL_PASS` should be a Gmail **App Password**, not your regular account password. Enable 2FA on your Google account first, then generate an App Password under *Security → App Passwords*.

---

## API Reference

All routes are prefixed with `/api` and are subject to rate limiting (200 requests / 15 min per IP). Auth-sensitive routes use a stricter limiter (15 requests / 30 min).

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login and receive a JWT |

### Users *(Admin)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create a new employee |
| PUT | `/api/users/:id` | Update employee info |
| DELETE | `/api/users/:id` | Delete an employee |

### Attendance

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/attendance/check-in` | Log check-in |
| POST | `/api/attendance/check-out` | Log check-out |
| GET | `/api/attendance/all` | Get all attendance records *(Admin)* |

### Leaves

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leaves` | Apply for leave *(Employee)* |
| GET | `/api/leaves/my` | Get own leave history *(Employee)* |
| GET | `/api/leaves/all` | Get all leave requests *(Admin)* |
| GET | `/api/leaves/active` | Get current + pending leaves *(Admin)* |
| GET | `/api/leaves/pending/count` | Get pending leave count |
| PUT | `/api/leaves/:id` | Approve or reject a leave *(Admin)* |

### Email

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/email/send` | Manually trigger a notification email |

---

## Data Models

### User

```js
{
  name:       String   // required
  email:      String   // required, unique
  password:   String   // required, bcrypt-hashed
  role:       String   // "admin" | "employee" (default: "employee")
  profilePic: String   // base64-encoded image
  department: String
  createdAt, updatedAt // auto (timestamps)
}
```

### Leave

```js
{
  userId:       ObjectId  // ref: User
  type:         String    // "sick" | "casual" | "earned"
  fromDate:     Date
  toDate:       Date
  reason:       String
  status:       String    // "pending" | "approved" | "rejected" (default: "pending")
  reviewedBy:   ObjectId  // ref: User (admin)
  adminComment: String
  reviewedAt:   Date
  createdAt, updatedAt
}
```

### Attendance

```js
{
  userId:    ObjectId  // ref: User
  checkIn:   Date
  checkOut:  Date
  date:      Date
  createdAt, updatedAt
}
```

---

## Route Structure (Frontend)

| Path | Role | Page |
|---|---|---|
| `/` | Public | Login |
| `/admin` | Admin | Dashboard (stats + charts) |
| `/users` | Admin | Employee management |
| `/admin/leaves` | Admin | Leave approval panel |
| `/admin/reports` | Admin | Leave analytics & charts |
| `/employee` | Employee | Dashboard (check-in/out + summary) |
| `/employee/leaves` | Employee | My leaves |
| `/employee/attendance` | Employee | My attendance history |
| `*` | Any | 404 Not Found |

All routes behind `/admin/*` and `/employee/*` are wrapped in a `ProtectedRoute` component that validates the JWT and enforces the correct role.

---

## Limitations & Planned Improvements

**Current limitations:**
- Profile images stored as base64 strings (not scalable for large teams)
- Email notifications rely on Gmail SMTP (subject to sending rate limits)
- No real-time updates — UI refreshes via polling / manual refetch
- Some analytics are computed on the frontend rather than aggregated in the backend

**Planned improvements:**
- Cloudinary integration for scalable image uploads
- Backend-aggregated dashboard stats API
- Leave balance system with per-employee quotas
- In-app notification system synced with email
- Pagination and server-side filtering for large datasets
- Performance optimization for chart rendering

---

## Purpose

This project was built to practice full-stack architecture with real business logic — not just basic CRUD. The focus is on role-based access, workflow-driven design, clean API structure, and a production-like developer experience.