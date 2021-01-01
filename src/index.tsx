import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import App from './App';

const generateClassName = createGenerateClassName({
  productionPrefix: 'provviz-web', seed: 'provviz-web',
});

ReactDOM.render(
  <StylesProvider generateClassName={generateClassName}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </StylesProvider>,
  document.getElementById('root'),
);
