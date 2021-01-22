import React, { useEffect, useRef, useState } from 'react';
import { Visualiser } from 'provviz';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import MenuBar, { MENU_BAR_HEIGHT } from './components/MenuBar';
import Editor from './components/Editor';
import FileUploadDialog from './components/FileUploadDialog';
import { PROVDocument } from './lib/types';

const DRAGGABLE_WIDTH = 12;

type Dimension = {
  width: number;
  height: number;
}

const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    position: 'relative',
    display: 'flex',
    height: `calc(100% - ${MENU_BAR_HEIGHT}px)`,
    overflow: 'hidden',
  },
  draggable: {
    display: 'flex',
    alignItems: 'center',
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    height: '100%',
    width: DRAGGABLE_WIDTH,
    '&:hover': {
      cursor: 'col-resize',
    },
    '& svg': {
      position: 'relative',
      transform: 'rotate(90deg)',
      left: -1 * (DRAGGABLE_WIDTH / 2),
    },
  },
}));

function App() {
  const classes = useStyles();
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const [openDocuments, setOpenDocuments] = useState<PROVDocument[]>([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState<number>(-1);

  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState<boolean>(false);

  const [draggingOffset, setDraggingOffset] = useState<boolean>(false);
  const [offset, setOffset] = useState<number | undefined>();
  const [
    contentWrapperDimension,
    setContentWrapperDimension] = useState<Dimension | undefined>();

  const calculateDimensions = () => {
    if (contentWrapperRef.current) {
      const { width, height } = contentWrapperRef.current.getBoundingClientRect();
      setContentWrapperDimension({ width, height });
      if (!offset) setOffset(width / 2);
    }
  };

  useEffect(() => {
    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  }, []);

  const handleMouseUp = () => {
    if (draggingOffset) setDraggingOffset(false);
  };

  const handlePointerMove = ({ clientX }: PointerEvent) => {
    if (contentWrapperDimension && draggingOffset) {
      setOffset(contentWrapperDimension.width - clientX);
    }
  };

  useEffect(() => {
    window.addEventListener('pointerup', handleMouseUp);
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointerup', handleMouseUp);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  });

  const handleDraggableMouseDown = () => {
    setDraggingOffset(true);
  };

  const handleDocumentChange = (index: number) => (serialized: object) => {
    setOpenDocuments((documents) => [
      ...documents.slice(0, index),
      { ...documents[index], serialized },
      ...documents.slice(index + 1, documents.length),
    ]);
  };

  const handleNewDocument = (newDocument: PROVDocument) => {
    setOpenDocuments((documents) => [...documents, newDocument]);
    setCurrentDocumentIndex(openDocuments.length);
  };

  const currentDocument = currentDocumentIndex < 0
    ? undefined
    : openDocuments[currentDocumentIndex];

  return (
    <>
      <FileUploadDialog
        open={fileUploadDialogOpen}
        onClose={() => setFileUploadDialogOpen(!fileUploadDialogOpen)}
        addDocument={handleNewDocument}
      />
      <MenuBar
        addDocument={handleNewDocument}
        openFileUploadDialog={() => setFileUploadDialogOpen(true)}
      />
      <div ref={contentWrapperRef} className={classes.contentWrapper}>
        {contentWrapperDimension && offset && currentDocument && (
          <>
            <Editor
              document={currentDocument}
              onChange={handleDocumentChange(currentDocumentIndex)}
              width={contentWrapperDimension.width - offset}
              height={contentWrapperDimension.height}
            />
            <Box
              onMouseDown={handleDraggableMouseDown}
              className={classes.draggable}
            >
              <DragHandleIcon />
            </Box>
            <Visualiser
              key={currentDocument.name}
              document={currentDocument.serialized}
              onChange={handleDocumentChange(currentDocumentIndex)}
              wasmFolderURL={`${process.env.PUBLIC_URL}wasm`}
              width={offset}
              height={contentWrapperDimension.height}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;
