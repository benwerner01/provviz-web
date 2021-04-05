import React, { ReactNode, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import WarningIcon from '@material-ui/icons/Warning';
import Tooltip from '@material-ui/core/Tooltip';
import { PROVDocument } from '../lib/types';
import { MENU_BAR_HEIGHT } from './MenuBar';

export const TABS_HEIGHT = MENU_BAR_HEIGHT;

const useStyles = makeStyles((theme) => ({
  tabsWrapper: {
    backgroundColor: theme.palette.grey[100],
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[300],
    borderBottomStyle: 'solid',
  },
  tabsRoot: {
    minHeight: TABS_HEIGHT,
    height: TABS_HEIGHT,
    flexGrow: 1,
  },
  tabRoot: {
    minHeight: TABS_HEIGHT,
    height: TABS_HEIGHT,
    minWidth: 'unset',
    textTransform: 'none',
    backgroundColor: 'transparent',
    '&.selected': {
      backgroundColor: theme.palette.common.white,
    },
  },
  tabLabel: {
    maxWidth: 200,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: 14,
  },
  tabIndicator: {
    height: 4,
    backgroundColor: theme.palette.primary.dark,
  },
  tabIconButton: {
    transition: theme.transitions.create('background-color'),
    backgroundColor: 'transparent',
    borderRadius: 12,
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  errorWrapper: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  errorIcon: {
    marginLeft: theme.spacing(1),
    color: '#dc3545',
  },
  errorMessage: {
    fontWeight: 800,
    color: '#dc3545',
  },
  circularPraogress: {
    marginRight: theme.spacing(1),
  },
}));

type TabsMenuBarProps = {
  openDocuments: PROVDocument[];
  setOpenDocuments: (documents: PROVDocument[]) => void;
  setEditingMetadata: React.Dispatch<React.SetStateAction<boolean>>;
  currentDocumentIndex: number;
  setCurrentDocumentIndex: (index: number) => void;
  loading: boolean;
  savingError: boolean;
}

const TabsComponent: React.FC<TabsMenuBarProps> = ({
  openDocuments,
  currentDocumentIndex,
  setOpenDocuments,
  setEditingMetadata,
  setCurrentDocumentIndex,
  loading,
  savingError,
}) => {
  const classes = useStyles();

  const handleTabChange = (_: React.ChangeEvent<{}>, tabIndex: number) => {
    setCurrentDocumentIndex(tabIndex);
  };

  const toggleEditingMetadata = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setEditingMetadata((prev) => !prev);
  };

  const handleCloseTab = (tabIndex: number) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    const updatedOpenDocuments = [
      ...openDocuments.slice(0, tabIndex),
      ...openDocuments.slice(tabIndex + 1),
    ];
    if (updatedOpenDocuments.length === 0) {
      setCurrentDocumentIndex(-1);
    } else if (currentDocumentIndex > (updatedOpenDocuments.length - 1)) {
      setCurrentDocumentIndex(currentDocumentIndex - 1);
    }
    setOpenDocuments(updatedOpenDocuments);
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className={classes.tabsWrapper}
        pr={1}
      >
        <Tabs
          value={currentDocumentIndex}
          onChange={handleTabChange}
          variant="scrollable"
          classes={{ root: classes.tabsRoot, indicator: classes.tabIndicator }}
        >
          {openDocuments.map(({ name }, i) => (
            <Tab
              key={name}
              classes={{ root: [classes.tabRoot, i === currentDocumentIndex ? 'selected' : []].flat().join(' ') }}
              label={(
                <Box display="flex" alignItems="center">
                  <Typography className={classes.tabLabel}>{name}</Typography>
                  <Fade in={i === currentDocumentIndex}>
                    <Box
                      display="flex"
                      alignItems="center"
                      onClick={i === currentDocumentIndex ? toggleEditingMetadata : undefined}
                      className={classes.tabIconButton}
                      ml={1}
                    >
                      <EditIcon fontSize="small" />
                    </Box>
                  </Fade>
                  <Box
                    display="flex"
                    alignItems="center"
                    onClick={handleCloseTab(i)}
                    className={classes.tabIconButton}
                    ml={0.5}
                  >
                    <CloseIcon />
                  </Box>
                </Box>
              )}
            />
          ))}
        </Tabs>
        <Box display="flex" alignItems="center">
          <Fade in={savingError && !loading}>
            <Box display="flex">
              <Tooltip
                arrow
                title={(
                  <Typography>
                    Check the PROV Document is valid
                  </Typography>
                )}
              >
                <Box className={classes.errorWrapper} display="flex" alignItems="center">
                  <Typography className={classes.errorMessage}>Could Not Save</Typography>
                  <WarningIcon className={classes.errorIcon} />
                </Box>
              </Tooltip>
            </Box>
          </Fade>
          <Fade in={loading}>
            <CircularProgress className={classes.circularPraogress} size={25} thickness={5} />
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default TabsComponent;
