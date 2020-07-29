import React from "react";

import { InfiniteLoader, ScrollSync } from "react-virtualized";

import TableVirtualized from "../virtualized/TableVirtualized";
import Loader from "react-loader-spinner";

const InfiniteLoaderWrapper = ({
  isNextPageLoading,

  loadNextPage,
  tableData,
  tableHeader,
  totalReportItems,
  cellSpecs,
  formData,
  updateFieldData,
  columnsWidth,

  onHeaderClicked,
  sortByColumn,
  validationSchema,
}) => {
  const isItemLoaded = ({ index }) => {
    return !!tableData[index];
  };
  const getTable = (
    onRowsRendered,
    registerChild,
    start,
    end,
    { onScroll, scrollTop }
  ) => {
    return (
      <TableVirtualized
        onRowsRendered={onRowsRendered}
        ref={registerChild}
        {...{
          tableData,
          tableHeader,
          cellSpecs,
          formData,
          validationSchema,
          onHeaderClicked,
          sortByColumn,
          updateFieldData,
        }}
        {...{ scrollTop, onScroll }}
        showCircularIndicator={isNextPageLoading}
        rowCount={tableData.length}
        rowGetter={({ index }) => tableData[index]}
        columns={tableHeader.slice(start, end).map((el) => ({
          ...el,
          dataKey: el.key,
          width: columnsWidth[el.key] != null ? columnsWidth[el.key] : 100,
        }))}
      />
    );
  };
  return (
    <div
      style={{
        height: "98%",
        overflow: "hidden",

        width: "100%",
        position: "relative",
      }}
    >
      <InfiniteLoader
        isRowLoaded={isItemLoaded}
        rowCount={totalReportItems}
        loadMoreRows={loadNextPage}
      >
        {({ onRowsRendered, registerChild }) => (
          <ScrollSync>
            {({
              clientHeight,
              clientWidth,
              onScroll,
              scrollHeight,
              scrollLeft,
              scrollTop,
              scrollWidth,
            }) => (
              <div style={{ display: "flex", height: "100%", width: "100%" }}>
                <div style={{ height: "100%", width: "15%" }}>
                  {getTable(onRowsRendered, registerChild, 0, 3, { scrollTop })}
                </div>
                <div style={{ height: "100%", width: "15%" }}>
                  {getTable(onRowsRendered, registerChild, 0, 3, { onScroll })}
                </div>
              </div>
            )}
          </ScrollSync>
        )}
      </InfiniteLoader>
      {isNextPageLoading ? (
        <div
          className={tableData.length === 0 ? "no-data" : null}
          style={
            tableData.length > 0
              ? {
                  position: "absolute",

                  zIndex: 1000,
                  width: "100%",
                  bottom: "1px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }
              : null
          }
        >
          <Loader
            type="ThreeDots"
            color="#00BFFF"
            height={50}
            width={50}
            timeout={0} //3 secs
          />
        </div>
      ) : null}
    </div>
  );
};
export default React.memo(InfiniteLoaderWrapper);
