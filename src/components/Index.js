/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { loginUser, logoutUser } from '../actions/index';

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
  loginUserFromComponent: user => dispatch(loginUser(user)),
  logoutUserFromComponent: () => dispatch(logoutUser()),
});

const Index = props => {
  let i = -1;
  const [email, setEmail] = useState(props.email);
  const [teacherDetails, setTeacherDetails] = useState([]);

  const checkLoginStatus = () => {
    axios
      .get('http://localhost:3001/auth/validate_token',
        {
          headers: {
            uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
            client: JSON.parse(localStorage.getItem('currentUser')).myClient,
            'access-token': JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
          },
        })
      .then(response => {
        if (response.data.success && !props.isLoggedIn) {
          props.loginUserFromComponent({
            user: {
              email: props.email,
              password: props.password,
            },
          });
          // props.history.push('/logged_in');
          setEmail(response.data.data.email);
        } else if (!response.data.success && props.isLoggedIn) {
          props.logoutUserFromComponent();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getTeachersFromAPI = () => {
    axios
      .get('http://localhost:3001/teachers')
      .then(response => {
        console.log(response);
        setTeacherDetails(response.data.data);
      });
  };

  useEffect(() => {
    checkLoginStatus();
    getTeachersFromAPI();
  }, []);

  const handleLogOut = () => {
    axios.delete('http://localhost:3001/auth/sign_out', {
      headers: {
        uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
        client: JSON.parse(localStorage.getItem('currentUser')).myClient,
        'access-token': JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
      },
    })
      .then(response => {
        console.log(response);
        return (
          props.logoutUserFromComponent()
        );
      })
      .then(() => props.history.push('/'))
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <div>Sercan</div>
      <div>{email}</div>
      <div>{props.isLoggedIn ? 'Yes' : 'No'}</div>
      <button type="button" onClick={handleLogOut}>Submit</button>
      <div>
        {teacherDetails.map(element => {
          i += 1;
          return (
            <div key={i}>
              <div>{element.email}</div>
              <img src={element.image} alt="teacher" />
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
