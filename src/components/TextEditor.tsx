import React, {
  useCallback, useContext, useEffect, useLayoutEffect, useState,
} from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import MonacoEditor, { EditorWillMount, monaco } from 'react-monaco-editor';
import debounce from 'lodash.debounce';
import PROVJSONSchema from '../lib/PROVJSONSchema';
import { PROVDocument, PROVFileType } from '../lib/types';
import CUSTOM_MONACO_LANGAUGES from '../lib/customMonacoLanguages';
import { translateToPROVJSON } from '../lib/openProvenanceAPI';
import LocalDocumentsContext from './context/LocalDocumentsContext';
import DocumentNameTextField from './TextField/DocumentNameTextField';
import useDocumentNameTextField from './TextField/useDocumentNameTextField';

const METADATA_HEIGHT = 0;

const useStyles = makeStyles((theme) => ({
  metadataWrapper: {
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  errorTypography: {
    color: '#dc3545',
  },
}));

export type TextEditorProps = {
  editingMetadata: boolean;
  currentDocument: PROVDocument;
  setEditingMetadata: (editingMetadata: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSavingError: (error: boolean) => void;
  onChange: (updatedDocument: PROVDocument) => void;
  width: number;
  height: number;
}

const mapPROVFileTypeToMonacoLanguage = (type: PROVFileType) => {
  if (type === 'PROV-JSON') return 'json';
  if (type === 'PROV-XML') return 'xml';
  return type;
};

const TextEditor: React.FC<TextEditorProps> = ({
  editingMetadata,
  width,
  height,
  currentDocument,
  setEditingMetadata,
  setLoading,
  setSavingError,
  onChange,
}) => {
  const { localDocuments } = useContext(LocalDocumentsContext);
  const classes = useStyles();

  const documentNameIsUnique = (potentialName: string) => (
    localDocuments.find(({ name }) => name === potentialName) === undefined
    || currentDocument.name === potentialName
  );

  const {
    documentName,
    setDocumentName,
    documentNameIsValid,
  } = useDocumentNameTextField(currentDocument.name, documentNameIsUnique);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | undefined>();
  const [prevDocumentName, setPrevDocumentName] = useState<string>(currentDocument.name);
  const [viewStates, setViewStates] = useState<Map<string, monaco.editor.ICodeEditorViewState>>(
    new Map<string, monaco.editor.ICodeEditorViewState>(),
  );
  const [value, setValue] = useState<string>('');
  const [lastSavedFileContent, setLastSavedFileContent] = useState<string>('');

  useEffect(() => {
    if (lastSavedFileContent !== currentDocument.fileContent) {
      setLastSavedFileContent(currentDocument.fileContent);
      setValue(currentDocument.fileContent);
    }
  }, [currentDocument]);

  useLayoutEffect(() => {
    if (currentDocument.name !== documentName) {
      setDocumentName(currentDocument.name);
      if (editor) {
        const currentState = editor.saveViewState();
        if (currentState) setViewStates((prev) => prev.set(prevDocumentName, currentState));
        setPrevDocumentName(currentDocument.name);
        const prevViewState = viewStates.get(currentDocument.name);
        if (prevViewState) editor.restoreViewState(prevViewState);
      }
    }
  }, [currentDocument.name]);

  const debouncedUpdateDocumentName = useCallback(debounce(async (name: string) => {
    onChange({ ...currentDocument, name, updatedAt: new Date() });
  }, 1000), [currentDocument]);

  useEffect(() => {
    if (currentDocument.name !== documentName && documentNameIsValid) {
      debouncedUpdateDocumentName(documentName);
    }
  }, [documentNameIsValid, documentName]);

  const debouncedUpdateDocumentValue = useCallback(debounce(async (updatedValue: string) => {
    setLoading(true);
    const serialized = await translateToPROVJSON(updatedValue, currentDocument.type);

    if (serialized) {
      setLastSavedFileContent(updatedValue);
      onChange({
        ...currentDocument, serialized, fileContent: updatedValue, updatedAt: new Date(),
      });
      setSavingError(false);
    } else setSavingError(true);

    setLoading(false);
  }, 1000), [currentDocument]);

  const handleMonacoChange = (newValue: string) => {
    debouncedUpdateDocumentValue(newValue);
    setValue(newValue);
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
      <Collapse in={editingMetadata}>
        <Box className={classes.metadataWrapper} p={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box style={{ position: 'relative' }} flexGrow={1}>
            <DocumentNameTextField
              name={documentName}
              style={{ width: 250 }}
              onChange={setDocumentName}
              documentNameIsUnique={documentNameIsUnique}
            />
          </Box>
          <IconButton onClick={(() => setEditingMetadata(false))}><CloseIcon /></IconButton>
        </Box>
      </Collapse>
      <MonacoEditor
        width={width}
        height={height - (editingMetadata ? METADATA_HEIGHT : 0)}
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

export default TextEditor;
