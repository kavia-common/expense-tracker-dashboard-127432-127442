import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const FilterSidebar = ({ isOpen, filters, categories, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // PUBLIC_INTERFACE
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  // PUBLIC_INTERFACE
  const handleClearFilters = () => {
    const clearedFilters = {
      category: '',
      startDate: '',
      endDate: '',
      search: '',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // PUBLIC_INTERFACE
  const handleQuickFilter = (filterType) => {
    const today = new Date();
    let startDate = '';
    
    switch (filterType) {
      case 'today':
        startDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      default:
        break;
    }

    const quickFilters = {
      ...localFilters,
      startDate,
      endDate: today.toISOString().split('T')[0]
    };
    
    setLocalFilters(quickFilters);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="filter-overlay" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3 className="filter-title">Filters & Sort</h3>
          <button
            onClick={onClose}
            className="filter-close"
          >
            ×
          </button>
        </div>

        <div className="filter-content">
          {/* Search */}
          <div className="filter-section">
            <label className="filter-label">Search</label>
            <input
              type="text"
              name="search"
              className="form-input"
              placeholder="Search expenses..."
              value={localFilters.search}
              onChange={handleInputChange}
            />
          </div>

          {/* Quick Filters */}
          <div className="filter-section">
            <label className="filter-label">Quick Filters</label>
            <div className="quick-filters">
              <button
                onClick={() => handleQuickFilter('today')}
                className="btn btn-small btn-outline quick-filter-btn"
              >
                Today
              </button>
              <button
                onClick={() => handleQuickFilter('week')}
                className="btn btn-small btn-outline quick-filter-btn"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => handleQuickFilter('month')}
                className="btn btn-small btn-outline quick-filter-btn"
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <label className="filter-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={localFilters.category}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="filter-section">
            <label className="filter-label">Date Range</label>
            <div className="date-range">
              <input
                type="date"
                name="startDate"
                className="form-input"
                placeholder="Start Date"
                value={localFilters.startDate}
                onChange={handleInputChange}
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                name="endDate"
                className="form-input"
                placeholder="End Date"
                value={localFilters.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="filter-section">
            <label className="filter-label">Sort By</label>
            <select
              name="sortBy"
              className="form-select"
              value={localFilters.sortBy}
              onChange={handleInputChange}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
              <option value="created_at">Created Date</option>
            </select>
          </div>

          <div className="filter-section">
            <label className="filter-label">Sort Order</label>
            <select
              name="sortOrder"
              className="form-select"
              value={localFilters.sortOrder}
              onChange={handleInputChange}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {/* Actions */}
          <div className="filter-actions">
            <button
              onClick={handleClearFilters}
              className="btn btn-outline btn-small clear-btn"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="btn btn-primary apply-btn"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
