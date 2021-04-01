import React, {
  ReactNode, useContext, useRef, useState,
} from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import CodeIcon from '@material-ui/icons/Code';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Menu, { MenuItem, SubMenu } from 'rc-menu';
import DeleteIcon from '@material-ui/icons/Delete';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import './MenuBar.css';
import examples from '../lib/examples';
import { PROVDocument, PROVFileType } from '../lib/types';
import LocalDocumentsContext from './context/LocalDocumentsContext';
import { translateSerializedToFile } from '../lib/openProvenanceAPI';
import PROVFileTypeSelect from './Select/PROVFileTypeSelect';
import { Dimension, MIN_CODE_WIDTH, MIN_VISUALISER_WIDTH } from '../PROVDocumentEditor';

export const MENU_BAR_HEIGHT = 36;

export type Layout = {
  code: boolean;
  visualisation: boolean;
}

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
  buttonGroupButton: {
    padding: theme.spacing(0, 1.5),
    borderColor: `${theme.palette.primary.dark} !important`,
    backgroundColor: theme.palette.grey[100],
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
    '&.selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
    },
  },
  buttonGroup: {
    marginLeft: theme.spacing(1),
  },
  errorButton: {
    color: '#dc3545',
    backgroundColor: theme.palette.common.white,
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
  deleteIconButton: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(0.5),
    '& svg': {
      color: theme.palette.common.white,
    },
  },
}));

type MenuBarProps = {
  contentWrapperDimension?: Dimension;
  currentDocument?: PROVDocument;
  layout: Layout
  openDocuments: PROVDocument[];
  setLoading: (loading: boolean) => void;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  exportDocument: () => void;
  openDocument: (document: PROVDocument) => void;
  deleteDocument: () => void;
  openFileUploadDialog: () => void;
  openCreateDocumentDialog: () => void;
  generateUniqueDocumentName: (name: string) => string;
  onOpenDocumentChange: (updatedDocument: PROVDocument) => void;
  setErrorMessage: (errorMessage: ReactNode) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  currentDocument,
  layout,
  openDocuments,
  contentWrapperDimension,
  setLoading,
  setLayout,
  exportDocument,
  openDocument,
  deleteDocument,
  openFileUploadDialog,
  openCreateDocumentDialog,
  generateUniqueDocumentName,
  onOpenDocumentChange,
  setErrorMessage,
}) => {
  const classes = useStyles();
  const openButton = useRef<HTMLButtonElement>(null);
  const { localDocuments } = useContext(LocalDocumentsContext);

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const handleDocumentClick = (document: PROVDocument) => {
    setMenuIsOpen(false);
    openDocument(document);
  };

  const handleFileTypeChange = (updatedFileType: PROVFileType) => {
    if (!currentDocument) return;
    setLoading(true);
    translateSerializedToFile(
      currentDocument.serialized, updatedFileType,
    ).then((updatedFileContent) => {
      setLoading(false);
      if (updatedFileContent) {
        onOpenDocumentChange({
          ...currentDocument,
          type: updatedFileType,
          fileContent: updatedFileContent,
        });
      } else {
        setErrorMessage(
          <Box flexGrow={2} display="flex" alignItems="center" justifyContent="space-between">
            <Typography>
              {'Could not translate document from '}
              <strong>{currentDocument.type}</strong>
              {' to '}
              <strong>{updatedFileType}</strong>
            </Typography>
            <Button
              variant="contained"
              className={classes.errorButton}
              onClick={() => {
                setErrorMessage(undefined);
                handleFileTypeChange(updatedFileType);
              }}
            >
              Retry
            </Button>
          </Box>,
        );
      }
    });
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.wrapper}>
      <Box display="flex" alignItems="center">
        <h1 className={classes.logo}>ProvViz</h1>
        <Button
          className={classes.button}
          onClick={() => setMenuIsOpen((prev) => !prev)}
          ref={openButton}
        >
          Open
        </Button>
        <Fade in={openDocuments.length > 0}>
          <Button
            className={classes.button}
            onClick={exportDocument}
          >
            Export
          </Button>
        </Fade>
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
                      ...document, name: generateUniqueDocumentName(`My ${document.name}`), updatedAt: new Date(),
                    })}
                  >
                    {document.name}
                  </MenuItem>
                ))}
              </SubMenu>
              <MenuItem
                className={classes.menuItem}
                onClick={openFileUploadDialog}
              >
                Upload Document
              </MenuItem>
              <MenuItem
                className={classes.menuItem}
                onClick={openCreateDocumentDialog}
              >
                Create Document
              </MenuItem>
            </Menu>
          </ClickAwayListener>
        </Popper>
      </Box>
      <Fade in={currentDocument !== undefined}>
        <Box display="flex" alignItems="center">
          <Tooltip title="Delete Document">
            <IconButton
              className={classes.deleteIconButton}
              onClick={deleteDocument}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Box>
            {currentDocument && (
            <PROVFileTypeSelect
              width={135}
              value={currentDocument.type}
              onChange={handleFileTypeChange}
            />
            )}
          </Box>
          <ButtonGroup className={classes.buttonGroup} variant="contained">
            <Button
              className={layout.code
                ? ['selected', classes.buttonGroupButton].join(' ')
                : classes.buttonGroupButton}
              onClick={() => setLayout((prev) => ({
                code: !prev.code,
                visualisation: prev.code
                  ? true
                  : (
                    contentWrapperDimension
                  && contentWrapperDimension.width - MIN_CODE_WIDTH < MIN_VISUALISER_WIDTH)
                    ? false
                    : prev.visualisation,
              }))}
            >
              <CodeIcon />
            </Button>
            <Button
              className={layout.visualisation
                ? ['selected', classes.buttonGroupButton].join(' ')
                : classes.buttonGroupButton}
              onClick={() => setLayout((prev) => ({
                code: prev.visualisation
                  ? true
                  : (
                    contentWrapperDimension
                  && contentWrapperDimension.width - MIN_VISUALISER_WIDTH < MIN_CODE_WIDTH)
                    ? false
                    : prev.code,
                visualisation: !prev.visualisation,
              }))}
            >
              <VisibilityIcon />
            </Button>
          </ButtonGroup>
        </Box>
      </Fade>
    </Box>
  );
};

export default MenuBar;
