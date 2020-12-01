import React, { useEffect, useState } from 'react';
import { Visualiser } from 'provviz';
import examples from './lib/examples';

type Dimensions = {
  width: number;
  height: number;
}

function App() {
  const [
    visualiserDimensions,
    setVisualiserDimensions] = useState<Dimensions | undefined>();

  const calculateDimensions = () => {
    setVisualiserDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
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
      {visualiserDimensions && (
        <Visualiser
          document={examples[0].document}
          wasmFolderURL={`${process.env.PUBLIC_URL}wasm`}
          width={visualiserDimensions.width}
          height={visualiserDimensions.height}
        />
      )}
    </div>
  );
}

export default App;
