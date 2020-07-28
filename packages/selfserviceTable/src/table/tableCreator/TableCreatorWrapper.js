import React from "react";
import TableCreator from "./TableCreator";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
const TableWrapper = (props) => {
  return <TableCreator {...props} newDataAllowed={true} />;
};
const mapStateToProps = (state) => {
  return {
    tableData: state.tableData,
    tableHeader: state.tableHeader,
    serverError: state.serverError,

    tableHeaderPending: state.tableHeaderPending,
    tableDataPending: state.tableDataPending,
    totalReportItems: state.totalReportItems,
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
