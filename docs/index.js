import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import routes from './src/routes';

/* eslint-disable import/no-unresolved */
require('./styles/index.scss');

const el = window.document.getElementById('content');
ReactDOM.render((
  <AppContainer>
    { routes() }
  </AppContainer>
), el);

if (module.hot) {
  module.hot.accept('./src/routes', () => {
    /* eslint-disable global-require */
    const nextRoutes = require('./src/routes.js').default;

    ReactDOM.render((
      <AppContainer>
        { nextRoutes() }
      </AppContainer>
    ), el);
  });
}
