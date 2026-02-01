<div align="center">

<!-- Hero Banner -->

<img src="./frontend/src/assets/home-regular-24.png" width="80" height="80" alt="DomHouse Logo">

# 🏠 DomHouse

<h3 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=Next-Generation+Real+Estate;AI-Powered+Property+Analysis;Modern+Full-Stack+Platform" alt="Typing SVG" />
</h3>

<!-- Tech Badges -->

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/React-18+-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/MongoDB-Latest-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TailwindCSS-3+-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/AI--Powered-FF6B6B.svg?style=for-the-badge&logo=openai&logoColor=white" alt="AI Powered">
</p>

<!-- Action Buttons -->

<p align="center">
  <a href="https://domhouse.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-4285F4?style=for-the-badge&logoColor=white" alt="Live Demo">
  </a>
  <a href="./API_DOCUMENTATION.md">
    <img src="https://img.shields.io/badge/📚_API_Docs-34A853?style=for-the-badge&logoColor=white" alt="API Docs">
  </a>
  <a href="./DATABASE_DOCUMENTATION.md">
    <img src="https://img.shields.io/badge/🗄️_Database_Schema-EA4335?style=for-the-badge&logoColor=white" alt="Database Docs">
  </a>
</p>

</div>

---

## 🌟 Overview

**DomHouse** is a full-stack real estate web application developed as a final project for the course **Advanced Databases (NoSQL)**. The system demonstrates advanced MongoDB data modeling, aggregation pipelines, RESTful API design, authentication, and a modern React-based frontend.

---

## 🎯 Key Features

### 🔍 Property Management

* Property listing with full CRUD operations
* Advanced filtering and search
* Image upload and media handling

### 🤖 AI-Assisted Features

* Automated property description generation
* Price and market insight suggestions

### 🔐 Authentication & Security

* JWT-based authentication
* Role-based access control (User / Admin)
* Protected API routes

### 📱 Frontend Experience

* Responsive design (desktop & mobile)
* Modern UI with TailwindCSS
* Multi-page navigation (Home, Properties, Details, Auth)

---

## 🏗️ System Architecture

```mermaid
graph TB
    A[Frontend - React + Vite] --> C[Backend API - Node.js + Express]
    C --> D[(MongoDB Atlas)]
    C --> E[ImageKit CDN]
    C --> F[SMTP Email Service]
```

---

## 🧰 Technology Stack

| Layer      | Technologies                                |
| ---------- | ------------------------------------------- |
| Frontend   | React 18, Vite, TailwindCSS                 |
| Backend    | Node.js, Express.js                         |
| Database   | MongoDB, Mongoose                           |
| Auth       | JWT, Bcrypt                                 |
| Media      | ImageKit                                    |
| Email      | Nodemailer (SMTP)                           |
| Deployment | Vercel (Frontend), Render/Railway (Backend) |

---

## 🚀 Getting Started

### Prerequisites

* Node.js 16+
* MongoDB Atlas account
* Git

### Installation

```bash
# Clone repository
git clone https://github.com/Nurbek-dev001/Dom-House.git
cd Dom-House

# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

---

## 🔧 Environment Variables (Backend Example)

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/domhouse
JWT_SECRET=your_secret_key
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

---

## 📡 API Overview

* Full CRUD for properties, users, and appointments
* Aggregation pipelines for analytics and filtering
* Advanced update operators: `$set`, `$push`, `$pull`, `$inc`
* Protected routes with middleware

Detailed endpoints are described in **API_DOCUMENTATION.md**.

---

## 📚 Documentation

* **API_DOCUMENTATION.md** – REST API endpoints and examples
* **DATABASE_DOCUMENTATION.md** – MongoDB schema and relations
* **PROJECT_COMPLETION_GUIDE.md** – Course requirements mapping

---

## 🎓 Course Information

* **Course:** Advanced Databases (NoSQL)
* **Project Type:** Full-stack Web Application
* **Database:** MongoDB
* **Assessment:** Final Project with Defense

---

## 🙏 Acknowledgment

This project was developed for academic purposes to demonstrate practical skills in NoSQL databases, backend development, and modern frontend engineering.

---

<p align="center">
  Built for the Advanced Databases (NoSQL) course • Happy coding 🚀
</p>

