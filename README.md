# Cairo Care - Healthcare Management System

A production-ready full-stack healthcare application connecting patients with doctors.

## Features

### 🏥 For Patients
- **Browse Doctors**: View doctor profiles, specializations, and fees.
- **Book Appointments**: Select available time slots.
- **Medical Reports**: Upload private medical reports (PDF/Image) securely.
- **Track Status**: Monitor appointment status (Pending/Approved/Completed).

### 👨‍⚕️ For Doctors
- **Profile Management**: Update bio, fees, and specialization.
- **Slot Management**: Define availability (Day/Time).
- **Appointment Handling**: Approve or reject booking requests.
- **Patient Records**: View patient details and uploaded medical reports.

### 🛡️ For Admins
- **Doctor Approval**: Verify and approve new doctor registrations.
- **System Overview**: View statistics on users and appointments.
- **User Management**: Monitor all registered users.

## Tech Stack
- **Frontend**: HTML5, CSS3 (Custom Variables), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js (MVC Architecture).
- **Database**: MySQL (Relational Schema).
- **Security**:
    - JWT (JSON Web Tokens) for Authentication.
    - Bcrypt for Password Hashing.
    - Role-Based Access Control (RBAC).

## Setup & Installation

1.  **Database Setup**:
    - Ensure you have MySQL installed and running.
    - Create a database (or let the script do it).
    - Update `.env` with your credentials.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Initialize Database**:
    ```bash
    node src/init_db.js
    ```
    *(Note: This creates tables defined in `schema.sql`)*

4.  **Start Server**:
    ```bash
    npm start
    ```
    Server runs on `http://localhost:3000`

5.  **Use the App**:
    - Open `http://localhost:3000` in your browser.
    - Register a new account (Patient or Doctor).

## Folder Structure
```
cairo-care/
├── public/             # Static Assets (Frontend)
│   ├── assets/         # CSS & JS
│   ├── dashboard/      # Dashboard HTML pages
│   └── uploads/        # Uploaded Medical Reports
├── src/                # Backend Source
│   ├── config/         # DB Configuration
│   ├── controllers/    # Business Logic
│   ├── middleware/     # Auth & Upload Middleware
│   ├── models/         # Database Queries
│   ├── routes/         # API Routes
│   └── server.js       # Entry Point
└── schema.sql          # Database Schema
```
