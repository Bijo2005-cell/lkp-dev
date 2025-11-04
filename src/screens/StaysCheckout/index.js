import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";
import styles from "./StaysCheckout.module.sass";
import Control from "../../components/Control";
import ConfirmAndPay from "../../components/ConfirmAndPay";
import PriceDetails from "../../components/PriceDetails";

const breadcrumbs = [
  {
    title: "Spectacular views of Queenstown",
    url: "/stays-product",
  },
  {
    title: "Confirm and pay",
  },
];

const items = [
  {
    title: "May 15, 2021",
    category: "Check-in",
    icon: "calendar",
  },
  {
    title: "May 22, 2021",
    category: "Check-out",
    icon: "calendar",
  },
  {
    title: "2 guests",
    category: "Guest",
    icon: "user",
  },
];

const basePrice = 833;
const discount = 125;
const serviceFee = 103;

const Checkout = () => {
  const location = useLocation();
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  // Initialize add-ons from location state
  useEffect(() => {
    if (location.state?.addOns) {
      setSelectedAddOns(location.state.addOns);
    }
  }, [location.state]);

  const handleRemoveAddOn = (indexToRemove) => {
    setSelectedAddOns((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const { addOnsTotal, finalTotal, table } = useMemo(() => {
    const addOnsPrice = selectedAddOns.reduce(
      (sum, addOn) => sum + (addOn?.price || 0),
      0
    );
    const final = basePrice - discount + serviceFee + addOnsPrice;

    const tableData = [
      {
        title: "$119 x 7 nights",
        value: "$833",
      },
      {
        title: "10% campaign discount",
        value: "-$125",
      },
    ];

    if (selectedAddOns.length > 0) {
      tableData.push({
        title: "Add-ons",
        value: `+$${addOnsPrice}`,
      });
    }

    tableData.push(
      {
        title: "Service fee",
        value: "$103",
      },
      {
        title: "Total (USD)",
        value: `$${final}`,
      }
    );

    return {
      addOnsTotal: addOnsPrice,
      finalTotal: final,
      table: tableData,
    };
  }, [selectedAddOns]);

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
          />
          <PriceDetails
            className={styles.price}
            more
            image="/images/content/photo-1.1.jpg"
            title="Spectacular views of Queenstown"
            items={items}
            table={table}
            addOns={selectedAddOns}
            onRemoveAddOn={handleRemoveAddOn}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
