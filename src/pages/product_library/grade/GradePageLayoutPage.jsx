import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";

const GradePageLayoutPage = () => {
  const [gradeData, setGradeData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define columns (without 'is_active')
  const columns = [
    { id: "grade_id", label: "Grade ID" },
    { id: "grade_name", label: "Grade Name" },
    { id: "description", label: "Description" },
  ];

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/grades");
        setGradeData(response.data); // Assuming data is an array of grades
      } catch (error) {
        console.error("Failed to fetch grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return (
    <Card>
      <CardContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <DynamicTable columns={columns} data={gradeData} rowsPerPage={5} />
        )}
      </CardContent>
    </Card>
  );
};

export default GradePageLayoutPage;
