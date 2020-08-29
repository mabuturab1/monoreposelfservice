import React from "react";

import SingleFilter from "./singleFilter/SingleFilter";
// import styles from "./TableFilter.module.scss";
const TableFilter = (props) => {
  const {
    queryConditions,
    tableFields,
    searchConditions,
    searchConditionsValues,
    // numFilters,
    removeFilter,
    idsArr: mIdsArr,
  } = {
    ...props,
  };
  let idsArr = [];
  if (mIdsArr) idsArr = mIdsArr;
  let renderFilterElements = (filterFormData) => {
    const searchFilterList = [];
    console.log("VALUES IN TABLE FILTER", filterFormData.values);
    for (let i = 0; i < idsArr.length; i++) {
      let filterName = idsArr[i];

      searchFilterList.push(
        <SingleFilter
          id={idsArr[i]}
          removeFilter={removeFilter}
          key={i}
          name={filterName}
          showLabel={i === 0}
          queryConditions={i === 0 ? [queryConditions[0]] : queryConditions}
          tableFields={tableFields}
          searchConditions={searchConditions}
          searchConditionsValues={searchConditionsValues}
          {...filterFormData}
        />
      );
    }

    return searchFilterList;
  };

  return renderFilterElements(props.filterFormData);
};
export default TableFilter;
