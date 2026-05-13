# OfficeLink — HR Management System

A full-stack Human Resource Management System built with the **MERN stack**, designed to handle real-world organizational workflows. OfficeLink provides a complete solution for HR operations including employee management, attendance tracking, leave management with balance tracking, document storage, internal support ticketing, and company-wide announcements.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Routes & Navigation](#routes--navigation)

---

## Overview

OfficeLink goes beyond basic CRUD operations. It's built with role-based access control, workflow-driven features, comprehensive business logic validation, cloud-based file storage, and production-level UX patterns. The system simulates a real internal company tool with leave balance tracking, approval workflows, ghost-session resolution, department-targeted announcements, document management, and internal support ticketing.

**Key Highlights:**
- Role-based access (Admin & Employee)
- Leave balance system with automatic deduction on approval
- Cloudinary integration for scalable file storage
- Company-wide announcement broadcasting with email delivery
- Thread-based support ticket system
- Ghost attendance session detection and bulk-fix tools
- Advanced leave validation logic including an `Unpaid` leave type
- Professional skeleton loaders for better UX
- Email notifications for workflow events
- Real-time badge notifications

---

## Features

### Authentication & Authorization
- JWT-based secure login system
- Role-based routing on both frontend and backend
- Protected routes with automatic permission validation
- Two roles: **Admin** (full system access) and **Employee** (personal operations)
- Dynamic page titles via `useTitle` hook

### User Management
- Create, update, and delete employee profiles (Admin only)
- Assign roles and departments
- Cloudinary-hosted profile pictures with automatic optimization
- View detailed employee profiles via `UserDetailsModal`
- Employees can view and edit their own profile via `EmployeeProfileModal`
- `leaveBalance` field embedded on the User model — tracks Sick, Casual, Earned, and Unpaid days

### Attendance System
- Employees can check-in and check-out with automatic timestamp logging
- Daily attendance tracking with status indicators
- Admin dashboard showing today's attendance activity
- Employee personal attendance history (`/me` endpoint)
- Attendance trends visualization (last 7 days)
- Filter attendance records by date range or employee (`/filters` endpoint)
- **Ghost Session Detection:** Admin dashboard surfaces past sessions where check-out is missing
- **Bulk Fix:** Admin can resolve ghost sessions in bulk or individually (`/bulk-fix`, `/fix/:id`)
- **Tomorrow's Away List:** Admin dashboard previews employees on approved leave the next day

### Leave Management System
- Employees apply for **Sick**, **Casual**, **Earned**, or **Unpaid** leave
- Leave balance cards displayed on the employee dashboard with per-type icons
- Advanced validation rules:
  - Prevent applications for past dates
  - Exclude weekends (Saturday/Sunday) from leave duration
  - Maximum 2-week range per request
  - Prevent overlapping leave requests
  - Enforce balance check on approval — rejects if insufficient days remain
- Leave balance automatically deducted when Admin approves; restored if rejected or reversed
- Admin approval workflow with optional comments
- Leave history with status tracking (Pending, Approved, Rejected)
- Leave details modal for employees to view admin feedback
- Paginated leave table (8 records per page)
- Leave analytics dashboard with trend charts
- Pending leave count badge in sidebar (polled every 10 seconds for Admins)

### Announcement System *(New)*
- Admins publish company-wide or department-targeted announcements
- Four announcement types: **General**, **Urgent**, **Event**, **Milestone** — each with a distinct email accent color
- Set an expiry date; expired announcements are automatically hidden from employees
- Announcements can be **Archived** by Admin at any time
- On creation, emails are automatically broadcast to all targeted employees (or all staff if no department filter is set)
- Employees see an **Announcement Feed** on their dashboard showing only active, non-expired announcements
- Admins see the full announcement list including archived entries

### Document Management System
- Employees upload and manage important documents
- File types supported: PDF, PNG, JPG, JPEG, GIF, DOC, DOCX, TXT
- Document categories: Contract, ID Proof, Certification, Other
- Cloudinary-powered storage with secure URLs
- Automatic file deletion on Cloudinary when a document record is removed
- File metadata tracking: size, type, upload date
- Admin can view and manage all employee documents via `AdminDocumentViewer`
- Document preview modal with file-type detection
- Card and list view modes for the Document Vault

### Support Ticket System
- Employees create support tickets for any issue
- 5 Categories: IT Support, HR Inquiry, Payroll, Facilities, General
- 4 Priority Levels: Low, Medium, High, Urgent
- 4 Status States: Open, In-Progress, Resolved, Closed
- Thread-based reply system (like internal messaging) — both Admin and Employee can reply
- Admin can update ticket status as work progresses
- Employees can close their own resolved tickets via `CloseTicketModal`
- Active ticket count badge in sidebar
- `ConfirmModal` used to guard destructive or irreversible actions

### Data Visualization
- Attendance trends chart (last 7 days) — `AttendanceChart`
- Leave analytics dashboard:
  - Status distribution (Approved vs Rejected vs Pending) — `LeaveStatusChart`
  - Leave trends over time by type — `LeaveTrendChart`
- Built with Chart.js via `react-chartjs-2` for smooth, responsive charts

### Email Notifications
- Automatic emails on leave approval and rejection (with admin comment)
- Announcement broadcast emails sent to targeted employees on creation
- Styled HTML email templates built with `buildEmailTemplate`
- Powered by Nodemailer with Gmail SMTP
- Manual email trigger available via `EmailModal` on the Admin dashboard

### User Experience
- Offline detection banner with animated indicator (real-time network status)
- Toast notifications for all actions (success, error, info) via `react-hot-toast`
- Professional skeleton loaders for all data tables and dashboards
- `EmptyState` component for tables with no data
- `DecisionModal` and `ConfirmModal` for safe approval and destructive actions
- Global page loader with Suspense boundary
- 404 Not Found page (`NotFound.jsx`)
- `HoverItem` tooltip component for contextual hints
- API rate limiting (200 req/15 min general; 15 req/30 min for auth routes)
- `DashboardLayout` wrapper shared across all authenticated pages

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---|---|---|
| React | ^19.2.5 | UI library |
| Vite | ^8.0.9 | Build tool & dev server |
| Tailwind CSS | ^4.2.4 | Utility-first styling |
| React Router DOM | ^7.14.2 | Client-side routing |
| TanStack Query | ^5.99.2 | Server state management & caching |
| React Hook Form | ^7.73.1 | Form handling |
| Chart.js | ^4.5.1 | Data visualization |
| react-chartjs-2 | ^5.3.1 | React wrapper for Chart.js |
| Axios | ^1.15.2 | HTTP client |
| Lucide React | ^1.11.0 | Icon library |
| React Hot Toast | ^2.6.0 | Notification system |

### Backend

| Package | Version | Purpose |
|---|---|---|
| Express | ^5.2.1 | Web framework |
| Mongoose | ^9.5.0 | MongoDB ODM |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| Cloudinary | ^1.41.3 | Cloud storage for files |
| Multer | ^2.1.1 | File upload middleware |
| multer-storage-cloudinary | ^4.0.0 | Cloudinary integration for Multer |
| Nodemailer | ^8.0.5 | Email sending |
| express-rate-limit | ^8.4.1 | Rate limiting |
| dotenv | ^17.4.2 | Environment variable management |
| CORS | ^2.8.6 | Cross-origin support |

---

## Project Structure

```
HR-Management-System/
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── api/
│       │   ├── axios.js                      # Axios instance config
│       │   ├── authApi.js
│       │   ├── userApi.js
│       │   ├── attendanceApi.js
│       │   ├── leaveApi.js
│       │   ├── documentApi.js
│       │   ├── ticketApi.js
│       │   ├── announcementApi.js            # NEW
│       │   └── emailApi.js
│       │
│       ├── components/
│       │   ├── charts/
│       │   │   ├── AttendanceChart.jsx
│       │   │   ├── LeaveStatusChart.jsx
│       │   │   └── LeaveTrendChart.jsx
│       │   ├── ui/
│       │   │   ├── Button.jsx
│       │   │   └── Modal.jsx
│       │   ├── Header.jsx
│       │   ├── Sidebar.jsx
│       │   ├── HoverItem.jsx
│       │   ├── AnnouncementFeed.jsx          # NEW
│       │   ├── CreateAnnouncementModal.jsx   # NEW
│       │   ├── ArchiveModal.jsx              # NEW
│       │   ├── UserModal.jsx
│       │   ├── UserDetailsModal.jsx
│       │   ├── EmployeeProfileModal.jsx
│       │   ├── LeaveModal.jsx
│       │   ├── LeaveDetailsModal.jsx
│       │   ├── DecisionModal.jsx
│       │   ├── ConfirmModal.jsx
│       │   ├── DeleteModal.jsx
│       │   ├── DocumentCard.jsx
│       │   ├── DocumentList.jsx
│       │   ├── DocumentUploadModal.jsx
│       │   ├── DocumentPreviewModal.jsx
│       │   ├── AdminDocumentViewer.jsx
│       │   ├── CreateTicketModal.jsx
│       │   ├── TicketDetailModal.jsx
│       │   ├── CloseTicketModal.jsx          # NEW
│       │   ├── EmailModal.jsx
│       │   ├── EmptyState.jsx
│       │   ├── PageLoader.jsx
│       │   ├── Skeleton.jsx
│       │   └── [Skeleton loaders for all tables]
│       │
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useUsers.js
│       │   ├── useAttendance.js
│       │   ├── useLeaves.js
│       │   ├── useDocuments.js
│       │   ├── useTickets.js
│       │   ├── useAnnouncements.js           # NEW
│       │   ├── useEmail.js
│       │   └── useTitle.js                   # NEW
│       │
│       ├── layouts/
│       │   └── DashboardLayout.jsx           # NEW
│       │
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Admin.jsx
│       │   ├── Employee.jsx
│       │   ├── Users.jsx
│       │   ├── AdminLeaves.jsx
│       │   ├── MyLeaves.jsx
│       │   ├── LeaveReport.jsx
│       │   ├── AdminDocuments.jsx
│       │   ├── DocumentVault.jsx
│       │   ├── AdminHelpdesk.jsx
│       │   ├── EmployeeHelpdesk.jsx
│       │   └── AttendanceHistory.jsx
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── routes/
│       │   └── ProtectedRoute.jsx
│       ├── NotFound.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   ├── documentController.js
│   │   ├── ticketController.js
│   │   ├── announcementController.js         # NEW
│   │   └── emailController.js
│   │
│   ├── models/
│   │   ├── User.js                           # Updated — leaveBalance embedded
│   │   ├── Attendance.js
│   │   ├── Leave.js                          # Updated — unpaid type added
│   │   ├── Document.js
│   │   ├── Ticket.js
│   │   └── Announcement.js                   # NEW
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── attendanceRoutes.js               # Updated — bulk-fix, filters
│   │   ├── leaveRoutes.js                    # Updated — recent, pending-count
│   │   ├── documentRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── announcementRoutes.js             # NEW
│   │   └── emailRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── rateLimiter.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── emailTemplate.js
│   │
│   └── server.js
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local installation or Atlas cloud database)
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) enabled
- Cloudinary account (free tier available at [cloudinary.com](https://cloudinary.com))

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/hr-management-system.git
cd hr-management-system
```

#### 2. Backend Setup
```bash
cd server
npm install
```

#### 3. Frontend Setup
```bash
cd client
npm install
```

---

## Configuration

Create a `.env` file in the `/server` directory:

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the `/client` directory:

```env
# Default check-out time used when resolving ghost attendance sessions
VITE_DEFAULT_CHECKOUT_TIME=18:00
```

### Running the Application

**Backend** (from `/server`):
```bash
npm run dev      # Development with nodemon
npm start        # Production
```
Runs on `http://localhost:5000`

**Frontend** (from `/client`):
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```
Runs on `http://localhost:5173`

---

## API Reference

All endpoints are prefixed with `/api`. General rate limit: 200 req/15 min. Auth routes: 15 req/30 min.

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, returns JWT token |

### User Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | Get all employees |
| POST | `/api/users` | Admin | Create new employee |
| PUT | `/api/users/:id` | Admin | Update employee details |
| DELETE | `/api/users/:id` | Admin | Delete employee |

### Attendance
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/attendance/check-in` | Employee | Check in |
| POST | `/api/attendance/check-out` | Employee | Check out |
| GET | `/api/attendance/today` | Employee | Today's own attendance |
| GET | `/api/attendance/me` | Employee | Personal attendance history |
| GET | `/api/attendance/all` | Admin | All attendance records |
| GET | `/api/attendance/user/:userId` | Admin | Attendance for a specific user |
| GET | `/api/attendance/filters` | Both | Filtered attendance records |
| PATCH | `/api/attendance/bulk-fix` | Admin | Bulk-resolve ghost sessions |
| PATCH | `/api/attendance/fix/:id` | Admin | Fix a single ghost session |

### Leave Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/leaves` | Employee | Apply for leave |
| GET | `/api/leaves/me` | Employee | Personal leave history |
| GET | `/api/leaves` | Admin | All leave requests |
| GET | `/api/leaves/active` | Admin | Current & pending leaves |
| GET | `/api/leaves/recent` | Admin | Recently updated leaves |
| GET | `/api/leaves/pending-count` | Admin | Pending leave count (sidebar badge) |
| PATCH | `/api/leaves/:id` | Admin | Approve or reject leave |

### Announcements
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/announcements` | Both | Get announcements (filtered by role) |
| POST | `/api/announcements` | Admin | Create announcement + broadcast email |
| PUT | `/api/announcements/:id` | Admin | Edit announcement |
| PUT | `/api/announcements/:id/archive` | Admin | Archive announcement |

### Document Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/documents/upload` | Employee | Upload document (multipart) |
| GET | `/api/documents/my-documents` | Employee | Personal documents |
| GET | `/api/documents/:id` | Both | Document details |
| PUT | `/api/documents/:id` | Employee | Update metadata |
| DELETE | `/api/documents/:id` | Employee | Delete document |
| GET | `/api/documents/user/:userId` | Admin | All documents for a user |

### Support Tickets
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/tickets` | Employee | Create ticket |
| GET | `/api/tickets/my` | Employee | Personal tickets |
| GET | `/api/tickets/all` | Admin | All tickets |
| POST | `/api/tickets/:id/reply` | Both | Add reply to thread |
| PATCH | `/api/tickets/:id/status` | Admin | Update ticket status |

### Email
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/email/send` | Admin | Send manual email notification |

---

## Data Models

### User
```javascript
{
  name:         String,          // Full name
  email:        String,          // Unique
  password:     String,          // bcrypt hashed
  role:         String,          // "admin" | "employee"
  profilePic:   String,          // Cloudinary URL
  department:   String,
  leaveBalance: {
    sick:       Number,          // Default: 12
    casual:     Number,          // Default: 12
    earned:     Number,          // Default: 0
    unpaid:     Number           // Tracks days taken (default: 0)
  },
  createdAt:    Date,
  updatedAt:    Date
}
```

### Leave
```javascript
{
  userId:       ObjectId,        // Ref: User
  type:         String,          // "sick" | "casual" | "earned" | "unpaid"
  fromDate:     Date,
  toDate:       Date,
  reason:       String,
  status:       String,          // "pending" | "approved" | "rejected"
  reviewedBy:   ObjectId,        // Ref: User (Admin)
  adminComment: String,
  reviewedAt:   Date,
  createdAt:    Date,
  updatedAt:    Date
}
```

### Attendance
```javascript
{
  userId:       ObjectId,        // Ref: User
  checkIn:      Date,
  checkOut:     Date,
  date:         String,          // YYYY-MM-DD
  createdAt:    Date,
  updatedAt:    Date
}
```

### Announcement
```javascript
{
  title:              String,
  message:            String,
  type:               String,    // "General" | "Urgent" | "Event" | "Milestone"
  targetDepartments:  [String],  // ["All"] or specific department names
  status:             String,    // "Active" | "Archived"
  expiresAt:          Date,
  createdBy:          ObjectId,  // Ref: User (Admin)
  createdAt:          Date,
  updatedAt:          Date
}
```

### Document
```javascript
{
  userId:       ObjectId,        // Ref: User
  title:        String,
  fileUrl:      String,          // Cloudinary URL
  publicId:     String,          // Cloudinary ID (used for deletion)
  fileType:     String,          // "pdf" | "png" | "jpg" | "doc" | "docx" | "txt"
  category:     String,          // "Contract" | "ID Proof" | "Certification" | "Other"
  fileSize:     Number,          // In bytes
  createdAt:    Date,
  updatedAt:    Date
}
```

### Ticket
```javascript
{
  userId:       ObjectId,        // Ref: User
  subject:      String,
  description:  String,
  category:     String,          // "IT Support" | "HR Inquiry" | "Payroll" | "Facilities" | "General"
  priority:     String,          // "Low" | "Medium" | "High" | "Urgent"
  status:       String,          // "Open" | "In-Progress" | "Resolved" | "Closed"
  replies: [{
    senderId:   ObjectId,
    senderName: String,
    role:       String,          // "admin" | "employee"
    message:    String,
    createdAt:  Date
  }],
  createdAt:    Date,
  updatedAt:    Date
}
```

---

## Routes & Navigation

| Path | Role | Component | Purpose |
|---|---|---|---|
| `/` | Public | Login | Authentication |
| `/admin` | Admin | Admin | Overview, stats, announcements |
| `/users` | Admin | Users | Employee management |
| `/admin/leaves` | Admin | AdminLeaves | Leave approval |
| `/admin/reports` | Admin | LeaveReport | Analytics & charts |
| `/admin/documents` | Admin | AdminDocuments | Manage all documents |
| `/admin/helpdesk` | Admin | AdminHelpdesk | Manage support tickets |
| `/employee` | Employee | Employee | Personal dashboard & announcements |
| `/employee/leaves` | Employee | MyLeaves | Leave history & apply |
| `/employee/attendance` | Employee | AttendanceHistory | Check-in/out history |
| `/employee/vault` | Employee | DocumentVault | Personal document storage |
| `/employee/helpdesk` | Employee | EmployeeHelpdesk | Create & track tickets |
| `*` | Any | NotFound | 404 page |

---

## Key Features in Detail

### Leave Balance System
Each employee has a `leaveBalance` object embedded on their User document. When an Admin **approves** a leave request, the system checks whether the employee has sufficient days remaining for the requested leave type. If the balance is insufficient, the approval is blocked with an informative error message. On approval, the balance is deducted; on rejection or reversal, it is restored. Unpaid leave is tracked separately and accumulates rather than depletes.

Default annual allocations:
- Sick: 12 days
- Casual: 12 days
- Earned: 0 days (accrual-based)
- Unpaid: tracked (no cap)

### Announcement Broadcasting
When an Admin creates an announcement, the system immediately sends a broadcast email to all employees in the targeted department(s). If `targetDepartments` is set to `["All"]`, every employee receives the email. Each announcement type maps to a distinct email accent color (Indigo for General, Rose for Urgent, Emerald for Event, Amber for Milestone) to aid at-a-glance recognition in inboxes.

### Ghost Session Resolution
A ghost session is an attendance record from a past date where the employee checked in but never checked out. The Admin dashboard surfaces these sessions with a dedicated panel. Admins can apply a default check-out time (configured via `VITE_DEFAULT_CHECKOUT_TIME`) to all ghost sessions at once (`bulk-fix`) or resolve them individually (`fix/:id`).

### Leave Validation Rules
- **Past dates** — prevented; only future dates allowed
- **Weekends** — Saturday and Sunday are automatically excluded from the leave duration count
- **Duration limit** — maximum 14 calendar days per request
- **Overlaps** — system rejects new requests that overlap with existing ones for the same employee
- **Balance check** — enforced at approval time; insufficient balance blocks the action

### Ticket Workflow
1. Employee creates ticket → Status: **Open**
2. Admin reviews → Updates to **In-Progress**
3. Both Admin and Employee can add replies to the thread
4. Admin marks as **Resolved** when the issue is addressed
5. Employee confirms and closes → Status: **Closed**

### Authentication Flow
1. User submits email and password via the Login page
2. Server validates credentials and returns a signed JWT
3. Frontend stores the token in `localStorage` via `AuthContext`
4. All subsequent API requests include the token in the `Authorization` header
5. Protected routes on both frontend and backend validate the token and check the user's role before granting access