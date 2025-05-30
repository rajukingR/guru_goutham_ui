import React from 'react';

const ClientJourneyPageLayout = () => {
  // Sample data - replace with your actual data source
  const clientData = {
    dateOfFirstContact: '17-04-2024',
    contactCoName: 'Annual Technologies',
    clientCode: '1256',
    contactPerson: 'Annual',
    mobileNumber: '9123456789',
    email: 'Annual@gmail.com',
    clientOwner: 'Sevajib'
  };

  const leadData = {
    leadDate: '20-04-2024',
    leadCode: '7894',
    leadType: 'Rent',
    leadOwner: 'Sevajib',
    leadTitle: 'ZYX',
    executedBy: 'Address',
    leadStatus: 'Interested'
  };

  const questionData = {
    questionDate: '28-04-2024',
    questionCode: '7458',
    questionType: 'Rent',
    questionAmount: '$5,000',
    questionStatus: 'Executed',
    executedBy: 'Address'
  };

  const orderData = {
    orderDate: '05-02-2024',
    orderCode: '8745',
    orderAmount: '$3,900',
    binaryContact: 'Annual',
    shippingContact: 'Annual',
    paymentTerms: 'Prepaid',
    executive: 'Address'
  };

  const dcData = {
    dcDate: '08-02-2024',
    dcCode: '87145',
    vehicleNumber: 'KA 05.00 9996',
    deferredStaff: 'Address',
    receiverName: 'Annual',
    receiverPhNumber: '9123456789',
    shippingAddress: '#121to main Road, Jayanagar, Bangalore-560074',
    dcStatus: 'Deferred'
  };

  const grnData = {
    grnDate: '05-07-2024',
    grnCode: '8974',
    informedPerson: 'MLS-BRBN',
    contactNumber: '9123456789',
    returnedPerson: 'Annual',
    returnedContactNumber: '9123456789',
    vehicleNumber: 'KA 05 AD 9995'
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Operations / Client Journey Report</h1>
      
      {/* Client Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Client</h2>
        <div style={styles.grid}>
          <div style={styles.field}>
            <span style={styles.label}>Date of First Contact</span>
            <span style={styles.value}>{clientData.dateOfFirstContact}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Contact Co. Name</span>
            <span style={styles.value}>{clientData.contactCoName}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Client Code</span>
            <span style={styles.value}>{clientData.clientCode}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Contact Person</span>
            <span style={styles.value}>{clientData.contactPerson}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Mobile Number</span>
            <span style={styles.value}>{clientData.mobileNumber}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{clientData.email}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Client Owner</span>
            <span style={styles.value}>{clientData.clientOwner}</span>
          </div>
        </div>
      </div>

      {/* Leads Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Leads</h2>
        <div style={styles.grid}>
          <div style={styles.field}>
            <span style={styles.label}>Lead Date</span>
            <span style={styles.value}>{leadData.leadDate}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Lead Code</span>
            <span style={styles.value}>{leadData.leadCode}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Lead Type</span>
            <span style={styles.value}>{leadData.leadType}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Lead Owner</span>
            <span style={styles.value}>{leadData.leadOwner}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Lead Title</span>
            <span style={styles.value}>{leadData.leadTitle}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Executed By</span>
            <span style={styles.value}>{leadData.executedBy}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Lead Status</span>
            <span style={styles.value}>{leadData.leadStatus}</span>
          </div>
        </div>
      </div>

      {/* Question Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Question</h2>
        <div style={styles.grid}>
          <div style={styles.field}>
            <span style={styles.label}>Question Date</span>
            <span style={styles.value}>{questionData.questionDate}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Question Code</span>
            <span style={styles.value}>{questionData.questionCode}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Question Type</span>
            <span style={styles.value}>{questionData.questionType}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Question Amount</span>
            <span style={styles.value}>{questionData.questionAmount}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Question Status</span>
            <span style={styles.value}>{questionData.questionStatus}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Executed By</span>
            <span style={styles.value}>{questionData.executedBy}</span>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Orders</h2>
        <div style={styles.grid}>
          <div style={styles.field}>
            <span style={styles.label}>Order Date</span>
            <span style={styles.value}>{orderData.orderDate}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Order Code</span>
            <span style={styles.value}>{orderData.orderCode}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Order Amount</span>
            <span style={styles.value}>{orderData.orderAmount}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Binary Contact</span>
            <span style={styles.value}>{orderData.binaryContact}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Shipping Contact</span>
            <span style={styles.value}>{orderData.shippingContact}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Payment Terms</span>
            <span style={styles.value}>{orderData.paymentTerms}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Executive</span>
            <span style={styles.value}>{orderData.executive}</span>
          </div>
        </div>
      </div>

      {/* DC Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>DC</h2>
        <div style={styles.grid}>
          <div style={styles.field}>
            <span style={styles.label}>DC Date</span>
            <span style={styles.value}>{dcData.dcDate}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>DC Code</span>
            <span style={styles.value}>{dcData.dcCode}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Vehicle Number</span>
            <span style={styles.value}>{dcData.vehicleNumber}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Deferred Staff</span>
            <span style={styles.value}>{dcData.deferredStaff}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Receiver Name</span>
            <span style={styles.value}>{dcData.receiverName}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Receiver Ph Number</span>
            <span style={styles.value}>{dcData.receiverPhNumber}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Shipping Address</span>
            <span style={styles.value}>{dcData.shippingAddress}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>DC Status</span>
            <span style={styles.value}>{dcData.dcStatus}</span>
          </div>
        </div>
      </div>

      {/* GRN Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>GRN</h2>
        <div style={styles.grid}>
          <div style={styles.field}>
            <span style={styles.label}>GRN Date</span>
            <span style={styles.value}>{grnData.grnDate}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>GRN Code</span>
            <span style={styles.value}>{grnData.grnCode}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Informed Person</span>
            <span style={styles.value}>{grnData.informedPerson}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Contact Number</span>
            <span style={styles.value}>{grnData.contactNumber}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Returned Person</span>
            <span style={styles.value}>{grnData.returnedPerson}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Contact Number</span>
            <span style={styles.value}>{grnData.returnedContactNumber}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Vehicle Number</span>
            <span style={styles.value}>{grnData.vehicleNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    maxWidth: '1400px',
    padding: '20px',
    color: '#333'
  },
  header: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#2c3e50',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  section: {
    marginBottom: '30px',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    padding: '20px',
    backgroundColor: '#f9f9f9'
  },
  sectionHeader: {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '20px',
    color: '#34495e',
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: '5px',
    textTransform: 'uppercase'
  },
  value: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#2c3e50',
    padding: '8px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center'
  }
};

export default ClientJourneyPageLayout;