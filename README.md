#HostelVyavastha – Hostel Management System

HostelVyavastha is a hostel management system designed to digitize and simplify hostel operations. It replaces manual processes with a centralized platform for managing students, rooms, attendance, complaints, fees, and leave requests.

The system supports **role-based access control** with different functionalities for **students, wardens, and administrators**, ensuring secure and structured operations.

---

# Tech Stack

###Backend

* Node.js (Runtime)
* Express.js (Framework)
* Supabase (PostgreSQL Database)
* JWT (Authentication)
* bcrypt (Password Hashing)

### Frontend

* React.js
* Context API
* CSS

---

#Key Features

*Secure Authentication (JWT-based)
*Role-based Access (Student / Warden / Admin)
*Room Allocation & Capacity Management
*Attendance Tracking (Warden-controlled)
*Complaint System (Raise & Resolve)
*Leave Management (Apply & Approve)
*Fee Management (Track & Update Payments)
*Notice Board System
*Dashboard with key statistics

---

# 📁 Project Structure

##Backend

```id="backend-structure"
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│
├── server.js
├── package.json
└── .env
```

---

##Frontend

```id="frontend-structure"
frontend/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│
├── package.json
└── .env
```

---

# Getting Started

##Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on:

```
http://localhost:5001
```

---

##Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

#Environment Variables

## Backend `.env`

```
PORT=5001

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

---

## Frontend `.env`

```
VITE_API_URL=http://localhost:5001/api
```

---

##Example APIs

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/users`
* POST `/api/rooms`
* POST `/api/attendance/mark`
* POST `/api/leaves`

---

#Testing

* APIs tested using Postman
* Role-based access verified (Student / Warden / Admin)
* Error handling validated for edge cases

---

* Supabase database tables
* Postman API responses
* Frontend UI

---

#Contributors

* [Akshat Chauhan](github.com/akshat280706)
* [Bhavya Gothi](github.com/Bhavya4523)
* [Aryan Daga](github.com/dagaaryan011)
* [Jehan Bhdeda](github.com/jehanbheda)


---

**Made by HosteVyavastha Team**
