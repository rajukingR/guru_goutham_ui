import React, { useState, useEffect } from "react";
import axios from "axios";
import DynamicTable from "../../../components/table-format/DynamicTable";
import API_URL from "../../../api/Api_url";
import { useSelector } from "react-redux";

const AssetSwapsTable = () => {

  //------------------------------------------------
  // STATES
  //------------------------------------------------

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const { token } = useSelector((state) => state.auth);

  //------------------------------------------------
  // COLUMNS
  //------------------------------------------------

  const columns = [
    { id: "s_id", label: "S.No." },
    { id: "asset_id", label: "Asset ID" },
    { id: "product_name", label: "Product Name" },
    { id: "reason", label: "Reason" },
    { id: "swapped_on", label: "Scrapped On" },
  ];

  //------------------------------------------------
  // FETCH DATA
  //------------------------------------------------

  const fetchSwapData = async () => {
    try {

      const res = await axios.get(
        `${API_URL}/asset-swaps?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //--------------------------------------------

      const swaps = res.data.assetSwaps;
      const pagination = res.data.pagination;

      setTotalPages(pagination.totalPages);

      //--------------------------------------------
      // FORMAT
      //--------------------------------------------

      const formattedData = swaps.map((item, index) => ({
        s_id: (page - 1) * 10 + index + 1,

        asset_id: item.asset_id || "-",
        product_name: item.product_name || "-",
        reason: item.reason || "-",

        swapped_on: item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-IN")
          : "-",
      }));

      setData(formattedData);

    } catch (err) {
      console.error("❌ Swap fetch error:", err);
    }
  };

  //------------------------------------------------

  useEffect(() => {
    fetchSwapData();
  }, [page, search]);

  //------------------------------------------------
  // RESET PAGE WHEN SEARCH
  //------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search]);

  //------------------------------------------------

  return (
    <div>

      <h2 style={{ marginBottom: "10px" }}>
        Asset Scraps List
      </h2>

      <DynamicTable
        columns={columns}
        data={data}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        search={search}
        setSearch={setSearch}
        refreshData={fetchSwapData}
      />

    </div>
  );
};

export default AssetSwapsTable;
