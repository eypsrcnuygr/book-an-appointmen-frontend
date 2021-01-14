/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable no-alert */
/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Widget } from '@uploadcare/react-widget';
import axios from 'axios';
import PropTypes from 'prop-types';
import { logoutAdmin, loginAdmin } from '../actions/index';

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
    image,
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
    image,
  };
};
const mapDispatchToProps = dispatch => ({
  logoutAdminFromComponent: admin => dispatch(logoutAdmin(admin)),
  loginAdminFromComponent: admin => dispatch(loginAdmin(admin)),
});

const IndexForAdmins = props => {
  const { image } = props;
  const { emailForAdmin } = props;
  const { isAdminLoggedIn } = props;
  const [photo, setImage] = useState(image);
  const [emailForAdminVar, setEmailForAdminVar] = useState(emailForAdmin);
  const [appointmentsForAdmin, setAppointmentsForAdmin] = useState([]);
  const [nickName, setNickName] = useState('');
  const [mydetails, setDetails] = useState('');
  const [currentTeacher, setCurrentTeacher] = useState([]);
  let i = -1;
  let responseVar = null;
  let renderedPicture = null;

  const checkLoginStatus = () => {
    axios
      .get('https://book-an-appointment-backend.herokuapp.com/auth_teacher/validate_token',
        {
          headers: {
            uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
            client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
            'access-token': JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
          },
        })
      .then(response => {
        if (response.data.success && !props.isAdminLoggedIn) {
          props.loginAdminFromComponent(
            { admin: { email: response.data.data.email, password: props.passwordForAdmin } },
          );
          setEmailForAdminVar(response.data.data.email);
        } else if (!response.data.success && props.isAdminLoggedIn) {
          props.logoutAdminFromComponent();
        }
      })
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  const getTeacherFromAPI = () => {
    let i = 0;
    const AdminId = JSON.parse(localStorage.getItem('currentAdmin')).myResponse.id;
    axios
      .get(`https://book-an-appointment-backend.herokuapp.com/show/${AdminId}`, {
        headers: {
          uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
          client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
          'access-token': JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
        },
      })
      .then(response => {
        const a = response.data.appointments;
        const b = response.data.users_mails;
        const lastVersion = [];
        a.forEach(element => {
          const first_version = element;
          first_version.user_mail = b[i];
          lastVersion.push(first_version);
          i += 1;
        });
        setAppointmentsForAdmin(lastVersion);
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

  const handleLogOut = () => {
    axios.delete('https://book-an-appointment-backend.herokuapp.com/auth_teacher/sign_out', {
      headers: {
        uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
        client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
        access_token: JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
      },
    })
      .then(() => (
        props.logoutAdminFromComponent({ admin: { email: props.email, password: props.password } })
      ))
      .then(() => props.history.push('/'))
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  const onImageUpload = event => {
    setImage(event.originalUrl);
  };

  const sendPhotoToAPI = () => {
    axios.patch('https://book-an-appointment-backend.herokuapp.com/auth_teacher', {
      image: photo,
      email: props.emailForAdmin,
      password: props.passwordForAdmin,
      nickname: nickName,
      details: mydetails,
    }, {
      headers: {
        uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
        client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
        access_token: JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
      },
    })
      .then(response => {
        responseVar = response.data.status;
        setTimeout(() => { alert(responseVar); }, 500);
      })
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  const handleAppointmentAnswer = (e, element) => {
    if (e.target.value === 'Accept') {
      axios.patch(`https://book-an-appointment-backend.herokuapp.com/appointments/${element.id}`, {
        appointment: {
          status: 'accepted',
        },
      }, {
        headers: {
          uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
          client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
          'access-token': JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
        },
      })
        .then(() => {
          getTeacherFromAPI();
        });
    } else {
      axios.patch(`https://book-an-appointment-backend.herokuapp.com/appointments/${element.id}`, {
        appointment: {
          status: 'none',
        },
      }, {
        headers: {
          uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
          client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
          'access-token': JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
        },
      })
        .then(() => {
          getTeacherFromAPI();
        });
    }
  };

  if (photo) {
    renderedPicture = <img src={photo} alt="teacher" className="rounded-circle img-fluid" />;
  } else if (currentTeacher.image) {
    renderedPicture = <img src={currentTeacher.image} alt="teacher" className="rounded-circle img-fluid" />;
  } else {
    renderedPicture = null;
  }

  return (
    <div className="text-center card w-50 mx-auto shadow-lg my-5 py-5">
      <div><h1>Welcome to Teachers&apos; Panel</h1></div>
      <div>{isAdminLoggedIn ? `You are logged in as ${emailForAdminVar}` : 'No'}</div>
      <div className="img-container mx-auto">
        {renderedPicture}
      </div>
      <div>
        {!currentTeacher.nickname || !currentTeacher.details || !currentTeacher.image
          ? <h2>Add your details</h2>
          : `Hello ${currentTeacher.nickname}`}
      </div>
      {!currentTeacher.nickname
        ? <input type="text" className="form-control w-50 mx-auto mb-3" placeholder="Add your nickname" onChange={e => { setNickName(e.target.value); }} />
        : null}
      {!currentTeacher.details
        ? <input type="text" className="form-control w-50 mx-auto mb-3" placeholder="Add your details" onChange={e => { setDetails(e.target.value); }} />
        : null}
      {!currentTeacher.nickname || !currentTeacher.details || !currentTeacher.image
        ? (
          <div className="d-flex flex-column">
            <Widget publicKey="aa727786fe030a1ce7a9" id="file" role="uploadcare-uploader" onChange={event => onImageUpload(event)} />
            <button type="button" className="btn btn-success my-3 w-25 mx-auto" onClick={sendPhotoToAPI}>Upload</button>
          </div>
        )
        : null}
      {appointmentsForAdmin.map(element => {
        i += 1;
        if (element.status === 'pending') {
          return (
            <div key={i} className="card w-75 mx-auto mb-3 shadow py-3">
              <p className="card-text">
                User with
                {' '}
                <b>{element.user_mail}</b>
                {' '}
                mail want to have a class on
                {' '}
                <b>{element.date}</b>
              </p>
              <button type="button" className="btn btn-success mb-2 w-50 mx-auto" value="Accept" onClick={(e => handleAppointmentAnswer(e, element))}>Accept</button>
              <button type="button" className="btn btn-danger mb-2 w-50 mx-auto" value="Decline" onClick={(e => handleAppointmentAnswer(e, element))}>Decline</button>
            </div>
          );
        } return <div key={i} />;
      })}
      <button type="button" className="btn btn-danger w-25 mx-auto mt-4" onClick={handleLogOut}>Log Out</button>
    </div>

  );
};

IndexForAdmins.propTypes = {
  isAdminLoggedIn: PropTypes.bool,
  image: PropTypes.string,
  emailForAdmin: PropTypes.string,
  email: PropTypes.string,
  history: PropTypes.instanceOf(Object),
  passwordForAdmin: PropTypes.string,
  password: PropTypes.string,
  loginAdminFromComponent: PropTypes.instanceOf(Object),
  logoutAdminFromComponent: PropTypes.instanceOf(Object),
};

IndexForAdmins.defaultProps = {
  isAdminLoggedIn: false,
  image: '',
  emailForAdmin: '',
  email: '',
  history: {},
  passwordForAdmin: '',
  password: '',
  loginAdminFromComponent: {},
  logoutAdminFromComponent: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexForAdmins);
