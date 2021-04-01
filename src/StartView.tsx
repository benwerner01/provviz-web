import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import AddIcon from '@material-ui/icons/Add';
import CardHeader from '@material-ui/core/CardHeader';
import examples from './lib/examples';
import LocalDocumentsContext from './components/context/LocalDocumentsContext';
import { PROVDocument } from './lib/types';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxHeight: 'calc(100% - 36px)',
    position: 'relative',
    padding: theme.spacing(10),
    boxSizing: 'border-box',
    overflowY: 'scroll',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(5),
    },
    '& > :not(:last-child)': {
      marginBottom: theme.spacing(10),
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(5),
      },
    },
  },
  fullWidthContentWrapper: {
    width: '100%',
  },
  card: {
    transition: theme.transitions.create('background-color'),
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
      cursor: 'pointer',
    },
  },
  cardHeader: {
    textDecoration: 'none',
  },
  button: {
    margin: theme.spacing(0.5),
    flexShrink: 0,
  },
}));

type StartViewProps = {
  openUploadDocumentDialog: () => void;
  openCreateDocumentDialog: () => void;
  openDocument: (document: PROVDocument) => void;
  generateUniqueDocumentName: (name: string) => string;
  deleteDocument: (document: PROVDocument) => void;
}

const StartView: React.FC<StartViewProps> = ({
  openUploadDocumentDialog,
  openCreateDocumentDialog,
  openDocument,
  generateUniqueDocumentName,
  deleteDocument,
}) => {
  const classes = useStyles();
  const { localDocuments } = useContext(LocalDocumentsContext);
  const recent = localDocuments
    .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
    .slice(0, 3);

  return (
    <Box className={classes.wrapper} display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
      {recent.length > 0 && (
      <Box className={classes.fullWidthContentWrapper}>
        <Typography gutterBottom variant="h5">Recent PROV Documents</Typography>
        <Grid container spacing={4}>
          {recent.map((document) => (
            <Grid key={document.name} item xs={12} md={4}>
              <Card className={classes.card} onClick={() => openDocument(document)}>
                <CardHeader
                  title={document.name}
                  className={classes.cardHeader}
                  subheader={document.updatedAt.toLocaleDateString()}
                  action={(
                    <IconButton onClick={(e) => {
                      e.stopPropagation();
                      deleteDocument(document);
                    }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                />
              </Card>
            </Grid>
          ))}
          {recent.length % 3 !== 0 && new Array(3 - (recent.length % 3))
            .fill([])
            // eslint-disable-next-line react/no-array-index-key
            .map((_, i) => <Grid key={i} item xs={false} md={4} />)}
        </Grid>
      </Box>
      )}
      {examples.length > 0 && (
      <Box className={classes.fullWidthContentWrapper}>
        <Typography gutterBottom variant="h5">Example PROV Documents</Typography>
        <Grid container spacing={4}>
          {examples.map((document) => (
            <Grid key={document.name} item xs={12} md={4}>
              <Card
                className={classes.card}
                onClick={() => openDocument({
                  ...document, name: generateUniqueDocumentName(`My ${document.name}`), updatedAt: new Date(),
                })}
              >
                <CardHeader
                  title={document.name}
                  className={classes.cardHeader}
                />
              </Card>
            </Grid>
          ))}
          {examples.length % 3 !== 0 && new Array(3 - (examples.length % 3))
            .fill([])
          // eslint-disable-next-line react/no-array-index-key
            .map((_, i) => <Grid key={i} item xs={false} md={4} />)}
        </Grid>
      </Box>
      )}
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          endIcon={<PublishIcon />}
          onClick={openUploadDocumentDialog}
        >
          Upload Document
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
          onClick={openCreateDocumentDialog}
        >
          Create Document
        </Button>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="h5">Need help?</Typography>
            <Typography>
              <a href="/user-guide.pdf" target="_blank" rel="noopener noreferrer">
                Access the User-Guide
              </a>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="h5">Encountering a problem?</Typography>
            <Typography>
              <a href="https://github.com/benwerner01/provviz-web/issues" target="_blank" rel="noopener noreferrer">
                File a GitHub issue
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StartView;
