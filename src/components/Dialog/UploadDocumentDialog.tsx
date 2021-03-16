import React, { ChangeEvent, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import DescriptionIcon from '@material-ui/icons/Description';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { translateToPROVJSON } from '../../lib/openProvenanceAPI';
import { PROVDocument, PROVFileType } from '../../lib/types';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    maxWidth: 700,
  },
  dialogContent: {
    position: 'relative',
    marginBottom: theme.spacing(2),
  },
  dialogTitle: {
    paddingBottom: 0,
  },
  dragAndDropBox: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    height: 150,
    borderStyle: 'dashed',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(2),
  },
  dragAndDropBoxFile: {
    width: `calc(50% - ${theme.spacing(4)}px)`,
  },
  dragAndDropBoxDragging: {
    backgroundColor: theme.palette.grey[100],
  },
  buttonWrapper: {
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));

type UploadDocumentDialogProps = {
  open: boolean;
  onClose: () => void;
  addDocument: (document: PROVDocument) => void;
}

const parsePROVFileType = (fileName: string): PROVFileType | undefined => {
  const lowerFileName = fileName.toLowerCase();
  if (lowerFileName.endsWith('.provn')) return 'PROV-N';
  if (lowerFileName.endsWith('.ttl')) return 'Turtle';
  if (lowerFileName.endsWith('.provx')) return 'PROV-XML';
  if (lowerFileName.endsWith('.trig')) return 'TriG';
  if (lowerFileName.endsWith('.json')) return 'PROV-JSON';

  return undefined;
};

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open, onClose, addDocument,
}) => {
  const classes = useStyles();

  const [file, setFile] = useState<File | undefined>();
  const [fileName, setFileName] = useState<string | undefined>();
  const [fileContent, setFileContent] = useState<string | undefined>();
  const [fileType, setFileType] = useState<PROVFileType | undefined>();
  const [serializedFile, setSerializedFile] = useState<object | undefined>();

  const [draggingCounter, setDraggingCounter] = useState<number>(0);

  useEffect(() => {
    if (file && !fileType) {
      const parsedFileType = parsePROVFileType(file.name);

      if (parsedFileType) {
        setFileType(parsedFileType);
      }
    }
    if (file && !fileContent) {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = ({ target }: ProgressEvent<FileReader>) => {
        const { result } = target || {};
        if (result && typeof result === 'string') {
          setFileContent(result);
        }
      };
    }
  }, [file]);

  useEffect(() => {
    if (file && fileContent && fileType && !serializedFile) {
      translateToPROVJSON(fileContent, fileType)
        .then((serialized) => {
          if (serialized) setSerializedFile(serialized);
        });
    }
  }, [file, fileType, fileContent]);

  const handleFileDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCounter(draggingCounter + 1);
  };

  const handleFileDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCounter(draggingCounter - 1);
  };

  const reset = () => {
    setFile(undefined);
    setFileName(undefined);
    setFileContent(undefined);
    setFileType(undefined);
    setSerializedFile(undefined);
    setDraggingCounter(0);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCounter(0);
    const { files } = e.dataTransfer;

    if (files.length > 0) {
      setFile(files[0]);
      setFileName(files[0].name.split('.')[0]);
    }
  };

  const handleFileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleCancel = () => {
    onClose();
    reset();
  };

  const handleDone = () => {
    if (fileName && fileType && fileContent && serializedFile) {
      addDocument({
        name: fileName,
        updatedAt: new Date(),
        type: fileType,
        fileContent,
        serialized: serializedFile,
      });
      onClose();
      reset();
    }
  };

  const dragging = draggingCounter > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>Upload a PROV Document</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          Valid document formats include
          {' '}
          {['PROV-N', 'Turtle', 'PROV-XML', 'TriG', 'PROV-JSON']
            .map((format, i, all) => (
              <React.Fragment key={format}>
                {i === 0 ? '' : i === all.length - 1 ? ' and ' : ', '}
                <strong>{format}</strong>
              </React.Fragment>
            ))}
        </DialogContentText>
        <Box display="flex">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            className={[
              classes.dragAndDropBox,
              file ? classes.dragAndDropBoxFile : [],
              dragging ? classes.dragAndDropBoxDragging : [],
            ].flat().join(' ')}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragEnter={handleFileDragEnter}
            onDragLeave={handleFileDragLeave}
            onDrop={handleFileDrop}
          >
            {file ? (
              <>
                <DescriptionIcon />
                {file.name}
              </>
            ) : (
              <>
                <PublishIcon />
                {dragging ? (
                  <>
                    <Typography><strong>Drop File</strong></Typography>
                  </>
                ) : (
                  <>
                    <Typography><strong>Drag and Drop file</strong></Typography>
                    <Typography>or</Typography>
                    <Button
                      color="primary"
                      variant="contained"
                      component="label"
                    >
                      Browse
                      <input
                        type="file"
                        onChange={({ target }) => {
                          reset();
                          if (target.files && target.files.length > 0) {
                            setFileName(target.files[0].name.split('.')[0]);
                            setFile(target.files[0]);
                          }
                        }}
                        hidden
                      />
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
          {file && (
          <Box
            pl={1}
            flexGrow={1}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box style={{ width: '100%' }}>
              <TextField label="Name" type="text" style={{ width: '100%' }} value={fileName} onChange={handleFileNameChange} />
              <Typography>
                {'Document Type: '}
                <strong>{fileType}</strong>
              </Typography>
            </Box>
            <Box className={classes.buttonWrapper} display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                disabled={(
                  fileName === undefined
                  || fileType === undefined
                  || serializedFile === undefined
                )}
                variant="contained"
                color="primary"
                onClick={handleDone}
              >
                Done
              </Button>
            </Box>
          </Box>
          )}
        </Box>

      </DialogContent>
    </Dialog>
  );
};

export default React.memo(UploadDocumentDialog);
