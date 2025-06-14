import React, { useState } from 'react';

const departments = ['All Departments', 'Sales', 'Tech', 'HR'];
const roles = ['All Roles', 'Admin', 'Rounder', 'Manager'];
const performances = ['All Performance', 'Good', 'Average', 'Poor'];

const dummyData = [
  { code: '456677', name: 'superadmin', role: 'undefined', teamHead: 'undefined', dept: 'undefined', date: '2025-01-16T00:00:00.000Z', perf: 'undefined' },
  { code: 'rounder', name: 'guru', role: 'undefined', teamHead: 'undefined', dept: 'undefined', date: '2024-12-12T00:00:00.000Z', perf: 'undefined' },
  { code: '456677', name: 'rounder', role: 'undefined', teamHead: 'undefined', dept: 'undefined', date: null, perf: 'undefined' },
  { code: 'rounder', name: 'Kavya', role: 'undefined', teamHead: 'undefined', dept: 'undefined', date: '2024-06-03T00:00:00.000Z', perf: 'undefined' },
  { code: 'rounder', name: 'raghavendra', role: 'undefined', teamHead: 'undefined', dept: 'undefined', date: '2025-05-20T00:00:00.000Z', perf: 'undefined' },
  { code: 'rounder', name: 'Testing by raghavendra', role: 'undefined', teamHead: 'undefined', dept: 'undefined', date: '2025-05-01T00:00:00.000Z', perf: 'undefined' },
  { code: 'rounder', name: 'Mulinitio2', role: 'undefined', teamHead: 'undefined', dept: 'undefined', date: '2025-05-31T00:00:00.000Z', perf: 'undefined' },
  { code: 'rounder', name: 'Raghavendra', role: 'undefined', teamHead: 'undefined', dept: 'undefined', date: '2025-05-20T00:00:00.000Z', perf: 'undefined' },
];

const UserPerformance = () => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [role, setRole] = useState('All Roles');
  const [performance, setPerformance] = useState('All Performance');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const filteredData = dummyData.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase()) || row.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === 'All Departments' || row.dept === department;
    const matchesRole = role === 'All Roles' || row.role === role;
    const matchesPerf = performance === 'All Performance' || row.perf === performance;
    const matchesDate = !selectedDate || (row.date && new Date(row.date).toISOString().split('T')[0] === selectedDate);
    return matchesSearch && matchesDept && matchesRole && matchesPerf && matchesDate;
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((_, index) => index)));
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (index) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === filteredData.length);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <div style={iconStyle}>👥</div>
          <h2 style={titleStyle}>User Performance</h2>
        </div>
      </div>

      {/* Filters Card */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={smallIconStyle}>🔍</div>
          <h3 style={cardHeaderStyle}>Filters:</h3>
        </div>
        <div style={filtersGridStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Search</label>
            <input
              type="text"
              placeholder="Filter key fields"
              style={inputStyle}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Department</label>
            <select
              style={selectStyle}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Role</label>
            <select
              style={selectStyle}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Performance</label>
            <select
              style={selectStyle}
              value={performance}
              onChange={(e) => setPerformance(e.target.value)}
            >
              {performances.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              style={inputStyle}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div style={cardStyle}>
        <div style={cardHeaderContainerStyle}>
          <div style={smallIconStyle}>📊</div>
          <h3 style={cardHeaderStyle}>Results ({filteredData.length} records):</h3>
        </div>
        
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={checkboxHeaderStyle}>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={tableHeaderStyle}>User Code</th>
                <th style={tableHeaderStyle}>User Name</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Team Head</th>
                <th style={tableHeaderStyle}>Department</th>
                <th style={tableHeaderStyle}>Joining Date</th>
                <th style={tableHeaderStyle}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={noDataStyle}>
                    <div style={noDataContainerStyle}>
                      <div style={noDataIconStyle}>📋</div>
                      <div>No data found matching your criteria</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr 
                    key={index} 
                    style={{
                      ...tableRowStyle,
                      backgroundColor: selectedRows.has(index) ? '#f0f9ff' : 'transparent'
                    }}
                  >
                    <td style={checkboxCellStyle}>
                      <input
                        type="checkbox"
                        style={checkboxStyle}
                        checked={selectedRows.has(index)}
                        onChange={() => handleRowSelect(index)}
                      />
                    </td>
                    <td style={tableCellStyle}>
                      <span style={codeStyle}>{row.code}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={nameStyle}>{row.name}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={statusBadgeStyle(row.role)}>
                        {row.role}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{row.teamHead}</td>
                    <td style={tableCellStyle}>{row.dept}</td>
                    <td style={tableCellStyle}>
                      <span style={dateStyle}>{formatDate(row.date)}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={performanceBadgeStyle(row.perf)}>
                        {row.perf}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '2rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  minHeight: '100vh',
  lineHeight: 1.6,
};

const headerStyle = {
  marginBottom: '2rem',
};

const titleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.5rem',
};

const iconStyle = {
  fontSize: '1.3rem',
  marginRight: '0.75rem',
  backgroundColor: '#e0f2fe',
  padding: '0.03rem',
  borderRadius: '12px',
};

const titleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  marginBottom: '1.5rem',
};

const cardHeaderContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #e2e8f0',
};

const smallIconStyle = {
  fontSize: '1.125rem',
  marginRight: '0.75rem',
  backgroundColor: '#f1f5f9',
  padding: '0.5rem',
  borderRadius: '8px',
};

const cardHeaderStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const filtersGridStyle = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
};

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  fontSize: '0.875rem',
  color: '#374151',
  letterSpacing: '0.025em',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

const tableContainerStyle = {
  overflowX: 'auto',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#ffffff',
};

const tableHeaderRowStyle = {
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
};

const tableHeaderStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '0.875rem',
  color: '#374151',
  borderBottom: '1px solid #e2e8f0',
};

const checkboxHeaderStyle = {
  ...tableHeaderStyle,
  width: '40px',
  textAlign: 'center',
};

const tableRowStyle = {
  borderBottom: '1px solid #f1f5f9',
  transition: 'background-color 0.2s ease',
};

const tableCellStyle = {
  padding: '0.75rem',
  fontSize: '0.875rem',
  color: '#374151',
  borderBottom: '1px solid #f1f5f9',
};

const checkboxCellStyle = {
  ...tableCellStyle,
  textAlign: 'center',
  width: '40px',
};

const checkboxStyle = {
  cursor: 'pointer',
};

const codeStyle = {
  fontFamily: 'monospace',
  backgroundColor: '#f1f5f9',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.8125rem',
};

const nameStyle = {
  fontWeight: '500',
  color: '#1e293b',
};

const dateStyle = {
  color: '#6b7280',
  fontSize: '0.8125rem',
};

const statusBadgeStyle = (status) => ({
  padding: '0.25rem 0.5rem',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: '500',
  backgroundColor: status === 'undefined' ? '#f3f4f6' : '#dbeafe',
  color: status === 'undefined' ? '#6b7280' : '#1e40af',
});

const performanceBadgeStyle = (perf) => {
  let bgColor = '#f3f4f6';
  let textColor = '#6b7280';
  
  if (perf === 'Good') {
    bgColor = '#dcfce7';
    textColor = '#166534';
  } else if (perf === 'Average') {
    bgColor = '#fef3c7';
    textColor = '#92400e';
  } else if (perf === 'Poor') {
    bgColor = '#fee2e2';
    textColor = '#991b1b';
  }

  return {
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '500',
    backgroundColor: bgColor,
    color: textColor,
  };
};

const noDataStyle = {
  padding: '3rem',
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '0.875rem',
};

const noDataContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
};

const noDataIconStyle = {
  fontSize: '2rem',
  opacity: 0.5,
};

export default UserPerformance;