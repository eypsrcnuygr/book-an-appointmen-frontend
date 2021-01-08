/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { loginUser, logoutUser } from '../actions/index';

const mapStateToProps = state => {
  const { isLoggedIn } = state.createUserReducer;
  const { email } = state.createUserReducer.user;
  return {
    isLoggedIn,
    email,
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
      .get('https://book-an-appointment-backend.herokuapp.com/logged_in', { xsrfCookieName: '_authentication_app' }, { withCredentials: true })
      .then(response => {
        if (response.data.logged_in && !props.isLoggedIn) {
          props.loginUserFromComponent({ user: { email: props.email, password: props.password } });
          // props.history.push('/logged_in');
          setEmail(response.data.user.email);
        } else if (!response.data.logged_in && props.isLoggedIn) {
          props.logoutUserFromComponent();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getTeachersFromAPI = () => {
    axios
      .get('https://book-an-appointment-backend.herokuapp.com/registrations', { xsrfCookieName: '_authentication_app' }, { withCredentials: true })
      .then(response => {
        setTeacherDetails(response.data.admins);
      });
  };

  useEffect(() => {
    checkLoginStatus();
    getTeachersFromAPI();
  }, []);

  const handleLogOut = () => {
    axios.delete('https://book-an-appointment-backend.herokuapp.com/logout', { withCredentials: true })
      .then(() => (
        props.logoutUserFromComponent()
      ))
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
              <img src={element.photo} alt="teacher" />
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
