import React from "react";
import styles from "./MenuList.modue.scss";
const MenuList = (props) => {
  let items = [];
  if (props.data == null) return <div></div>;
  props.data.forEach((el) => {
    items.push(
      <div className={styles.headerTitle}>
        <h3>{el.headerTitle}</h3>
        {el.options.map((el1) => (
          <p
            className={styles.options}
            onClick={() => props.itemClicked(el1.id)}
          >
            {el1}
          </p>
        ))}
      </div>
    );
  });
  return <div>{items}</div>;
};
export default MenuList;
