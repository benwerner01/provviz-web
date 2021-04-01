import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PROVDocumentEditor from './PROVDocumentEditor';

const generateClassName = createGenerateClassName({
  productionPrefix: 'provviz-web', seed: 'provviz-web',
});

ReactDOM.render(
  <StylesProvider generateClassName={generateClassName}>
    <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path={['/:slug', '/']}>
            <PROVDocumentEditor />
          </Route>
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  </StylesProvider>,
  document.getElementById('root'),
);
