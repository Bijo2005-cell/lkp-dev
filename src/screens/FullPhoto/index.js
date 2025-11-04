import React, { useState } from "react";
import cn from "classnames";
import styles from "./FullPhoto.module.sass";
import Product from "../../components/Product";
import Icon from "../../components/Icon";
import { Link } from "react-router-dom";
import PhotoView from "../../components/PhotoView";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Stays",
    url: "/",
  },
  {
    title: "New Zealand",
    url: "/stays-category",
  },
  {
    title: "South Island",
  },
];

const gallery = [
  "/images/content/photo-2.1.jpg",
  "/images/content/photo-2.2.jpg",
  "/images/content/photo-2.6.jpg",
  "/images/content/photo-2.3.jpg",
  "/images/content/photo-2.7.jpg",
  "/images/content/photo-2.4.jpg",
  "/images/content/photo-2.8.jpg",
  "/images/content/photo-2.5.jpg",
  "/images/content/photo-2.9.jpg",
];

const options = [
  {
    title: "Superhost",
    icon: "home",
  },
  {
    title: "Queenstown, Otago, New Zealand",
    icon: "flag",
  },
];

const FullPhoto = () => {
  const [initialSlide, setInitialSlide] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleOpen = (index) => {
    setInitialSlide(index);
    setVisible(true);
  };

  return (
    <>
      <Product
        classSection="section-mb64"
        urlHome="/"
        title="Spectacular views of Queenstown"
        breadcrumbs={breadcrumbs}
        options={options}
      ></Product>
      <div className={cn("section-mb80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.galleryGrid}>
            {gallery.map((x, index) => (
              <div
                key={index}
                className={cn(styles.preview, {
                  [styles.previewLarge]: index === 0 || index === 3,
                })}
                onClick={() => handleOpen(index)}
              >
                <div className={styles.imageWrapper}>
                  <img src={x} alt={`Gallery image ${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.foot}>
            <Link
              to="/stays-product"
              className={cn("button-circle-stroke button-small", styles.button)}
            >
              <Icon name="close" size="24" />
            </Link>
          </div>
        </div>
      </div>
      <PhotoView
        title="Spectacular views of Queenstown"
        initialSlide={initialSlide}
        visible={visible}
        items={gallery}
        onClose={() => setVisible(false)}
      />
    </>
  );
};

export default FullPhoto;
