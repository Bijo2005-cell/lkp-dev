import React from "react";
import Main from "./Main";
import Catalog from "./Catalog";
import Newsletter from "../../components/Newsletter";
import Best from "../../components/Best";
import Testimonials from "../../components/Testimonials";

const ExperienceCategory = () => {
  return (
    <>
      <Main />
      <Catalog />
      <Newsletter />
      <Best
        classSection="section-mb0"
        title="Superhost"
        info="300+ superhost"
      />
      <Testimonials classSection="section-pd section-mb0" />
    </>
  );
};

export default ExperienceCategory;
