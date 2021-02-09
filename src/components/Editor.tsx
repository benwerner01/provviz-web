import React, { useCallback, useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import debounce from 'lodash.debounce';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PROVJSONSchema from '../lib/PROVJSONSchema';
import { PROVDocument } from '../lib/types';

type EditorProps = {
  openDocuments: PROVDocument[];
  currentDocumentIndex: number;
  setCurrentDocumentIndex: (index: number) => void;
  onChange: (serialized: object) => void;
  width: number;
  height: number;
}

const mapPROVDocumentToMonacoValue = ({ serialized }: PROVDocument) => JSON.stringify(serialized, null, '\t');

const Editor: React.FC<EditorProps> = ({
  width, height, openDocuments, currentDocumentIndex, setCurrentDocumentIndex, onChange,
}) => {
  const currentDocument = openDocuments[currentDocumentIndex];

  const [value, setValue] = useState<string>(
    mapPROVDocumentToMonacoValue(currentDocument),
  );

  useEffect(() => {
    setValue(mapPROVDocumentToMonacoValue(currentDocument));
  }, [currentDocument.name]);

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

  const handleTabChange = (_: React.ChangeEvent<{}>, newIndex: number) => {
    setCurrentDocumentIndex(newIndex);
  };

  return (
    <Box>
      <Tabs value={currentDocumentIndex} onChange={handleTabChange} variant="scrollable">
        {openDocuments.map(({ name }) => (
          <Tab key={name} label={name} />
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
      />
    </Box>
  );
};

export default Editor;
