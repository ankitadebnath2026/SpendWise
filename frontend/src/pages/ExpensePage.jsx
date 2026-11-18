import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  Plus,
  Download,
  Filter,
  CreditCard,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';
import { expensePageStyles } from '../assets/dummyStyles';
import { expenseService } from '../services/api';
import TransactionItem from '../components/TransactionItem';
import TransactionModal from '../components/TransactionModal';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [overview, setOverview] = useState({
    totalExpense: 0,
    averageExpense: 0,
    numberOfTransactions: 0,
  });
  const [timeframe, setTimeframe] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchExpenseData = async () => {
    setLoading(true);
    try {
      const [allRes, overviewRes] = await Promise.all([
        expenseService.getAll(),
        expenseService.getOverview(timeframe),
      ]);

      if (allRes.success && allRes.data) {
        setExpenses(allRes.data);
      }
      if (overviewRes.success && overviewRes.data) {
        setOverview(overviewRes.data);
      }
    } catch (err) {
      console.error('Failed to load expense data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, [timeframe]);

  const handleUpdate = async (id, payload) => {
    await expenseService.update(id, payload);
    fetchExpenseData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry?')) {
      await expenseService.delete(id);
      fetchExpenseData();
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await expenseService.downloadExcel();
    } catch (err) {
      console.error('Failed to download Excel:', err);
      alert('Failed to download Excel spreadsheet');
    } finally {
      setExporting(false);
    }
  };

  // Filtered expense list
  const filteredExpenses = expenses.filter((item) => {
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...new Set(expenses.map((e) => e.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Expenses Overview
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track, categorize and optimize your daily expenditures
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>{exporting ? 'Exporting...' : 'Export Excel'}</span>
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Period:</span>
            <div className="inline-flex bg-gray-100 p-1 rounded-xl">
              {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                    timeframe === tf
                      ? 'bg-white text-orange-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Expenses ({timeframe})
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              ${Number(overview.totalExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Average per Expense
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              ${Number(overview.averageExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Expenses Count
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              {overview.numberOfTransactions || expenses.length}
            </h2>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Transaction List Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              All Expenses
            </h2>
            <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2.5 py-0.5 rounded-full">
              {filteredExpenses.length} records
            </span>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        {loading ? (
          <div className="py-16 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredExpenses.length > 0 ? (
          <div className="space-y-3">
            {filteredExpenses.map((item) => (
              <TransactionItem
                key={item._id}
                transaction={item}
                type="expense"
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <CreditCard className="w-8 h-8" />
            </div>
            <h3 className="text-gray-700 font-semibold text-base">
              No expense entries found
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery || categoryFilter !== 'All'
                ? 'Try adjusting your search filters.'
                : 'Click "Add Expense" to record your first expense!'}
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <TransactionModal
        isOpen={modalOpen}
        defaultType="expense"
        onClose={() => setModalOpen(false)}
        onSuccess={fetchExpenseData}
      />
    </div>
  );
};

export default ExpensePage;
