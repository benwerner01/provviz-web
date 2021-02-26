import React, {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import debounce from 'lodash.debounce';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import PROVJSONSchema from '../lib/PROVJSONSchema';
import { PROVDocument } from '../lib/types';

const useStyles = makeStyles((theme) => ({
  tabsRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey[100],
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[300],
    borderBottomStyle: 'solid',
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
}));

type EditorProps = {
  openDocuments: PROVDocument[];
  setOpenDocuments: (documents: PROVDocument[]) => void;
  currentDocumentIndex: number;
  setCurrentDocumentIndex: (index: number) => void;
  onChange: (serialized: object) => void;
  width: number;
  height: number;
}

const mapPROVDocumentToMonacoValue = ({ serialized }: PROVDocument) => JSON.stringify(serialized, null, '\t');

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
  const [value, setValue] = useState<string>(
    mapPROVDocumentToMonacoValue(currentDocument),
  );

  useLayoutEffect(() => {
    if (editor) {
      const prevViewState = viewStates.get(currentDocument.name);
      if (prevViewState) editor.restoreViewState(prevViewState);
    }
  }, [currentDocument.name]);

  useEffect(() => {
    setValue(mapPROVDocumentToMonacoValue(currentDocument));
  }, [currentDocument]);

  const debouncedUpdateDocument = useCallback(debounce((updatedValue: string) => {
    let serialized: object | undefined;
    try {
      serialized = JSON.parse(updatedValue);
    } catch (e) {
      return;
    } finally {
      if (serialized) onChange(serialized);
    }
  }, 200), []);

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

  return (
    <Box>
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
      <MonacoEditor
        width={width}
        height={height}
        options={{ fontSize: 16 }}
        language="json"
        value={value}
        onChange={handleMonacoChange}
        editorWillMount={({ languages }) => {
          languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: [{
              uri: 'https://www.w3.org/Submission/2013/SUBM-prov-json-20130424/schema',
              fileMatch: ['*'],
              schema: PROVJSONSchema,
            }],
          });
        }}
        editorDidMount={(mountedEditor) => setEditor(mountedEditor)}
      />
    </Box>
  );
};

export default Editor;
