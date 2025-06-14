import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Typography
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";

const AssetTrackerOp = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/asset-modifications/");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch asset modifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns (without "Active" column)
  const columns = [
    {
      id: "asset_image_url",
      label: "Asset Image",
      render: (value) => (
        <Avatar
          variant="square"
          src={value}
          sx={{ width: 56, height: 56 }}
        />
      ),
    },
    { id: "asset_id", label: "Asset ID" },
    { id: "asset_name", label: "Asset Name" },
    { id: "modification_type", label: "Modification Type" },
    { id: "reason_for_modification", label: "Reason" },
    { id: "requested_by", label: "Requested By" },
    { id: "approved_by", label: "Approved By" },
    { id: "request_date", label: "Request Date" },
    { id: "approval_date", label: "Approval Date" },
    { id: "estimated_cost", label: "Estimated Cost" },
    { id: "status", label: "Status" },
    { id: "remarks", label: "Remarks" },
  ];

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Asset Modification Tracker
        </Typography>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CircularProgress />
          </div>
        ) : (
          <DynamicTable columns={columns} data={data} rowsPerPage={5} />
        )}
      </CardContent>
    </Card>
  );
};

export default AssetTrackerOp;
