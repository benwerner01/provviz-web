import React, {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { saveAs } from 'file-saver';
import { translateSerializedToFile } from '../lib/openProvenanceAPI';
import { PROVDocument, PROVFileType } from '../lib/types';
import PROVFileTypeSelect from './Select/PROVFileTypeSelect';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    width: 500,
  },
  dialogContent: {
    position: 'relative',
    marginBottom: theme.spacing(2),
  },
  dialogTitle: {
    paddingBottom: 0,
  },
  buttonWrapper: {
    position: 'relative',
    '& > button': {
      width: `calc((100% - ${theme.spacing(1)}px) / 2)`,
    },
  },
  errorTypography: {
    color: '#dc3545',
    marginRight: theme.spacing(1),
  },
  errorButton: {
    color: '#dc3545',
  },
}));

const mapPROVFileTypeToFileExtension = (type: PROVFileType) => {
  if (type === 'PROV-JSON') return '.json';
  if (type === 'PROV-N') return '.provn';
  if (type === 'PROV-XML') return '.xml';
  if (type === 'TriG') return '.trig';
  return '.ttl';
};

type DocumentExportDialogProps = {
  open: boolean;
  document: PROVDocument;
  onClose: () => void;
}

const DocumentExportDialog: React.FC<DocumentExportDialogProps> = ({
  open, document, onClose,
}) => {
  const classes = useStyles();

  const [exportFileType, setExportFileType] = useState<PROVFileType>(document.type);
  const [
    exportFileContent,
    setExportFileContent] = useState<string | undefined>(document.fileContent);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode | undefined>();

  useLayoutEffect(() => {
    setExportFileType(document.type);
    setExportFileContent(document.fileContent);
  }, [document]);

  const translate = useCallback(() => {
    if (document.type !== exportFileType) {
      setLoading(true);
      translateSerializedToFile(document.serialized, exportFileType).then((fileContent) => {
        setLoading(false);
        if (fileContent) setExportFileContent(fileContent);
        else {
          setErrorMessage(
            <Box flexGrow={2} display="flex" alignItems="center" justifyContent="space-between">
              <Typography className={classes.errorTypography}>
                {'Could not translate document from '}
                <strong>{document.type}</strong>
                {' to '}
                <strong>{exportFileType}</strong>
              </Typography>
              <Button
                variant="outlined"
                className={classes.errorButton}
                onClick={() => {
                  setErrorMessage(undefined);
                  translate();
                }}
              >
                Retry
              </Button>
            </Box>,
          );
        }
      });
    } else {
      setExportFileContent(document.fileContent);
    }
  }, [document, exportFileType]);

  useEffect(() => {
    if (open) {
      setExportFileContent(undefined);
      translate();
    }
  }, [document, exportFileType, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleExport = () => {
    if (exportFileContent) {
      const blob = new File([exportFileContent], `${document.name}${mapPROVFileTypeToFileExtension(exportFileType)}`);
      saveAs(blob);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {'Export \''}
        <strong>{document.name}</strong>
        {'\''}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box display="flex">
          <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <PROVFileTypeSelect
              label="Document Type"
              width="100%"
              value={exportFileType}
              onChange={(updatedFileType) => {
                setExportFileContent(undefined);
                setExportFileType(updatedFileType);
              }}
            />
            <Collapse in={open && !loading && errorMessage !== undefined}>
              <Box mt={1}>{errorMessage}</Box>
            </Collapse>
            <Box mt={2} className={classes.buttonWrapper} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                disabled={exportFileContent === undefined}
                variant="outlined"
                color="primary"
                onClick={handleExport}
              >
                Export
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DocumentExportDialog);
