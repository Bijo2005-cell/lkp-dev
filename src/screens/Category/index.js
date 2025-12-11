import React from "react";
import Main from "./Main";
import Catalog from "./Catalog";
import Newsletter from "../../components/Newsletter";
import Best from "../../components/Best";

const ExperienceCategory = () => {
  return (
    <>
      <Main />
      <Catalog />
      <Best
        classSection="section-mb64"
        title="Best tour guide"
        info="100+ tour guides"
      />
      <Newsletter />
    </>
  );
};

export default ExperienceCategory;
