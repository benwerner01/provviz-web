import React, { useEffect, useRef, useState } from 'react';
import Visualiser, { MIN_WIDTH, VisualisationSettings } from 'provviz';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { useHistory, useParams } from 'react-router-dom';
import slugify from 'slugify';
import MenuBar, { Layout, MENU_BAR_HEIGHT } from './components/MenuBar';
import Editor from './components/Editor';
import FileUploadDialog from './components/FileUploadDialog';
import { PROVDocument } from './lib/types';
import LocalDocumentsContext, { getLocalStorageDocuments, setLocalStorageDocuments } from './components/context/LocalDocumentsContext';
import NoCurrentDocument from './components/NoCurrentDocument';
import DocumentExportDialog from './components/DocumentExportDialog';

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

const App = () => {
  const history = useHistory();
  const classes = useStyles();
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const { slug } = useParams<{ slug?: string }>();

  const [localDocuments, setLocalDocuments] = useState<PROVDocument[]>(getLocalStorageDocuments());
  const [openDocuments, setOpenDocuments] = useState<PROVDocument[]>([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState<number>(-1);

  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState<boolean>(false);
  const [documentExportDialogOpen, setDocumentExportDialogOpen] = useState<boolean>(false);

  const [layout, setLayout] = useState<Layout>({ code: true, visualisation: true });
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

  const currentDocument = currentDocumentIndex < 0
    ? undefined
    : openDocuments[currentDocumentIndex];

  const setLocalDocument = (document: PROVDocument) => {
    const i = localDocuments.findIndex(({ name }) => name === document.name);
    setLocalDocuments(i === -1
      ? [...localDocuments, document]
      : [
        ...localDocuments.slice(0, i),
        document,
        ...localDocuments.slice(i + 1, localDocuments.length),
      ]);
  };

  const openDocument = (newDocument: PROVDocument) => {
    setLocalDocument(newDocument);
    const existingIndex = openDocuments.findIndex(({ name }) => name === newDocument.name);
    if (existingIndex !== -1) {
      setCurrentDocumentIndex(existingIndex);
    } else {
      setOpenDocuments((documents) => [...documents, newDocument]);
      setCurrentDocumentIndex(openDocuments.length);
    }
  };

  useEffect(() => {
    if (slug) {
      if (currentDocument) {
        if (slugify(currentDocument.name) === slug) return;
        const openDocumentsIndex = openDocuments.findIndex(({ name }) => slugify(name) === slug);
        if (openDocumentsIndex !== -1) {
          setCurrentDocumentIndex(openDocumentsIndex);
          return;
        }
      }
      const localDocumentsIndex = localDocuments
        .findIndex(({ name }) => slugify(name) === slug);
      if (localDocumentsIndex !== -1) {
        openDocument(localDocuments[localDocumentsIndex]);
        return;
      }
      history.replace('/');
    } else if (currentDocument) history.replace(`/${slugify(currentDocument.name)}`);
  }, [slug]);

  useEffect(() => {
    history.replace(currentDocumentIndex === -1
      ? '/'
      : `/${slugify(openDocuments[currentDocumentIndex].name)}`);
  }, [openDocuments, currentDocumentIndex]);

  useEffect(() => {
    setLocalStorageDocuments(localDocuments);
  }, [localDocuments]);

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
      const updatedOffset = contentWrapperDimension.width - clientX;
      if (
        updatedOffset > MIN_WIDTH
        && contentWrapperDimension.width - updatedOffset > MIN_WIDTH) setOffset(updatedOffset);
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

  const handleDocumentChange = (index: number) => (updatedDocument: PROVDocument) => {
    setOpenDocuments((documents) => [
      ...documents.slice(0, index),
      updatedDocument,
      ...documents.slice(index + 1, documents.length),
    ]);
    setLocalDocument(updatedDocument);
  };

  const handleDocumentVisualisationSettingsChange = (index: number) => (
    visualisationSettings: VisualisationSettings,
  ) => {
    const updatedDocument: PROVDocument = { ...openDocuments[index], visualisationSettings };
    setOpenDocuments((documents) => [
      ...documents.slice(0, index),
      updatedDocument,
      ...documents.slice(index + 1, documents.length),
    ]);
    setLocalDocument(updatedDocument);
  };

  return (
    <LocalDocumentsContext.Provider
      value={{ localDocuments, setLocalDocuments, setLocalDocument }}
    >
      <FileUploadDialog
        open={fileUploadDialogOpen}
        onClose={() => setFileUploadDialogOpen(false)}
        addDocument={openDocument}
      />
      {currentDocument && (
      <DocumentExportDialog
        open={documentExportDialogOpen}
        document={currentDocument}
        onClose={() => setDocumentExportDialogOpen(false)}
      />
      )}
      <MenuBar
        layout={layout}
        openDocuments={openDocuments}
        setLayout={setLayout}
        openDocument={openDocument}
        openFileUploadDialog={() => setFileUploadDialogOpen(true)}
        exportDocument={() => setDocumentExportDialogOpen(true)}
      />
      <div ref={contentWrapperRef} className={classes.contentWrapper}>
        {!currentDocument && <NoCurrentDocument addDocument={openDocument} />}
        {contentWrapperDimension && offset && currentDocument && (
        <>
          {layout.code && (
          <Editor
            openDocuments={openDocuments}
            setOpenDocuments={setOpenDocuments}
            currentDocumentIndex={currentDocumentIndex}
            onChange={handleDocumentChange(currentDocumentIndex)}
            setCurrentDocumentIndex={setCurrentDocumentIndex}
            width={layout.visualisation
              ? contentWrapperDimension.width - offset
              : contentWrapperDimension.width}
            height={contentWrapperDimension.height}
          />
          )}
          {layout.code && layout.visualisation && (
          <Box
            onMouseDown={handleDraggableMouseDown}
            className={classes.draggable}
          >
            <DragHandleIcon />
          </Box>
          )}
          {layout.visualisation && (
          <Visualiser
            key={currentDocument.name}
            documentName={currentDocument.name}
            document={currentDocument.serialized}
            onChange={(serialized) => handleDocumentChange(currentDocumentIndex)({
              ...currentDocument,
              serialized,
            })}
            initialSettings={currentDocument.visualisationSettings}
            onSettingsChange={handleDocumentVisualisationSettingsChange(currentDocumentIndex)}
            wasmFolderURL={`${process.env.PUBLIC_URL}wasm`}
            width={layout.code ? offset : contentWrapperDimension.width}
            height={contentWrapperDimension.height}
          />
          )}
        </>
        )}
      </div>
    </LocalDocumentsContext.Provider>
  );
};

export default App;
