import React from "react";
import cn from "classnames";
import styles from "./Travel.module.sass";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import Image from "../Image";

const items = [
  {
    title: "Find trips that fit a flexible lifestyle",
    content:
      "Stacks is a production-ready library of stackable content blocks built in React Native",
    color: "#0097B2",
  },
  {
    title: "Travel with more confidence",
    content:
      "Stacks is a production-ready library of stackable content blocks built in React Native",
    color: "#0097B2",
  },
  {
    title: "See what’s really included",
    content:
      "Stacks is a production-ready library of stackable content blocks built in React Native",
    color: "#0097B2",
  },
];

const gallery = [
  {
    src: "/images/content/travel-pic-1.jpg",
    srcSet: "/images/content/travel-pic-1@2x.jpg",
    images: [
      {
        src: "/images/content/appraisal-pic-1.png",
        srcSet: "/images/content/appraisal-pic-1@2x.png",
        srcDark: "/images/content/appraisal-pic-dark-1.png",
        srcSetDark: "/images/content/appraisal-pic-dark-1@2x.png",
      },
      {
        src: "/images/content/appraisal-pic-1.png",
        srcSet: "/images/content/appraisal-pic-1@2x.png",
        srcDark: "/images/content/appraisal-pic-dark-1.png",
        srcSetDark: "/images/content/appraisal-pic-dark-1@2x.png",
      },
      {
        src: "/images/content/appraisal-pic-1.png",
        srcSet: "/images/content/appraisal-pic-1@2x.png",
        srcDark: "/images/content/appraisal-pic-dark-1.png",
        srcSetDark: "/images/content/appraisal-pic-dark-1@2x.png",
      },
    ],
  },
  {
    src: "/images/content/travel-pic-1.jpg",
    srcSet: "/images/content/travel-pic-1@2x.jpg",
    images: [
      {
        src: "/images/content/appraisal-pic-1.png",
        srcSet: "/images/content/appraisal-pic-1@2x.png",
        srcDark: "/images/content/appraisal-pic-dark-1.png",
        srcSetDark: "/images/content/appraisal-pic-dark-1@2x.png",
      },
      {
        src: "/images/content/appraisal-pic-1.png",
        srcSet: "/images/content/appraisal-pic-1@2x.png",
        srcDark: "/images/content/appraisal-pic-dark-1.png",
        srcSetDark: "/images/content/appraisal-pic-dark-1@2x.png",
      },
    ],
  },
];

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const Travel = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    nextArrow: (
      <SlickArrow>
        <Icon name="arrow-next" size="14" />
      </SlickArrow>
    ),
    prevArrow: (
      <SlickArrow>
        <Icon name="arrow-prev" size="14" />
      </SlickArrow>
    ),
  };

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <h2 className={cn("h2", styles.title)}>
            Travel to make memories all around the world
          </h2>
          <div className={cn("info", styles.info)}>
            Find trips that fit a flexible lifestyle
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.list}>
              {items.map((x, index) => (
                <div className={styles.item} key={index}>
                  <div
                    className={styles.number}
                    style={{ backgroundColor: x.color }}
                  >
                    0{index + 1}
                  </div>
                  <div className={styles.subtitle}>{x.title}</div>
                  <div className={styles.text}>{x.content}</div>
                </div>
              ))}
            </div>
            <Link className={cn("button", styles.button)} to="/experience-category">
              Start your search
            </Link>
          </div>
          <div className={styles.col}>
            <div className={styles.wrapper}>
              <Slider className="travel-slider" {...settings}>
                {gallery.map((item, index) => (
                  <div className={styles.gallery} key={index}>
                    <div className={cn("travel-bg", styles.bg)}>
                      <img
                        srcSet={`${item.srcSet} 2x`}
                        src={item.src}
                        alt="Travel"
                      />
                    </div>
                    <div className={styles.group}>
                      {item.images.map((x, index) => (
                        <div
                          className={cn("travel-preview", styles.preview)}
                          key={index}
                        >
                          <Image
                            srcSet={`${x.srcSet} 2x`}
                            srcSetDark={`${x.srcSetDark} 2x`}
                            src={x.src}
                            srcDark={x.srcDark}
                            alt="Appraisal"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Travel;
