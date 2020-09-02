import { withStyles } from "@material-ui/core/styles";

import Tooltip from "@material-ui/core/Tooltip";
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#dc3545",
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    margin: "0px!important",
    maxWidth: "400px",
  },

  arrow: {
    left: "3px!important",
    marginTop: "-0.60em",
    "&::before": {
      backgroundColor: "#dc3545",
    },
  },
}))(Tooltip);
export default LightTooltip;
