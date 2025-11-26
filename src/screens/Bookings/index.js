import React, { useState, useEffect } from "react";
import Main from "./Main";
import { getCustomerOrders, getCompleteExpiredOrders } from "../../utils/api";

const Bookings = ({ bookingData = null }) => {
  const [orders, setOrders] = useState(null);
  const [completedOrders, setCompletedOrders] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If bookingData is provided as prop, use it directly
    if (bookingData) {
      // Handle both single booking and array of bookings
      const bookingsArray = Array.isArray(bookingData) ? bookingData : [bookingData];
      setOrders(bookingsArray);
      setCompletedOrders([]); // Empty for prop-based data
      setLoading(false);
      return;
    }

    // Otherwise, fetch all orders from API
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      // Fetch both APIs in parallel for better performance
      // Handle errors independently so one failure doesn't block the other
      const [ordersResult, completedCountResult] = await Promise.allSettled([
        getCustomerOrders(20, 0),
        getCompleteExpiredOrders()
      ]);
      
      // Handle regular orders result
      let fetchedOrders = [];
      if (ordersResult.status === 'fulfilled') {
        fetchedOrders = ordersResult.value;
        console.log("✅ Fetched orders:", fetchedOrders);
      } else {
        console.error("❌ Error fetching regular orders:", ordersResult.reason);
        setError(ordersResult.reason?.message || "Failed to fetch orders");
      }
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);

      // Handle completed count result
      let fetchedCompletedCount = 0;
      if (completedCountResult.status === 'fulfilled') {
        const countData = completedCountResult.value;
        fetchedCompletedCount = countData?.completedCount || 0;
        console.log("✅ Fetched completed orders count:", fetchedCompletedCount);
      } else {
        console.warn("⚠️ Failed to fetch completed orders count:", completedCountResult.reason);
        fetchedCompletedCount = 0;
      }
      setCompletedCount(fetchedCompletedCount);
      
      // Initially set completed orders as empty - will be fetched when tab is clicked
      setCompletedOrders([]);
      
      setLoading(false);
    };

    fetchOrders();
  }, [bookingData]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading bookings...</p>
      </div>
    );
  }

  // Always render Main component, even if there are errors
  // This ensures the page is not blocked by API failures
  return (
    <>
      {error && (
        <div style={{ padding: "1rem", textAlign: "center", backgroundColor: "#fee", color: "#c33" }}>
          <p>⚠️ {error}</p>
        </div>
      )}
      <Main 
        bookingData={orders || []} 
        completedOrders={completedOrders || []} 
        completedCount={completedCount}
        setCompletedOrders={setCompletedOrders}
      />
    </>
  );
};

export default Bookings;
