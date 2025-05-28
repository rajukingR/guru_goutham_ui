import React from "react";
import {
  Card,
  CardContent
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ContactsTableLayoutPage = () => {
  const columns = [
    { id: "date", label: "Date" },
    { id: "customerId", label: "Customer ID" },
    { id: "industry", label: "Industry" },
    { id: "paymentType", label: "Payment Type" },
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
    { id: "phoneNumber", label: "Phone Number" },
    { id: "email", label: "Email" },
    { id: "companyName", label: "Company Name" },
    { id: "owner", label: "Owner" },
    { id: "activeStatus", label: "Active Status" },
    { id: "street", label: "Street" },
    { id: "landmark", label: "Landmark" },
    { id: "pincode", label: "Pincode" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "country", label: "Country" },
    { id: "bankName", label: "Bank Name" },
    { id: "bankAddress", label: "Bank Address" },
    { id: "accountNumber", label: "Account Number" },
    { id: "panNumber", label: "Pan Number" },
    { id: "contactPersonInBank", label: "Contact Person In Bank" },
    { id: "contactPersonPhone", label: "Contact Person Phone" },
    { id: "otherBankDetails", label: "Other Bank Details" },
    { id: "remarks", label: "Remarks" },
    { id: "actions", label: "Actions" }
  ];

  const data = [
    {
      date: "2025-05-28",
      customerId: "CUST-001",
      industry: "IT Services",
      paymentType: "Credit",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+91-9876543210",
      email: "john.doe@example.com",
      companyName: "Tech Solutions Pvt Ltd",
      owner: "Jane Smith",
      activeStatus: "Active",
      street: "123 Main St",
      landmark: "Near Tech Park",
      pincode: "560001",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      bankName: "HDFC Bank",
      bankAddress: "MG Road Branch",
      accountNumber: "1234567890",
      panNumber: "ABCDE1234F",
      contactPersonInBank: "Rajesh Kumar",
      contactPersonPhone: "+91-9876543211",
      otherBankDetails: "IFSC: HDFC0001234",
      remarks: "Preferred client",
      actions: "..."
    },
    {
      date: "2025-05-27",
      customerId: "CUST-002",
      industry: "Retail",
      paymentType: "Cash",
      firstName: "Alice",
      lastName: "Brown",
      phoneNumber: "+91-9123456789",
      email: "alice.brown@retailbiz.com",
      companyName: "Retail Biz Ltd",
      owner: "Michael Green",
      activeStatus: "Inactive",
      street: "45 Market Road",
      landmark: "Opposite Mall",
      pincode: "400001",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      bankName: "ICICI Bank",
      bankAddress: "Andheri Branch",
      accountNumber: "2345678901",
      panNumber: "FGHIJ5678K",
      contactPersonInBank: "Sneha Kapoor",
      contactPersonPhone: "+91-9123456790",
      otherBankDetails: "IFSC: ICIC0005678",
      remarks: "Delayed payments",
      actions: "..."
    },
    {
      date: "2025-05-26",
      customerId: "CUST-003",
      industry: "Healthcare",
      paymentType: "Cheque",
      firstName: "Rahul",
      lastName: "Verma",
      phoneNumber: "+91-9988776655",
      email: "rahul.verma@healthplus.com",
      companyName: "HealthPlus Inc",
      owner: "Dr. Mehta",
      activeStatus: "Active",
      street: "78 Wellness Blvd",
      landmark: "Next to Apollo Hospital",
      pincode: "110001",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      bankName: "SBI",
      bankAddress: "Connaught Place Branch",
      accountNumber: "3456789012",
      panNumber: "KLMNO9012P",
      contactPersonInBank: "Amit Sharma",
      contactPersonPhone: "+91-9988776654",
      otherBankDetails: "IFSC: SBIN0001234",
      remarks: "Government contract",
      actions: "..."
    }
  ];

  return (
    <Card>
      <CardContent>
        <DynamicTable 
          columns={columns} 
          data={data} 
          rowsPerPage={5} 
        />
      </CardContent>
    </Card>
  );
};

export default ContactsTableLayoutPage;
