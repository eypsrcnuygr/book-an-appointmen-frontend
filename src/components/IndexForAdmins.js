/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
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
  const [photo, setImage] = useState(props.image);
  const [emailForAdminVar, setEmailForAdminVar] = useState(props.emailForAdmin);
  const [appointmentsForAdmin, setAppointmentsForAdmin] = useState([]);
  let i = -1;

  const checkLoginStatus = () => {
    axios
      .get('http://localhost:3001/auth_teacher/validate_token',
        {
          headers: {
            uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
            client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
            'access-token': JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
          },
        })
      .then(response => {
        console.log(response.data.data);
        if (response.data.success && !props.isAdminLoggedIn) {
          props.loginAdminFromComponent({ admin: { email: props.emailForAdmin, password: props.passwordForAdmin } });
          props.history.push('/logged_in_admin');
          setEmailForAdminVar(response.data.data.email);
        } else if (!response.data.success && props.isAdminLoggedIn) {
          props.logoutAdminFromComponent();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getTeacherFromAPI = () => {
    let i = 0;
    const AdminId = JSON.parse(localStorage.getItem('currentAdmin')).myResponse.id;
    axios
      .get(`http://localhost:3001/show/${AdminId}`)
      .then(response => {
        console.log(response.data);
        const a = response.data.appointments;
        const b = response.data.users_mails;
        console.log(b);
        const lastVersion = [];
        a.forEach(element => {
          const first_version = element;
          first_version.user_mail = b[i];
          lastVersion.push(first_version);
          i += 1;
        });
        setAppointmentsForAdmin(lastVersion);
      });
  };

  useEffect(() => {
    checkLoginStatus();
    getTeacherFromAPI();
  }, []);

  const handleLogOut = () => {
    axios.delete('http://localhost:3001/auth_teacher/sign_out', {
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
        console.log(error);
      });
  };

  const onImageUpload = event => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setImage(URL.createObjectURL(img));
    }
  };

  const sendPhotoToAPI = () => {
    axios.patch('http://localhost:3001/auth_teacher', {
      image: photo,
      email: props.emailForAdmin,
      password: props.passwordForAdmin,
    }, {
      headers: {
        uid: JSON.parse(localStorage.getItem('currentAdmin')).myUid,
        client: JSON.parse(localStorage.getItem('currentAdmin')).myClient,
        access_token: JSON.parse(localStorage.getItem('currentAdmin')).myAccessToken,
      },
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleAppointmentAnswer = (e, element) => {
    console.log(e.target.value);
    if (e.target.value === 'Accept') {
      axios.patch(`http://localhost:3001/appointments/${element.id}`, {
        appointment: {
          status: 'accepted',
        },
      });
    } else {
      axios.patch(`http://localhost:3001/appointments/${element.id}`, {
        appointment: {
          status: 'none',
        },
      });
    }
  };

  const renderedElement = [];

  appointmentsForAdmin.map(element => {
    element.status === 'pending'
      ? renderedElement.push(
        <div>
          `$
          {element.user_mail}
          {' '}
          wants to have a lesson with you on $
          {element.date}
          `
          <button type="button" value="Accept" onClick={(e => handleAppointmentAnswer(e, element))}>Accept</button>
          <button type="button" value="Decline" onClick={(e => handleAppointmentAnswer(e, element))}>Decline</button>
        </div>,
      )
      : renderedElement.push(<div />);
    return renderedElement;
  });

  return (
    <div>
      <div>Admin Panel</div>
      <div>{props.isAdminLoggedIn ? 'Yes' : 'No'}</div>
      <div>{emailForAdminVar}</div>
      <button type="button" onClick={handleLogOut}>Submit</button>
      <div>Add your details</div>
      <input type="file" name="myImage" onChange={onImageUpload} />
      <img src={photo} alt="teacher" />
      <button type="button" onClick={sendPhotoToAPI}>Upload</button>
      {renderedElement.map(element => {
        i += 1;
        return <div key={i}>{element}</div>;
      })}
    </div>

  );
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexForAdmins);
