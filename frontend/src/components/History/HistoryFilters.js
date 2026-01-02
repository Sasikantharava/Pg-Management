import React from 'react';
import '../../styles/History.css';

const HistoryFilters = ({ filters, onFilterChange, onExport }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="history-filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label>Year</label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Month</label>
          <select
            value={filters.month}
            onChange={(e) => onFilterChange('month', e.target.value)}
            disabled={filters.year === 'all'}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Room Type</label>
          <select
            value={filters.roomType}
            onChange={(e) => onFilterChange('roomType', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Shared">Shared</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Source</label>
          <select
            value={filters.source}
            onChange={(e) => onFilterChange('source', e.target.value)}
          >
            <option value="all">All Sources</option>
            <option value="manual">Manual Added</option>
            <option value="qr">QR Application</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-actions">
        <button
          className="clear-filters"
          onClick={() => onFilterChange('clear', null)}
        >
          Clear Filters
        </button>
        <button className="export-button" onClick={onExport}>
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default HistoryFilters;