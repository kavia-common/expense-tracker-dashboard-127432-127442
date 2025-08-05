import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseCard from './ExpenseCard';
import ExpenseModal from './ExpenseModal';
import FilterSidebar from './FilterSidebar';

// PUBLIC_INTERFACE
const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Load expenses on component mount and when filters change
  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  // Load additional data
  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  // PUBLIC_INTERFACE
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.category && { category: filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.search && { search: filters.search })
      });

      const response = await axios.get(`/api/expenses?${params}`);
      
      if (response.data.status === 'success') {
        setExpenses(response.data.data);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages
          }));
        }
        setError('');
      }
    } catch (error) {
      console.error('Failed to load expenses:', error);
      setError('Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const loadCategories = async () => {
    try {
      const response = await axios.get('/api/expenses/categories');
      if (response.data.status === 'success') {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // PUBLIC_INTERFACE
  const loadStats = async () => {
    try {
      const response = await axios.get('/api/expenses/stats');
      if (response.data.status === 'success') {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // PUBLIC_INTERFACE
  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseModal(true);
  };

  // PUBLIC_INTERFACE
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  };

  // PUBLIC_INTERFACE
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axios.delete(`/api/expenses/${expenseId}`);
      await loadExpenses(); // Reload expenses
      await loadStats(); // Reload stats
      await loadCategories(); // Reload categories
    } catch (error) {
      console.error('Failed to delete expense:', error);
      setError('Failed to delete expense. Please try again.');
    }
  };

  // PUBLIC_INTERFACE
  const handleExpenseSaved = async () => {
    setShowExpenseModal(false);
    setEditingExpense(null);
    await loadExpenses();
    await loadStats();
    await loadCategories();
  };

  // PUBLIC_INTERFACE
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // PUBLIC_INTERFACE
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Expense Dashboard</h1>
            <p className="dashboard-subtitle">
              Track and manage your expenses efficiently
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline filter-toggle"
            >
              <span>🔍</span>
              Filters
            </button>
            <button
              onClick={handleAddExpense}
              className="btn btn-primary"
            >
              <span>+</span>
              Add Expense
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3 className="stat-value">${totalAmount.toFixed(2)}</h3>
                <p className="stat-label">Current Page Total</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3 className="stat-value">{pagination.total}</h3>
                <p className="stat-label">Total Expenses</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📁</div>
              <div className="stat-content">
                <h3 className="stat-value">{categories.length}</h3>
                <p className="stat-label">Categories</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3 className="stat-value">
                  ${stats.monthlyByCategory?.reduce((sum, cat) => sum + cat.total, 0)?.toFixed(2) || '0.00'}
                </h3>
                <p className="stat-label">Monthly Total</p>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-content">
          {/* Sidebar Filters */}
          <FilterSidebar
            isOpen={showFilters}
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />

          {/* Main Content */}
          <div className="main-panel">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading expenses...</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No expenses found</h3>
                <p>Start by adding your first expense or adjust your filters.</p>
                <button
                  onClick={handleAddExpense}
                  className="btn btn-primary btn-large"
                >
                  Add Your First Expense
                </button>
              </div>
            ) : (
              <>
                {/* Expenses Grid */}
                <div className="expenses-grid">
                  {expenses.map(expense => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      onEdit={handleEditExpense}
                      onDelete={handleDeleteExpense}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="btn btn-outline"
                    >
                      Previous
                    </button>
                    
                    <div className="pagination-info">
                      Page {pagination.page} of {pagination.pages}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="btn btn-outline"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <ExpenseModal
          expense={editingExpense}
          onSave={handleExpenseSaved}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
