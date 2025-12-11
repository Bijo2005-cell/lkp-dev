import React, { useState } from "react";
import cn from "classnames";
import styles from "./Catalog.module.sass";
import Icon from "../../../components/Icon";
import Dropdown from "../../../components/Dropdown";
import Card from "./Card";

// data
import { catalogList } from "../../../mocks/catalog";

const dateOptions = ["Recently added", "Long added"];
const sortingOptions = [];
catalogList.map((x) => sortingOptions.push(x.title));

const Catalog = () => {
  const [date, setDate] = useState(dateOptions[0]);
  const [sorting, setSorting] = useState(sortingOptions[0]);

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.wrapper}>
          <h2 className={cn("h2", styles.title)}>Go somewhere</h2>
          <div className={cn("info", styles.info)}>
            Let’s go on an adventure
          </div>
          <div className={styles.sorting}>
            <div className={styles.nav}>
              {catalogList.map((x, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: x.title === sorting,
                  })}
                  onClick={() => setSorting(x.title)}
                  key={index}
                >
                  <Icon name={x.icon} size="16" />
                  {x.title}
                </button>
              ))}
            </div>
            <div className={cn("tablet-show", styles.box)}>
              <Dropdown
                className={styles.dropdown}
                value={sorting}
                setValue={setSorting}
                options={sortingOptions}
              />
            </div>
            <div className={styles.box}>
              <Dropdown
                className={styles.dropdown}
                value={date}
                setValue={setDate}
                options={dateOptions}
              />
            </div>
          </div>
          <div className={styles.list}>
            {catalogList
              .find((x) => x.title === sorting)
              .items.map((x, index) => (
                <Card className={styles.card} item={x} key={index} />
              ))}
          </div>
          <div className={styles.btns}>
            <button className={cn("button-stroke button-small", styles.button)}>
              View all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
