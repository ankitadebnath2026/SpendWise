import express from 'express'
import authMiddleware from '../middleware/auth.js';
import { addIncome,deleteIncome,getAllIncome,updateIncome,downloadIncomeExcel,getIncomeOverview } from '../controllers/incomeController.js';

const incomeRouter = express.Router();

incomeRouter.post("/add",authMiddleware, addIncome);
incomeRouter.get("/get",authMiddleware, getAllIncome);
incomeRouter.put("/update/:id",authMiddleware, updateIncome);
incomeRouter.get("/downloadexcel",authMiddleware, downloadIncomeExcel);
incomeRouter.get("/overview",authMiddleware, getIncomeOverview);
incomeRouter.delete("/delete/:id",authMiddleware, deleteIncome);

export default incomeRouter;