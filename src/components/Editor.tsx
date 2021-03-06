import React, {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import MonacoEditor, { EditorWillMount, monaco } from 'react-monaco-editor';
import debounce from 'lodash.debounce';
import PROVJSONSchema from '../lib/PROVJSONSchema';
import { PROVDocument, PROVFileType } from '../lib/types';
import CUSTOM_MONACO_LANGAUGES from '../lib/customMonacoLanguages';
import { translateToPROVJSON } from '../lib/openProvenanceAPI';

type EditorProps = {
  currentDocument: PROVDocument;
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

const Editor: React.FC<EditorProps> = ({
  width,
  height,
  currentDocument,
  setLoading,
  setSavingError,
  onChange,
}) => {
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
    if (editor) {
      const currentState = editor.saveViewState();
      if (currentState) setViewStates((prev) => prev.set(prevDocumentName, currentState));
      setPrevDocumentName(currentDocument.name);
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
  );
};

export default Editor;
