import React from "react";
import cn from "classnames";
import { NavLink } from "react-router-dom";
import styles from "./Panel.module.sass";
import Icon from "../Icon";

const navigation = [
  {
    title: "Experience",
    url: "/",
  },
  {
    title: "Flights",
    url: "/flights",
  },
  {
    title: "Cars",
    url: "/cars",
  },
  {
    title: "Things to do",
    url: "/things-to-do",
  },
];

const Panel = ({
  className,
  menu,
  classBody,
  children,
  onSearch,
  classButtonSearch,
}) => {
  return (
    <div className={cn(className, styles.panel)}>
      <div className={styles.background}></div>
      {menu && (
        <div className={styles.nav}>
          {navigation.map((x, index) => (
            <NavLink
              className={styles.link}
              activeClassName={styles.active}
              to={x.url}
              key={index}
              exact
            >
              {x.title}
            </NavLink>
          ))}
        </div>
      )}
      <div className={cn(styles.body, classBody)}>
        {children}
        <button
          className={cn(classButtonSearch, styles.search)}
          onClick={onSearch}
        >
          <Icon name="search" size="24" />
        </button>
      </div>
    </div>
  );
};

export default Panel;
