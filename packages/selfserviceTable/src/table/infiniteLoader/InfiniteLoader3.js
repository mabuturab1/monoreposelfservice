import React, { useEffect } from "react";

import { InfiniteLoader, ScrollSync } from "react-virtualized";

import TableVirtualized from "../virtualized/TableVirtualized";
import Loader from "react-loader-spinner";
import styles from "./InfiniteLoader.module.scss";

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
  tableStatus,
  onHeaderClicked,
  sortByColumn,
  validationSchema,
  tableActionsClicked,
  freezedColumnKeys,
}) => {
  const isItemLoaded = ({ index }) => {
    return !!tableData[index];
  };
  let disableTableStatus = {
    contentAddAble: false,
    contentEditAble: false,
    contentDeleteAble: false,
    fieldAddAble: false,
    fieldEditAble: false,
    fieldDeleteAble: false,
  };
  const getFreezedColumnWidth = () => {
    return freezedColumnKeys
      .map((el) => columnsWidth[el])
      .reduce((a, b) => a + b, 0);
  };
  const getTable = (
    onRowsRendered,
    registerChild,
    mTableHeader,
    mCellSpecs,
    mTableStatus,
    isFreezed,
    { onScroll, scrollTop }
  ) => {
    return (
      <TableVirtualized
        onRowsRendered={onRowsRendered}
        ref={registerChild}
        {...{
          tableData,

          formData,
          validationSchema,
          onHeaderClicked,
          sortByColumn,
          updateFieldData,
          tableActionsClicked,
          isFreezed,
        }}
        tableStatus={mTableStatus}
        tableHeader={mTableHeader}
        cellSpecs={mCellSpecs}
        scrollTop={scrollTop}
        onScroll={onScroll}
        showCircularIndicator={isNextPageLoading}
        rowCount={tableData.length}
        rowGetter={({ index }) => tableData[index]}
        columns={mTableHeader.map((el) => ({
          ...el,
          dataKey: el.key,
          width: columnsWidth[el.key] != null ? columnsWidth[el.key] : 100,
        }))}
      />
    );
  };
  const handleKeyDown = (event) => {
    console.log("shift key pressed status", event, event.ctrlKey);
  };
  useEffect(() => {
    window.addEventListener("keypressed", handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener("keypressed", handleKeyDown);
    };
  }, []);
  console.log("FREEZED RESULT IS");
  console.log(
    tableHeader.filter((el) => freezedColumnKeys.includes(el.key)),
    cellSpecs.filter((el) => freezedColumnKeys.includes(el.key))
  );
  let tableHeaderFreezed = tableHeader.filter((el) =>
    freezedColumnKeys.includes(el.key)
  );
  let cellSpecsFreezed = cellSpecs.filter((el) =>
    freezedColumnKeys.includes(el.key)
  );
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
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  position: "relative",
                  width: "100%",
                }}
              >
                {freezedColumnKeys.length > 0 ? (
                  <div
                    className={styles.disableOverflow}
                    style={{
                      height: "100%",
                      width: getFreezedColumnWidth() + "px",
                      backgroundColor: "white",
                      zIndex: 100000,
                      position: "absolute",
                      overflowY: "hidden",
                      overflowX: "hidden",
                      top: 0,
                      left: 0,
                    }}
                  >
                    {getTable(
                      onRowsRendered,
                      registerChild,
                      tableHeaderFreezed,
                      cellSpecsFreezed,
                      disableTableStatus,
                      true,
                      { scrollTop }
                    )}
                  </div>
                ) : null}
                <div style={{ height: "100%", width: "100%" }}>
                  {getTable(
                    onRowsRendered,
                    registerChild,
                    tableHeader,
                    cellSpecs,
                    tableStatus,
                    false,
                    { onScroll }
                  )}
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
