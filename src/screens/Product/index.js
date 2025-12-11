import React from "react";
import cn from "classnames";
import styles from "./Product.module.sass";
import Product from "../../components/Product";
import Description from "./Description";
import CommentsProduct from "../../components/CommentsProduct";
import Interest from "../../components/Interest";
import Categories from "../../components/Categories";

// data
import { experience2 } from "../../mocks/experience";
import { categories1 } from "../../mocks/categories";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Experience",
    url: "/",
  },
  {
    title: "New Zealand",
    url: "/category",
  },
  {
    title: "South Island",
  },
];

const gallery = [
  "/images/content/photo-4.1.jpg",
  "/images/content/photo-4.2.jpg",
  "/images/content/photo-4.3.jpg",
  "/images/content/photo-4.4.jpg",
  "/images/content/photo-4.5.jpg",
];

const options = [
  {
    title: "Best tour guide",
    icon: "user",
  },
  {
    title: "Queenstown, assaOtago, New Zealand",
    icon: "flag",
  },
];

const parametersUser = [
  {
    title: "Superhost",
    icon: "home",
  },
  {
    title: "256 reviews",
    icon: "star-outline",
  },
];

const socials = [
  {
    title: "twitter",
    url: "https://twitter.com/ui8",
  },
  {
    title: "instagram",
    url: "https://www.instagram.com/ui8net/",
  },
  {
    title: "facebook",
    url: "https://www.facebook.com/ui8.net/",
  },
];

const ExperienceProduct = () => {
  return (
    <>
      <Product
        classSection="section-mb64"
        urlHome="/category"
        title="Premium milford sound tour ex queenstown"
        breadcrumbs={breadcrumbs}
        options={options}
        gallery={gallery}
        type="tour"
      />
      <Description classSection="section" />
      <CommentsProduct
        className={cn("section", styles.comment)}
        parametersUser={parametersUser}
        info="Described by Queenstown House & Garden magazine as having 'one of the best views we've ever seen' you will love relaxing in this newly built"
        socials={socials}
        buttonText="Contact"
      />
      <Interest classSection="section" items={experience2} />
      <Categories
        classSection="section"
        title="Exploring in Queenstown"
        info="A lot of amazing experiences 🏝"
        items={categories1}
      />
    </>
  );
};

export default ExperienceProduct;
