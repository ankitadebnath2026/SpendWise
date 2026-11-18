import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { modalStyles } from '../assets/dummyStyles';
import { incomeService, expenseService } from '../services/api';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Housing', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

const TransactionModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  defaultType = 'expense',
}) => {
  const [type, setType] = useState(defaultType); // 'income' or 'expense'
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || defaultType);
      setDescription(initialData.description || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setCategory(initialData.category || '');
      setDate(
        initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
    } else {
      setType(defaultType);
      setDescription('');
      setAmount('');
      setCategory(defaultType === 'income' ? 'Salary' : 'Food');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setError('');
  }, [initialData, defaultType, isOpen]);

  // Update default category when switching types if not already set
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food');
  };

  if (!isOpen) return null;

  const currentTheme =
    type === 'income'
      ? modalStyles.colorClasses.teal
      : modalStyles.colorClasses.orange;

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!category) {
      setError('Please choose a category.');
      return;
    }
    if (!date) {
      setError('Please choose a date.');
      return;
    }

    setLoading(true);
    const payload = {
      description: description.trim(),
      amount: parsedAmount,
      category,
      date,
    };

    try {
      if (type === 'income') {
        if (isEditing && initialData._id) {
          await incomeService.update(initialData._id, payload);
        } else {
          await incomeService.add(payload);
        }
      } else {
        if (isEditing && initialData._id) {
          await expenseService.update(initialData._id, payload);
        } else {
          await expenseService.add(payload);
        }
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Operation failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modalContainer}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.modalTitle}>
            {isEditing ? `Edit ${type === 'income' ? 'Income' : 'Expense'}` : `Add Transaction`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={modalStyles.closeButton}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={modalStyles.form}>
          {/* Type Toggle if not editing */}
          {!isEditing && (
            <div className={modalStyles.typeButtonContainer}>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={modalStyles.typeButton(
                  type === 'income',
                  'bg-teal-500'
                )}
              >
                + Income
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={modalStyles.typeButton(
                  type === 'expense',
                  'bg-gradient-to-r from-orange-500 to-amber-500'
                )}
              >
                - Expense
              </button>
            </div>
          )}

          {/* Description */}
          <div>
            <label className={modalStyles.label}>Description</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Salary, Groceries, Coffee"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={modalStyles.input(currentTheme.ring)}
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className={modalStyles.label}>Amount ($)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={modalStyles.input(currentTheme.ring)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={modalStyles.label}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={modalStyles.input(currentTheme.ring)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className={modalStyles.label}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={modalStyles.input(currentTheme.ring)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${modalStyles.submitButton(currentTheme.button)} ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading
              ? 'Saving...'
              : isEditing
              ? 'Update Transaction'
              : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
