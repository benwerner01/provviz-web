import React, { useCallback, useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import debounce from 'lodash.debounce';
import PROVJSONSchema from '../lib/PROVJSONSchema';
import { PROVDocument } from '../lib/types';

type EditorProps = {
  document: PROVDocument;
  onChange: (serialized: object) => void;
  width: number;
  height: number;
}

const mapPROVDocumentToMonacoValue = ({ serialized }: PROVDocument) => JSON.stringify(serialized, null, '\t');

const Editor: React.FC<EditorProps> = ({
  width, height, document, onChange,
}) => {
  const [value, setValue] = useState<string>(mapPROVDocumentToMonacoValue(document));

  useEffect(() => {
    setValue(mapPROVDocumentToMonacoValue(document));
  }, [document]);

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

  const handleChange = (newValue: string) => {
    debouncedUpdateDocument(newValue);
    setValue(newValue);
  };

  return (
    <MonacoEditor
      width={width}
      height={height}
      options={{
        fontSize: 16,
      }}
      language="json"
      value={value}
      onChange={handleChange}
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
  );
};

export default Editor;
