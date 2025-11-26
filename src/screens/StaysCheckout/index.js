import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import cn from "classnames";
import styles from "./StaysCheckout.module.sass";
import Control from "../../components/Control";
import ConfirmAndPay from "../../components/ConfirmAndPay";
import PriceDetails from "../../components/PriceDetails";
import { getOrderDetails } from "../../utils/api";

const breadcrumbs = [
  {
    title: "Spectacular views of Queenstown",
    url: "/stays-product",
  },
  {
    title: "Confirm and pay",
  },
];

const Checkout = () => {
  const location = useLocation();
  const history = useHistory();
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [bookingData, setBookingData] = useState(location.state?.bookingData || null);
  const [paymentData, setPaymentData] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(true);

  // Initialize add-ons from location state
  useEffect(() => {
    if (location.state?.addOns) {
      setSelectedAddOns(location.state.addOns);
    }
  }, [location.state]);

  // Fallback: hydrate bookingData from localStorage if not present in state
  useEffect(() => {
    if (!bookingData) {
      try {
        const saved = localStorage.getItem("pendingBooking");
        if (saved) {
          const parsed = JSON.parse(saved);
          setBookingData(parsed);
          if (Array.isArray(parsed.selectedAddOns)) {
            setSelectedAddOns(parsed.selectedAddOns);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [bookingData]);

  // Read payment data from order response
  useEffect(() => {
    try {
      const pendingPayment = localStorage.getItem("pendingPayment");
      if (pendingPayment) {
        const payment = JSON.parse(pendingPayment);
        setPaymentData(payment);
        
        // Calculate and save the actual paid amount (after discount)
        // This will be used in the checkout complete page
        let actualPaidAmount = payment.amount; // Default to amount
        
        // If there's a discount, calculate paid amount = amount - discount
        if (payment.discount !== undefined && payment.discount > 0) {
          actualPaidAmount = payment.amount - payment.discount;
        } else if (payment.paidAmount !== undefined && payment.paidAmount > 0) {
          actualPaidAmount = payment.paidAmount;
        } else if (payment.finalAmount !== undefined && payment.finalAmount > 0) {
          actualPaidAmount = payment.finalAmount;
        }
        
        // Save the actual paid amount to localStorage for checkout complete page
        try {
          localStorage.setItem("actualPaidAmount", JSON.stringify({
            amount: actualPaidAmount,
            currency: payment.currency || "INR"
          }));
        } catch (e) {
          console.error("Error saving actual paid amount:", e);
        }
      }
    } catch (e) {
      console.error("Error reading payment data:", e);
    }
  }, []);

  // Persist snapshot for completion screen
  useEffect(() => {
    if (bookingData) {
      try {
        localStorage.setItem("checkoutBooking", JSON.stringify(bookingData));
      } catch {}
    }
  }, [bookingData]);

  // Check payment status when component mounts
  useEffect(() => {
    const checkPaymentStatus = async () => {
      setCheckingPayment(true);
      
      try {
        // Check if payment was already successful
        const paymentSuccess = localStorage.getItem("razorpayPaymentSuccess");
        if (paymentSuccess) {
          // Payment already succeeded, allow user to proceed
          setCheckingPayment(false);
          return;
        }

        // Check if there's a pending orderId
        const pendingOrderId = localStorage.getItem("pendingOrderId");
        if (!pendingOrderId) {
          // No order created yet, allow normal checkout flow
          setCheckingPayment(false);
          return;
        }

        // Fetch order details to check payment status
        const orderDetails = await getOrderDetails(pendingOrderId);
        const order = orderDetails?.order || orderDetails;
        
        if (order) {
          const paymentStatus = order.paymentStatus || "PENDING";
          const normalizedStatus = String(paymentStatus).toUpperCase().trim();
          
          // If payment failed, redirect to complete page with failure status
          if (normalizedStatus === "FAILED" || normalizedStatus === "FAILURE") {
            localStorage.setItem("paymentFailed", "true");
            localStorage.setItem("paymentFailureOrderId", String(order.orderId || pendingOrderId));
            history.push("/stays-checkout-complete");
            return;
          }
        }
        
        setCheckingPayment(false);
      } catch (error) {
        console.error("Error checking payment status:", error);
        // If error checking, allow normal checkout flow
        setCheckingPayment(false);
      }
    };

    checkPaymentStatus();
  }, [history]);


  const handleRemoveAddOn = (indexToRemove) => {
    setSelectedAddOns((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Helper function to format time from "HH:mm" to "HH:mm AM/PM"
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Build booking items (date, time, guests) for summary
  const items = useMemo(() => {
    const dateTitle =
      bookingData?.bookingSummary?.date ||
      bookingData?.selectedDate ||
      "Select date";
    
    // Format time slot with start and end time if available
    let timeTitle = "Select time";
    if (bookingData?.bookingSummary?.time) {
      const startTime = bookingData.bookingSummary.time;
      const endTime = bookingData?.bookingSummary?.endTime;
      
      // If we have both start and end time, format as range
      if (startTime && endTime) {
        timeTitle = `${formatTime(startTime)} – ${formatTime(endTime)}`;
      } else if (startTime) {
        // Only start time available, check if it's already formatted
        if (startTime.includes("–") || startTime.includes("-")) {
          timeTitle = startTime;
        } else {
          timeTitle = formatTime(startTime);
        }
      }
    }
    
    // Get guest count - check multiple possible formats
    const guestsCount = 
      bookingData?.bookingSummary?.guestCount ||
      bookingData?.guests?.guests ||
      (bookingData?.guests?.adults || 0) + (bookingData?.guests?.children || 0);
    const guestsTitle = guestsCount > 0 
      ? `${guestsCount} ${guestsCount === 1 ? 'guest' : 'guests'}` 
      : "Add guests";

    return [
      {
        title: dateTitle,
        category: "Date",
        icon: "calendar",
      },
      {
        title: timeTitle,
        category: "Time slot",
        icon: "clock",
      },
      {
        title: guestsTitle,
        category: "Guest",
        icon: "user",
      },
    ];
  }, [bookingData]);

  // Build price table from receipt if provided
  const { addOnsTotal, finalTotal, table } = useMemo(() => {
    if (bookingData?.receipt && Array.isArray(bookingData.receipt)) {
      const rows = bookingData.receipt.map((r) => ({
        title: r.title,
        value: r.content,
      }));
      return {
        addOnsTotal: bookingData.addOnsTotal || 0,
        finalTotal: bookingData.finalTotal || 0,
        table: rows,
      };
    }

    // Fallback: compute a minimal table from selectedAddOns only
    const addOnsPrice = selectedAddOns.reduce(
      (sum, addOn) => sum + (addOn?.priceValue || addOn?.price || 0),
      0
    );
    return {
      addOnsTotal: addOnsPrice,
      finalTotal: addOnsPrice,
      table: [
        {
          title: "Add-ons",
          value: `${addOnsPrice}`,
        },
      ],
    };
  }, [bookingData, selectedAddOns]);

  // Show loading state while checking payment status
  if (checkingPayment) {
    return (
      <div className={cn("section-mb80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p>Checking payment status...</p>
          </div>
        </div>
      </div>
    );
  }

  const listingTitle = bookingData?.listingTitle || "Your trip";
  // Get first image - ensure it's a single image URL, not an array
  const getListingImage = () => {
    const image = bookingData?.listingImage;
    if (!image) return "/images/content/photo-1.1.jpg";
    // If it's an array, get the first item
    if (Array.isArray(image)) {
      return image[0]?.url || image[0] || "/images/content/photo-1.1.jpg";
    }
    // If it's a string, return it
    if (typeof image === 'string') {
      return image;
    }
    return "/images/content/photo-1.1.jpg";
  };
  const listingImage = getListingImage();

  return (
    <div className={cn("section-mb80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <Control
          className={styles.control}
          urlHome="/stays-product"
          breadcrumbs={breadcrumbs}
        />
        <div className={styles.wrapper}>
          <ConfirmAndPay
            className={styles.confirm}
            title="Your trip"
            buttonUrl="/stays-checkout-complete"
            guests
            amountToPay={paymentData?.amount}
            currency={paymentData?.currency || "INR"}
          />
          <PriceDetails
            className={styles.price}
            more
            image={listingImage}
            title={listingTitle}
            items={items}
            table={table}
            amountToPay={paymentData?.amount}
            currency={paymentData?.currency || "INR"}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
