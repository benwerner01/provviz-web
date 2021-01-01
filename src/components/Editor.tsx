import React, { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import PROVJSONSchema from '../lib/PROVJSONSchema';

type EditorProps = {
  document: object;
  width: number;
  height: number;
}

const Editor: React.FC<EditorProps> = ({ width, height, document }) => {
  const [value, setValue] = useState<string>(
    JSON.stringify(document, null, '\t'),
  );

  useEffect(() => {
    setValue(JSON.stringify(document, null, '\t'));
  }, [document]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <MonacoEditor
      width={width}
      height={height}
      language="json"
      value={value}
      onChange={handleChange}
      // editorWillMount={({ languages }) => {
      //   languages.json.jsonDefaults.setDiagnosticsOptions({
      //     validate: true,
      //     schemas: [{
      //       uri: 'http://provenance.ecs.soton.ac.uk/prov-json/schema#',
      //       fileMatch: ['*'],
      //       schema: PROVJSONSchema,
      //     }],
      //   });
      // }}
    />
  );
};

export default Editor;
