import React from "react";

import * as actions from "../../store/actions";

import { connect } from "react-redux";

import NewRecordFormDialog from "@selfservicetable/newrecord/src/App";
const NewRecordDialog = (props) => {
  return <NewRecordFormDialog {...props} />;
};
const mapStateToProps = (state) => {
  return {
    tableHeader: state.table.tableHeader,
    reportId: state.table.currentReportId,
    apiUrl: state.table.apiAddress,
    reportType: state.table.reportType,
    bearerToken: state.table.bearerToken,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: (
      apiUrl,
      reportType,
      reportId,
      rowId,
      data,
      type,
      newKey,
      isSuccess,
      forcedUpdate
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
          isSuccess,
          forcedUpdate
        )
      ),
    addTableContent: (apiUrl, reportType, reportId, data, isSuccess) =>
      dispatch(
        actions.addTableContent(apiUrl, reportType, reportId, data, isSuccess)
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(NewRecordDialog));
