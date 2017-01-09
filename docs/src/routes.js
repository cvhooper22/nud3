import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import DocumentationLayout from './DocumentationLayout';
import HomeView from './views/HomeView';
import ExampleView from './views/ExampleView';

export default function () {
  return (
    <Router history={ hashHistory }>
      <Route path="/" component={ DocumentationLayout }>
        <Route path="/:name" component={ ExampleView } />
        <IndexRoute component={ HomeView } />
      </Route>
    </Router>
  );
}
