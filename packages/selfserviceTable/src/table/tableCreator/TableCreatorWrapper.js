import React from "react";
import TableCreator from "./TableCreator";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
const TableWrapper = (props) => {
  return <TableCreator {...props} />;
};
const mapStateToProps = (state) => {
  return {
    tableData: state.tableData,
    tableHeader: state.tableHeader,
    serverError: state.serverError,
    fetchNewDataTrigger: state.fetchData,
    tableHeaderPending: state.tableHeaderPending,
    tableDataPending: state.tableDataPending,
    totalReportItems: state.totalReportItems,
    freezedColumnKeys: state.freezedColumnKeys,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTableHeader: (apiUrl, reportId) =>
      dispatch(actions.getTableHeader(apiUrl, reportId)),
    fetchTableData: (apiUrl, reportId, params, isNewData) =>
      dispatch(actions.getTableData(apiUrl, reportId, params, isNewData)),
    removeError: () => dispatch(actions.removeError()),
    clearTableData: () => dispatch(actions.clearTableData()),
    updateApiUrl: (apiAddress) => dispatch(actions.updateApiUrl(apiAddress)),
    updateCurrentReportId: (currentReportId) =>
      dispatch(actions.updateCurrentReportId(currentReportId)),
    deleteTableContent: (apiUrl, reportId, rowId) =>
      dispatch(actions.deleteTableContent(apiUrl, reportId, rowId)),
    uploadFile: (apiUrl, reportId, rowId, data, type, newKey, isSuccess) =>
      dispatch(
        actions.uploadFile(
          apiUrl,
          reportId,
          rowId,
          data,
          type,
          newKey,
          isSuccess
        )
      ),
    updateQueryParams: (data) => dispatch(actions.updateQueryParams(data)),
    updateFieldData: (apiUrl, reportId, rowId, data, newKey, isSuccess) =>
      dispatch(
        actions.updateFieldData(
          apiUrl,
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
