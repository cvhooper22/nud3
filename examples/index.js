import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Examples from './src/Examples';

/* eslint-disable import/no-unresolved */
require('./styles/index.scss');

const el = window.document.getElementById('content');
ReactDOM.render((
  <AppContainer>
    <Examples />
  </AppContainer>
), el);

if (module.hot) {
  module.hot.accept('./src/Examples', () => {
    /* eslint-disable global-require */
    const NextExamples = require('./src/Examples.js').default;

    ReactDOM.render((
      <AppContainer>
        <NextExamples />
      </AppContainer>
    ), el);
  });
}
