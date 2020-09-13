import React from "react";
import TableCreator from "./TableCreator";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
const TableWrapper = (props) => {
  return <TableCreator {...props} />;
};
const mapStateToProps = (state) => {
  return {
    tableData: state.table.tableData,
    tableHeader: state.table.tableHeader,
    serverError: state.table.serverError,
    fetchNewDataTrigger: state.table.fetchData,
    tableHeaderPending: state.table.tableHeaderPending,
    tableDataPending: state.table.tableDataPending,
    totalReportItems: state.table.totalReportItems,
    freezedColumnKeys: state.table.freezedColumnKeys,
    bearerToken: state.table.bearerToken,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSnackbarContent: (data) => dispatch(actions.showSnackbarContent(data)),
    fetchTableHeader: (apiUrl, reportType, reportId) =>
      dispatch(actions.getTableHeader(apiUrl, reportType, reportId)),
    fetchTableData: (apiUrl, reportType, reportId, params, isNewData) =>
      dispatch(
        actions.getTableData(apiUrl, reportType, reportId, params, isNewData)
      ),
    removeError: () => dispatch(actions.removeError()),
    clearTableData: () => dispatch(actions.clearTableData()),
    updateApiUrl: (apiAddress) => dispatch(actions.updateApiUrl(apiAddress)),
    updateCurrentReportId: (currentReportId) =>
      dispatch(actions.updateCurrentReportId(currentReportId)),
    deleteTableContent: (apiUrl, reportType, reportId, rowId) =>
      dispatch(actions.deleteTableContent(apiUrl, reportType, reportId, rowId)),
    getConnectedToWebSocket: () => dispatch(actions.getConnectedToWebSocket()),
    uploadFile: (
      apiUrl,
      reportType,
      reportId,
      rowId,
      data,
      type,
      newKey,
      isSuccess
    ) =>
      dispatch(
        actions.uploadFile(
          apiUrl,
          reportType,
          reportId,
          rowId,
          data,
          type,
          newKey,
          isSuccess
        )
      ),
    updateQueryParams: (data) => dispatch(actions.updateQueryParams(data)),
    updateFieldData: (
      apiUrl,
      reportType,
      reportId,
      rowId,
      data,
      newKey,
      isSuccess
    ) =>
      dispatch(
        actions.updateFieldData(
          apiUrl,
          reportType,
          reportId,
          rowId,
          data,
          newKey,
          isSuccess
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(TableWrapper));
