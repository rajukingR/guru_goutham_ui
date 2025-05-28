import React from "react";
import { Card, CardContent } from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const LeadsTableLayoutPage = () => {
  const columns = [
    { id: "date", label: "Date" },
    { id: "leadTitle", label: "Lead Title" },
    { id: "leadId", label: "Lead ID" },
    { id: "industry", label: "Industry" },
    { id: "transactionType", label: "Transaction Type" },
    { id: "leadStatus", label: "Lead Status" },
    { id: "sourceOfEnquiry", label: "Source Of Enquiry" },
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
    { id: "remarks", label: "Remarks" },
    { id: "actions", label: "Actions" }
  ];

  const data = [
    {
      date: "2025-05-28",
      leadTitle: "Website Development",
      leadId: "LEAD-001",
      industry: "IT",
      transactionType: "Project",
      leadStatus: "New",
      sourceOfEnquiry: "LinkedIn",
      firstName: "Rohit",
      lastName: "Sharma",
      phoneNumber: "+91-9876543210",
      email: "rohit.sharma@techbiz.com",
      companyName: "TechBiz Pvt Ltd",
      owner: "Anjali Mehta",
      activeStatus: "Active",
      street: "45 Park Lane",
      landmark: "Opp. IT Park",
      pincode: "560034",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      remarks: "Follow-up in 2 days",
      actions: "..."
    },
    {
      date: "2025-05-27",
      leadTitle: "CRM Software",
      leadId: "LEAD-002",
      industry: "Finance",
      transactionType: "Subscription",
      leadStatus: "In Progress",
      sourceOfEnquiry: "Email Campaign",
      firstName: "Sneha",
      lastName: "Kapoor",
      phoneNumber: "+91-9123456789",
      email: "sneha.kapoor@finserve.com",
      companyName: "FinServe Ltd",
      owner: "Raj Malhotra",
      activeStatus: "Inactive",
      street: "12 MG Road",
      landmark: "Near HSBC Bank",
      pincode: "400001",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      remarks: "Waiting on budget approval",
      actions: "..."
    },
    {
      date: "2025-05-26",
      leadTitle: "Mobile App Development",
      leadId: "LEAD-003",
      industry: "Healthcare",
      transactionType: "Consulting",
      leadStatus: "Closed Won",
      sourceOfEnquiry: "Website Form",
      firstName: "Amit",
      lastName: "Patel",
      phoneNumber: "+91-9988776655",
      email: "amit.patel@meditech.org",
      companyName: "MediTech",
      owner: "Divya Rao",
      activeStatus: "Active",
      street: "88 Sector 5",
      landmark: "Near Apollo Clinic",
      pincode: "110085",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      remarks: "Converted to customer",
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

export default LeadsTableLayoutPage;
