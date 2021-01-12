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
  const [dateNow, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [userId, setUserId] = useState(null);

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

  const handleAppointment = element => {
    axios
      .post('http://localhost:3001/appointments', {
        appointment: {
          user_id: userId,
          teacher_id: element.id,
          date: dateNow,
        },
      })
      .then(response => {
        axios.patch(`http://localhost:3001/appointments/${response.data.id}`, {
          appointment: {
            status: 'pending',
          },
        });
      });
  };

  return (
    <div className="w-50 mx-auto text-center">
      <div><h1>Welcome to Students&apos; Panel</h1></div>
      <div>{props.isLoggedIn ? `You are logged in as ${email}` : 'Not authorized'}</div>
      <div>
        <h2>Here Are the Registrated Teachers</h2>
        {teacherDetails.map(element => {
          i += 1;
          return (
            <div key={i} className="card mb-3 py-3 shadow-lg">
              <div>{element.email}</div>
              <div className="img-container mx-auto my-4"><img src={element.image} className="img-fluid rounded-circle image" alt="teacher" /></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Index);
