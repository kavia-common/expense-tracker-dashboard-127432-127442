import React from 'react';

// PUBLIC_INTERFACE
const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get category icon based on category name
  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍽️',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Utilities': '⚡',
      'Shopping': '🛍️',
      'Healthcare': '🏥',
      'Education': '📚',
      'Travel': '✈️',
      'Other': '📋'
    };
    return icons[category] || '📋';
  };

  // Handle edit button click
  const handleEdit = () => {
    onEdit(expense);
  };

  // Handle delete button click
  const handleDelete = () => {
    onDelete(expense.id);
  };

  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <div className="expense-category">
          <span className="category-icon">
            {getCategoryIcon(expense.category)}
          </span>
          <span className="category-name">
            {expense.category || 'Uncategorized'}
          </span>
        </div>
        <div className="expense-actions">
          <button
            onClick={handleEdit}
            className="btn btn-small action-btn edit-btn"
            title="Edit expense"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-small action-btn delete-btn"
            title="Delete expense"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="expense-card-body">
        <h3 className="expense-title">{expense.title}</h3>
        {expense.description && (
          <p className="expense-description">{expense.description}</p>
        )}
      </div>

      <div className="expense-card-footer">
        <div className="expense-amount">
          ${expense.amount.toFixed(2)}
        </div>
        <div className="expense-date">
          {formatDate(expense.date)}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
