/* eslint-disable no-alert */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { loginUser, logoutUser } from '../actions/index';
import NavBar from '../components/NavBar';

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
  const { email } = props;
  const [emailState, setEmail] = useState(email);
  const [teacherDetails, setTeacherDetails] = useState([]);
  const [dateNow, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [userId, setUserId] = useState(null);
  const { isLoggedIn } = props;
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
        setUserId(response.data.data.id);
        if (response.data.success && !props.isLoggedIn) {
          props.loginUserFromComponent({
            user: {
              email: response.data.data.email,
              password: props.password,
            },
          });
          setEmail(response.data.data.email);
        } else if (!response.data.success && props.isLoggedIn) {
          props.logoutUserFromComponent();
        }
      })
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  const getTeachersFromAPI = () => {
    axios
      .get('http://localhost:3001/teachers', {
        headers: {
          uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
          client: JSON.parse(localStorage.getItem('currentUser')).myClient,
          'access-token': JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
        },
      })
      .then(response => {
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
      .then(() => (
        props.logoutUserFromComponent()
      ))
      .then(() => props.history.push('/'))
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  const handleAppointment = element => {
    axios
      .post('http://localhost:3001/appointments', {
        appointment: {
          user_id: userId,
          teacher_id: element.id,
          date: dateNow,
        },
      }, {
        headers: {
          uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
          client: JSON.parse(localStorage.getItem('currentUser')).myClient,
          'access-token': JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
        },
      })
      .then(response => {
        axios.patch(`http://localhost:3001/appointments/${response.data.id}`, {
          appointment: {
            status: 'pending',
          },
        }, {
          headers: {
            uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
            client: JSON.parse(localStorage.getItem('currentUser')).myClient,
            'access-token': JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
          },
        });
      })
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  return (
    <div className="w-50 mx-auto text-center mb-5">
      <NavBar />
      <div><h1>Welcome to Students&apos; Panel</h1></div>
      <div>{isLoggedIn ? `You are logged in as ${emailState}` : 'Not authorized'}</div>
      <div>
        <h2>Here Are the Registrated Teachers</h2>
        {teacherDetails.map(element => {
          i += 1;
          return (
            <div key={i} className="card mb-3 py-3 shadow-lg">
              <div>{element.email}</div>
              <div className="img-container mx-auto my-4"><img src={element.image} className="img-fluid rounded-circle image" alt="teacher" /></div>
              <div><p>{element.nickname}</p></div>
              <div><p>{element.details}</p></div>
              <input className="form-control w-50 mx-auto my-3" type="date" onChange={e => setDate(e.target.value)} value={dateNow} />
              <button type="button" className="btn btn-primary w-25 mx-auto" onClick={() => handleAppointment(element)}>Apply</button>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn btn-danger my-4" onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

Index.propTypes = {
  logoutUserFromComponent: PropTypes.instanceOf(Object),
  isLoggedIn: PropTypes.bool,
  password: PropTypes.string,
  email: PropTypes.string,
  history: PropTypes.instanceOf(Object),
  loginUserFromComponent: PropTypes.instanceOf(Object),
};

Index.defaultProps = {
  logoutUserFromComponent: {},
  isLoggedIn: false,
  password: '',
  email: '',
  history: {},
  loginUserFromComponent: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
