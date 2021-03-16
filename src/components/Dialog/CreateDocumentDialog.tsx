import React, { useLayoutEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import { TextField, Typography } from '@material-ui/core';
import {
  EMPTY_SERIALIZED, EMPTY_PROV_FILE_CONTENT, PROVDocument, PROVFileType,
} from '../../lib/types';
import PROVFileTypeSelect from '../Select/PROVFileTypeSelect';

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
  },
  nameTextFieldInput: {
    padding: theme.spacing(1.25, 1.75),
  },
  nameTextFieldRoot: {
    marginBottom: theme.spacing(1),
  },
  nameTextFieldLabelShrink: {
    transform: 'translate(14px, -6px) scale(0.75) !important',
  },
}));

type ExportDocumentDialogProps = {
  open: boolean;
  onClose: () => void;
  documentNameIsUnique: (name: string) => boolean
  generateUniqueDocumentName: (name: string) => string;
  openDocument: (document: PROVDocument) => void;
}

const ExportDocumentDialog: React.FC<ExportDocumentDialogProps> = ({
  open, documentNameIsUnique, generateUniqueDocumentName, openDocument, onClose,
}) => {
  const classes = useStyles();

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<PROVFileType>('PROV-N');

  useLayoutEffect(() => {
    if (open) setName(generateUniqueDocumentName('My PROV Document'));
  }, [open]);

  const handleCancel = () => {
    onClose();
  };

  const isUnique = documentNameIsUnique(name);

  const validName = name !== '' && isUnique;

  const handleCreate = () => {
    if (validName) {
      openDocument({
        name,
        updatedAt: new Date(),
        type,
        serialized: EMPTY_SERIALIZED,
        fileContent: EMPTY_PROV_FILE_CONTENT[type],
      });
      setName(generateUniqueDocumentName('My PROV Document'));
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
        Create New Document
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box display="flex">
          <Box
            flexGrow={1}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <TextField
              classes={{
                root: classes.nameTextFieldRoot,
              }}
              InputLabelProps={{
                classes: {
                  shrink: classes.nameTextFieldLabelShrink,
                },
              }}
              InputProps={{
                classes: {
                  input: classes.nameTextFieldInput,
                },
              }}
              label="Document Name"
              type="text"
              variant="outlined"
              style={{ width: '100%' }}
              value={name}
              onChange={({ target }) => setName(target.value)}
              error={!validName}
            />
            <Box mb={1}>
              <Collapse in={!isUnique}>
                {!isUnique && (
                <Typography className={classes.errorTypography} gutterBottom>
                  Please enter a unique Document Name
                </Typography>
                )}
                {name === '' && (
                <Typography className={classes.errorTypography} gutterBottom>
                  Please enter a Document Name
                </Typography>
                )}
              </Collapse>
            </Box>
            <PROVFileTypeSelect
              label="Document Type"
              width="100%"
              value={type}
              onChange={setType}
            />
            <Box mt={2} className={classes.buttonWrapper} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                disabled={!validName}
                variant="outlined"
                color="primary"
                onClick={handleCreate}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ExportDocumentDialog);
