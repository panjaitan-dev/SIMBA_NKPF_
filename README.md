# 🌿 SIMBA Nusantara – Simulasi Sistem Informasi Bank Sampah

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

> **NOTE:** This repository is a **simulation** created for the IT Fest 2026 Web Development competition. All data, logos, and contact information are placeholders and do **not** represent any official organization.

---

## 📖 Overview

SIMBA (Sistem Informasi Bank Sampah) is a web‑based platform that demonstrates a full‑stack solution for waste‑bank management. It includes:
- Public portal with interactive map and waste‑value calculator.
- Role‑based dashboards for **Administrator**, **Petugas**, **Nasabah**, and **Monitoring**.
- CRUD operations, responsive UI, and basic accessibility compliance.

The project is built with **Next.js**, **Tailwind CSS**, **Supabase** (PostgreSQL) and follows the constraints of the competition (no external templates, original code).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend API | Node.js (Express), Supabase (PostgreSQL) |
| Auth & DB | Supabase Auth & RLS |
| Deployment | Vercel (frontend) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or v20 (LTS)
- **Git**
- **npm** (comes with Node.js)

### Clone the repository
```bash
git clone https://github.com/yourusername/SIMBA_NKPF_.git
cd SIMBA_NKPF_
```

### Frontend setup
```bash
cd frontend
npm install
# Run development server
npm run dev
```
Open **http://localhost:3000** in your browser.

### Backend (optional for local API)
```bash
cd ../backend
npm install
npm run dev
```
The API will be available at **http://localhost:5000/api**.

---

## 📁 Project Structure
```
SIMBA_NKPF_/                     # Repository root
├─ frontend/                    # Next.js application
│  ├─ public/                   # Static assets (images, icons, maps)
│  └─ src/                      # Source code (app router, components, lib)
├─ backend/                     # Express API (optional for local dev)
│  └─ src/                      # Routes, middlewares, tests
├─ README.md                    # This documentation file
└─ LICENSE                      # MIT License
```

---

## 🔧 Environment Variables
Create a `.env.local` inside `frontend/` and a `.env` inside `backend/`.

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGIN=http://localhost:3000
```

---

## 🧪 Testing & Build
```bash
# Frontend build
cd frontend
npm run build   # production build
npm test         # run Jest/React Testing Library tests

# Backend tests
cd ../backend
npm test
```

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♀️ Contributing
For the competition, no external contributions are required. Feel free to fork the repo for learning purposes.

---

*This README is intentionally minimal and free of any official claims. All contact information, logos, and statistics are placeholders used only for the competition demonstration.*
