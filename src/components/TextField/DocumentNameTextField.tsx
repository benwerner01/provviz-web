import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import { INVALID_DOCUMENT_NAMES } from './util';

const useStyles = makeStyles(() => ({
  errorTypography: {
    color: '#dc3545',
  },
}));

type DocumentNameTextFieldProps = {
  name: string,
  documentNameIsUnique: (name: string) => boolean;
  onChange: (name: string) => void;
} & Omit<Omit<TextFieldProps, 'value'>, 'onChange'>;

const DocumentNameTextField: React.FC<DocumentNameTextFieldProps> = ({
  name, documentNameIsUnique, onChange, ...remainingProps
}) => {
  const classes = useStyles();

  const isUnique = documentNameIsUnique(name);

  const isInvalidName = INVALID_DOCUMENT_NAMES.includes(name);

  const validName = name !== '' && isUnique && !isInvalidName;

  return (
    <>
      <TextField
        label="Document Name"
        {...remainingProps}
        type="text"
        value={name}
        onChange={({ target }) => { onChange(target.value); }}
        error={!validName}
      />
      <Box mb={1}>
        <Collapse in={!validName}>
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
          {isInvalidName && (
          <Typography className={classes.errorTypography} gutterBottom>
            This name is not valid
          </Typography>
          )}
        </Collapse>
      </Box>
    </>
  );
};

export default DocumentNameTextField;
