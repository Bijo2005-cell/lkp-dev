import React from "react";
import cn from "classnames";
import styles from "./ExperienceProduct.module.sass";
import Product from "../../components/Product";
import Description from "./Description";
import CommentsProduct from "../../components/CommentsProduct";
import Browse from "../../components/Browse";
import Categories from "../../components/Categories";

// data
import { browse3 } from "../../mocks/browse";
import { categories2 } from "../../mocks/categories";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Cars",
    url: "/cars",
  },
  {
    title: "London",
    url: "/cars-product",
  },
  {
    title: "Kings Cross",
  },
];

const gallery = [
  "/images/content/photo-3.1.jpg",
  "/images/content/photo-3.2.jpg",
  "/images/content/photo-3.3.jpg",
  "/images/content/photo-3.4.jpg",
  "/images/content/photo-3.5.jpg",
];

const options = [
  {
    title: "Best driver",
    icon: "user",
  },
  {
    title: "London - Kings Cross",
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

const CarsProduct = () => {
  return (
    <>
      <Product
        classSection="section-mb64"
        urlHome="/cars-category"
        title="BMW i1 – 2021"
        breadcrumbs={breadcrumbs}
        options={options}
        gallery={gallery}
        type="cars"
      />
      <Description classSection="section" />
      <CommentsProduct
        className={cn("section", styles.comment)}
        parametersUser={parametersUser}
        info="Described by Queenstown House & Garden magazine as having 'one of the best views we've ever seen' you will love relaxing in this newly built"
        socials={socials}
        buttonText="Contact"
      />
      <Browse
        classSection="section"
        classTitle="h2"
        title="Discover more"
        info="for car rentals"
        items={browse3}
      />
      <Categories
        classSection="section"
        title="Recommended pickup locations"
        info="A lot of amazing experiences 🏝"
        items={categories2}
      />
    </>
  );
};

export default CarsProduct;
