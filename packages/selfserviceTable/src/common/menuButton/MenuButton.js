import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuItemRoot: {
    fontSize: "0.7rem",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  menuAbove: {
    zIndex: 10000,
  },
}));

const MenuButton = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const menuItemsList = props.itemList || [];
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const handleOptionSubmit = (id) => {
    if (props.onItemSelected) {
      props.onItemSelected(id);
      setOpen(false);
    }
  };
  return (
    <div className={classes.root}>
      <div style={{ zIndex: 1000 }}>
        {props.children ? (
          <div
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            {props.children}
          </div>
        ) : (
          <Button
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            {props.buttonTitle}
          </Button>
        )}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: "right bottom",
              }}
            >
              <Paper classes={{ root: classes.menuAbove }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow">
                    {menuItemsList.map((el, index) => (
                      <MenuItem
                        classes={{
                          root: classes.menuItemRoot,
                        }}
                        key={index}
                        onClick={() => handleOptionSubmit(el.id)}
                      >
                        {el.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};
export default MenuButton;
