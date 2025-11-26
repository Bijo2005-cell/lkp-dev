import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./CheckoutComplete.module.sass";
import Icon from "../Icon";

const CheckoutComplete = ({ className, title, parameters, options, items, paymentFailed = false, onRetryPayment }) => {
  return (
    <div className={cn(className, styles.complete)}>
      <div className={styles.head}>
        {paymentFailed ? (
          <>
            <div className={cn("h2", styles.title)} style={{ color: "#e74c3c" }}>Payment Failed</div>
            <div className={styles.info} style={{ color: "#e74c3c" }}>
              Your payment could not be processed. Please try again.
            </div>
          </>
        ) : (
          <>
            <div className={cn("h2", styles.title)}>Congratulation!</div>
            <div className={styles.info}>
              You trip has been booked!{" "}
              <span role="img" aria-label="firework">
                🎉
              </span>
            </div>
          </>
        )}
        <div className={styles.subtitle}>{title}</div>
        <div className={styles.author}>
          <div className={styles.text}>Hosted by</div>
          <div className={styles.avatar}>
            <img src="/images/content/avatar.jpg" alt="Avatar" />
          </div>
          <div className={styles.man}>Zoe Towne</div>
        </div>
      </div>
      <div className={styles.line}>
        <div className={styles.rating}>
          <Icon name="star" size="20" />
          <div className={styles.number}>4.8</div>
          <div className={styles.reviews}>(256 reviews)</div>
        </div>
        {parameters && (
          <div className={styles.parameters}>
            {parameters.map((x, index) => (
              <div className={styles.parameter} key={index}>
                {x.icon && <Icon name={x.icon} size="16" />}
                {x.title}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.list}>
        {items.map((x, index) => (
          <div className={styles.item} key={index}>
            {x.icon && (
              <div className={styles.icon} style={{ borderColor: x.color }}>
                <Icon name={x.icon} size="24" />
              </div>
            )}
            <div className={styles.details}>
              <div className={styles.category}>{x.title}</div>
              <div className={styles.value}>{x.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.stage}>Booking details</div>
      <div className={styles.table}>
        {options.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.cell}>
              <Icon name={x.icon} size="20" />
              {x.title}
            </div>
            <div className={styles.cell}>{x.content}</div>
          </div>
        ))}
      </div>
      <div className={styles.btns}>
        {paymentFailed ? (
          <>
            <Link className={cn("button-stroke", styles.button)} to="/bookings">
              Your trips
            </Link>
            {onRetryPayment && (
              <button
                type="button"
                className={cn("button", styles.button)}
                onClick={onRetryPayment}
              >
                Retry Payment
              </button>
            )}
          </>
        ) : (
          <>
            <Link className={cn("button-stroke", styles.button)} to="/bookings">
              Your trips
            </Link>
            <Link className={cn("button", styles.button)} to="/things-to-do">
              Explore things to do
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutComplete;
