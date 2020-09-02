import React from "react";

import { InfiniteLoader } from "react-virtualized";

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
  tableStatus,
  onHeaderClicked,
  sortByColumn,
  validationSchema,
  tableActionsClicked,
  updateCurrentScroll,
  editAllowed,
  apiUrl,
  tableHeaderSkeletonPreview,
  tableDataSkeletonPreview,
  currentReportId,
  reportType,
}) => {
  const isItemLoaded = ({ index }) => {
    return !!tableData[index];
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
              tableActionsClicked,
              tableStatus,
              updateCurrentScroll,
              editAllowed,
              apiUrl,
              tableHeaderSkeletonPreview,
              tableDataSkeletonPreview,
              currentReportId,
              reportType,
            }}
            showCircularIndicator={isNextPageLoading}
            rowCount={tableData.length}
            rowGetter={({ index }) => tableData[index]}
            columns={tableHeader.map((el) => ({
              ...el,
              dataKey: el.key,
              width: columnsWidth[el.key] != null ? columnsWidth[el.key] : 100,
            }))}
          />
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
