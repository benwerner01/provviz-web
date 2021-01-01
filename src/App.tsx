import React, { useEffect, useState } from 'react';
import { Visualiser } from 'provviz';
import Box from '@material-ui/core/Box';
import MenuBar, { MENU_BAR_HEIGHT } from './components/MenuBar';
import Editor from './components/Editor';

type Dimensions = {
  width: number;
  height: number;
}

function App() {
  const [document, setDocument] = useState<object | undefined>();
  const [
    visualiserDimensions,
    setVisualiserDimensions] = useState<Dimensions | undefined>();

  const calculateDimensions = () => {
    setVisualiserDimensions({
      width: window.innerWidth / 2,
      height: window.innerHeight - MENU_BAR_HEIGHT,
    });
  };

  useEffect(() => {
    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  }, []);

  return (
    <div className="App">
      <MenuBar setDocument={setDocument} />
      <Box display="flex">
        {document && visualiserDimensions && (
          <>
            <Editor
              document={document}
              width={visualiserDimensions.width}
              height={visualiserDimensions.height}
            />
            <Visualiser
              document={document}
              wasmFolderURL={`${process.env.PUBLIC_URL}wasm`}
              width={visualiserDimensions.width}
              height={visualiserDimensions.height}
            />
          </>
        )}
      </Box>
    </div>
  );
}

export default App;
