import React, { useEffect, useLayoutEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { saveAs } from 'file-saver';
import { translatePROVJSONDocumentToFile } from '../lib/openProvenanceAPI';
import { PROVDocument, PROVFileType } from '../lib/types';

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
  buttonWrapper: {
    position: 'relative',
    '& > button': {
      width: `calc((100% - ${theme.spacing(1)}px) / 2)`,
    },
  },
  errorTypography: {
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
  const [exportFileContent, setExportFileContent] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    setExportFileType(document.type);
  }, [document]);

  useEffect(() => {
    if (open) {
      setExportFileContent(undefined);
      setLoading(true);
      translatePROVJSONDocumentToFile(document, exportFileType).then((fileContent) => {
        if (fileContent) setExportFileContent(fileContent);
        setLoading(false);
      });
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
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor="age-native-simple">Document Type</InputLabel>
              <Select
                value={exportFileType}
                onChange={({ target }) => {
                  setExportFileContent(undefined);
                  setExportFileType(target.value as PROVFileType);
                }}
              >
                {['PROV-N', 'Turtle', 'PROV-XML', 'TriG', 'PROV-JSON']
                  .map((format) => <MenuItem key={format} value={format}>{format}</MenuItem>)}
              </Select>
            </FormControl>
            <Collapse in={open && !loading && exportFileContent === undefined}>
              <Typography className={classes.errorTypography}>
                {'Could not translate PROV Document to '}
                <i>{exportFileType}</i>
                {' format'}
              </Typography>
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
                variant="contained"
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
