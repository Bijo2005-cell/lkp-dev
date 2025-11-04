import React from "react";
import cn from "classnames";
import styles from "./StaysProduct.module.sass";
import Product from "../../components/Product";
import Description from "./Description";
import Itinerary from "../../components/Itinerary";
import CommentsProduct from "../../components/CommentsProduct";
import Browse from "../../components/Browse";
import Newsletter from "../../components/Newsletter";

// data
import { browse1 } from "../../mocks/browse";
import { browse2 } from "../../mocks/browse";

const gallery = [
  "/images/content/photo-1.1.jpg",
  "/images/content/photo-1.2.jpg",
  "/images/content/photo-1.3.jpg",
  "/images/content/photo-1.4.jpg",
  "/images/content/photo-1.1.jpg",
  "/images/content/photo-1.2.jpg",
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

const StaysProduct = () => {
  return (
    <>
      <Product
        classSection="section-mb64"
        title="Spectacular views of Queenstown"
        options={options}
        gallery={gallery}
        type="stays"
      />
      <Description classSection="section" />
      <Itinerary classSection="section" />
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
        title="Browse by property type"
        info="Let’s go on an adventure"
        items={browse1}
      />
      <Newsletter />
      <Browse
        classSection="section"
        headSmall
        classTitle="h4"
        title="Explore mountains in New Zealand"
        items={browse2}
      />
    </>
  );
};

export default StaysProduct;
