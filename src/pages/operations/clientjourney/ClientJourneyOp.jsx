import React, { useState } from 'react';
import {
  Search,
  User,
  TrendingUp,
  FileText,
  ShoppingCart,
  Truck,
  Clipboard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const ClientJourneyOp = () => {
  const [searchBy, setSearchBy] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    client: false,
    leads: false,
    quotation: false,
    orders: true, // Default expanded to show the example
    dc: false,
    grn: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clientData = [
    {
      dateOfFirstContact: '17-01-2024',
      contactCoName: 'Anand Technologies',
      clientCode: '1256',
      contactPerson: 'Anand',
      mobileNumber: '9123456789',
      email: 'Anand@gmail.com',
      clientOwner: 'Sreejith'
    }
  ];

  const leadsData = [
    {
      leadDate: '20-01-2024',
      leadCode: '7894',
      leadType: 'Rent',
      leadOwner: 'Sreejith',
      leadTitle: 'ZYX',
      executedBy: 'Abhiram',
      leadStatus: 'Interested'
    }
  ];

  const quotationData = [
    {
      quotationDate: '28-01-2024',
      quotationCode: '7458',
      quotationType: 'Rent',
      quotationAmount: '55,000',
      quotationStatus: 'Executed',
      executedBy: 'Abhiram'
    }
  ];

  const ordersData = [
    {
      orderDate: '05-02-2024',
      orderCode: '8745',
      orderAmount: '55,000',
      billingContact: 'Anand',
      shippingContact: 'Anand',
      paymentTerms: 'Prepaid',
      executive: 'Abhiram'
    }
  ];

  const orderSubItems = [
    {
      orderDate: '28-01-2024',
      orderCode: '7458',
      orderAmount: '55,000',
      billingContact: 'Anand',
      shippingContact: 'Anand',
      paymentTerms: 'Prepaid',
      executive: 'Abhiram'
    },
    {
      orderDate: '28-01-2024',
      orderCode: '7458',
      orderAmount: '55,000',
      billingContact: 'Anand',
      shippingContact: 'Anand',
      paymentTerms: 'Prepaid',
      executive: 'Abhiram'
    },
    {
      orderDate: '28-01-2024',
      orderCode: '7458',
      orderAmount: '55,000',
      billingContact: 'Anand',
      shippingContact: 'Anand',
      paymentTerms: 'Prepaid',
      executive: 'Abhiram'
    }
  ];

  const dcData = [
    {
      dcDate: '08-02-2024',
      dcCode: '8745',
      vehicleNumber: 'KA 05 AD 9956',
      deliveredStaff: 'Abhiram',
      receiverName: 'Anand',
      receiverPhNumber: '9123456789',
      shippingAddress: '#12th main Road,jayanagar,Bangalore-560074',
      dcStatus: 'Delivered'
    }
  ];

  const grnData = [
    {
      grnDate: '05-07-2024',
      grnCode: '8974',
      informedPerson: 'Mr.Sathish',
      contactNumber: '9123456789',
      returnedPerson: 'Anand',
      contactNumber2: '9123456789',
      receivedPerson: 'Abhiram',
      vehicleNumber: 'KA 05 AD 9956'
    }
  ];

  const SectionHeader = ({ icon: Icon, title, sectionKey, color }) => (
    <div 
      style={sectionHeaderStyle}
      onClick={() => toggleSection(sectionKey)}
    >
      <div style={{ ...iconContainerStyle, backgroundColor: color }}>
        <Icon style={iconStyle} />
      </div>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <button style={toggleButtonStyle}>
        {expandedSections[sectionKey] ? 
          <ChevronUp style={chevronStyle} /> : 
          <ChevronDown style={chevronStyle} />
        }
      </button>
    </div>
  );

  const renderTable = (columns, data, isSubItem = false) => (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr style={tableHeaderRowStyle}>
            {columns.map((column) => (
              <th key={column.key} style={tableHeaderCellStyle}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} style={tableRowStyle}>
              {columns.map((column) => (
                <td key={column.key} style={tableCellStyle}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderHierarchicalSection = (sectionKey, icon, title, color, mainData, mainColumns, subItems = null, subColumns = null) => (
    <div style={sectionContainerStyle}>
      <div style={sectionHeaderContainerStyle}>
        <SectionHeader 
          icon={icon} 
          title={title} 
          sectionKey={sectionKey}
          color={color}
        />
      </div>
      
      {expandedSections[sectionKey] && (
        <div style={sectionContentStyle}>
          {/* Main section data */}
          <div style={{ marginBottom: '1rem' }}>
            {renderTable(mainColumns, mainData)}
          </div>
          
          {/* Sub-items with connecting lines and numbers */}
          {subItems && subColumns && (
            <div style={subItemsContainerStyle}>
              {/* Vertical connecting line */}
              <div style={verticalConnectorStyle}></div>
              
              {subItems.map((item, index) => (
                <div key={index} style={subItemWrapperStyle}>
                  {/* Horizontal connecting line */}
                  <div style={horizontalConnectorStyle}></div>
                  
                  {/* Numbered circle */}
                  <div style={numberedCircleStyle}>
                    {subItems.length - index}
                  </div>
                  
                  {/* Sub-item table */}
                  <div style={subItemContentStyle}>
                    {renderTable(subColumns, [item], true)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          Operations / Client Journey Report
        </h1>
      </div>

      {/* Search Controls */}
      <div style={searchControlsStyle}>
        <div style={selectContainerStyle}>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            style={selectStyle}
          >
            <option value="">Search By</option>
            <option value="client">Code</option>
            <option value="code">Name</option>
          </select>
          <ChevronDown style={selectChevronStyle} />
        </div>
        <div style={searchInputContainerStyle}>
          <input
            type="text"
            placeholder="Enter Code/Name"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            style={searchInputStyle}
          />
          <Search style={searchIconStyle} />
        </div>
      </div>

      {/* Client Section */}
      {renderHierarchicalSection(
        'client',
        User,
        'Client',
        '#3b82f6',
        clientData,
        [
          { key: 'dateOfFirstContact', label: 'Date of First Contact' },
          { key: 'contactCoName', label: 'Contact/Co. Name' },
          { key: 'clientCode', label: 'Client Code' },
          { key: 'contactPerson', label: 'Contact Person' },
          { key: 'mobileNumber', label: 'Mobile Number' },
          { key: 'email', label: 'Email' },
          { key: 'clientOwner', label: 'Client Owner' }
        ]
      )}

      {/* Leads Section */}
      {renderHierarchicalSection(
        'leads',
        TrendingUp,
        'Leads',
        '#3b82f6',
        leadsData,
        [
          { key: 'leadDate', label: 'Lead Date' },
          { key: 'leadCode', label: 'Lead Code' },
          { key: 'leadType', label: 'Lead Type' },
          { key: 'leadOwner', label: 'Lead Owner' },
          { key: 'leadTitle', label: 'Lead Title' },
          { key: 'executedBy', label: 'Executed By' },
          { key: 'leadStatus', label: 'Lead Status' }
        ]
      )}

      {/* Quotation Section */}
      {renderHierarchicalSection(
        'quotation',
        FileText,
        'Quotation',
        '#3b82f6',
        quotationData,
        [
          { key: 'quotationDate', label: 'Quotation Date' },
          { key: 'quotationCode', label: 'Quotation Code' },
          { key: 'quotationType', label: 'Quotation Type' },
          { key: 'quotationAmount', label: 'Quotation Amount' },
          { key: 'quotationStatus', label: 'Quotation Status' },
          { key: 'executedBy', label: 'Executed By' }
        ]
      )}

      {/* Orders Section with Sub-items */}
      {renderHierarchicalSection(
        'orders',
        ShoppingCart,
        'Orders',
        '#3b82f6',
        ordersData,
        [
          { key: 'orderDate', label: 'Order Date' },
          { key: 'orderCode', label: 'Order Code' },
          { key: 'orderAmount', label: 'Order Amount' },
          { key: 'billingContact', label: 'Billing Contact' },
          { key: 'shippingContact', label: 'Shipping Contact' },
          { key: 'paymentTerms', label: 'Payment Terms' },
          { key: 'executive', label: 'Executive' }
        ],
        orderSubItems,
        [
          { key: 'orderDate', label: 'Order Date' },
          { key: 'orderCode', label: 'Order Code' },
          { key: 'orderAmount', label: 'Order Amount' },
          { key: 'billingContact', label: 'Billing Contact' },
          { key: 'shippingContact', label: 'Shipping Contact' },
          { key: 'paymentTerms', label: 'Payment Terms' },
          { key: 'executive', label: 'Executive' }
        ]
      )}

      {/* DC Section */}
      {renderHierarchicalSection(
        'dc',
        Truck,
        'DC',
        '#3b82f6',
        dcData,
        [
          { key: 'dcDate', label: 'DC Date' },
          { key: 'dcCode', label: 'DC Code' },
          { key: 'vehicleNumber', label: 'Vehicle Number' },
          { key: 'deliveredStaff', label: 'Delivered Staff' },
          { key: 'receiverName', label: 'Receiver Name' },
          { key: 'receiverPhNumber', label: 'Receiver Ph.Number' },
          { key: 'shippingAddress', label: 'Shipping Address' },
          { key: 'dcStatus', label: 'DC Status' }
        ]
      )}

      {/* GRN Section */}
      {renderHierarchicalSection(
        'grn',
        Clipboard,
        'GRN',
        '#3b82f6',
        grnData,
        [
          { key: 'grnDate', label: 'GRN Date' },
          { key: 'grnCode', label: 'GRN Code' },
          { key: 'informedPerson', label: 'Informed Person' },
          { key: 'contactNumber', label: 'Contact Number' },
          { key: 'returnedPerson', label: 'Returned Person' },
          { key: 'contactNumber2', label: 'Contact Number' },
          { key: 'receivedPerson', label: 'Received Person' },
          { key: 'vehicleNumber', label: 'Vehicle Number' }
        ]
      )}
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
  marginBottom: '1.5rem'
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b'
};

const searchControlsStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1.5rem'
};

const selectContainerStyle = {
  position: 'relative'
};

const selectStyle = {
  appearance: 'none',
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  padding: '0.5rem 2rem 0.5rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  width: '150px',
  cursor: 'pointer'
};

const selectChevronStyle = {
  position: 'absolute',
  right: '0.5rem',
  top: '0.7rem',
  width: '1rem',
  height: '1rem',
  color: '#9ca3af',
  pointerEvents: 'none'
};

const searchInputContainerStyle = {
  position: 'relative'
};

const searchInputStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  padding: '0.5rem 2rem 0.5rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  width: '320px'
};

const searchIconStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '0.6rem',
  width: '1rem',
  height: '1rem',
  color: '#9ca3af'
};

const sectionContainerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '0.5rem',
  marginBottom: '1rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  overflow: 'hidden'
};

const sectionHeaderContainerStyle = {
  padding: '1.5rem',
  paddingBottom: '1rem'
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
  cursor: 'pointer',
  opacity: 1,
  transition: 'opacity 0.2s ease'
};

const iconContainerStyle = {
  width: '3rem',
  height: '3rem',
  borderRadius: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '1rem'
};

const iconStyle = {
  width: '1.5rem',
  height: '1.5rem',
  color: '#ffffff'
};

const sectionTitleStyle = {
  fontSize: '1.125rem',
  fontWeight: '500',
  color: '#1e293b',
  flexGrow: 1
};

const toggleButtonStyle = {
  padding: '0.25rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer'
};

const chevronStyle = {
  width: '1.25rem',
  height: '1.25rem',
  color: '#6b7280'
};

const sectionContentStyle = {
  padding: '0 1.5rem 1.5rem 1.5rem',
  transition: 'all 0.3s ease'
};

const tableContainerStyle = {
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#ffffff',
  borderRadius: '0.375rem',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
};

const tableHeaderRowStyle = {
  backgroundColor: '#f9fafb'
};

const tableHeaderCellStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  borderBottom: '1px solid #e5e7eb'
};

const tableRowStyle = {
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#f9fafb'
  }
};

const tableCellStyle = {
  padding: '0.75rem',
  fontSize: '0.875rem',
  color: '#6b7280',
  borderBottom: '1px solid #e5e7eb'
};

const subItemsContainerStyle = {
  marginLeft: '4rem',
  position: 'relative'
};

const verticalConnectorStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '2px',
  backgroundColor: '#93c5fd'
};

const subItemWrapperStyle = {
  position: 'relative',
  marginBottom: '1.5rem'
};

const horizontalConnectorStyle = {
  position: 'absolute',
  left: 0,
  top: '1.5rem',
  width: '2rem',
  height: '2px',
  backgroundColor: '#93c5fd'
};

const numberedCircleStyle = {
  position: 'absolute',
  left: '1.5rem',
  top: '0.5rem',
  width: '2rem',
  height: '2rem',
  backgroundColor: '#3b82f6',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const subItemContentStyle = {
  marginLeft: '4rem'
};

export default ClientJourneyOp;