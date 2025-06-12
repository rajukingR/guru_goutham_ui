import React, { useEffect, useState } from "react";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const GrnLayoutTableContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
  { id: "grn_id", label: "GRN ID" },
  { id: "grn_title", label: "Title" },
  { id: "customer_select", label: "Customer" },
  { id: "email_id", label: "Email" },
  { id: "phone_no", label: "Phone" },
  { id: "grn_date", label: "GRN Date" },
  { id: "gst_number", label: "GST Number" },
  { id: "pan", label: "PAN" },
  { id: "grn_created_by", label: "Created By" },
  { id: "industry", label: "Industry" },
  { id: "company_name", label: "Company Name" },
  { id: "pincode", label: "Pincode" },
  { id: "country", label: "Country" },
  { id: "state", label: "State" },
  { id: "city", label: "City" },
  { id: "street", label: "Street" },
  { id: "landmark", label: "Landmark" },
  { id: "informed_person_name", label: "Informed Person" },
  { id: "informed_person_phone_no", label: "Informed Phone" },
  { id: "returner_name", label: "Returner" },
  { id: "returner_phone_no", label: "Returner Phone" },
  { id: "receiver_name", label: "Receiver" },
  { id: "receiver_phone_no", label: "Receiver Phone" },
  { id: "vehicle_number", label: "Vehicle Number" },
  { id: "description", label: "Description" },
];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/goods-return-notes/");
        const result = await res.json();

        setData(result);
      } catch (error) {
        console.error("Error fetching GRNs:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardContent>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Loading GRNs...
            </Typography>
          </div>
        ) : (
          <DynamicTable columns={columns} data={data} rowsPerPage={5} />
        )}
      </CardContent>
    </Card>
  );
};

export default GrnLayoutTableContent;
