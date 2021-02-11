import React, { useContext, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Menu, { MenuItem, SubMenu } from 'rc-menu';
import { ClickAwayListener } from '@material-ui/core';
import './MenuBar.css';
import examples from '../lib/examples';
import { PROVDocument } from '../lib/types';
import LocalDocumentsContext from './context/LocalDocumentsContext';

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
  openDocument: (document: PROVDocument) => void;
  openFileUploadDialog: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ openDocument, openFileUploadDialog }) => {
  const classes = useStyles();
  const openButton = useRef<HTMLButtonElement>(null);
  const { localDocuments } = useContext(LocalDocumentsContext);

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const handleDocumentClick = (document: PROVDocument) => {
    setMenuIsOpen(false);
    openDocument(document);
  };

  return (
    <Box display="flex" alignItems="center" className={classes.wrapper}>
      <h1 className={classes.logo}>ProvViz</h1>
      <Button
        className={classes.button}
        onClick={() => setMenuIsOpen((prev) => !prev)}
        ref={openButton}
      >
        Open
      </Button>
      <Popper
        open={menuIsOpen}
        className={classes.menuPopper}
        placement="bottom-start"
        anchorEl={openButton.current}
      >
        <ClickAwayListener onClickAway={() => setMenuIsOpen(false)}>
          <Menu className={classes.menu}>
            {localDocuments.length > 0 && (
              <SubMenu className={classes.subMenu} title="Recent">
                {localDocuments.map((document) => (
                  <MenuItem
                    key={document.name}
                    className={classes.menuItem}
                    onClick={() => handleDocumentClick(document)}
                  >
                    {document.name}
                  </MenuItem>
                ))}
              </SubMenu>
            )}
            <SubMenu className={classes.subMenu} title="Examples">
              {examples.map((document) => (
                <MenuItem
                  key={document.name}
                  className={classes.menuItem}
                  onClick={() => handleDocumentClick({
                    ...document, name: `My ${document.name}`, updatedAt: new Date(),
                  })}
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
