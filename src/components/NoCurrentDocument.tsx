import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import LocalDocumentsContext from './context/LocalDocumentsContext';
import { PROVDocument } from '../lib/types';

type NoCurrentDocumentProps = {
  addDocument: (document: PROVDocument) => void;
}

const NoCurrentDocument: React.FC<NoCurrentDocumentProps> = ({ addDocument }) => {
  const { localDocuments } = useContext(LocalDocumentsContext);
  const recent = localDocuments
    .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
    .slice(0, 3);

  return (
    <Box p={10} flexGrow={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Typography variant="h5">To get started, open an example PROV Document or upload your own</Typography>
      <Grid container spacing={4}>
        {recent.map((document) => (
          <Grid key={document.name} item xs>
            <Link to={`/${slugify(document.name)}`}>
              <Card>
                <CardHeader
                  title={document.name}
                  subheader={document.updatedAt.toLocaleDateString()}
                />
              </Card>
            </Link>
          </Grid>
        ))}
        {/* eslint-disable-next-line react/no-array-index-key */}
        {new Array(3 - (recent.length % 3)).fill([]).map((_, i) => <Grid key={i} item xs />)}
      </Grid>
    </Box>
  );
};

export default NoCurrentDocument;
