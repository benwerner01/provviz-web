import React, { useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Menu, { MenuItem, SubMenu } from 'rc-menu';
import 'rc-menu/assets/index.css';
import { ClickAwayListener } from '@material-ui/core';
import examples from '../lib/examples';
import { PROVDocument } from '../lib/types';

export const MENU_BAR_HEIGHT = 36;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: MENU_BAR_HEIGHT,
    padding: theme.spacing(0, 2),
    backgroundColor: theme.palette.primary.dark,
  },
  logo: {
    margin: theme.spacing(0, 2, 0, 0),
    fontSize: 24,
    fontWeight: 800,
    color: theme.palette.common.white,
  },
  button: {
    borderRadius: 0,
    fontWeight: 800,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  menuPopper: {
    width: 300,
  },
  menu: {
    marginTop: 0,
    padding: 0,
    backgroundColor: theme.palette.common.white,
  },
  subMenu: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  menuItem: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

type MenuBarProps = {
  addDocument: (document: PROVDocument) => void;
  openFileUploadDialog: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ addDocument, openFileUploadDialog }) => {
  const classes = useStyles();
  const openButton = useRef<HTMLButtonElement>(null);

  const [openMenuIsOpen, setOpenMenuIsOpen] = useState<boolean>(false);

  return (
    <Box display="flex" alignItems="center" className={classes.wrapper}>
      <h1 className={classes.logo}>ProvViz</h1>
      <Button
        className={classes.button}
        onClick={() => setOpenMenuIsOpen(!openMenuIsOpen)}
        ref={openButton}
      >
        Open
      </Button>
      <Popper
        open={openMenuIsOpen}
        className={classes.menuPopper}
        placement="bottom-start"
        anchorEl={openButton.current}
      >
        <ClickAwayListener onClickAway={() => setOpenMenuIsOpen(false)}>
          <Menu className={classes.menu}>
            <SubMenu className={classes.subMenu} title="Examples">
              {examples.map((document, i) => (
                <MenuItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className={classes.menuItem}
                  onClick={() => addDocument(document)}
                >
                  {document.name}
                </MenuItem>
              ))}
            </SubMenu>
            <MenuItem
              className={classes.menuItem}
              onClick={() => openFileUploadDialog()}
            >
              Upload
            </MenuItem>
          </Menu>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default MenuBar;
