import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "../GuestPicker/GuestPicker.module.sass";
import Icon from "../Icon";
import Counter from "../Counter";

const RoomPicker = ({ visible, onClose, onChange, initialRooms = 1, maxRooms }) => {
  const [rooms, setRooms] = useState(initialRooms);
  const skipRef = useRef(true);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const target = Number(initialRooms) || 1;
    if (target !== rooms) {
      skipRef.current = true;
      setRooms(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRooms]);

  useEffect(() => {
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }
    onChangeRef.current?.(rooms);
  }, [rooms]);

  if (!visible) return null;

  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div className={cn(styles.picker)}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLabel}>ROOMS</div>
            <div className={styles.headerValue}>{rooms} room{rooms !== 1 ? "s" : ""}</div>
          </div>
          <button type="button" className={styles.collapseButton} onClick={onClose}>
            <Icon name="arrow-bottom" size="16" />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.categoryRow}>
            <div className={styles.categoryInfo}>
              <div className={styles.categoryLabel}>Rooms</div>
              <div className={styles.categorySubtitle}>Select how many rooms you need</div>
            </div>
            <Counter
              className={styles.counter}
              value={rooms}
              setValue={(val) => setRooms(Number(val))}
              iconMinus="minus"
              iconPlus="plus"
              min={1}
              max={maxRooms}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.rules} />
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default RoomPicker;
