import React, { useEffect, useRef, useState } from 'react';
import Visualiser, { MIN_WIDTH as MIN_VISUALISER_WIDTH, VisualisationSettings } from 'provviz';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { useHistory, useParams } from 'react-router-dom';
import slugify from 'slugify';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import MenuBar, { Layout, MENU_BAR_HEIGHT } from './components/MenuBar';
import Editor from './components/Editor';
import FileUploadDialog from './components/FileUploadDialog';
import { PROVDocument } from './lib/types';
import LocalDocumentsContext, { getLocalStorageDocuments, setLocalStorageDocuments } from './components/context/LocalDocumentsContext';
import NoCurrentDocument from './components/NoCurrentDocument';
import DocumentExportDialog from './components/DocumentExportDialog';
import { translateSerializedToFile } from './lib/openProvenanceAPI';
import Tabs, { TABS_HEIGHT } from './components/Tabs';

// Global Constants
export const MIN_CODE_WIDTH = 320;
export { MIN_WIDTH as MIN_VISUALISER_WIDTH } from 'provviz';

// Local Constants
const DRAGGABLE_WIDTH = 12;
const DEFAULT_OFFSET_RATIO = 0.5;

export type Dimension = {
  width: number;
  height: number;
}

const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    position: 'relative',
    display: 'flex',
    height: `calc(100% - ${MENU_BAR_HEIGHT}px - ${TABS_HEIGHT + 1}px)`,
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
    '& svg': {
      position: 'relative',
      transform: 'rotate(90deg)',
      left: -1 * (DRAGGABLE_WIDTH / 2),
    },
  },
  errorMessageWrapper: {
    backgroundColor: '#dc3545',
    color: theme.palette.common.white,
    '& svg': {
      color: theme.palette.common.white,
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

  const [loading, setLoading] = useState<boolean>(false);
  const [savingError, setSavingError] = useState<boolean>(false);
  const [layout, setLayout] = useState<Layout>({
    code: false,
    visualisation: true,
  });
  const [draggingOffset, setDraggingOffset] = useState<boolean>(false);
  const [offsetRatio, setOffsetRatio] = useState<number | undefined>();
  const [
    contentWrapperDimension,
    setContentWrapperDimension] = useState<Dimension | undefined>();
  const [errorMessage, setErrorMessage] = useState<React.ReactNode | undefined>();

  const calculateDimensions = () => {
    if (contentWrapperRef.current) {
      const { width, height } = contentWrapperRef.current.getBoundingClientRect();
      setContentWrapperDimension({ width, height });
      if (offsetRatio) {
        if (layout.code && layout.visualisation) {
          const codeWidth = width * offsetRatio;
          if (codeWidth < MIN_CODE_WIDTH) setLayout({ code: false, visualisation: true });
          const visualisationWidth = width - codeWidth;
          if (visualisationWidth < MIN_VISUALISER_WIDTH) {
            setLayout({ code: true, visualisation: false });
          }
        }
      } else {
        if (width * DEFAULT_OFFSET_RATIO > MIN_CODE_WIDTH) {
          setLayout({ code: true, visualisation: true });
        }
        setOffsetRatio(DEFAULT_OFFSET_RATIO);
      }
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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 's' && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      setDocumentExportDialogOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

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
  }, [currentDocument]);

  const handlePointerUp = () => {
    if (draggingOffset) setDraggingOffset(false);
  };

  const handlePointerMove = ({ clientX }: PointerEvent) => {
    if (contentWrapperDimension && draggingOffset) {
      const { width } = contentWrapperDimension;
      const updatedOffsetRatio = clientX / width;
      const codeWidth = width * updatedOffsetRatio;
      const visualisationWidth = width - codeWidth;
      if (codeWidth < MIN_CODE_WIDTH) {
        setLayout({ code: false, visualisation: true });
      } else if (visualisationWidth < MIN_VISUALISER_WIDTH) {
        setLayout({ code: true, visualisation: false });
      } else {
        if (!layout.code || !layout.visualisation) setLayout({ code: true, visualisation: true });
        setOffsetRatio(updatedOffsetRatio);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('resize', calculateDimensions);
    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [offsetRatio, layout]);

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', calculateDimensions);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [draggingOffset, layout]);

  const handleDraggableMouseDown = () => {
    if (!contentWrapperDimension || !offsetRatio) return;
    const potentialCodeWidth = contentWrapperDimension.width * offsetRatio;
    const potentialVisualisationWidth = contentWrapperDimension.width - potentialCodeWidth;
    if (layout.code && !layout.visualisation) {
      setLayout({
        code: potentialCodeWidth > MIN_CODE_WIDTH,
        visualisation: true,
      });
    } else if (!layout.code && layout.visualisation) {
      setLayout({
        code: true,
        visualisation: potentialVisualisationWidth > MIN_VISUALISER_WIDTH,
      });
    } else {
      setDraggingOffset(true);
    }
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

  const handleVisualiserChange = (index: number) => (serialized: object) => {
    const { type } = openDocuments[index];
    setOpenDocuments((documents) => [
      ...documents.slice(0, index),
      { ...openDocuments[index], serialized },
      ...documents.slice(index + 1, documents.length),
    ]);
    translateSerializedToFile(serialized, type).then((fileContent) => {
      const updatedDocument: PROVDocument = {
        ...openDocuments[index],
        serialized,
        fileContent: fileContent || openDocuments[index].fileContent,
      };
      setOpenDocuments((documents) => [
        ...documents.slice(0, index),
        updatedDocument,
        ...documents.slice(index + 1, documents.length),
      ]);
      setLocalDocument(updatedDocument);
    });
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
        contentWrapperDimension={contentWrapperDimension}
        currentDocument={currentDocument}
        layout={layout}
        setLoading={setLoading}
        setLayout={setLayout}
        onOpenDocumentChange={handleDocumentChange(currentDocumentIndex)}
        setErrorMessage={setErrorMessage}
        openDocuments={openDocuments}
        openDocument={openDocument}
        openFileUploadDialog={() => setFileUploadDialogOpen(true)}
        exportDocument={() => setDocumentExportDialogOpen(true)}
      />
      {!currentDocument && <NoCurrentDocument />}
      {currentDocument && (
        <>
          <Tabs
            loading={loading}
            savingError={savingError}
            openDocuments={openDocuments}
            setOpenDocuments={setOpenDocuments}
            currentDocumentIndex={currentDocumentIndex}
            setCurrentDocumentIndex={setCurrentDocumentIndex}
            setErrorMessage={setErrorMessage}
          />
          <Collapse in={errorMessage !== undefined}>
            <Box
              className={classes.errorMessageWrapper}
              px={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {typeof errorMessage === 'string'
                ? <Typography>{errorMessage}</Typography>
                : errorMessage}
              <IconButton onClick={() => setErrorMessage(undefined)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Collapse>
          <div ref={contentWrapperRef} className={classes.contentWrapper}>
            {contentWrapperDimension && offsetRatio && (
              <>
                {layout.code && (
                <Editor
                  currentDocument={currentDocument}
                  setLoading={setLoading}
                  setSavingError={setSavingError}
                  onChange={handleDocumentChange(currentDocumentIndex)}
                  width={layout.visualisation
                    ? contentWrapperDimension.width * offsetRatio - DRAGGABLE_WIDTH * 0.5
                    : contentWrapperDimension.width - DRAGGABLE_WIDTH}
                  height={contentWrapperDimension.height}
                />
                )}
                <Box
                  style={{ cursor: (layout.code && layout.visualisation) ? 'col-resize' : 'pointer' }}
                  onMouseDown={handleDraggableMouseDown}
                  className={classes.draggable}
                >
                  {layout.code && layout.visualisation
                    ? <DragHandleIcon />
                    : (
                      <ArrowBackIosIcon style={{
                        transform: `rotate(${layout.code ? 0 : 180}deg)`,
                        left: layout.visualisation ? -1 * (DRAGGABLE_WIDTH / 1.5) : 0,
                        fontSize: 20,
                      }}
                      />
                    ) }
                </Box>
                {layout.visualisation && (
                <Visualiser
                  key={currentDocument.name}
                  documentName={currentDocument.name}
                  document={currentDocument.serialized}
                  onChange={handleVisualiserChange(currentDocumentIndex)}
                  initialSettings={currentDocument.visualisationSettings}
                  onSettingsChange={handleDocumentVisualisationSettingsChange(currentDocumentIndex)}
                  wasmFolderURL={`${process.env.PUBLIC_URL}wasm`}
                  width={layout.code
                    ? (
                      contentWrapperDimension.width
                        - (contentWrapperDimension.width * offsetRatio)
                        - DRAGGABLE_WIDTH * 0.5
                    )
                    : contentWrapperDimension.width - DRAGGABLE_WIDTH}
                  height={contentWrapperDimension.height}
                />
                )}
              </>
            )}
          </div>
        </>
      )}
    </LocalDocumentsContext.Provider>
  );
};

export default App;
