# Expense Tracker Application

A full-stack Expense Tracker web application built with a React & Tailwind CSS frontend and a Node.js, Express & MongoDB backend.

## 📁 Project Structure

```
expense_tracker/
├── backend/          # Node.js + Express API server
│   ├── config/       # MongoDB connection
│   ├── controllers/  # Auth, Income, Expense, Dashboard controllers
│   ├── middleware/   # JWT authentication middleware
│   ├── models/       # Mongoose data schemas (User, Income, Expense)
│   ├── routes/       # Express API routes
│   └── server.js     # Entry point (port 4000)
│
├── frontend/         # React + Vite + Tailwind CSS client
│   ├── src/
│   │   ├── assets/       # Icons, color presets, styling
│   │   ├── components/   # Navbar, Sidebar, Layout, Modals, Items
│   │   ├── context/      # Authentication context
│   │   ├── pages/        # Dashboard, Income, Expenses, Profile, Auth
│   │   └── services/     # Axios API services
│   └── vite.config.js    # Vite configuration
└── .gitignore
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The server will start on `http://localhost:4000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The client will start on `http://localhost:5173`.

## ✨ Features
- **Authentication**: JWT-based login, registration, and session persistence.
- **Dashboard**: Real-time financial summary (income, expenses, net savings, savings rate, and category distribution).
- **Incomes & Expenses**: Track, categorize, edit, filter by timeframe (daily, weekly, monthly, yearly), and export to Excel (`.xlsx`).
- **Profile Management**: Update name and email, and change passwords securely.
