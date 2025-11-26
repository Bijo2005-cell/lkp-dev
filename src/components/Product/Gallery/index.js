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

  // Determine how many images to show in the grid
  const imageCount = items.length;
  const maxDisplayImages = 6;
  const displayImages = Math.min(imageCount, maxDisplayImages);
  const showMoreButton = imageCount > maxDisplayImages;

  // Get dynamic class based on image count for "stays" type
  const getImageCountClass = () => {
    if (type !== "stays") return "";
    // Only apply custom classes for 1-3 images to prevent empty spaces
    // For 4-6 images, use default layout which works fine
    if (displayImages <= 3) {
      return styles[`count${displayImages}`] || "";
    }
    return "";
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
            },
            getImageCountClass()
          )}
        >
          {items.slice(0, displayImages).map((x, index) => {
            // Web: 6th image (index 5), Mobile: 4th image (index 3)
            const isWebButtonImage = index === 5 && displayImages >= 6; // 6th image for web
            const isMobileButtonImage = index === 3 && displayImages >= 4; // 4th image for mobile
            return (
              <div
                className={styles.preview}
                key={index}
                onClick={() => handleOpen(index)}
              >
                <div className={styles.view}>
                  <img src={x} alt="Product Details"></img>
                </div>
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
          {showMoreButton && (
            <div
              className={cn(styles.preview, styles.morePhotos)}
              onClick={() => handleOpen(maxDisplayImages)}
            >
              <div className={styles.moreContent}>
                <Icon name="image" size="24" />
                <span className={styles.moreText}>+{items.length - maxDisplayImages}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <PhotoView
        title="Spectacular views of Queenstowsdffn"
        initialSlide={initialSlide}
        visible={visible}
        items={items}
        onClose={() => setVisible(false)}
      />
    </>
  );
};

export default Gallery;
