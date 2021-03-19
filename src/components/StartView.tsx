import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CardHeader from '@material-ui/core/CardHeader';
import slugify from 'slugify';
import LocalDocumentsContext from './context/LocalDocumentsContext';
import { PROVDocument } from '../lib/types';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    textDecoration: 'none',
  },
}));

type StartViewProps = {
  deleteDocument: (document: PROVDocument) => void;
}

const StartView: React.FC<StartViewProps> = ({ deleteDocument }) => {
  const classes = useStyles();
  const { localDocuments } = useContext(LocalDocumentsContext);
  const recent = localDocuments
    .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
    .slice(0, 3);

  return (
    <Box p={10} flexGrow={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Typography gutterBottom variant="h5">To get started, open an example PROV Document or upload your own</Typography>
      <Grid container spacing={4}>
        {recent.map((document) => (
          <Grid key={document.name} item xs>
            <a href={`/${slugify(document.name)}`}>
              <Card>
                <CardHeader
                  title={document.name}
                  className={classes.cardHeader}
                  subheader={document.updatedAt.toLocaleDateString()}
                  action={(
                    <IconButton onClick={(e) => {
                      e.preventDefault();
                      deleteDocument(document);
                    }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                />
              </Card>
            </a>
          </Grid>
        ))}
        {/* eslint-disable-next-line react/no-array-index-key */}
        {new Array(3 - (recent.length % 3)).fill([]).map((_, i) => <Grid key={i} item xs />)}
      </Grid>
    </Box>
  );
};

export default StartView;
