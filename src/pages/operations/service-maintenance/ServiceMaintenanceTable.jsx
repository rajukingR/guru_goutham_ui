import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/table-format/DynamicTable";
import axios from "axios";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const ServiceMaintenanceTable = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);
  const userToken = token;

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "service_number", label: "Service Number" },
    { id: "customer_name", label: "Customer Name" },
    { id: "service_date", label: "Service Date" },
  ];

  //-----------------------------------
  // FETCH SERVICES
  //-----------------------------------

  useEffect(() => {
    fetchServices();
  }, [page, search]);

  const fetchServices = async () => {
    try {

      const response = await axios.get(
        `${API_URL}/service-charges?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const { serviceCharges, pagination } = response.data;

      setTotalPages(pagination.totalPages);

      const formatted = serviceCharges.map((item, index) => ({
        s_id: (page - 1) * 10 + index + 1,
        ...item,
        customer_name: item.customer
          ? `${item.customer.first_name} ${item.customer.last_name}`
          : "",
      }));

      setData(formatted);

    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  //-----------------------------------
  // RESET PAGE WHEN SEARCH
  //-----------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //-----------------------------------

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Service & Maintenance List</h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchServices}
      />
    </div>
  );
};

export default ServiceMaintenanceTable;
