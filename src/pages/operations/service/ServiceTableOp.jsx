import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { Avatar, Chip, CircularProgress, Alert } from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";

const ServiceTableOp = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      id: "s_no",
      label: "S.No.",
      width: 70,
    },
    {
      id: "image_url",
      label: "Image",
      render: (value) => (
        <Avatar
          variant="square"
          src={value}
          sx={{ width: 56, height: 56 }}
          alt="Product Image"
        />
      ),
      width: 100,
    },
    {
      id: "product_id",
      label: "Product ID",
      width: 120,
    },
    {
      id: "product_name",
      label: "Service Name",
      width: 180,
    },
    {
      id: "type",
      label: "Type",
      render: (value) => value || "N/A",
      width: 100,
    },
    {
      id: "priority",
      label: "Priority",
      render: (value) => (
        <Chip
          label={value}
          color={
            value === "High"
              ? "error"
              : value === "Medium"
              ? "warning"
              : "success"
          }
          size="small"
        />
      ),
      width: 120,
    },
    {
      id: "order_no",
      label: "Order No",
      width: 150,
    },
    {
      id: "client_id",
      label: "Client ID",
      width: 120,
    },
    {
      id: "service_staff",
      label: "Staff",
      width: 150,
    },
    {
      id: "start_datetime",
      label: "Start Time",
      render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
      width: 180,
    },
    {
      id: "end_datetime",
      label: "End Time",
      render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
      width: 180,
    },
    {
      id: "task_duration",
      label: "Duration",
      render: (value) => value || "N/A",
      width: 100,
    },
    {
      id: "created_at",
      label: "Created On",
      render: (value) => new Date(value).toLocaleDateString(),
      width: 120,
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/product-services`);

        if (response.status === 200) {
          const formattedData = response.data.map((item, index) => ({
            s_no: index + 1,
            ...item,
            image_url: item.image_url || "https://placehold.co/56x56",
            type: item.type || "N/A",
          }));
          setData(formattedData);
        }
      } catch (error) {
        setError("Failed to fetch services. Please try again later.");
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <DynamicTable
        columns={columns}
        data={data}
        rowsPerPage={10}
        sx={{
          "& .MuiTableCell-root": {
            padding: "8px 16px",
          },
        }}
      />
    </div>
  );
};

export default ServiceTableOp;
