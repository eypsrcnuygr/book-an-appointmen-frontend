/* eslint-disable no-alert */
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const Teacher = props => {
  const [currentTeacher, setCurrentTeacher] = useState([]);
  let responseVar = null;

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
              email: response.data.data.email,
              password: props.password,
            },
          });
        } else if (!response.data.success && props.isLoggedIn) {
          props.logoutUserFromComponent();
        }
      })
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  const getTeacherFromAPI = () => {
    axios
      .get(`http://localhost:3001/show/${props.match.params.id}`, {
        headers: {
          uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
          client: JSON.parse(localStorage.getItem('currentUser')).myClient,
          'access-token': JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
        },
      })
      .then(response => {
        setCurrentTeacher(response.data.cur_teacher);
      })
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  useEffect(() => {
    checkLoginStatus();
    getTeacherFromAPI();
  }, []);
  return (
    <div className="h-100">
      <div className="row h-100 w-100">
        <div className="col-3 pl-3 height light-bg mb-0 pb-0 d-flex justify-content-center pt-3">
          <h1><Link to="/logged_in" className="Link2">Book an Appointment</Link></h1>
        </div>
        <div className="col-6 height px-0 myOpacity">
          <div className="h-100"><img src={currentTeacher.image} alt="current teacher" className="py-5 img-fluid" /></div>
        </div>
        <div className="col-3 height pr-3 pl-5 pt-5 d-flex flex-column justify-content-around">
          <div>
            <div className="d-flex justify-content-end pt-5 mb-5 mr-3"><h2>{currentTeacher.nickname}</h2></div>
            <div className="myDiv mr-3 py-2"><p className="px-0 py-0 my-0">The current teacher&apos;s email</p></div>
            <div className="font-weight-bold">{currentTeacher.email}</div>
            <div className="mt-3 myDiv mr-3 py-2"><p className="px-0 py-0 my-0">The current teacher&apos;s details</p></div>
            <div className="font-weight-bold">{currentTeacher.details}</div>
          </div>
          <div className="d-flex justify-content-end mr-3">
            <button type="button" className="btn btn-success rounded-pill py-3 font-weight-bolder"><Link className="Link3" to="/logged_in">Discover more teacher</Link></button>
          </div>
        </div>
      </div>

    </div>

  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Teacher);
