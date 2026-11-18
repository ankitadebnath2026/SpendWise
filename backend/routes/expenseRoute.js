import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addExpense, deleteExpense, getAllExpense, updateExpense, downloadExpenseExcel, getExpenseOverview } from '../controllers/expenseController.js';

const expenseRouter = express.Router();

expenseRouter.use(authMiddleware);

expenseRouter.post("/add",authMiddleware, addExpense);
expenseRouter.get("/get",authMiddleware, getAllExpense);
expenseRouter.put("/update/:id",authMiddleware, updateExpense);
expenseRouter.get("/downloadExcel",authMiddleware, downloadExpenseExcel);
expenseRouter.get("/overview",authMiddleware, getExpenseOverview);
expenseRouter.delete("/delete/:id",authMiddleware, deleteExpense);



export default expenseRouter;