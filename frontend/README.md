# Expense Tracker - Frontend & Backend Integration

A modern, responsive Expense Tracker web application built with **React**, **Vite**, **Tailwind CSS v4**, and connected to the **Node.js / Express / MongoDB** backend.

---

## 🚀 How to Run the Application

### 1. Start the Backend Server
In a terminal, navigate to the `backend` directory and run:
```bash
cd backend
npm start
```
The backend server will run on `http://localhost:4000`.

### 2. Start the Frontend Development Server
In another terminal, navigate to the `frontend` directory and run:
```bash
cd frontend
npm run dev
```
Open the URL shown in your terminal (typically `http://localhost:5173`).

---

## 🌟 Features Implemented

1. **Authentication & Security**
   - User Registration (`/signup`) with input validation and password checks.
   - User Login (`/login`) with JWT token storage in `localStorage`.
   - Protected routes that automatically redirect unauthenticated users to `/login`.
   - Global `AuthContext` to manage user state and token expiry.

2. **Dashboard (`/`)**
   - Financial overview cards: **Monthly Income**, **Monthly Expense**, **Net Savings**, and **Savings Rate**.
   - **Recent Transactions list** with color-coded badges, categories, and timestamps.
   - **Spending by Category** progress bars and distribution.
   - Quick action buttons to add income or expense.

3. **Income Management (`/income`)**
   - View all income streams with search and category filtering.
   - Timeframe filter: **Daily**, **Weekly**, **Monthly**, **Yearly**.
   - Summary statistics: Total Income, Average per Entry, Total Incomes count.
   - Inline editing and deletion of income entries.
   - **Export to Excel** (`.xlsx`) via backend API.

4. **Expense Management (`/expenses`)**
   - View all expenses with search and category filtering.
   - Timeframe filter: **Daily**, **Weekly**, **Monthly**, **Yearly**.
   - Summary statistics: Total Expenses, Average per Expense, Total Expenses count.
   - Inline editing and deletion of expense entries.
   - **Export to Excel** (`.xlsx`) via backend API.

5. **Profile & Security Settings (`/profile`)**
   - View and update user profile name and email (`/api/user/profile`).
   - Change password modal with current password verification (`/api/user/password`).
   - Logout functionality.

6. **Interactive Components**
   - **Navbar**: User avatar, dropdown menu, and mobile navigation trigger.
   - **Sidebar**: Collapsible drawer with active link indicator and responsive mobile overlay.
   - **TransactionModal**: Unified popup modal for adding or updating income and expense entries.
   - **TransactionItem**: Detailed row component supporting inline editing, deleting, and category icons.
