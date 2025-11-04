import React, { useState } from "react";
import cn from "classnames";
import styles from "./PriceDetails.module.sass";
import HeadMoreOptions from "./HeadMoreOptions";
import HeadOptions from "./HeadOptions";
import Icon from "../Icon";
import Form from "../Form";

const PriceDetails = ({
  className,
  more,
  image,
  title,
  items,
  table,
  discoundCode,
  addOns,
  onRemoveAddOn,
}) => {
  const [discound, setDiscound] = useState("");

  const handleSubmit = (e) => {
    alert();
  };

  return (
    <div className={cn(className, styles.price)}>
      {more ? (
        <HeadMoreOptions className={styles.head} image={image} title={title} />
      ) : (
        <HeadOptions className={styles.head} image={image} title={title} />
      )}
      <div
        className={cn(styles.description, {
          [styles.flex]: items.length > 1,
        })}
      >
        {items.map((x, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.icon}>
              <Icon name={x.icon} size="24" />
            </div>
            <div className={styles.box}>
              <div className={styles.category}>{x.category}</div>
              <div className={styles.subtitle}>{x.title}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.body}>
        <div className={styles.stage}>Price details</div>
        {discoundCode && (
          <Form
            className={styles.form}
            value={discound}
            setValue={setDiscound}
            onSubmit={() => handleSubmit()}
            placeholder="Enter discound code"
            type="text"
            name="code"
            icon="arrow-next"
          />
        )}
        <div className={styles.table}>
          {table.map((x, index) => (
            <div className={styles.row} key={index}>
              <div className={styles.cell}>{x.title}</div>
              <div className={styles.cell}>{x.value}</div>
            </div>
          ))}
        </div>
        {addOns && addOns.length > 0 && (
          <div className={styles.addOnsSection}>
            <div className={styles.addOnsTitle}>Add-ons</div>
            <div className={styles.addOnsList}>
              {addOns.map((addOn, index) => (
                <div className={styles.addOnItem} key={index}>
                  <div className={styles.addOnItemName}>{addOn.name}</div>
                  <div className={styles.addOnItemPrice}>${addOn.price}</div>
                  {onRemoveAddOn && (
                    <button
                      className={styles.addOnRemoveButton}
                      onClick={() => onRemoveAddOn(index)}
                      aria-label={`Remove ${addOn.name}`}
                    >
                      <Icon name="close" size="16" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.note}>
        <Icon name="coin" size="12" />
        Free cancellation until 3:00 PM on May 15, 2021
      </div>
    </div>
  );
};

export default PriceDetails;
