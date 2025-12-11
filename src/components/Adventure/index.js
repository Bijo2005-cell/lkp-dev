import React from "react";
import cn from "classnames";
import styles from "./Adventure.module.sass";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Icon from "../Icon";

const items = [
  {
    title: "Luxury resort at the sea",
    places: "9,326 places",
    image: "/images/content/adventure-pic-1.svg",
  },
  {
    title: "Camping amidst the wild",
    places: "12,326 places",
    image: "/images/content/adventure-pic-2.svg",
  },
  {
    title: "Luxury resort at the sea",
    places: "5,326 places",
    image: "/images/content/adventure-pic-3.svg",
  },
  {
    title: "Luxury resort at the sea",
    places: "9,326 places",
    image: "/images/content/adventure-pic-1.svg",
  },
  {
    title: "Camping amidst the wild",
    places: "12,326 places",
    image: "/images/content/adventure-pic-2.svg",
  },
  {
    title: "Luxury resort at the sea",
    places: "5,326 places",
    image: "/images/content/adventure-pic-3.svg",
  },
];

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const Adventure = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <h2 className={cn("h2", styles.title)}>Let’s go on an adventure</h2>
          <div className={cn("info", styles.info)}>
            Find and book a great experience.
          </div>
        </div>
        <div className={styles.wrapper}>
          <Slider className="adventure-slider" {...settings}>
            {items.map((x, index) => (
              <div className={styles.item} key={index}>
                <div className={styles.preview}>
                  <img src={x.image} alt="Adventure" />
                </div>
                <div className={styles.details}>
                  <div className={styles.subtitle}>{x.title}</div>
                  <Link
                    className={cn("status", styles.places)}
                    to="/experience-category"
                  >
                    {x.places}
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Adventure;
