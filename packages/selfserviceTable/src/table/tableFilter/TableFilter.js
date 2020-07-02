import React from "react";

import SingleFilter from "./singleFilter/SingleFilter";

const TableFilter = (props) => {
  const {
    queryConditions,
    tableFields,
    searchConditions,
    searchConditionsValues,
    numFilters,
  } = {
    ...props,
  };
  let renderFilterElements = (filterFormData) => {
    const searchFilterList = [];

    for (let i = 0; i < numFilters || 0; i++) {
      let filterName = i + "list";

      searchFilterList.push(
        <SingleFilter
          key={i}
          name={filterName}
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
