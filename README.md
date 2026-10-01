# Store Rating System - Full Stack Application

A role-based web application that allows users to register, view, and rate stores. Built for the Roxiler FullStack Intern Coding Challenge.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Frontend:** React.js, Vite
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs

---

## 🔑 User Roles & Test Credentials

Run `npm run seed` in the backend directory to populate default test accounts:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@storerating.com` | `Admin@1234` | Full system dashboard, user/store creation, filter & search all listings |
| **Normal User** | `user@storerating.com` | `User@1234` | Sign up, view stores, submit/modify store ratings, search stores |
| **Store Owner** | `owner@storerating.com` | `Owner@1234` | Owner dashboard, view store average rating & user ratings received |

---

## 🛠️ Setup & Local Testing

### Prerequisites
- Node.js (v16+)
- PostgreSQL installed and running on `localhost:5432`

---

### 1. Database Creation
In PostgreSQL (via `psql` or pgAdmin), create the database:
```sql
CREATE DATABASE storeratingdb;