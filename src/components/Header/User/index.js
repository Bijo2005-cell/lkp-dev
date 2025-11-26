import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./User.module.sass";
import Icon from "../../Icon";

const User = ({ className, items }) => {
  const [visible, setVisible] = useState(false);

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.user, className, { [styles.active]: visible })}>
        <button className={styles.head} onClick={() => setVisible(!visible)}>
          <Icon name="user" size="24" />
        </button>
        <div className={styles.body}>
          <div className={styles.group}>
            {items.map((item, index) => (
              <div className={styles.menu} key={index}>
                {item.menu.map((x, index) => (
                  <NavLink
                    className={styles.item}
                    activeClassName={styles.active}
                    to={x.url}
                    onClick={() => setVisible(!visible)}
                    key={index}
                  >
                    <div className={styles.icon}>
                      <Icon name={x.icon} size="24" />
                    </div>
                    <div className={styles.text}>{x.title}</div>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.btns}>
            <NavLink
              className={cn("button button-small", styles.button)}
              activeClassName={styles.active}
              to="/account-settings"
              onClick={() => setVisible(!visible)}
            >
              Account
            </NavLink>
            <button className={cn("button-stroke button-small", styles.button)}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default User;
