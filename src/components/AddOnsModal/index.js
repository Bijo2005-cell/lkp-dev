import React, { useState, useMemo } from "react";
import cn from "classnames";
import { useHistory } from "react-router-dom";
import styles from "./AddOnsModal.module.sass";
import Modal from "../Modal";
import Checkbox from "../Checkbox";
import Icon from "../Icon";

const mockAddOns = [
  {
    id: 1,
    name: "Airport Transfer",
    description: "Complimentary pick-up and drop-off service from Queenstown Airport",
    price: 45,
    image: "/images/content/photo-1.1.jpg",
  },
  {
    id: 2,
    name: "Breakfast Package",
    description: "Daily continental breakfast with local specialties included",
    price: 25,
    image: "/images/content/photo-1.2.jpg",
  },
  {
    id: 3,
    name: "Spa & Wellness",
    description: "Access to on-site spa facilities and wellness amenities",
    price: 80,
    image: "/images/content/photo-1.3.jpg",
  },
  {
    id: 4,
    name: "Late Checkout",
    description: "Extend your stay until 2 PM at no additional charge",
    price: 30,
    image: "/images/content/photo-1.4.jpg",
  },
  {
    id: 5,
    name: "Room Upgrade",
    description: "Upgrade to a suite with mountain views and premium amenities",
    price: 150,
    image: "/images/content/photo-1.1.jpg",
  },
  {
    id: 6,
    name: "WiFi Premium",
    description: "High-speed internet connection with unlimited data",
    price: 15,
    image: "/images/content/photo-1.2.jpg",
  },
];

const baseTotal = 833; // From the receipt data

const AddOnsModal = ({ visible, onClose, basePrice = baseTotal }) => {
  const history = useHistory();
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const handleToggleAddOn = (addOnId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const { totalAddOnsPrice, finalTotal } = useMemo(() => {
    const addOnsPrice = selectedAddOns.reduce((sum, id) => {
      const addOn = mockAddOns.find((a) => a.id === id);
      return sum + (addOn?.price || 0);
    }, 0);
    return {
      totalAddOnsPrice: addOnsPrice,
      finalTotal: basePrice + addOnsPrice,
    };
  }, [selectedAddOns, basePrice]);

  const selectedCount = selectedAddOns.length;

  const handleSkip = () => {
    setSelectedAddOns([]);
    onClose();
    history.push({
      pathname: "/stays-checkout",
      state: { addOns: [] },
    });
  };

  const handleContinue = () => {
    const selectedAddOnsData = selectedAddOns.map((id) =>
      mockAddOns.find((addOn) => addOn.id === id)
    );
    onClose();
    history.push({
      pathname: "/stays-checkout",
      state: { addOns: selectedAddOnsData },
    });
  };

  return (
    <Modal visible={visible} onClose={onClose} outerClassName={styles.modalOuter}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Customize your stay</h2>
          <p className={styles.modalSubtitle}>
            Select add-ons to enhance your experience
          </p>
        </div>

        <div className={styles.addOnsList}>
          {mockAddOns.map((addOn) => (
            <div
              key={addOn.id}
              className={cn(styles.addOnCard, {
                [styles.addOnCardSelected]: selectedAddOns.includes(addOn.id),
              })}
              onClick={() => handleToggleAddOn(addOn.id)}
            >
              <div className={styles.addOnImage}>
                {addOn.image ? (
                  <img src={addOn.image} alt={addOn.name} />
                ) : (
                  <div className={styles.addOnIcon}>
                    <Icon name="star" size="24" />
                  </div>
                )}
              </div>
              <div className={styles.addOnContent}>
                <div className={styles.addOnHeader}>
                  <h3 className={styles.addOnName}>{addOn.name}</h3>
                  <span className={styles.addOnPrice}>${addOn.price}</span>
                </div>
                <p className={styles.addOnDescription}>{addOn.description}</p>
              </div>
              <div
                className={styles.addOnCheckbox}
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  value={selectedAddOns.includes(addOn.id)}
                  onChange={() => handleToggleAddOn(addOn.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.totalSummary}>
            <div className={styles.totalLine}>
              <span className={styles.totalLabel}>Base price</span>
              <span className={styles.totalValue}>${basePrice}</span>
            </div>
            {selectedCount > 0 && (
              <>
                <div className={styles.totalLine}>
                  <span className={styles.totalLabel}>
                    Add-ons ({selectedCount})
                  </span>
                  <span className={styles.totalValue}>+${totalAddOnsPrice}</span>
                </div>
                <div className={cn(styles.totalLine, styles.totalLineFinal)}>
                  <span className={styles.totalLabelFinal}>Total</span>
                  <span className={styles.totalValueFinal}>${finalTotal}</span>
                </div>
              </>
            )}
            {selectedCount === 0 && (
              <div className={cn(styles.totalLine, styles.totalLineFinal)}>
                <span className={styles.totalLabelFinal}>Total</span>
                <span className={styles.totalValueFinal}>${basePrice}</span>
              </div>
            )}
          </div>
          <div className={styles.modalActions}>
            <button
              className={cn("button-stroke", styles.actionButton)}
              onClick={handleSkip}
            >
              Skip
            </button>
            <button
              className={cn("button", styles.actionButton)}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddOnsModal;

