import React, { useState } from "react";

const Dashboard = () => {
  // Updated stats for laptop rental/sale
  const stats = [
    { 
      title: "Active Rentals", 
      value30: 12, 
      value90: 45, 
      color: "#10b981", 
      bgColor: "#ecfdf5",
      icon: "💻",
      change: "+8.2%"
    },
    { 
      title: "Laptops Sold", 
      value30: 8, 
      value90: 32, 
      color: "#8b5cf6", 
      bgColor: "#faf5ff",
      icon: "💰",
      change: "+12.5%"
    },
    { 
      title: "Available Stock", 
      value30: 25, 
      value90: 89, 
      color: "#3b82f6", 
      bgColor: "#eff6ff",
      icon: "📦",
      change: "+4.1%"
    },
    { 
      title: "Overdue Rentals", 
      value30: 3, 
      value90: 11, 
      color: "#ef4444", 
      bgColor: "#fef2f2",
      icon: "⚠️",
      change: "-2.3%"
    },
  ];

  // Doughnut chart data simulation
  const categoryData = [
    { name: "Gaming", value: 15, color: "#fb923c" },
    { name: "Business", value: 25, color: "#6366f1" },
    { name: "Ultrabooks", value: 18, color: "#2dd4bf" },
    { name: "Budget", value: 22, color: "#f472b6" },
    { name: "Workstations", value: 12, color: "#fbbf24" },
    { name: "Chromebooks", value: 8, color: "#a855f7" },
  ];

  // Monthly data for trend visualization
  const monthlyData = [
    { month: "Jan", rentals: 120, sales: 80 },
    { month: "Feb", rentals: 150, sales: 90 },
    { month: "Mar", rentals: 180, sales: 100 },
    { month: "Apr", rentals: 210, sales: 110 },
    { month: "May", rentals: 240, sales: 120 },
    { month: "Jun", rentals: 270, sales: 130 },
    { month: "Jul", rentals: 300, sales: 140 },
    { month: "Aug", rentals: 280, sales: 150 },
    { month: "Sep", rentals: 250, sales: 140 },
    { month: "Oct", rentals: 230, sales: 130 },
    { month: "Nov", rentals: 200, sales: 120 },
    { month: "Dec", rentals: 180, sales: 110 },
  ];

  // Table data for Recent Rentals
  const recentRentals = [
    { id: 'R1001', customer: 'John Doe', model: 'Dell XPS 15', startDate: '2023-06-01', endDate: '2023-07-01', status: 'Active' },
    { id: 'R1002', customer: 'Jane Smith', model: 'MacBook Pro M2', startDate: '2023-06-05', endDate: '2023-07-05', status: 'Active' },
    { id: 'R1003', customer: 'Mike Johnson', model: 'HP Spectre x360', startDate: '2023-05-20', endDate: '2023-06-20', status: 'Completed' },
    { id: 'R1004', customer: 'Sarah Williams', model: 'Lenovo ThinkPad X1', startDate: '2023-06-10', endDate: '2023-07-10', status: 'Active' },
    { id: 'R1005', customer: 'David Brown', model: 'Asus ROG Zephyrus', startDate: '2023-05-15', endDate: '2023-06-15', status: 'Overdue' },
  ];

  // Table data for Recent Sales
  const recentSales = [
    { id: 'S2001', customer: 'Alex Green', model: 'MacBook Air M1', date: '2023-06-12', price: '$999', status: 'Completed' },
    { id: 'S2002', customer: 'Emily White', model: 'Surface Laptop 4', date: '2023-06-08', price: '$1,299', status: 'Completed' },
    { id: 'S2003', customer: 'Robert Black', model: 'Acer Swift 3', date: '2023-06-05', price: '$699', status: 'Completed' },
    { id: 'S2004', customer: 'Lisa Gray', model: 'LG Gram 17', date: '2023-05-28', price: '$1,599', status: 'Completed' },
    { id: 'S2005', customer: 'Thomas Blue', model: 'Razer Blade 15', date: '2023-05-22', price: '$2,199', status: 'Completed' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
      case 'Completed':
        return { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' };
      case 'Overdue':
        return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    }
  };

  const maxRental = Math.max(...monthlyData.map(d => d.rentals));
  const maxSales = Math.max(...monthlyData.map(d => d.sales));

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <div style={headerLeftStyle}>
          <div style={headerIconStyle}>📊</div>
          <div>
            <h1 style={headerTitleStyle}>
              Laptop Rental & Sales Dashboard
            </h1>
            <p style={headerSubtitleStyle}>Manage your inventory and track performance</p>
          </div>
        </div>
        <div style={headerButtonsStyle}>
          <button 
            style={primaryButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            ➕ Add New Laptop
          </button>
          <button 
            style={secondaryButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📅 Process Rental
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div style={statsGridStyle}>
        {stats.map((stat, index) => (
          <div key={index} style={statsCardStyle}>
            <div style={statsCardHeaderStyle}>
              <div style={{...statsIconStyle, backgroundColor: stat.bgColor}}>
                <span style={{color: stat.color}}>{stat.icon}</span>
              </div>
              <div style={{
                ...changeIndicatorStyle,
                backgroundColor: stat.change.startsWith('+') ? '#dcfce7' : '#fee2e2',
                color: stat.change.startsWith('+') ? '#166534' : '#991b1b'
              }}>
                {stat.change}
              </div>
            </div>
            
            <h3 style={statsCardTitleStyle}>{stat.title}</h3>
            
            <div style={statsValueGridStyle}>
              <div style={statsValueBoxStyle}>
                <p style={statsValueLabelStyle}>30 Days</p>
                <p style={statsValueNumberStyle}>{stat.value30}</p>
              </div>
              <div style={statsValueBoxStyle}>
                <p style={statsValueLabelStyle}>90 Days</p>
                <p style={statsValueNumberStyle}>{stat.value90}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Section */}
      <div style={chartsGridStyle}>
        {/* Left Column */}
        <div style={columnStyle}>
          {/* Laptop Categories Chart */}
          <div style={chartCardStyle}>
            <div style={chartHeaderStyle}>
              <div style={chartIconStyle}>📊</div>
              <h2 style={chartTitleStyle}>Laptop Categories</h2>
            </div>
            <div style={doughnutChartContainerStyle}>
              <div style={doughnutChartStyle}>
                <svg style={svgStyle} viewBox="0 0 100 100">
                  {categoryData.map((item, index) => {
                    const total = categoryData.reduce((sum, cat) => sum + cat.value, 0);
                    const percentage = (item.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const prevPercentage = categoryData.slice(0, index).reduce((sum, cat) => sum + cat.value, 0) / total * 100;
                    const prevAngle = (prevPercentage / 100) * 360;
                    
                    const startAngle = prevAngle;
                    const endAngle = prevAngle + angle;
                    
                    const x1 = 50 + 30 * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = 50 + 30 * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = 50 + 30 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 50 + 30 * Math.sin((endAngle * Math.PI) / 180);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    return (
                      <path
                        key={index}
                        d={`M 50 50 L ${x1} ${y1} A 30 30 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        stroke="white"
                        strokeWidth="0.5"
                        style={{cursor: 'pointer', transition: 'opacity 0.2s ease'}}
                        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="15" fill="white" />
                </svg>
              </div>
              
              {/* Legend */}
              <div style={legendStyle}>
                {categoryData.map((item, index) => (
                  <div key={index} style={legendItemStyle}>
                    <div style={{...legendColorStyle, backgroundColor: item.color}}></div>
                    <span style={legendTextStyle}>{item.name}</span>
                    <span style={legendValueStyle}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Rentals Table */}
          <div style={tableCardStyle}>
            <div style={tableHeaderStyle}>
              <div style={tableIconStyle}>📅</div>
              <h2 style={tableTitleStyle}>Recent Rentals</h2>
            </div>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRowStyle}>
                    <th style={tableHeaderCellStyle}>Rental ID</th>
                    <th style={tableHeaderCellStyle}>Customer</th>
                    <th style={tableHeaderCellStyle}>Model</th>
                    <th style={tableHeaderCellStyle}>Start Date</th>
                    <th style={tableHeaderCellStyle}>End Date</th>
                    <th style={{...tableHeaderCellStyle, textAlign: 'right'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRentals.map((row, index) => (
                    <tr key={index} style={tableRowStyle}>
                      <td style={tableCellIdStyle}>{row.id}</td>
                      <td style={tableCellStyle}>{row.customer}</td>
                      <td style={tableCellStyle}>{row.model}</td>
                      <td style={tableCellStyle}>{row.startDate}</td>
                      <td style={tableCellStyle}>{row.endDate}</td>
                      <td style={{...tableCellStyle, textAlign: 'right'}}>
                        <span style={{...statusBadgeStyle, ...getStatusColor(row.status)}}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={columnStyle}>
          {/* Rental & Sales Trends */}
          <div style={chartCardStyle}>
            <div style={chartHeaderStyle}>
              <div style={chartIconStyle}>📈</div>
              <h2 style={chartTitleStyle}>Rental & Sales Trends</h2>
            </div>
            <div style={lineChartContainerStyle}>
              <div style={lineChartStyle}>
                {monthlyData.map((data, index) => (
                  <div key={index} style={barGroupStyle}>
                    <div style={barsContainerStyle}>
                      <div 
                        style={{
                          ...barStyle,
                          backgroundColor: '#3b82f6',
                          height: `${(data.rentals / maxRental) * 180}px`
                        }}
                      ></div>
                      <div 
                        style={{
                          ...barStyle,
                          backgroundColor: '#ef4444',
                          height: `${(data.sales / maxSales) * 180}px`
                        }}
                      ></div>
                    </div>
                    <span style={monthLabelStyle}>{data.month}</span>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div style={chartLegendStyle}>
                <div style={legendItemStyle}>
                  <div style={{...legendColorStyle, backgroundColor: '#3b82f6'}}></div>
                  <span style={legendTextStyle}>Rentals</span>
                </div>
                <div style={legendItemStyle}>
                  <div style={{...legendColorStyle, backgroundColor: '#ef4444'}}></div>
                  <span style={legendTextStyle}>Sales</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Sales Table */}
          <div style={tableCardStyle}>
            <div style={tableHeaderStyle}>
              <div style={tableIconStyle}>💵</div>
              <h2 style={tableTitleStyle}>Recent Sales</h2>
            </div>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRowStyle}>
                    <th style={tableHeaderCellStyle}>Sale ID</th>
                    <th style={tableHeaderCellStyle}>Customer</th>
                    <th style={tableHeaderCellStyle}>Model</th>
                    <th style={tableHeaderCellStyle}>Date</th>
                    <th style={{...tableHeaderCellStyle, textAlign: 'right'}}>Price</th>
                    <th style={{...tableHeaderCellStyle, textAlign: 'right'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((row, index) => (
                    <tr key={index} style={tableRowStyle}>
                      <td style={tableCellIdStyle}>{row.id}</td>
                      <td style={tableCellStyle}>{row.customer}</td>
                      <td style={tableCellStyle}>{row.model}</td>
                      <td style={tableCellStyle}>{row.date}</td>
                      <td style={{...tableCellStyle, textAlign: 'right', fontWeight: '600'}}>{row.price}</td>
                      <td style={{...tableCellStyle, textAlign: 'right'}}>
                        <span style={{...statusBadgeStyle, ...getStatusColor(row.status)}}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  padding: '1.5rem',
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  lineHeight: 1.6,
};

const headerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

const headerLeftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem',
};

const headerIconStyle = {
  padding: '0.75rem',
  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  borderRadius: '12px',
  fontSize: '2rem',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
};

const headerTitleStyle = {
  fontSize: '1.875rem',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  margin: 0,
};

const headerSubtitleStyle = {
  color: '#64748b',
  margin: '0.25rem 0 0 0',
  fontSize: '0.875rem',
};

const headerButtonsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  '@media (min-width: 640px)': {
    flexDirection: 'row',
  },
};

const primaryButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  outline: 'none',
};

const secondaryButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  border: '2px solid #2563eb',
  color: '#2563eb',
  padding: '0.75rem 1.5rem',
  borderRadius: '12px',
  fontWeight: '600',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  outline: 'none',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
  marginBottom: '2rem',
};

const statsCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
};

const statsCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
};

const statsIconStyle = {
  padding: '0.75rem',
  borderRadius: '12px',
  fontSize: '1.5rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const changeIndicatorStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  padding: '0.25rem 0.5rem',
  borderRadius: '6px',
  border: '1px solid',
};

const statsCardTitleStyle = {
  color: '#64748b',
  fontWeight: '500',
  marginBottom: '1rem',
  fontSize: '0.875rem',
  margin: '0 0 1rem 0',
};

const statsValueGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.75rem',
};

const statsValueBoxStyle = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  padding: '0.75rem',
  textAlign: 'center',
  border: '1px solid #e2e8f0',
};

const statsValueLabelStyle = {
  fontSize: '0.75rem',
  color: '#64748b',
  margin: '0 0 0.25rem 0',
};

const statsValueNumberStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#1e293b',
  margin: 0,
};

const chartsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
  gap: '2rem',
};

const columnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const chartCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

const chartHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.5rem',
};

const chartIconStyle = {
  padding: '0.5rem',
  backgroundColor: '#f1f5f9',
  borderRadius: '8px',
  fontSize: '1.25rem',
};

const chartTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#1e293b',
  margin: 0,
};

const doughnutChartContainerStyle = {
  position: 'relative',
  height: '320px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const doughnutChartStyle = {
  width: '256px',
  height: '256px',
};

const svgStyle = {
  width: '100%',
  height: '100%',
  transform: 'rotate(-90deg)',
};

const legendStyle = {
  position: 'absolute',
  right: '0',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const legendItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const legendColorStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
};

const legendTextStyle = {
  fontSize: '0.875rem',
  color: '#64748b',
};

const legendValueStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#1e293b',
};

const tableCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

const tableHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.5rem',
};

const tableIconStyle = {
  padding: '0.5rem',
  backgroundColor: '#f1f5f9',
  borderRadius: '8px',
  fontSize: '1.25rem',
};

const tableTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#1e293b',
  margin: 0,
};

const tableContainerStyle = {
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeaderRowStyle = {
  borderBottom: '1px solid #e2e8f0',
};

const tableHeaderCellStyle = {
  textAlign: 'left',
  padding: '0.75rem 0.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#64748b',
};

const tableRowStyle = {
  borderBottom: '1px solid #f1f5f9',
  transition: 'background-color 0.2s ease',
  cursor: 'pointer',
};

const tableCellStyle = {
  padding: '0.75rem 0.5rem',
  fontSize: '0.875rem',
  color: '#1e293b',
};

const tableCellIdStyle = {
  padding: '0.75rem 0.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#2563eb',
};

const statusBadgeStyle = {
  display: 'inline-flex',
  padding: '0.25rem 0.5rem',
  fontSize: '0.75rem',
  fontWeight: '600',
  borderRadius: '6px',
};

const lineChartContainerStyle = {
  height: '320px',
  position: 'relative',
};

const lineChartStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  padding: '0 1rem 2rem 1rem',
  height: '100%',
};

const barGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  flex: 1,
};

const barsContainerStyle = {
  display: 'flex',
  gap: '0.25rem',
  alignItems: 'flex-end',
  height: '180px',
};

const barStyle = {
  width: '12px',
  borderRadius: '2px 2px 0 0',
  transition: 'all 0.5s ease',
  cursor: 'pointer',
};

const monthLabelStyle = {
  fontSize: '0.75rem',
  color: '#64748b',
  fontWeight: '500',
};

const chartLegendStyle = {
  position: 'absolute',
  top: '0',
  right: '0',
  display: 'flex',
  gap: '1rem',
};

export default Dashboard;