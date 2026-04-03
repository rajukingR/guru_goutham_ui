import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const CourierChargesTable = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  //------------------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "service_number", label: "Courier Number" },
    { id: "customer_name", label: "Customer Name" },
    { id: "service_date", label: "Courier Date" },
  ];

  //------------------------------------------------
  // FETCH DATA
  //------------------------------------------------

  useEffect(() => {
    fetchCourierCharges();
  }, [page, search]);

  const fetchCourierCharges = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/courier-charges?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const { courierCharges, pagination } = response.data;

      setTotalPages(pagination.totalPages);

      const formatted = courierCharges.map((item, index) => ({

        s_id: (page - 1) * 10 + index + 1,

        ...item,

        customer_name: item.customer
          ? `${item.customer.first_name} ${item.customer.last_name}`
          : "",

      }));

      setData(formatted);

    } catch (error) {
      console.error("Error fetching courier charges:", error);
    }
  };

  //------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //------------------------------------------------

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Courier Charges List</h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchCourierCharges}
      />
    </div>
  );
};

export default CourierChargesTable;
