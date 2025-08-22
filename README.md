# Full-Stack Developer Portfolio - Shakil Ahmed

This repository contains the complete source code for my professional portfolio website, a full-stack application built from the ground up using a modern, professional technology stack. This project showcases my skills in frontend development with Angular, backend development with Node.js and Express, and database management with PostgreSQL.

---

## ✨ Features

### Public-Facing Portfolio:
* **Fully Dynamic Content:** All sections (Projects, Skills, Blog, etc.) are powered by a custom-built backend API.
* **Interactive Forms:** "Leave a Review" and "Contact Me" forms with real-time validation and email notifications.
* **Advanced Search:** A powerful full-text search engine to find projects and blogs instantly.
* **Professional UI/UX:** Features smooth page transition animations, a responsive design, and performance optimizations like image compression and lazy loading.
* **Privacy Compliant:** Includes a cookie consent banner for Google Analytics integration.

### Secure Admin Dashboard:
* **Full CMS Capabilities:** A private, password-protected dashboard to manage all site content.
* **Robust Authentication:** Database-driven login system with JWTs and a secure, automated "Forgot Password" feature.
* **Content Management:** Full CRUD (Create, Read, Update, Delete) functionality for Projects, Blogs, Skills, Reviews, and Messages.
* **Analytics Overview:** A dynamic dashboard with data visualizations, including charts and a live "Recent Activity" feed.

---

## 🛠️ Technology Stack

* **Frontend:** Angular, TypeScript, SCSS, Bootstrap
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **File Handling:** Multer for file uploads, Sharp for image optimization
* **Deployment:** Hosted on [Your Hosting Provider], with SSL via Cloudflare.

---

## 🚀 Getting Started

To run this project locally, you will need two terminal windows.

### Backend Setup:
```bash
# Navigate to the backend folder
cd portfolio-backend

# Install dependencies
npm install

# Set up your .env file with database and email credentials

# Run the server
npm run dev