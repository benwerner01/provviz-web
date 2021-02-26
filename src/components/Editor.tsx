import React, {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MonacoEditor, { EditorWillMount, monaco } from 'react-monaco-editor';
import debounce from 'lodash.debounce';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import WarningIcon from '@material-ui/icons/Warning';
import Tooltip from '@material-ui/core/Tooltip';
import PROVJSONSchema from '../lib/PROVJSONSchema';
import { PROVDocument, PROVFileType } from '../lib/types';
import CUSTOM_MONACO_LANGAUGES from '../lib/customMonacoLanguages';
import PROVFileTypeSelect from './Select/PROVFileTypeSelect';
import { translateSerializedToFile, translateToPROVJSON } from '../lib/openProvenanceAPI';

const useStyles = makeStyles((theme) => ({
  tabsWrapper: {
    backgroundColor: theme.palette.grey[100],
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[300],
    borderBottomStyle: 'solid',
  },
  tabsRoot: {
    flexGrow: 1,
  },
  tabRoot: {
    backgroundColor: theme.palette.common.white,
    minWidth: 'unset',
    textTransform: 'none',
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
  errorIcon: {
    color: '#dc3545',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  errorMessageWrapper: {
    backgroundColor: '#dc3545',
    color: theme.palette.common.white,
    '& svg': {
      color: theme.palette.common.white,
    },
  },
  errorButton: {
    color: '#dc3545',
    backgroundColor: theme.palette.common.white,
  },
  circularPraogress: {
    marginRight: theme.spacing(1),
  },
}));

type EditorProps = {
  openDocuments: PROVDocument[];
  setOpenDocuments: (documents: PROVDocument[]) => void;
  currentDocumentIndex: number;
  setCurrentDocumentIndex: (index: number) => void;
  onChange: (updatedDocument: PROVDocument) => void;
  width: number;
  height: number;
}

const mapPROVFileTypeToMonacoLanguage = (type: PROVFileType) => {
  if (type === 'PROV-JSON') return 'json';
  if (type === 'PROV-XML') return 'xml';
  return type;
};

const Editor: React.FC<EditorProps> = ({
  width,
  height,
  openDocuments,
  setOpenDocuments,
  currentDocumentIndex,
  setCurrentDocumentIndex,
  onChange,
}) => {
  const classes = useStyles();

  const currentDocument = openDocuments[currentDocumentIndex];

  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | undefined>();
  const [viewStates, setViewStates] = useState<Map<string, monaco.editor.ICodeEditorViewState>>(
    new Map<string, monaco.editor.ICodeEditorViewState>(),
  );
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [savingError, setSavingError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode | string | undefined>();
  const [lastSavedFileContent, setLastSavedFileContent] = useState<string>('');

  useEffect(() => {
    if (lastSavedFileContent !== currentDocument.fileContent) {
      setLastSavedFileContent(currentDocument.fileContent);
      setValue(currentDocument.fileContent);
    }
  }, [currentDocument]);

  useLayoutEffect(() => {
    if (editor) {
      const prevViewState = viewStates.get(currentDocument.name);
      if (prevViewState) editor.restoreViewState(prevViewState);
    }
  }, [currentDocument.name]);

  const debouncedUpdateDocument = useCallback(debounce(async (updatedValue: string) => {
    setLoading(true);
    const serialized = await translateToPROVJSON(updatedValue, currentDocument.type);

    if (serialized) {
      setLastSavedFileContent(updatedValue);
      onChange({ ...currentDocument, serialized, fileContent: updatedValue });
      setSavingError(false);
    } else setSavingError(true);

    setLoading(false);
  }, 300), [currentDocument]);

  const handleMonacoChange = (newValue: string) => {
    debouncedUpdateDocument(newValue);
    setValue(newValue);
  };

  const handleTabChange = (_: React.ChangeEvent<{}>, tabIndex: number) => {
    const currentState = editor?.saveViewState();
    if (currentState) setViewStates((prev) => prev.set(currentDocument.name, currentState));
    setCurrentDocumentIndex(tabIndex);
  };

  const handleCloseTab = (tabIndex: number) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    const updatedOpenDocuments = [
      ...openDocuments.slice(0, tabIndex),
      ...openDocuments.slice(tabIndex + 1, openDocuments.length),
    ];
    if (updatedOpenDocuments.length === 0) setCurrentDocumentIndex(-1);
    else if (tabIndex > (updatedOpenDocuments.length - 1)) setCurrentDocumentIndex(tabIndex - 1);
    setOpenDocuments(updatedOpenDocuments);
  };

  const handleFileTypeChange = (updatedFileType: PROVFileType) => {
    setLoading(true);
    translateSerializedToFile(
      currentDocument.serialized, updatedFileType,
    ).then((updatedFileContent) => {
      setLoading(false);
      if (updatedFileContent) {
        onChange({
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

  const handleEditorWillMount: EditorWillMount = ({ languages }) => {
    CUSTOM_MONACO_LANGAUGES.forEach(({ id, configuration, language }) => {
      languages.register({ id });
      if (configuration) languages.setLanguageConfiguration(id, configuration);
      if (language) languages.setMonarchTokensProvider(id, language);
    });

    languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [{
        uri: 'https://www.w3.org/Submission/2013/SUBM-prov-json-20130424/schema',
        fileMatch: ['*'],
        schema: PROVJSONSchema,
      }],
    });
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
              classes={{ root: classes.tabRoot }}
              label={(
                <Box display="flex" alignItems="center">
                  <Typography className={classes.tabLabel}>{name}</Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    onClick={handleCloseTab(i)}
                    className={classes.tabIconButton}
                    ml={1}
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
              <Tooltip arrow title={<Typography>Saving Error</Typography>}>
                <WarningIcon className={classes.errorIcon} />
              </Tooltip>
            </Box>
          </Fade>
          <Fade in={loading}>
            <CircularProgress className={classes.circularPraogress} size={25} thickness={5} />
          </Fade>
          <PROVFileTypeSelect
            width={150}
            value={currentDocument.type}
            onChange={handleFileTypeChange}
          />
        </Box>
      </Box>
      <Collapse in={errorMessage !== undefined}>
        <Box
          className={classes.errorMessageWrapper}
          px={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {typeof errorMessage === 'string'
            ? <Typography>{errorMessage}</Typography>
            : errorMessage}
          <IconButton onClick={() => setErrorMessage(undefined)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Collapse>
      <MonacoEditor
        width={width}
        height={height}
        options={{ fontSize: 16 }}
        language={mapPROVFileTypeToMonacoLanguage(currentDocument.type)}
        value={value}
        onChange={handleMonacoChange}
        editorWillMount={handleEditorWillMount}
        editorDidMount={(mountedEditor) => setEditor(mountedEditor)}
      />
    </Box>
  );
};

export default Editor;
