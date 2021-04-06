import React, { useLayoutEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import {
  EMPTY_SERIALIZED, EMPTY_PROV_FILE_CONTENT, PROVDocument, PROVFileType,
} from '../../lib/types';
import PROVFileTypeSelect from '../Select/PROVFileTypeSelect';
import DocumentNameTextField from '../TextField/DocumentNameTextField';
import useDocumentNameTextField from '../TextField/useDocumentNameTextField';

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

export type CreateDocumentDialogProps = {
  open: boolean;
  onClose: () => void;
  documentNameIsUnique: (name: string) => boolean
  generateUniqueDocumentName: (name: string) => string;
  openDocument: (document: PROVDocument) => void;
}

const CreateDocumentDialog: React.FC<CreateDocumentDialogProps> = ({
  open, documentNameIsUnique, generateUniqueDocumentName, openDocument, onClose,
}) => {
  const classes = useStyles();

  const { documentName, setDocumentName, documentNameIsValid } = useDocumentNameTextField('', documentNameIsUnique);

  const [type, setType] = useState<PROVFileType>('PROV-N');

  useLayoutEffect(() => {
    if (open) setDocumentName(generateUniqueDocumentName('My PROV Document'));
  }, [open]);

  const handleCancel = () => {
    onClose();
  };

  const handleCreate = () => {
    if (documentNameIsValid) {
      openDocument({
        name: documentName,
        updatedAt: new Date(),
        type,
        serialized: EMPTY_SERIALIZED,
        fileContent: EMPTY_PROV_FILE_CONTENT[type],
      });
      setDocumentName(generateUniqueDocumentName('My PROV Document'));
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
            <DocumentNameTextField
              name={documentName}
              documentNameIsUnique={documentNameIsUnique}
              onChange={setDocumentName}
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
              variant="outlined"
              style={{ width: '100%' }}
            />
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
                disabled={!documentNameIsValid}
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

export default React.memo(CreateDocumentDialog);
