import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getDashboardOverview } from '../controllers/dashboardController.js';

const dashBoardRouter= express.Router();

dashBoardRouter.get("/",authMiddleware,getDashboardOverview);

export default dashBoardRouter;
