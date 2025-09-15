// src/contexts/InventoryContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api/Api_url";
  import { useSelector } from "react-redux";

const InventoryContext = createContext();

// Custom hook to access context easily
export const useInventory = () => useContext(InventoryContext);

// Provider component
export const InventoryProvider = ({ children }) => {

    const { user, token } = useSelector((state) => state.auth);
  
    const userToken = token;

  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {

        const response = await axios.get(
          `${API_URL}/goods-receipts/approved-receipt-products`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (response.status === 200) {
          const { products } = response.data;

          const formatted = products.map((item) => ({
            id: item.product_id,
            name: item.product?.product_name || "",
            available_quantity: item.available_quantity || 0,
            fullProduct: item,
          }));

          setInventoryData(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch inventory once on mount
    fetchInventory();
  }, []);

  return (
    <InventoryContext.Provider value={{ inventoryData, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};
