/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  createUser, loginUser, createAdmin, loginAdmin,
} from '../actions/index';

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
  const [email, setEmail] = useState(props.email);
  const [password, setPassword] = useState(props.password);
  const [password_confirmation, setPasswordConfirmation] = useState(props.password_confirmation);
  const [emailForLogin, setEmailForLogin] = useState(props.email);
  const [passwordForLogin, setPasswordForLogin] = useState(props.password);
  const [emailForAdmin, setEmailForAdmin] = useState(props.emailForAdmin);
  const [passwordForAdmin, setPasswordForAdmin] = useState(props.passwordForAdmin);
  const [password_confirmationForAdmin, setPasswordConfirmationForAdmin] = useState(props.password_confirmationForAdmin);
  const [emailForAdminLogin, setEmailForAdminLogin] = useState(props.emailForAdmin);
  const [passwordForAdminLogin, setPasswordForAdminLogin] = useState(props.passwordForAdmin);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = event => {
    axios.post('http://localhost:3001/auth', {
      email,
      password,
      password_confirmation,
    }).then(response => {
      if (response.data.status === 'success') {
        const myResponse = response.data.data;
        const myUid = response.headers.uid;
        const myClient = response.headers.client;
        const myAccessToken = response.headers['access-token'];
        localStorage.setItem('currentUser', JSON.stringify({
          myResponse, myUid, myClient, myAccessToken,
        }));
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
        const myResponse = response.data.data;
        const myUid = response.headers.uid;
        const myClient = response.headers.client;
        const myAccessToken = response.headers['access-token'];
        localStorage.setItem('currentAdmin', JSON.stringify({
          myResponse, myUid, myClient, myAccessToken,
        }));
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
        return error.response;
      });

    event.preventDefault();
  };

  const handleSubmitForAdminLogin = event => {
    axios.post('http://localhost:3001/auth_teacher/sign_in', {
      email: emailForAdminLogin,
      password: passwordForAdminLogin,
    }, {
      headers: {
        uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
        client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
        'access-token': JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
      },
    }).then(response => {
      console.log(response);
      if (response.status === 200) {
        const myResponse = response.data.data;
        const myUid = response.headers.uid;
        const myClient = response.headers.client;
        const myAccessToken = response.headers['access-token'];
        localStorage.setItem('currentAdmin', JSON.stringify({
          myResponse, myUid, myClient, myAccessToken,
        }));
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
        return error.response;
      });

    event.preventDefault();
  };

  const handleSubmitForLogin = event => {
    axios.post('http://localhost:3001/auth/sign_in', {
      email: emailForLogin,
      password: passwordForLogin,
    }, {
      headers: {
        uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
        client: JSON.parse(localStorage.getItem('currentUser')).myClient,
        access_token: JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
      },
    }).then(response => {
      if (response.status === 200) {
        const myResponse = response.data.data;
        const myUid = response.headers.uid;
        const myClient = response.headers.client;
        const myAccessToken = response.headers['access-token'];
        localStorage.setItem('currentUser', JSON.stringify({
          myResponse, myUid, myClient, myAccessToken,
        }));
        console.log(response);
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
        return error.response;
      });

    event.preventDefault();
  };

  return (
    <>
      <form>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          required
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Password-Confirmation"
          value={password_confirmation}
          onChange={event => setPasswordConfirmation(event.target.value)}
          required
        />
        <button type="button" onClick={handleSubmit}>Submit</button>
      </form>

      <form>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={emailForLogin}
          onChange={event => setEmailForLogin(event.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordForLogin}
          onChange={event => setPasswordForLogin(event.target.value)}
          required
        />
        <button type="button" onClick={handleSubmitForLogin}>Submit</button>
      </form>

      <div>Or Are you a teacher</div>
      <form>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={emailForAdmin}
          onChange={event => setEmailForAdmin(event.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordForAdmin}
          onChange={event => setPasswordForAdmin(event.target.value)}
          required
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Password-Confirmation"
          value={password_confirmationForAdmin}
          onChange={event => setPasswordConfirmationForAdmin(event.target.value)}
          required
        />
        <button type="button" onClick={handleSubmitForAdminRegistration}>Submit</button>
      </form>

      <form>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={emailForAdminLogin}
          onChange={event => setEmailForAdminLogin(event.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordForAdminLogin}
          onChange={event => setPasswordForAdminLogin(event.target.value)}
          required
        />
        <button type="button" onClick={handleSubmitForAdminLogin}>Submit</button>
      </form>
      {hasError ? <div>{errorMessage}</div> : null}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
