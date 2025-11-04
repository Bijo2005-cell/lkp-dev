import React from "react";
import cn from "classnames";
import styles from "./Product.module.sass";
import Icon from "../Icon";
import Actions from "../Actions";
import Gallery from "./Gallery";

const Product = ({
  classSection,
  title,
  options,
  gallery,
  type,
}) => {
  return (
    <div className={cn(classSection, styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <div className={styles.box}>
            <h1 className={cn("h2", styles.title)}>{title}</h1>
            <div className={styles.line}>
              <div className={styles.avatar}>
                <img src="/images/content/avatar-1.jpg" alt="Avatar" />
              </div>
              <div className={styles.rating}>
                <Icon name="star" size="20" />
                <div className={styles.number}>4.8</div>
                <div className={styles.reviews}>(256 reviews)</div>
              </div>
              <div className={styles.options}>
                {options.map((x, index) => (
                  <div className={styles.option} key={index}>
                    <Icon name={x.icon} size="20" />
                    {x.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Actions className={styles.actions} />
        </div>
        {gallery && (
          <Gallery className={styles.gallery} items={gallery} type={type} />
        )}
      </div>
    </div>
  );
};

export default Product;
