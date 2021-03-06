/* eslint-disable no-alert */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  createUser, loginUser, createAdmin, loginAdmin,
} from '../actions/index';
import { SetLocalStorageForUser, setLocalStorageForAdmin } from '../helpers/SetLocalStorage';

const mapStateToProps = state => {
  const {
    email,
    password,
    password_confirmation,
    uid,
    client,
    access_token,
  } = state.createUserReducer.user;

  const { isLoggedIn } = state.createUserReducer;
  const { isAdminLoggedIn } = state.createUserReducer;

  const {
    emailForAdmin,
    passwordForAdmin,
    password_confirmationForAdmin,
    uidForAdmin,
    clientForAdmin,
    access_tokenForAdmin,
  } = state.createUserReducer.admin;

  return {
    email,
    password,
    password_confirmation,
    emailForAdmin,
    passwordForAdmin,
    password_confirmationForAdmin,
    isLoggedIn,
    isAdminLoggedIn,
    uid,
    client,
    access_token,
    uidForAdmin,
    clientForAdmin,
    access_tokenForAdmin,
  };
};

const mapDispatchToProps = dispatch => ({
  createUserFromComponent: user => dispatch(createUser(user)),
  loginUserFromComponent: user => dispatch(loginUser(user)),
  loginAdminFromComponent: admin => dispatch(loginAdmin(admin)),
  createAdminFromComponent: user => dispatch(createAdmin(user)),
});

const App = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [emailForLogin, setEmailForLogin] = useState('');
  const [passwordForLogin, setPasswordForLogin] = useState('');
  const [emailForAdmin, setEmailForAdmin] = useState('');
  const [passwordForAdmin, setPasswordForAdmin] = useState('');
  const [password_confirmationForAdmin, setPasswordConfirmationForAdmin] = useState('');
  const [emailForAdminLogin, setEmailForAdminLogin] = useState('');
  const [passwordForAdminLogin, setPasswordForAdminLogin] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  let responseVar = null;

  const handleSubmit = event => {
    axios.post('http://localhost:3001/auth', {
      email,
      password,
      password_confirmation,
    }).then(response => {
      if (response.data.status === 'success') {
        SetLocalStorageForUser(response);
        props.createUserFromComponent({
          user: {
            email,
            password,
            password_confirmation,
            uid: response.headers.uid,
            access_token: response.headers.access_token,
            client: response.headers.client,
          },
        });
      }
    })
      .then(() => props.history.push('/logged_in'))
      .catch(error => {
        setHasError(true);
        setErrorMessage(error.response.statusText);
        responseVar = errorMessage;
        setTimeout(() => { alert(responseVar); }, 500);
        return error.response;
      });

    event.preventDefault();
  };

  const handleSubmitForAdminRegistration = event => {
    axios.post('http://localhost:3001/auth_teacher', {
      email: emailForAdmin,
      password: passwordForAdmin,
      password_confirmation: password_confirmationForAdmin,
    }).then(response => {
      if (response.data.status === 'success') {
        setLocalStorageForAdmin(response);
        props.createAdminFromComponent({
          admin: {
            email: emailForAdmin,
            password: passwordForAdmin,
            password_confirmation: password_confirmationForAdmin,
            uidForAdmin: response.headers.uid,
            access_tokenForAdmin: response.headers['access-token'],
            clientForAdmin: response.headers.client,
          },
        });
      }
    })
      .then(() => props.history.push('/logged_in_admin'))
      .catch(error => {
        setHasError(true);
        setErrorMessage(error.response.statusText);
        responseVar = errorMessage;
        setTimeout(() => { alert(responseVar); }, 500);
        return error.response;
      });

    event.preventDefault();
  };

  const handleSubmitForAdminLogin = event => {
    axios.post('http://localhost:3001/auth_teacher/sign_in', {
      email: emailForAdminLogin,
      password: passwordForAdminLogin,
    }).then(response => {
      if (response.status === 200) {
        setLocalStorageForAdmin(response);
        props.loginAdminFromComponent({
          admin: {
            email: emailForAdminLogin,
            password: passwordForAdminLogin,
          },
        });
      }
    })
      .then(() => props.history.push('/logged_in_admin'))
      .catch(error => {
        setHasError(true);
        setErrorMessage(error.response.statusText);
        responseVar = errorMessage;
        setTimeout(() => { alert(responseVar); }, 500);
        return error.response;
      });

    event.preventDefault();
  };

  const handleSubmitForLogin = event => {
    axios.post('http://localhost:3001/auth/sign_in', {
      email: emailForLogin,
      password: passwordForLogin,
    }).then(response => {
      if (response.status === 200) {
        SetLocalStorageForUser(response);
        props.loginUserFromComponent({
          user: {
            email: emailForLogin,
            password: passwordForLogin,
          },
        });
      }
    })
      .then(() => props.history.push('/logged_in'))
      .catch(error => {
        setHasError(true);
        setErrorMessage(error.response.statusText);
        responseVar = errorMessage;
        setTimeout(() => { alert(responseVar); }, 500);
        return error.response;
      });

    event.preventDefault();
  };

  return (
    <div className="yellowbg d-flex flex-column">
      <h1 className="text-center font-weight-bold">Welcome STUDENTS</h1>
      <form className="text-center mb-4 w-50 mx-auto mt-4">
        <input
          type="email"
          name="email"
          id="myMailForTest"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          name="password"
          id="myPasswordForTest"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          name="password_confirmation"
          id="myPasswordConfirmationForTest"
          placeholder="Password-Confirmation"
          value={password_confirmation}
          onChange={event => setPasswordConfirmation(event.target.value)}
          required
          className="form-control mb-2"
        />
        <button type="button" className="btn btn-success mt-3" id="myButtonForTest" onClick={handleSubmit}>Sign Up</button>
      </form>

      <form className="text-center mb-3 w-50 mx-auto">
        <input
          type="email"
          name="email"
          data-testid="custom-element"
          placeholder="Email"
          value={emailForLogin}
          onChange={event => setEmailForLogin(event.target.value)}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          name="password"
          data-testid="custom-element2"
          placeholder="Password"
          value={passwordForLogin}
          onChange={event => setPasswordForLogin(event.target.value)}
          required
          className="form-control mb-2"
        />
        <button type="button" className="btn btn-primary mt-3" data-testid="custom-element3" onClick={handleSubmitForLogin}>Sign In</button>
      </form>

      <div className="text-center"><h2 className="font-weight-bolder">Or Are You a TEACHER?</h2></div>
      <form className="text-center mb-5 w-50 mx-auto">
        <input
          type="email"
          name="email"
          id="emailForAdmin"
          placeholder="Email"
          value={emailForAdmin}
          onChange={event => setEmailForAdmin(event.target.value)}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          name="password"
          id="passwordForAdmin"
          placeholder="Password"
          value={passwordForAdmin}
          onChange={event => setPasswordForAdmin(event.target.value)}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          name="password_confirmation"
          id="passwordConfirmationForAdmin"
          placeholder="Password-Confirmation"
          value={password_confirmationForAdmin}
          onChange={event => setPasswordConfirmationForAdmin(event.target.value)}
          required
          className="form-control mb-2"
        />
        <button type="button" className="btn btn-success mt-3" id="buttonForAdmin" onClick={handleSubmitForAdminRegistration}>Sign Up</button>
      </form>

      <form className="text-center mb-4 w-50 mx-auto">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={emailForAdminLogin}
          onChange={event => setEmailForAdminLogin(event.target.value)}
          required
          className="form-control mb-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordForAdminLogin}
          onChange={event => setPasswordForAdminLogin(event.target.value)}
          required
          className="form-control mb-2"
        />
        <button type="button" className="btn btn-primary mt-3" onClick={handleSubmitForAdminLogin}>Sign In</button>
      </form>
      {hasError ? <div>{errorMessage}</div> : null}
    </div>
  );
};

App.propTypes = {
  createUserFromComponent: PropTypes.instanceOf(Object),
  createAdminFromComponent: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  loginAdminFromComponent: PropTypes.instanceOf(Object),
  loginUserFromComponent: PropTypes.instanceOf(Object),
};

App.defaultProps = {
  createUserFromComponent: {},
  createAdminFromComponent: {},
  history: {},
  loginAdminFromComponent: {},
  loginUserFromComponent: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
