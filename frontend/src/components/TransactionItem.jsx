import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, Tag } from 'lucide-react';
import { transactionItemStyles } from '../assets/dummyStyles';
import { colorClasses, INCOME_CATEGORY_ICONS, EXPENSE_CATEGORY_ICONS } from '../assets/dummy';

const TransactionItem = ({
  transaction,
  type = 'expense',
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount);
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(
    transaction.date
      ? new Date(transaction.date).toISOString().split('T')[0]
      : ''
  );
  const [loading, setLoading] = useState(false);

  const classes = colorClasses[type] || colorClasses.expense;
  const icons = type === 'income' ? INCOME_CATEGORY_ICONS : EXPENSE_CATEGORY_ICONS;
  const CategoryIcon = icons[transaction.category] || <Tag className="w-5 h-5" />;

  const handleSave = async () => {
    if (!description.trim() || !amount || !category) return;
    setLoading(true);
    try {
      await onUpdate?.(transaction._id, {
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        date,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setDate(
      transaction.date
        ? new Date(transaction.date).toISOString().split('T')[0]
        : ''
    );
    setIsEditing(false);
  };

  const formattedDate = transaction.date
    ? new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className={transactionItemStyles.container(isEditing, classes)}>
      {isEditing ? (
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={transactionItemStyles.input(false, classes)}
            placeholder="Description"
          />
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={transactionItemStyles.amountInput(false, classes)}
            placeholder="Amount"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full md:w-auto bg-white rounded-lg px-3 py-2 text-sm border border-gray-200"
          />
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className={transactionItemStyles.saveButton(classes)}
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={transactionItemStyles.cancelButton}
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={transactionItemStyles.mainContainer}>
            <div
              className={`p-3 rounded-xl flex items-center justify-center ${classes.iconBg}`}
            >
              {CategoryIcon}
            </div>
            <div className={transactionItemStyles.contentContainer}>
              <h4 className={transactionItemStyles.description}>
                {transaction.description}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {transaction.category}
                </span>
                <span className={transactionItemStyles.details}>
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div className={transactionItemStyles.actionsContainer}>
            <div className={transactionItemStyles.amountContainer}>
              <span className={`text-base md:text-lg font-bold ${classes.text}`}>
                {type === 'income' ? '+' : '-'}${Number(transaction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className={transactionItemStyles.buttonsContainer}>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={transactionItemStyles.editButton(classes)}
                title="Edit transaction"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(transaction._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete transaction"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionItem;
