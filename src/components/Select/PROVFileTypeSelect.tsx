import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { PROVFileType } from '../../lib/types';

const useStyles = makeStyles((theme) => ({
  labelShrink: {
    backgroundColor: theme.palette.common.white,
    transform: 'translate(14px, -6px) scale(0.75) !important',
  },
  selectedRoot: {
    overflow: 'hidden',
  },
  selectOutlined: ({ label }: { label?: string }) => ({
    fontWeight: 800,
    padding: label === undefined ? theme.spacing(0.5) : theme.spacing(1.25, 1.75),
    backgroundColor: theme.palette.common.white,
    '&:focus': {
      backgroundColor: theme.palette.common.white,
    },
  }),
}));

export type PROVFileTypeSelectProps = {
  label?: string;
  width?: string | number;
  value: PROVFileType;
  onChange: (newValue: PROVFileType) => void;
}

const PROVFileTypeSelect: React.FC<PROVFileTypeSelectProps> = ({
  label, width, value, onChange,
}) => {
  const classes = useStyles({ label });
  return (
    <FormControl variant="outlined" style={{ width }}>
      {label && <InputLabel classes={{ shrink: classes.labelShrink }}>{label}</InputLabel>}
      <Select
        value={value}
        onChange={({ target }) => onChange(target.value as PROVFileType)}
        classes={{ root: classes.selectedRoot, outlined: classes.selectOutlined }}
      >
        {['PROV-N', 'Turtle', 'PROV-XML', 'TriG', 'PROV-JSON']
          .map((format) => <MenuItem key={format} value={format}>{format}</MenuItem>)}
      </Select>
    </FormControl>
  );
};

export default PROVFileTypeSelect;
