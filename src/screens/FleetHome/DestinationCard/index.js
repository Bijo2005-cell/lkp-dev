import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./DestinationCard.module.sass";

const DestinationCard = ({ className, item }) => {
  return (
    <Link className={cn(className, styles.card)} to={item.url || "/stays-category"}>
      <div className={styles.imageWrapper}>
        <img
          srcSet={item.srcSet ? `${item.srcSet} 2x` : undefined}
          src={item.src}
          alt={item.title}
          className={styles.image}
          onError={(e) => {
            // Silently fallback to default image if original fails to load
            if (e.target.src !== "/images/content/card-pic-13.jpg") {
              e.target.src = "/images/content/card-pic-13.jpg";
              e.target.srcSet = "/images/content/card-pic-13.jpg";
            }
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{item.title}</div>
        {item.location && (
          <div className={styles.location}>{item.location}</div>
        )}
      </div>
    </Link>
  );
};

export default DestinationCard;

