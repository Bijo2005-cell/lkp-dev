import React, { useState } from "react";
import cn from "classnames";
import styles from "./Catalog.module.sass";
import Sorting from "../../../components/Sorting";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";

// data
import { experience1 } from "../../../mocks/experience";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Experience",
    url: "/things-to-do",
  },
  {
    title: "New Zealand",
    url: "/product",
  },
  {
    title: "South Island",
  },
];

const navigation = [
  "Sightseeing",
  "Transportation activities",
  "Art and culture",
  "City tour",
];

const saleOptions = ["Time of day", "Time of week"];

const Catalog = () => {
  const [sale, setSale] = useState(saleOptions[0]);

  return (
    <div className={cn("section", styles.section)}>
      <Sorting
        className={styles.sorting}
        urlHome="/things-to-do"
        breadcrumbs={breadcrumbs}
        navigation={navigation}
        title="128 experiences"
        sale="up to 25% off"
        details="May 1 - 14, 2 guests"
        sorting={sale}
        setSorting={setSale}
        sortingOptions={saleOptions}
      />
      <div className={styles.body}>
        <div className={cn("container", styles.container)}>
          <div className={styles.list}>
            {experience1.map((x, index) => (
              <Card className={styles.card} item={x} key={index} row />
            ))}
          </div>
          <div className={styles.btns}>
            <button className={cn("button-stroke", styles.button)}>
              <Loader className={styles.loader} />
              <span>Show more</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
