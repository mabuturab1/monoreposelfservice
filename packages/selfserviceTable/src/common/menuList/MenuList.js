import React from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider } from "@material-ui/core";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "& .MuiListItemIcon-root": {
      minWidth: "1.9rem",
    },
    "& .MuiListItemText-root": {
      margin: 0,
    },
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);
const useStyles = makeStyles(() => ({
  body1: {
    lineHeight: 1,
    color: "#4A4A4A",
    fontWeight: 500,
  },
  body1Del: {
    lineHeight: 1,
    color: "#FF6060",
    fontWeight: 500,
  },
  body1Header: {
    fontSize: "1.1rem",
    textTransform: "uppercase",
    lineHeight: 1,
    color: "#D6D6D6",
    fontWeight: 300,
  },
}));
export const StyledMenuList = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const handleClick = (event) => {
    if (props.itemActiveStatus) props.itemActiveStatus(true);
    setAnchorEl(event.currentTarget);
  };
  const getClassOfTypography = (data = "") => {
    switch (data) {
      case "red":
        return classes.body1Del;
      default:
        return classes.body1;
    }
  };
  const handleClose = () => {
    if (props.itemActiveStatus) props.itemActiveStatus(false);
    setAnchorEl(null);
  };
  const handleItemSelect = (i, j, itemClose) => {
    props.itemClicked(i, j);
    if (itemClose) handleClose();
  };
  let items = [];
  if (props.data != null) {
    props.data.forEach((el, i) => {
      items.push(
        <div key={i}>
          <ListItemText
            primaryTypographyProps={{
              classes: {
                body1: classes.body1Header,
              },
            }}
            style={{
              textAlign: "center",

              ...props.headerStyle,
            }}
            primary={el.headerTitle}
          />
          {el.options.map((el1, j) => (
            <StyledMenuItem
              key={i + j}
              onClick={() => handleItemSelect(i, j, el1.closeRequired)}
            >
              <ListItemIcon>{el1.icon}</ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  classes: {
                    body1: getClassOfTypography(el1.type),
                  },
                }}
                primary={el1.text}
              />
            </StyledMenuItem>
          ))}
          {i < props.data.length - 1 ? (
            <div style={{ margin: "0.6rem 0px 1rem 0px" }}>
              <Divider />
            </div>
          ) : null}
        </div>
      );
    });
  }

  return (
    <div>
      <div onClick={handleClick}>{props.trigger}</div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {items}
      </StyledMenu>
    </div>
  );
};
export default StyledMenuList;
StyledMenuList.propTypes = {
  data: PropTypes.array,
};
