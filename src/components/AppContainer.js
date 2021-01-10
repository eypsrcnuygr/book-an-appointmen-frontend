/* eslint-disable react/jsx-props-no-spreading */
import { HashRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import App from '../containers/App';
import Index from './Index';
import IndexForAdmins from './IndexForAdmins';

const AppContainer = () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact render={props => <App {...props} />} />
      <Route path="/logged_in" exact render={props => <Index {...props} />} />
      <Route path="/logged_in_admin" exact render={props => <IndexForAdmins {...props} />} />
    </Switch>
  </HashRouter>
);

export default AppContainer;