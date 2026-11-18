import expenseModel from '../models/expenseModel.js';   
import getDateRange from '../utils/dataFilter.js';
import XLSX from 'xlsx';

//add expense
export async function addExpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;
     try{
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
     const newExpense = new expenseModel({
                  userId  ,
                 description,
                 amount, 
                 category,
                 date: new Date(date)
                
             })
     
             await newExpense.save();
             res.json({
                 success: true,
                 message: "Expense added successfully",       
             })
         }
         catch (error) {
             console.error(error);
             res.status(500).json({
                 success: false,
                 message: "Server Error",
             });
         }
     }

     //to get all expense
export async function getAllExpense(req, res) {
    const userId= req.user._id; 
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        res.json({
            success: true,
            data: expenses
        });
    } catch (error) {
         console.error(error);
         res.status(500).json({
         success: false,
        message: "Server Error",
    });
    }
}
         
//to update expense
export async function updateExpense(req, res) {
    const userId = req.user._id;
    const expenseId = req.params.id;
    const { description, amount, category, date } = req.body;
    try {
      const updatedExpense = await expenseModel.findOneAndUpdate( { _id: expenseId, userId },
      { description, amount, category, date: new Date(date) },{ new: true });
        if(!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        res.json({
            success: true,
            message: "Expense updated successfully",
            data: updatedExpense
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
         message: "Server Error",
    });
   }
};
//to delete expense
export async function deleteExpense(req, res) {
    try{
    const expense = await expenseModel.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if(!expense){
             return res.status(404).json({
                     success: false,
                     message: "Expense not found"
                });
            }
            res.json({
                success: true,
                 message: "Expense deleted successfully"
                });
            }
    catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: "Server Error",
    });
}       
}
//download the expense data Excel
export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id;
        try{
            const expense= await expenseModel.find({ userId }).sort({ date: -1 });//return array of objects
            const plainData = expense.map((exp) => ({
                description: exp.description,
                amount: exp.amount,
                category: exp.category,
                date: exp.date
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(plainData);//array of objects to excel sheet
            const workbook = XLSX.utils.book_new();//Creates an empty Excel workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");//workbook → The Excel workbook.worksheet → The sheet containing your data."expenseModel" → The sheet tab name
            XLSX.writeFile(workbook, "expenseData.xlsx");//Creates the actual Excel file named expenseData.xlsx on your backend server's filesystem
            res.download("expenseData.xlsx");
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server Error",
            });
        }
    }
    
    //to get expense overview
    export async function getExpenseOverview(req, res) {
        try{
            const userId = req.user._id;
            const {range="month"} = req.query;
            const { start, end } = getDateRange(range);
    
            const expenses= await expenseModel.find({
                userId,
                date:{ $gte: start, $lte: end }
            }).sort({ date: -1 });
    
            const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
            const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
           const numberOfTransactions = expenses.length;
    
            const recentTransactions = expenses.slice(0, 9);
            res.json({
                success: true,
                data: {
                    totalExpense,
                    averageExpense,
                    numberOfTransactions,
                    recentTransactions
                }
            });
    
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server Error",
            });
        }   
    }
    