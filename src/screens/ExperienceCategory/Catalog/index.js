import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Catalog.module.sass";
import Sorting from "../../../components/Sorting";
import Browse from "../../../components/Browse";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";

// data
import { browse2 } from "../../../mocks/browse";
import { experience } from "../../../mocks/experience";
import { getListings } from "../../../utils/api";

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
    url: "/experience-category",
  },
  {
    title: "South Island",
  },
];

const navigation = [
  "Entire homes",
  "Cancellation flexibility",
  "Closest beach",
  "For long experiences",
];

const saleOptions = ["On sales", "On delivery", "In exchange"];

const Catalog = () => {
  const [sale, setSale] = useState(saleOptions[0]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getListings("EXPERIENCE", 50, 0);
        const adapted = (Array.isArray(data) ? data : []).map((l) => ({
          title: l.title || "",
          src: l.coverPhotoUrl || "",
          srcSet: l.coverPhotoUrl || "",
          url: `/experience-product?id=${l.listingId || l.id || 2}`,
          priceOld: "",
          priceActual: "",
          options: [],
          comment: "",
          avatar: "",
          cost: "",
          rating: "",
          reviews: "",
        }));
        if (mounted) setListings(adapted);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("Failed to load listings", e);
        }
        if (mounted) setListings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={cn("section", styles.section)}>
      <Sorting
        className={styles.sorting}
        urlHome="/"
        breadcrumbs={breadcrumbs}
        navigation={navigation}
        title="Places to experience"
        sale="300+ experiences"
        details="May 1 - 14, 2 guests"
        sorting={sale}
        setSorting={setSale}
        sortingOptions={saleOptions}
      />
      <Browse
        classSection="section-mb80"
        headSmall
        classTitle="h4"
        title="Explore mountains in New Zealand"
        items={browse2}
      />
      <div className={styles.body}>
        <div className={cn("container", styles.container)}>
          <h4 className={cn("h4", styles.title)}>Experience</h4>
          <div className={styles.list}>
            {loading ? (
              <Loader className={styles.loader} />
            ) : listings.length > 0 ? (
              listings.map((x, index) => (
                <Card className={styles.card} item={x} key={index} />
              ))
            ) : (
              experience.map((x, index) => (
                <Card className={styles.card} item={x} key={index} />
              ))
            )}
          </div>
          <div className={styles.btns}>
            <button className={cn("button-stroke", styles.button)}>
              <Loader className={styles.loader} />
              <span>Show more</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
