import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Main.module.sass";
import Panel from "../../../components/Panel";
import Location from "../../../components/Location";
import DateRange from "../../../components/DateRange";
import Guests from "../../../components/Guests";

const Main = () => {
  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.preview}>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/content/main-pic-mobile-3.jpg"
            />
            <img src="/images/content/main-pic-3.jpg" alt="Main" />
          </picture>
          <div className={styles.wrap}>
            <h1 className={cn("hero", styles.title)}>LKP</h1>
            <div className={cn("info", styles.info)}>
              Find and book a great experience.
            </div>
            <Link
              className={cn("button", styles.button)}
              to="/flights-category"
            >
              Start your search
            </Link>
          </div>
        </div>
        <Panel
          className={styles.panel}
          menu
          classBody={styles.body}
          classButtonSearch={styles.search}
          onSearch={() => console.log("Search")}
        >
          <div className={styles.controls}>
            <button
              className={cn(
                "button-stroke button-small",
                styles.active,
                styles.button
              )}
            >
              Round-trip
            </button>
            <button className={cn("button-stroke button-small", styles.button)}>
              One-way
            </button>
            <Guests className={styles.guests} title="1 guest" />
          </div>
          <div className={styles.row}>
            <Location
              className={styles.location}
              icon="marker"
              description="Leaving from"
              placeholder="Flying from"
            />
            <Location
              className={styles.location}
              icon="location"
              description="Going to"
              placeholder="Flying to"
            />
            <DateRange
              className={styles.date}
              icon="calendar"
              description="Add date"
              startDatePlaceholderText="Departure"
              endDatePlaceholderText="Return"
              displayFormat="MMM DD, YYYY"
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Main;
