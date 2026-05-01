# OfficeLink — HR Management System

A full-stack Human Resource Management System built with the **MERN stack**, designed to simulate real-world organizational workflows. OfficeLink enables administrators to manage employees, track attendance, handle leave requests, and manage employee documents — while giving employees a clean, functional dashboard to interact with their own data.

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

---

## Overview

OfficeLink is a practical HR tool — not a simple CRUD demo. It incorporates role-based access control, workflow-driven features, business logic validation, file management with Cloudinary, and structured data handling to behave like a real internal company tool.

---

## Features

### Authentication & Authorization
- JWT-based secure login
- Role-based routing and protected routes on both frontend and backend
- Two roles: **Admin** and **Employee**

### User Management *(Admin only)*
- Create, update, and delete employee profiles
- Assign roles (`admin` / `employee`) and departments
- Profile picture support (Cloudinary-hosted)
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

### Document Management System ⭐ *New*
- Employees can upload and manage documents (PDFs, images, Word docs, etc.)
- Document categorization: **Contract**, **ID Proof**, **Certification**, **Other**
- Supported file types: PDF, PNG, JPG, JPEG, GIF, DOC, DOCX, TXT
- Document preview modal with file type detection
- Cloudinary-powered file storage with automatic deletion on removal
- Admin can view all employee documents via dedicated admin panel
- File metadata tracking: size, type, upload date, category

### Data Visualization
- Attendance trends over the last 7 days
- Leave analytics: status distribution (approved / rejected / pending) and leave trends over time
- Built with **Chart.js** via `react-chartjs-2`

### Email Notifications
- Automatic emails on leave approval or rejection
- Styled HTML email templates
- Powered by **Nodemailer** over Gmail SMTP
- Manual email trigger available via dedicated modal

### Loading States & Skeleton Components
- Professional skeleton loaders for all data tables
- Admin dashboard skeleton
- Attendance, leave, and document skeleton loaders
- Empty state component for tables with no data

### Other UX Details
- Offline detection banner (real-time network status)
- Toast notifications for all actions (react-hot-toast)
- Global page loader with Suspense
- 404 Not Found page
- Rate limiting on all API routes
- Document preview modal with inline viewers

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
| **Cloudinary** | ^1.41.3 |
| **Multer** | ^2.1.1 |
| **Multer Storage Cloudinary** | ^4.0.0 |
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
│       │   ├── emailApi.js
│       │   └── documentApi.js            # NEW: Document API calls
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
│       │   ├── PageLoader.jsx
│       │   ├── Skeleton.jsx                    # NEW: Base skeleton component
│       │   ├── EmptyState.jsx                  # NEW: Empty state UI
│       │   ├── DocumentUploadModal.jsx         # NEW: File upload interface
│       │   ├── DocumentList.jsx                # NEW: Document listing
│       │   ├── DocumentCard.jsx                # NEW: Individual document card
│       │   ├── DocumentPreviewModal.jsx        # NEW: Document preview
│       │   ├── AdminDocumentViewer.jsx         # NEW: Admin document viewer
│       │   ├── AdminDashboardSkeleton.jsx      # NEW: Dashboard loader
│       │   ├── AdminDocumentsSkeleton.jsx      # NEW: Docs loader
│       │   ├── AdminLeavesSkeleton.jsx         # NEW: Leaves loader
│       │   ├── LeaveTableSkeleton.jsx          # NEW: Table loader
│       │   ├── LeaveReportsSkeleton.jsx        # NEW: Reports loader
│       │   ├── AttendanceRowSkeleton.jsx       # NEW: Attendance loader
│       │   └── DocumentSkeleton.jsx            # NEW: Document loader
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/            # TanStack Query wrappers per domain
│       │   ├── useAuth.js
│       │   ├── useUsers.js
│       │   ├── useAttendance.js
│       │   ├── useLeaves.js
│       │   ├── useEmail.js
│       │   └── useDocuments.js               # NEW: Document hooks
│       ├── layouts/
│       │   └── DashboardLayout.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Admin.jsx             # Admin dashboard
│       │   ├── Users.jsx             # Employee management
│       │   ├── AdminLeaves.jsx       # Leave approval panel
│       │   ├── LeaveReport.jsx       # Analytics & charts
│       │   ├── AdminDocuments.jsx    # NEW: Admin document management
│       │   ├── Employee.jsx          # Employee dashboard
│       │   ├── MyLeaves.jsx          # Employee leave history
│       │   ├── AttendanceHistory.jsx
│       │   └── DocumentVault.jsx     # NEW: Employee document vault
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
│   │   ├── emailController.js
│   │   └── documentController.js     # NEW: Document handling
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── rateLimiter.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js       # NEW: Cloudinary upload config
│   ├── models/
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── Leave.js
│   │   └── Document.js               # NEW: Document schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── emailRoutes.js
│   │   └── documentRoutes.js         # NEW: Document endpoints
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
- Cloudinary account (free tier available at [cloudinary.com](https://cloudinary.com)) for document storage

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

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Environment Variable Details

- **MONGO_URI**: MongoDB connection string (Atlas or local)
- **JWT_SECRET**: Secret key for JWT token signing (use a strong random string)
- **EMAIL_USER**: Gmail address for sending notifications
- **EMAIL_PASS**: Gmail **App Password** (not your regular password; enable 2FA first)
- **CLOUDINARY_CLOUD_NAME**: Found in your Cloudinary dashboard
- **CLOUDINARY_API_KEY**: Cloudinary API key
- **CLOUDINARY_API_SECRET**: Cloudinary API secret

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

### Documents ⭐ *New*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload a new document *(multipart/form-data)* |
| GET | `/api/documents/my-documents` | Get own documents *(Employee)* |
| GET | `/api/documents/:id` | Get document details by ID |
| PUT | `/api/documents/:id` | Update document metadata (title, category) |
| DELETE | `/api/documents/:id` | Delete a document (removes from Cloudinary) |
| GET | `/api/documents/user/:userId` | Get all documents for a user *(Admin only)* |

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
  profilePic: String   // Cloudinary URL
  department: String
  lastLogin:  Date     // Auto-updated on login
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
  reviewedBy:   ObjectId  // ref: User (admin who approved/rejected)
  adminComment: String    // optional feedback from admin
  reviewedAt:   Date      // when admin took action
  createdAt, updatedAt
}
```

### Attendance

```js
{
  userId:    ObjectId  // ref: User
  checkIn:   Date
  checkOut:  Date
  date:      Date      // day of attendance
  createdAt, updatedAt
}
```

### Document ⭐ *New*

```js
{
  userId:    ObjectId  // ref: User (document owner)
  title:     String    // required, user-defined
  fileUrl:   String    // required, Cloudinary URL
  publicId:  String    // required, Cloudinary public ID (for deletion)
  fileType:  String    // enum: "pdf", "png", "jpg", "jpeg", "gif", "doc", "docx", "txt"
  category:  String    // enum: "Contract", "ID Proof", "Certification", "Other"
  fileSize:  Number    // in bytes
  createdAt, updatedAt
}
```

---

## Route Structure (Frontend)

| Path | Role | Page | Purpose |
|---|---|---|---|
| `/` | Public | Login | Authentication |
| `/admin` | Admin | Dashboard | Overview & key metrics |
| `/users` | Admin | Employee Management | CRUD operations on users |
| `/admin/leaves` | Admin | Leave Approval | Review & approve/reject leaves |
| `/admin/reports` | Admin | Analytics | Leave & attendance charts |
| `/admin/documents` | Admin | Document Viewer | Manage all employee documents |
| `/employee` | Employee | Dashboard | Check-in/out & summary |
| `/employee/leaves` | Employee | My Leaves | View leave history & apply |
| `/employee/attendance` | Employee | Attendance History | View check-in/out logs |
| `/employee/vault` | Employee | Document Vault | Upload & manage own documents |
| `*` | Any | 404 | Not found |

All routes behind `/admin/*` and `/employee/*` are wrapped in a `ProtectedRoute` component that validates the JWT and enforces the correct role.

---

## Features in Detail

### Document Management Workflow

**Employee (Document Vault):**
1. Navigate to `/employee/vault`
2. Click "Upload Document"
3. Select file, add title, and choose category
4. Document is uploaded to Cloudinary and metadata saved to MongoDB
5. View, download, or delete documents anytime

**Admin (Document Viewer):**
1. Navigate to `/admin/documents`
2. Search and filter documents by category or user
3. Preview documents inline (PDFs with embedded viewer)
4. Download or delete documents on behalf of users
5. Track document metadata: size, type, upload date

### Cloudinary Integration

- All documents are stored securely on Cloudinary
- Automatic public ID tracking for safe deletion
- Support for 8 file types with proper validation
- Documents are organized by user and category
- File size limits handled at upload middleware level

### Loading States

Every major section has dedicated skeleton loaders:
- **AdminDashboardSkeleton** - Dashboard metrics skeleton
- **AdminLeavesSkeleton** - Leave table skeleton
- **AdminDocumentsSkeleton** - Document list skeleton
- **LeaveTableSkeleton** - General leave table loader
- **LeaveReportsSkeleton** - Charts skeleton
- **AttendanceRowSkeleton** - Attendance table loader
- **DocumentSkeleton** - Single document loader

These provide better perceived performance during data fetching.

---

## Purpose

This project demonstrates full-stack architecture with real business logic — not just basic CRUD. The focus is on role-based access, workflow-driven design, file management integration, clean API structure, and a production-like developer experience with professional UX patterns.