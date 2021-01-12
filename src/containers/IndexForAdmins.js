/* eslint-disable react/jsx-one-expression-per-line */
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
  const [nickName, setNickName] = useState('');
  const [mydetails, setDetails] = useState('');
  const [currentTeacher, setCurrentTeacher] = useState([]);
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
          props.loginAdminFromComponent({ admin: { email: response.data.data.email, password: props.passwordForAdmin } });
          // props.history.push('/logged_in_admin');
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
        setCurrentTeacher(response.data.cur_teacher);
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
  let responseVar = null;

  const sendPhotoToAPI = () => {
    axios.patch('http://localhost:3001/auth_teacher', {
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
        setTimeout(() => { alert(responseVar); }, 1000);
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
      })
        .then(() => {
          getTeacherFromAPI();
        });
    } else {
      axios.patch(`http://localhost:3001/appointments/${element.id}`, {
        appointment: {
          status: 'none',
        },
      })
        .then(() => {
          getTeacherFromAPI();
        });
    }
  };

  let renderedPicture = null;

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
      <div>{props.isAdminLoggedIn ? `You are logged in as ${emailForAdminVar}` : 'No'}</div>
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
          <div>
            <input type="file" className="form-control w-25 mx-auto mb-3" name="myImage" onChange={onImageUpload} />
            <button type="button" className="btn btn-primary mb-3" onClick={sendPhotoToAPI}>Upload</button>
          </div>
        )
        : null}
      {appointmentsForAdmin.map(element => {
        i += 1;
        if (element.status === 'pending') {
          return (
            <div key={i} className="card w-75 mx-auto mb-3 shadow py-3">
              <p className="card-text">User with
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

export default connect(mapStateToProps, mapDispatchToProps)(IndexForAdmins);
