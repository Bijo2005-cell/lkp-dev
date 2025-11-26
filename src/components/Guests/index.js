import React, { useState } from "react";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./Guests.module.sass";
import Icon from "../Icon";
import Counter from "../Counter";

const Guests = ({ className, title }) => {
  const [guests, setGuests] = useState(1);

  const [visible, setVisible] = useState(false);

  const renderTitle = () => {
    return guests > 0
      ? guests > 1
        ? guests + " guests"
        : guests + " guest"
      : title;
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div
        className={cn(className, styles.guests, {
          [styles.active]: visible,
        })}
      >
        <button
          type="button"
          className={cn("button-stroke button-small", styles.button)}
          onClick={() => setVisible(!visible)}
        >
          <span>{renderTitle()}</span>
          <Icon name="arrow-bottom" size="10" />
        </button>
        <div className={styles.body}>
          <Counter
            className={styles.counter}
            value={guests}
            setValue={setGuests}
            iconMinus="minus"
            iconPlus="plus"
          />
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Guests;
