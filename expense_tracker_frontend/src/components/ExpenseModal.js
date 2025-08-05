import React, { useState, useEffect } from 'react';
import axios from 'axios';

// PUBLIC_INTERFACE
const ExpenseModal = ({ expense, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    if (expense) {
      // Editing existing expense
      setFormData({
        title: expense.title || '',
        amount: expense.amount?.toString() || '',
        category: expense.category || '',
        description: expense.description || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : today
      });
    } else {
      // Adding new expense
      setFormData(prev => ({
        ...prev,
        date: today
      }));
    }
  }, [expense]);

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.date) {
      setError('Date is required');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category.trim() || undefined,
        description: formData.description.trim() || undefined,
        date: formData.date
      };

      let response;
      if (expense) {
        // Update existing expense
        response = await axios.put(`/api/expenses/${expense.id}`, requestData);
      } else {
        // Create new expense
        response = await axios.post('/api/expenses', requestData);
      }

      if (response.data.status === 'success') {
        onSave();
      } else {
        setError('Failed to save expense. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.details) {
        setError(error.response.data.details.map(d => d.message).join(', '));
      } else {
        setError('Failed to save expense. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Common expense categories for the dropdown
  const commonCategories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Shopping',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              placeholder="Enter expense title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={loading}
              required
              maxLength={255}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Amount ($) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="form-input"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
                disabled={loading}
                required
                min="0.01"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {commonCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Add any additional details..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              maxLength={1000}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  {expense ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                expense ? 'Update Expense' : 'Add Expense'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
