import React from "react";
import { Card, CardContent } from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const QuotationsTableLayoutPage = () => {
  const columns = [
    { id: "date", label: "Date" },
    { id: "quotationTitle", label: "Quotation Title" },
    { id: "quotationId", label: "Quotation ID" },
    { id: "leadId", label: "Lead ID" },
    { id: "industry", label: "Industry" },
    { id: "transactionType", label: "Transaction Type" },
    { id: "quotationStatus", label: "Quotation Status" },
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
    { id: "actions", label: "Actions" },
  ];

  const data = [
    {
      date: "2025-05-28",
      quotationTitle: "Quotation for Mobile App",
      quotationId: "QUO-001",
      leadId: "LEAD-001",
      industry: "Technology",
      transactionType: "Service",
      quotationStatus: "Sent",
      sourceOfEnquiry: "Website",
      firstName: "Ankit",
      lastName: "Verma",
      phoneNumber: "+91-9876543210",
      email: "ankit.verma@smartapps.com",
      companyName: "SmartApps Solutions",
      owner: "Neha Arora",
      activeStatus: "Active",
      street: "123 Business Ave",
      landmark: "Near IT Hub",
      pincode: "560076",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      remarks: "Waiting for client feedback",
      actions: "..."
    },
    {
      date: "2025-05-27",
      quotationTitle: "CRM Software Proposal",
      quotationId: "QUO-002",
      leadId: "LEAD-002",
      industry: "Retail",
      transactionType: "License",
      quotationStatus: "Under Review",
      sourceOfEnquiry: "Referral",
      firstName: "Priya",
      lastName: "Mehta",
      phoneNumber: "+91-9988776655",
      email: "priya.mehta@retailking.com",
      companyName: "RetailKing Ltd.",
      owner: "Ramesh Iyer",
      activeStatus: "Inactive",
      street: "75 MG Road",
      landmark: "Next to City Mall",
      pincode: "400012",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      remarks: "Requested discount",
      actions: "..."
    },
    {
      date: "2025-05-26",
      quotationTitle: "Quotation for E-Commerce Dev",
      quotationId: "QUO-003",
      leadId: "LEAD-003",
      industry: "E-commerce",
      transactionType: "Project",
      quotationStatus: "Approved",
      sourceOfEnquiry: "Cold Call",
      firstName: "Karan",
      lastName: "Singh",
      phoneNumber: "+91-9123456780",
      email: "karan.singh@trendmart.com",
      companyName: "TrendMart Pvt Ltd",
      owner: "Aarti Shah",
      activeStatus: "Active",
      street: "Plot 45, Industrial Area",
      landmark: "Opp Metro Station",
      pincode: "110075",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      remarks: "Move to contract phase",
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

export default QuotationsTableLayoutPage;
