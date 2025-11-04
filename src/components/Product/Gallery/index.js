import React, { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Gallery.module.sass";
import Icon from "../../Icon";
import PhotoView from "../../PhotoView";

const Gallery = ({ className, items, type }) => {
  const [initialSlide, setInitialSlide] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleOpen = (index) => {
    setInitialSlide(index);
    setVisible(true);
  };

  return (
    <>
      <div className={cn(styles.gallery, className)}>
        <div
          className={cn(
            styles.list,
            {
              [styles.stays]: type === "stays",
            },
            {
              [styles.cars]: type === "cars",
            },
            {
              [styles.tour]: type === "tour",
            }
          )}
        >
          {items.slice(0, 2).map((x, index) => (
            <div className={styles.preview} key={index}>
              <div className={styles.view} onClick={() => handleOpen(index)}>
                <img src={x} alt="Product Details"></img>
              </div>
            </div>
          ))}
          {items.slice(2, items.length > 6 ? 6 : items.length).map((x, index) => {
            const actualIndex = index + 2;
            // Web: 6th image (index 5), Mobile: 4th image (index 3)
            const isWebButtonImage = actualIndex === 5; // 6th image for web
            const isMobileButtonImage = actualIndex === 3; // 4th image for mobile
            return (
              <div
                className={styles.preview}
                key={actualIndex}
                onClick={() => handleOpen(actualIndex)}
              >
                <img src={x} alt="Product Details"></img>
                {(isWebButtonImage || isMobileButtonImage) && (
                  <Link
                    to="/full-photo"
                    className={cn(
                      "button-white button-small",
                      styles.button,
                      {
                        [styles.buttonWeb]: isWebButtonImage,
                        [styles.buttonMobile]: isMobileButtonImage,
                      }
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon name="arrow-next" size="16" />
                    <span>More</span>
                  </Link>
                )}
              </div>
            );
          })}
          {items.length > 6 && (
            <div
              className={cn(styles.preview, styles.morePhotos)}
              onClick={() => handleOpen(6)}
            >
              <div className={styles.moreContent}>
                <Icon name="image" size="24" />
                <span className={styles.moreText}>+{items.length - 6}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <PhotoView
        title="Spectacular views of Queenstown"
        initialSlide={initialSlide}
        visible={visible}
        items={items}
        onClose={() => setVisible(false)}
      />
    </>
  );
};

export default Gallery;
