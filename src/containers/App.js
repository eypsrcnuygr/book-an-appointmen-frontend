/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  createUser, loginUser, createAdmin, loginAdmin, logoutUser,
} from '../actions/index';

const mapStateToProps = state => {
  const {
    email,
    password,
    password_confirmation,
  } = state.createUserReducer.user;

  const { isLoggedIn } = state.createUserReducer;
  const { isAdminLoggedIn } = state.createUserReducer;

  const {
    emailForAdmin,
    passwordForAdmin,
    password_confirmationForAdmin,
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
  };
};

const mapDispatchToProps = dispatch => ({
  createUserFromComponent: user => dispatch(createUser(user)),
  loginUserFromComponent: user => dispatch(loginUser(user)),
  logoutUserFromComponent: user => dispatch(logoutUser(user)),
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

  const checkLoginStatus = () => {
    axios
      .get('http://localhost:3001/logged_in', { withCredentials: true })
      .then(response => {
        if (response.data.logged_in && !props.isLoggedIn) {
          props.loginUserFromComponent({ user: { email: props.email, password: props.password } });
          props.history.push('/logged_in');
        } else if (!response.data.logged_in && props.isLoggedIn) {
          props.logoutUserFromComponent();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleSubmit = event => {
    axios.post('http://localhost:3001/registrations', {
      user: {
        email,
        password,
        password_confirmation,
      },
    }, { withCredentials: true }).then(response => {
      if (response.data.status === 'created') {
        props.createUserFromComponent({ user: { email, password, password_confirmation } });
      }
    })
      .then(() => props.history.push('/logged_in'))
      .catch(error => {
        console.log(error.message);
      });

    event.preventDefault();
  };

  const handleSubmitForAdminRegistration = event => {
    axios.post('http://localhost:3001/create_admin', {
      admin: {
        email: emailForAdmin,
        password: passwordForAdmin,
        password_confirmation: password_confirmationForAdmin,
      },
    }, { withCredentials: true }).then(response => {
      if (response.data.status === 'created') {
        props.createAdminFromComponent({ admin: { email: emailForAdmin, password: passwordForAdmin, password_confirmation: password_confirmationForAdmin } });
      }
    })
      .then(() => props.history.push('/logged_in_admin'))
      .catch(error => {
        console.log(error.message);
      });

    event.preventDefault();
  };

  const handleSubmitForAdminLogin = event => {
    axios.post('http://localhost:3001/create_admin_session', {
      admin: {
        email: emailForAdminLogin,
        password: passwordForAdminLogin,
      },
    }, { withCredentials: true }).then(response => {
      console.log(response);
      if (response.data.logged_in) {
        props.loginAdminFromComponent({ admin: { email: emailForAdminLogin, password: passwordForAdminLogin } });
      }
    })
      .then(() => props.history.push('/logged_in_admin'))
      .catch(error => {
        console.log(error.message);
      });

    event.preventDefault();
  };

  const handleSubmitForLogin = event => {
    axios.post('http://localhost:3001/sessions', {
      user: {
        email: emailForLogin,
        password: passwordForLogin,
      },
    }, { withCredentials: true }).then(response => {
      if (response.data.logged_in) {
        props.loginUserFromComponent({ user: { email: emailForLogin, password: passwordForLogin } });
      }
    })
      .then(() => props.history.push('/logged_in'))
      .catch(error => {
        console.log(error.message);
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
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
