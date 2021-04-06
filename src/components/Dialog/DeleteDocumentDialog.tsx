import React, { useLayoutEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import { PROVDocument } from '../../lib/types';

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
  deleteButton: {
    backgroundColor: '#dc3545',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#ab2936',
    },
  },
}));

export type DeleteDocumentDialogProps = {
  open: boolean;
  document?: PROVDocument;
  onClose: () => void;
  onDelete: (document: PROVDocument) => void;
}

const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = ({
  open, document, onClose, onDelete,
}) => {
  const classes = useStyles();

  const [name, setName] = useState<string>(document?.name || '');

  useLayoutEffect(() => {
    if (document) {
      setName(document.name);
    }
  }, [document]);

  const handleDelete = () => {
    if (document) {
      onClose();
      onDelete(document);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {'Are you sure you want to delete '}
        <strong>{name}</strong>
        ?
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          Deleting a PROV Document cannot be undone.
        </DialogContentText>
        <Box mt={2} className={classes.buttonWrapper} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            disabled={document === undefined}
            className={classes.deleteButton}
            variant="outlined"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DeleteDocumentDialog);
