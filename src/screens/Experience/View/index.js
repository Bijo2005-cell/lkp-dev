import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./View.module.sass";
import Play from "../../../components/Play";

const View = () => {
  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <div className={styles.details}>
            <div className={cn("stage", styles.stage)}>fleet travel ui kit</div>
            <h2 className={cn("h2", styles.title)}>
              Book a ticket <br></br>and just leave
            </h2>
          </div>
          <Link className={cn("button", styles.button)} to="/flights-category">
            Book now
          </Link>
        </div>
        <div className={styles.body}>
          <div className={styles.preview}>
            <img src="/images/content/video-bg.jpg" alt="Video bg" />
            <Play className="play" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
