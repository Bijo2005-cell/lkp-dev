import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Main.module.sass";
import Panel from "../../../components/Panel";
import Location from "../../../components/Location";
import DateRange from "../../../components/DateRange";
import Travelers from "../../../components/Travelers";

const Main = () => {
  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.preview}>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/content/main-pic-mobile-1.jpg"
            />
            <img src="/images/content/main-pic-1.jpg" alt="Main" />
          </picture>
          <div className={styles.wrap}>
            <h1 className={cn("hero", styles.title)}>LKP</h1>
            <div className={cn("info", styles.info)}>
              Find and book a great experience.
            </div>
            <Link className={cn("button", styles.button)} to="/stays-category">
              Start your search
            </Link>
          </div>
        </div>
        <Panel
          className={styles.panel}
          menu
          classBody={styles.body}
          onSearch={() => console.log("Search")}
        >
          <div className={styles.row}>
            <Location
              className={styles.location}
              icon="location"
              description="Where are you going?"
              placeholder="Location"
            />
            <DateRange
              className={styles.date}
              icon="calendar"
              description="Add date"
              startDatePlaceholderText="Check in"
              endDatePlaceholderText="Check out"
              displayFormat="MMM DD, YYYY"
            />
            <Travelers
              className={styles.travelers}
              title="Travelers"
              description="Add guests"
              icon="user"
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Main;
