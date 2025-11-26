import React from "react";
import cn from "classnames";
import styles from "./Comment.module.sass";
import List from "./List";

const Comment = ({ className, reviews = [] }) => {
  return (
    <div className={cn(className, styles.section)}>
      <List reviews={reviews} />
    </div>
  );
};

export default Comment;
