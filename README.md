# HR Management System (HRMS)

A full-stack Human Resource Management System built using the MERN stack, designed to simulate real-world organizational workflows.
This system enables administrators to manage employees, track attendance, and handle leave requests efficiently, while providing employees with a clean and functional dashboard to interact with their data.

---

## 🚀 Overview

This project focuses on building a **practical HR system**, not just a CRUD application.
It incorporates role-based access, workflow-driven features, and structured data handling to resemble a real internal company tool.

---

## ✨ Core Features

### 🔐 Authentication & Authorization

* Secure login system using JWT
* Role-based routing and access control
* Two distinct user roles:

  * **Admin**
  * **Employee**

---

### 👥 User Management (Admin Panel)

* Create new employees with profile details
* Update employee information
* Delete users
* Assign roles and departments
* Profile image support (base64 for now)

---

### ⏱️ Attendance System

* Employee check-in / check-out
* Daily attendance tracking
* Automatic timestamp logging
* Dashboard insights:

  * Total employees
  * Today’s activity
  * Attendance trends

---

### 📝 Leave Management System

* Employees can apply for leave
* Admin can approve or reject requests
* Validation rules:

  * No past dates allowed
  * No weekends (Saturday/Sunday)
  * Maximum 2-week range
  * No overlapping leave requests
* Leave history tracking for employees
* Active leave filtering for admin

---

### 📊 Data Visualization

* Attendance trends (last 7 days)
* Leave analytics:

  * Status distribution (approved/rejected/pending)
  * Leave trends over time
* Built using Chart.js

---

### 📧 Email Notifications

* Automatic emails triggered on:

  * Leave approval
  * Leave rejection
* Implemented using Nodemailer (SMTP)
* Styled HTML email templates

---

## 🧱 Tech Stack

### Frontend

```
React (Vite)
Tailwind CSS
React Router
React Hook Form
TanStack Query
Chart.js
```

### Backend

```
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Nodemailer
```

---

## 📁 Project Structure

```
HR-Management-System/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── api/
│   └── context/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone Repository

```
git clone https://github.com/your-username/hrms.git
cd hrms
```

---

### 2. Backend Setup

```
cd server
npm install
```

Create `.env` file inside `/server`:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Run backend:

```
npm run dev
```

---

### 3. Frontend Setup

```
cd client
npm install
npm run dev
```

---

## 🔗 API Endpoints (Overview)

### 🔐 Auth

```
POST   /api/auth/login
```

---

### 👥 Users

```
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

---

### ⏱️ Attendance

```
POST   /api/attendance/check-in
POST   /api/attendance/check-out
GET    /api/attendance/all
```

---

### 📝 Leaves

```
POST   /api/leaves            → Apply leave
GET    /api/leaves/my        → Employee leaves
GET    /api/leaves/all       → Admin view
GET    /api/leaves/active    → Current + pending
GET    /api/leaves/pending/count

PUT    /api/leaves/:id       → Approve / Reject
```

---

## 🧠 System Design Notes

* Separation of concerns between frontend and backend
* RESTful API structure
* Role-based access enforced at backend level
* State management handled via TanStack Query
* Reusable UI components with consistent styling
* Global layout system for shared UI (Sidebar + Header)

---

## ⚠️ Current Limitations

* Profile images stored as base64 (not scalable)
* Email system uses Gmail SMTP (rate-limited)
* No real-time updates (polling-based UI)
* Some analytics computed on frontend instead of backend

---

## 🚀 Planned Improvements

* Cloudinary integration for image uploads
* Backend-driven dashboard stats API
* Leave balance system (per employee)
* Notification system (in-app + email sync)
* Better performance optimization for charts
* Pagination and filtering for large datasets

---

## 🎯 Purpose of the Project

This project was built to:

* Simulate real-world HR workflows
* Practice full-stack architecture
* Implement business logic beyond basic CRUD
* Understand state management and API design
* Build a portfolio-ready system with practical use cases

---

## 💬 Final Notes

This is not just a UI-focused project — it emphasizes **logic, workflow, and system design**.
The goal was to build something that behaves like an internal company tool rather than a simple demo application.

---
