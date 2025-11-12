import React, { useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import cn from "classnames";
import styles from "./Description.module.sass";
import Icon from "../../../components/Icon";
import Details, { addOns } from "./Details";
import Receipt from "../../../components/Receipt";
import DateTimeModal from "../../../components/DateTimeModal";

const Description = ({ classSection, listing }) => {
  const history = useHistory();
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  // default values
  const defaultDate = listing?.timeSlots?.[0]?.startDate
    ? new Date(listing.timeSlots[0].startDate)
    : new Date();
  const formattedDefaultDate = defaultDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timeSlotOptions = useMemo(
    () => (Array.isArray(listing?.timeSlots) ? listing.timeSlots.map((t) => t?.slotName).filter(Boolean) : []),
    [listing]
  );
  const fallbackTimeSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];
  const [selectedDate, setSelectedDate] = useState(moment(defaultDate));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    listing?.timeSlots?.[0]?.slotName || timeSlotOptions[0] || fallbackTimeSlots[0]
  );

  const items = [
    {
      title: selectedDate ? selectedDate.format("MMM DD, YYYY") : formattedDefaultDate,
      category: "Select date",
      icon: "calendar",
    },
    {
      title: selectedTimeSlot,
      category: "Time slot",
      icon: "clock",
    },
    {
      title: "2 guests",
      category: "Guest",
      icon: "user",
    },
  ];

  const [showDateTimeModal, setShowDateTimeModal] = useState(false);

  const handleToggleAddOn = (addOnId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const { addOnsTotal, finalTotal, receipt } = useMemo(() => {
    const addOnsPrice = selectedAddOns.reduce((sum, id) => {
      const addOn = addOns.find((a) => a.id === id);
      return sum + (addOn?.priceValue || 0);
    }, 0);
    const currency = listing?.currency || "INR";

    const receiptData = [];
    if (addOnsPrice > 0) {
      receiptData.push({
        title: `Add-ons (${selectedAddOns.length})`,
        content: `+${currency} ${addOnsPrice}`,
      });
    }

    return {
      addOnsTotal: addOnsPrice,
      finalTotal: addOnsPrice,
      receipt: receiptData,
    };
  }, [selectedAddOns, listing]);

  const handleReserveClick = (e) => {
    e.preventDefault();
    const selectedAddOnsData = selectedAddOns
      .map((id) => addOns.find((a) => a.id === id))
      .filter(Boolean);

    
    history.push({
      pathname: "/stays-checkout",
      state: { addOns: selectedAddOnsData },
    });
  };

  const handleOpenDateTime = (index) => {
    // Open modal for both date and time selections
    if (index === 0 || index === 1) {
      setShowDateTimeModal(true);
    }
  };

  const handleConfirmDateTime = (dateText, timeText) => {
    if (dateText) {
      setSelectedDate(moment(new Date(dateText)));
    }
    setSelectedTimeSlot(timeText);
  };

  // derive price display values
  const currency = listing?.currency || "INR";
  const firstSlot = listing?.timeSlots?.[0];
  const hasPerPerson = firstSlot && firstSlot.pricePerPerson !== undefined && firstSlot.pricePerPerson !== null;
  const hasB2B = firstSlot && firstSlot.b2bRate !== undefined && firstSlot.b2bRate !== null;
  const unitPerPerson = hasPerPerson ? Number(firstSlot.pricePerPerson) : null;
  const b2bRate = hasB2B ? Number(firstSlot.b2bRate) : null;
  let priceOldValue = null;
  let priceActualValue = null;
  let priceUnit = undefined;
  if (hasPerPerson) {
    priceUnit = "person";
    if (b2bRate !== null && !Number.isNaN(b2bRate) && unitPerPerson !== null && !Number.isNaN(unitPerPerson) && b2bRate < unitPerPerson) {
      priceOldValue = `${currency} ${unitPerPerson}`;
      priceActualValue = `${currency} ${b2bRate}`;
    } else if (unitPerPerson !== null && !Number.isNaN(unitPerPerson)) {
      priceActualValue = `${currency} ${unitPerPerson}`;
    }
  } else if (listing?.pricePerNight !== undefined && listing?.pricePerNight !== null) {
    priceUnit = "night";
    priceActualValue = `${currency} ${listing.pricePerNight}`;
  }

  return (
    <>
      <div className={cn(classSection, styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <Details 
              className={styles.details}
              listing={listing}
              selectedAddOns={selectedAddOns}
              onToggleAddOn={handleToggleAddOn}
            />
            <Receipt
              className={styles.receipt}
              items={items}
              priceOld={priceOldValue}
              priceActual={priceActualValue}
              time={priceUnit}
              onItemClick={handleOpenDateTime}
            >
              <div className={styles.btns}>
                <button className={cn("button-stroke", styles.button)}>
                  <span>Save</span>
                  <Icon name="plus" size="16" />
                </button>
                <button
                  className={cn("button", styles.button)}
                  onClick={handleReserveClick}
                >
                  <span>Reserve</span>
                  <Icon name="bag" size="16" />
                </button>
              </div>
              <div className={styles.table}>
                {receipt.map((x, index) => (
                  <div className={styles.line} key={index}>
                    <div className={styles.cell}>{x.title}</div>
                    <div className={styles.cell}>{x.content}</div>
                  </div>
                ))}
              </div>
              <div className={styles.foot}>
                <button className={styles.report}>
                  <Icon name="flag" size="12" />
                  Report this property
                </button>
              </div>
            </Receipt>
          </div>
        </div>
      </div>
      <DateTimeModal
        visible={showDateTimeModal}
        onClose={() => setShowDateTimeModal(false)}
        onConfirm={handleConfirmDateTime}
        selectedDate={selectedDate ? selectedDate.toDate().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : formattedDefaultDate}
        selectedTime={selectedTimeSlot}
      />
    </>
  );
};

export default Description;
