import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Download,
  Filter,
  DollarSign,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';
import { incomeStyles } from '../assets/dummyStyles';
import { incomeService } from '../services/api';
import TransactionItem from '../components/TransactionItem';
import TransactionModal from '../components/TransactionModal';

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [overview, setOverview] = useState({
    totalIncome: 0,
    averageIncome: 0,
    numberOfTransactions: 0,
  });
  const [timeframe, setTimeframe] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchIncomeData = async () => {
    setLoading(true);
    try {
      const [allRes, overviewRes] = await Promise.all([
        incomeService.getAll(),
        incomeService.getOverview(timeframe),
      ]);

      if (allRes.success && allRes.data) {
        setIncomes(allRes.data);
      }
      if (overviewRes.success && overviewRes.data) {
        setOverview(overviewRes.data);
      }
    } catch (err) {
      console.error('Failed to load income data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, [timeframe]);

  const handleUpdate = async (id, payload) => {
    await incomeService.update(id, payload);
    fetchIncomeData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      await incomeService.delete(id);
      fetchIncomeData();
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await incomeService.downloadExcel();
    } catch (err) {
      console.error('Failed to download Excel:', err);
      alert('Failed to download Excel spreadsheet');
    } finally {
      setExporting(false);
    }
  };

  // Filtered income list
  const filteredIncomes = incomes.filter((item) => {
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...new Set(incomes.map((i) => i.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Income Overview
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Monitor, categorize and manage all your income streams
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
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Income</span>
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
                      ? 'bg-white text-teal-700 shadow-sm'
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Income ({timeframe})
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              ${Number(overview.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-teal-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Average per Entry
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              ${Number(overview.averageIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-cyan-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Incomes Count
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              {overview.numberOfTransactions || incomes.length}
            </h2>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Transaction List Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              All Incomes
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              {filteredIncomes.length} records
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
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

        {/* Incomes List */}
        {loading ? (
          <div className="py-16 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredIncomes.length > 0 ? (
          <div className="space-y-3">
            {filteredIncomes.map((item) => (
              <TransactionItem
                key={item._id}
                transaction={item}
                type="income"
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-gray-700 font-semibold text-base">
              No income entries found
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery || categoryFilter !== 'All'
                ? 'Try adjusting your search filters.'
                : 'Click "Add Income" to record your first income!'}
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Income</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <TransactionModal
        isOpen={modalOpen}
        defaultType="income"
        onClose={() => setModalOpen(false)}
        onSuccess={fetchIncomeData}
      />
    </div>
  );
};

export default IncomePage;
