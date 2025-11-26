import React, { useState } from "react";
import cn from "classnames";
import styles from "./Testimonials.module.sass";
import Item from "./Item";

// data
import { testimonials } from "../../mocks/testimonials";

const Testimonials = ({ classSection }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Return null if testimonials array is empty
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Ensure activeIndex is within bounds
  const safeActiveIndex = Math.min(activeIndex, testimonials.length - 1);
  const activeTestimonial = testimonials[safeActiveIndex];

  if (!activeTestimonial || !activeTestimonial.review) {
    return null;
  }

  return (
    <div className={cn(classSection, styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.list}>
          {activeTestimonial.review.map((x, index) => (
            <Item item={x} key={index} />
          ))}
        </div>
        <div className={styles.nav}>
          {testimonials.map((x, index) => (
            <div
              className={cn(styles.link, {
                [styles.active]: index === safeActiveIndex,
              })}
              onClick={() => setActiveIndex(index)}
              key={index}
            >
              <div className={styles.avatar}>
                <img src={x.avatar} alt="Avatar" />
              </div>
              <div className={styles.details}>
                <div className={styles.man}>{x.name}</div>
                <div className={styles.position}>{x.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
