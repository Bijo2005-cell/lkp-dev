import React, { useState } from "react";
import cn from "classnames";
import styles from "./Description.module.sass";
import Icon from "../../../components/Icon";
import Details from "./Details";
import Receipt from "../../../components/Receipt";
import AddOnsModal from "../../../components/AddOnsModal";

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

const receipt = [
  {
    title: "$119 x 7 nights",
    content: "$833",
  },
  {
    title: "10% campaign discount",
    content: "-$125",
  },
  {
    title: "Service fee",
    content: "$103",
  },
  {
    title: "Total",
    content: "$833",
  },
];

const Description = ({ classSection }) => {
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);

  const handleReserveClick = (e) => {
    e.preventDefault();
    setShowAddOnsModal(true);
  };

  return (
    <>
      <div className={cn(classSection, styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <Details className={styles.details} />
            <Receipt
              className={styles.receipt}
              items={items}
              priceOld="$119"
              priceActual="$109"
              time="night"
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
      <AddOnsModal
        visible={showAddOnsModal}
        onClose={() => setShowAddOnsModal(false)}
        basePrice={833}
      />
    </>
  );
};

export default Description;
