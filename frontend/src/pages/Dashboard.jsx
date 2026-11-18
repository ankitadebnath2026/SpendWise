import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  Plus,
  RefreshCw,
  ArrowRight,
  PieChart,
  Clock,
  Layers,
} from 'lucide-react';
import { dashboardStyles, styles } from '../assets/dummyStyles';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  INCOME_CATEGORY_ICONS,
  EXPENSE_CATEGORY_ICONS,
  COLORS,
} from '../assets/dummy';
import TransactionModal from '../components/TransactionModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    monthlyIncome: 0,
    monthlyExpense: 0,
    savings: 0,
    savingsRate: 0,
    recentTransactions: [],
    expenseDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getOverview();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openAddModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const getTransactionIcon = (type, category) => {
    if (type === 'income') {
      return (
        INCOME_CATEGORY_ICONS[category] || <TrendingUp className="w-5 h-5 text-teal-600" />
      );
    }
    return (
      EXPENSE_CATEGORY_ICONS[category] || <TrendingDown className="w-5 h-5 text-orange-600" />
    );
  };

  return (
    <div className={dashboardStyles.container}>
      {/* Header Banner */}
      <div className={dashboardStyles.headerContainer}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={dashboardStyles.headerTitle}>
              Hello, {user?.name || 'Friend'}!
            </h1>
            <p className={dashboardStyles.headerSubtitle}>
              Here is your financial summary and monthly spending tracker.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openAddModal('income')}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Income</span>
            </button>
            <button
              type="button"
              onClick={() => openAddModal('expense')}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2.5 bg-white text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Monthly Income */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Monthly Income</span>
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-gray-800">
              ${Number(data.monthlyIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-teal-100 text-teal-700 font-medium px-2 py-0.5 rounded-full">
                This Month
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Expense */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Monthly Expense</span>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-gray-800">
              ${Number(data.monthlyExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-orange-100 text-orange-700 font-medium px-2 py-0.5 rounded-full">
                This Month
              </span>
            </div>
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Net Savings</span>
            <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2
              className={`text-2xl font-bold ${
                data.savings >= 0 ? 'text-cyan-700' : 'text-red-600'
              }`}
            >
              ${Number(data.savings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  data.savings >= 0
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {data.savings >= 0 ? 'Net Positive' : 'Deficit'}
              </span>
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Savings Rate</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {Number(data.savingsRate || 0)}%
            </h2>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(Math.max(data.savingsRate || 0, 0), 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Transactions & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Recent Transactions
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/income"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 px-2.5 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
              >
                Income
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/expenses"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 px-2.5 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Expenses
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data.recentTransactions && data.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {data.recentTransactions.slice(0, 8).map((item, idx) => {
                const isIncome = item.type === 'income';
                const formattedDate = item.date
                  ? new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '';

                return (
                  <div
                    key={item._id || idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isIncome
                            ? 'bg-teal-50 text-teal-600'
                            : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {getTransactionIcon(item.type, item.category)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold text-sm md:text-base ${
                          isIncome ? 'text-teal-600' : 'text-orange-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'}${Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                <Layers className="w-8 h-8" />
              </div>
              <p className="text-gray-600 font-medium">No transactions this month</p>
              <p className="text-gray-400 text-sm mt-1">
                Start adding your income or expenses to visualize your cash flow!
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openAddModal('income')}
                  className="text-xs bg-teal-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Add Income
                </button>
                <button
                  type="button"
                  onClick={() => openAddModal('expense')}
                  className="text-xs bg-orange-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </div>
          )}

          {data.recentTransactions && data.recentTransactions.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500">
                Showing latest {Math.min(data.recentTransactions.length, 8)} transactions
              </span>
              <Link
                to="/expenses"
                className="flex items-center gap-1 font-medium text-teal-600 hover:text-teal-700"
              >
                <span>View all</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Spending By Category & Financial Health */}
        <div className="space-y-6">
          {/* Spending Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <PieChart className="w-5 h-5" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Spending by Category
              </h2>
            </div>

            {data.expenseDistribution && data.expenseDistribution.length > 0 ? (
              <div className="space-y-4">
                {data.expenseDistribution.map((catItem, idx) => {
                  const color = COLORS[idx % COLORS.length];
                  return (
                    <div key={catItem.category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-700">
                          {catItem.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">
                            ${Number(catItem.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({catItem.percent}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(catItem.percent || 0, 100)}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  No expense records found for this period.
                </p>
              </div>
            )}
          </div>

          {/* Quick Cash Flow Summary Box */}
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-md">
            <h3 className="text-lg font-bold">Monthly Cash Flow</h3>
            <p className="text-teal-100 text-sm mt-1">
              {data.savings >= 0
                ? `You saved $${Number(data.savings || 0).toLocaleString()} this month! Keep up the good work.`
                : `Your expenses exceeded your income by $${Math.abs(Number(data.savings || 0)).toLocaleString()}. Check your non-essential spending.`}
            </p>
            <div className="mt-4 pt-4 border-t border-teal-400/40 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-teal-100 uppercase font-semibold">Total In</p>
                <p className="text-lg font-bold mt-0.5">
                  ${Number(data.monthlyIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-teal-100 uppercase font-semibold">Total Out</p>
                <p className="text-lg font-bold mt-0.5">
                  ${Number(data.monthlyExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal for Add/Edit */}
      <TransactionModal
        isOpen={modalOpen}
        defaultType={modalType}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
