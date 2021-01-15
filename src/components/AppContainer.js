/* eslint-disable react/jsx-props-no-spreading */
import { HashRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import App from '../containers/App';
import Index from '../containers/Index';
import IndexForAdmins from '../containers/IndexForAdmins';
import AppointmentsFetcher from '../containers/AppointmentsFetcher';
import Teacher from './Teacher';

const AppContainer = () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact render={props => <App {...props} />} />
      <Route path="/logged_in" exact render={props => <Index {...props} />} />
      <Route path="/logged_in_admin" exact render={props => <IndexForAdmins {...props} />} />
      <Route path="/appointments" exact render={props => <AppointmentsFetcher {...props} />} />
      <Route path={['/teachers', '/teachers/:id']} exact render={props => <Teacher {...props} />} />
    </Switch>
  </HashRouter>
);

export default AppContainer;
