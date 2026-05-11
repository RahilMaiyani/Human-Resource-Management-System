# OfficeLink — HR Management System

A full-stack Human Resource Management System built with **MERN stack**, designed to handle real-world organizational workflows. OfficeLink provides a complete solution for HR operations including employee management, attendance tracking, leave management, document storage, and internal support ticketing.

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

OfficeLink goes beyond basic CRUD operations. It's built with role-based access control, workflow-driven features, comprehensive business logic validation, cloud-based file storage, and production-level UX patterns. The system simulates a real internal company tool with features like leave approval workflows, document management, and internal support ticketing.

**Key Highlights:**
- Role-based access (Admin & Employee)
- Cloudinary integration for scalable file storage
- Thread-based support ticket system
- Advanced leave validation logic
- Professional skeleton loaders for better UX
- Email notifications for workflow events
- Real-time badge notifications

---

## Features

### 🔐 Authentication & Authorization
- JWT-based secure login system
- Role-based routing on both frontend and backend
- Protected routes with automatic permission validation
- Two roles: **Admin** (full system access) and **Employee** (personal operations)

### 👥 User Management
- Create, update, and delete employee profiles (Admin only)
- Assign roles and departments
- Cloudinary-hosted profile pictures with automatic optimization
- View detailed employee profiles and edit information
- Track user metadata (last login, creation date)

### ⏱️ Attendance System
- Employees can check-in/check-out with automatic timestamp logging
- Daily attendance tracking with status indicators
- Admin dashboard showing today's attendance activity
- Employee personal attendance history view
- Attendance trends visualization (last 7 days)
- Real-time check-in/check-out status

### 📝 Leave Management System
- Employees apply for **Sick**, **Casual**, or **Earned** leave
- Advanced validation rules:
  - Prevent applications for past dates
  - Exclude weekends (Saturday/Sunday) from leave duration
  - Maximum 2-week range per request
  - Prevent overlapping leave requests
- Admin approval workflow with optional comments
- Leave history with status tracking (pending, approved, rejected)
- Leave analytics dashboard with trend charts
- Pending leave count badge in sidebar

### 📄 Document Management System
- Employees upload and manage important documents
- File types supported: PDF, PNG, JPG, JPEG, GIF, DOC, DOCX, TXT
- Document categories: Contract, ID Proof, Certification, Other
- Cloudinary-powered storage with secure URLs
- Automatic file deletion when document is removed
- File metadata tracking: size, type, upload date
- Admin can view and manage all employee documents
- Document preview modal with file type detection

### 🎟️ Support Ticket System
- Employees create support tickets for any issue
- **5 Categories:** IT Support, HR Inquiry, Payroll, Facilities, General
- **4 Priority Levels:** Low, Medium, High, Urgent
- **4 Status States:** Open, In-Progress, Resolved, Closed
- Thread-based reply system (like internal messaging)
- Both admin and employees can add replies to tickets
- Admin can update ticket status as work progresses
- Active ticket count badge in sidebar
- Real-time conversation tracking

### 📊 Data Visualization
- Attendance trends chart (last 7 days)
- Leave analytics dashboard:
  - Status distribution (approved vs rejected vs pending)
  - Leave trends over time by type
- Built with Chart.js for smooth, responsive charts
- Interactive legend and data point selection

### 📧 Email Notifications
- Automatic emails on leave approval
- Automatic emails on leave rejection with admin comment
- Styled HTML email templates
- Powered by Nodemailer with Gmail SMTP
- Manual email trigger option available

### 🎨 User Experience Enhancements
- Offline detection banner (real-time network status)
- Toast notifications for all actions (success, error, info)
- Professional skeleton loaders for all data tables
- Empty state components for tables with no data
- Global page loader with Suspense boundary
- 404 Not Found error page
- API rate limiting for security

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---|---|---|
| React | ^19.2.5 | UI library |
| Vite | ^8.0.9 | Build tool & dev server |
| Tailwind CSS | ^4.2.4 | Utility-first styling |
| React Router DOM | ^7.14.2 | Client-side routing |
| TanStack Query | ^5.99.2 | Server state management |
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
| MongoDB/Mongoose | ^9.5.0 | Database & ODM |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| Cloudinary | ^1.41.3 | Cloud storage for files |
| Multer | ^2.1.1 | File upload middleware |
| Multer Storage Cloudinary | ^4.0.0 | Cloudinary integration for Multer |
| Nodemailer | ^8.0.5 | Email sending |
| express-rate-limit | ^8.4.1 | Rate limiting |
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
│       │   ├── axios.js                    # Axios instance config
│       │   ├── authApi.js
│       │   ├── userApi.js
│       │   ├── attendanceApi.js
│       │   ├── leaveApi.js
│       │   ├── documentApi.js
│       │   ├── ticketApi.js                
│       │   └── emailApi.js
│       │
│       ├── components/
│       │   ├── charts/
│       │   │   ├── AttendanceChart.jsx
│       │   │   ├── LeaveStatusChart.jsx
│       │   │   └── LeaveTrendChart.jsx
│       │   ├── ui/
│       │   │   ├── Button.jsx
│       │   │   ├── Modal.jsx
│       │   │   └── Skeleton.jsx
│       │   ├── Header.jsx
│       │   ├── Sidebar.jsx
│       │   ├── UserModal.jsx
│       │   ├── LeaveModal.jsx
│       │   ├── DocumentUploadModal.jsx
│       │   ├── DocumentPreviewModal.jsx
│       │   ├── CreateTicketModal.jsx        
│       │   ├── TicketDetailModal.jsx        
│       │   ├── EmptyState.jsx
│       │   └── [Skeleton loaders for all tables]
│       │
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useUsers.js
│       │   ├── useAttendance.js
│       │   ├── useLeaves.js
│       │   ├── useDocuments.js
│       │   ├── useTickets.js                
│       │   └── useEmail.js
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
│   │   └── emailController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── Leave.js
│   │   ├── Document.js
│   │   └── Ticket.js                       
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── ticketRoutes.js                
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

### Installation Steps

#### 1. Clone Repository
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

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Application

**Backend (from `/server` directory):**
```bash
npm run dev      # Development with nodemon
npm start        # Production mode
```
Server runs on `http://localhost:5000`

**Frontend (from `/client` directory):**
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```
Client runs on `http://localhost:5173`

---

## API Reference

All endpoints are prefixed with `/api` and include rate limiting (200 req/15min). Auth routes use stricter limits (15 req/30min).

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | User login, returns JWT token |

### User Management (Admin Only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all employees |
| POST | `/api/users` | Create new employee |
| PUT | `/api/users/:id` | Update employee details |
| DELETE | `/api/users/:id` | Delete employee |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/attendance/check-in` | Employee check-in |
| POST | `/api/attendance/check-out` | Employee check-out |
| GET | `/api/attendance/all` | Get all attendance (Admin) |

### Leave Management
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leaves` | Apply for leave |
| GET | `/api/leaves/my` | Get personal leave history |
| GET | `/api/leaves/all` | Get all leaves (Admin) |
| GET | `/api/leaves/active` | Get current + pending leaves |
| GET | `/api/leaves/pending/count` | Get pending count |
| PUT | `/api/leaves/:id` | Approve/reject leave (Admin) |

### Document Management
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload document (multipart) |
| GET | `/api/documents/my-documents` | Get personal documents |
| GET | `/api/documents/:id` | Get document details |
| PUT | `/api/documents/:id` | Update metadata |
| DELETE | `/api/documents/:id` | Delete document |
| GET | `/api/documents/user/:userId` | Get user's documents (Admin) |

### Support Tickets
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/my` | Get personal tickets |
| GET | `/api/tickets/all` | Get all tickets (Admin) |
| POST | `/api/tickets/:id/reply` | Add reply to ticket |
| PATCH | `/api/tickets/:id/status` | Update ticket status |

### Email
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/email/send` | Send email notification |

---

## Data Models

### User
```javascript
{
  name:       String           // Employee full name
  email:      String           // Unique email address
  password:   String           // Bcrypt hashed
  role:       String           // "admin" or "employee"
  profilePic: String           // Cloudinary URL
  department: String           // Department name
  lastLogin:  Date            // Last login timestamp
  createdAt:  Date            // Auto-generated
  updatedAt:  Date            // Auto-generated
}
```

### Leave
```javascript
{
  userId:       ObjectId       // Reference to User
  type:         String         // "sick", "casual", "earned"
  fromDate:     Date
  toDate:       Date
  reason:       String         // Leave reason
  status:       String         // "pending", "approved", "rejected"
  reviewedBy:   ObjectId       // Admin who reviewed
  adminComment: String         // Feedback from admin
  reviewedAt:   Date
  createdAt:    Date
  updatedAt:    Date
}
```

### Attendance
```javascript
{
  userId:       ObjectId
  checkIn:      Date           // Check-in timestamp
  checkOut:     Date           // Check-out timestamp
  date:         Date           // Attendance date
  createdAt:    Date
  updatedAt:    Date
}
```

### Document
```javascript
{
  userId:       ObjectId       // Document owner
  title:        String
  fileUrl:      String         // Cloudinary URL
  publicId:     String         // Cloudinary public ID (for deletion)
  fileType:     String         // "pdf", "png", "jpg", "doc", "docx", "txt"
  category:     String         // "Contract", "ID Proof", "Certification", "Other"
  fileSize:     Number         // In bytes
  createdAt:    Date
  updatedAt:    Date
}
```

### Ticket
```javascript
{
  userId:       ObjectId       // Ticket creator
  subject:      String
  description:  String
  category:     String         // "IT Support", "HR Inquiry", "Payroll", "Facilities", "General"
  priority:     String         // "Low", "Medium", "High", "Urgent"
  status:       String         // "Open", "In-Progress", "Resolved", "Closed"
  replies: [                   // Thread-based conversation
    {
      senderId:   ObjectId
      senderName: String
      role:       String       // "admin" or "employee"
      message:    String
      createdAt:  Date
    }
  ],
  createdAt:    Date
  updatedAt:    Date
}
```

---

## Routes & Navigation

| Path | Role | Component | Purpose |
|---|---|---|---|
| `/` | Public | Login | User authentication |
| `/admin` | Admin | Dashboard | Overview & statistics |
| `/users` | Admin | Users | Employee management |
| `/admin/leaves` | Admin | AdminLeaves | Leave approval |
| `/admin/reports` | Admin | LeaveReport | Analytics & charts |
| `/admin/documents` | Admin | AdminDocuments | Manage documents |
| `/admin/helpdesk` | Admin | AdminHelpdesk | Manage tickets |
| `/employee` | Employee | Dashboard | Personal dashboard |
| `/employee/leaves` | Employee | MyLeaves | Leave management |
| `/employee/attendance` | Employee | AttendanceHistory | Check-in/out history |
| `/employee/vault` | Employee | DocumentVault | Document storage |
| `/employee/helpdesk` | Employee | EmployeeHelpdesk | Create & track tickets |

---

## Key Features in Detail

### Leave Validation Rules
- **Past dates**: Prevented — can only apply for future dates
- **Weekends**: Automatically excluded from leave duration calculation
- **Duration limit**: Maximum 14 days (2 weeks) per request
- **Overlaps**: System prevents overlapping leave applications for same employee

### Ticket Workflow
1. Employee creates ticket → Status: **Open**
2. Admin reviews → Updates to **In-Progress**
3. Both can reply with comments
4. Once resolved → Status: **Resolved**
5. Final confirmation → Status: **Closed**

### Document Management
- Files stored on Cloudinary (not in database)
- Automatic cleanup when document is deleted
- File size and type validation at upload
- Metadata stored in MongoDB for quick queries

### Authentication Flow
1. User logs in with email/password
2. Server validates and returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include token in header
5. Protected routes validate token and role

---

## Purpose

OfficeLink demonstrates production-level full-stack development with real business logic. The focus is on workflow automation, role-based access control, data validation, file management, professional UX patterns, and scalable architecture — beyond basic CRUD operations.
