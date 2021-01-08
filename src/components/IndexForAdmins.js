/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { logoutAdmin, loginAdmin } from '../actions/index';

const mapStateToProps = state => {
  const { isAdminLoggedIn } = state.createUserReducer;

  const { emailForAdmin, passwordForAdmin } = state.createUserReducer.admin;

  return {
    isAdminLoggedIn,
    emailForAdmin,
    passwordForAdmin,
  };
};

const mapDispatchToProps = dispatch => ({
  logoutAdminFromComponent: admin => dispatch(logoutAdmin(admin)),
  loginAdminFromComponent: admin => dispatch(loginAdmin(admin)),
});

const IndexForAdmins = props => {
  const [photo, setPhoto] = useState(props.photo);
  const [emailForAdminVar, setEmailForAdminVar] = useState(props.emailForAdmin);
  const checkLoginStatus = () => {
    axios
      .get('http://localhost:3001/logged_in_admin', { withCredentials: true })
      .then(response => {
        console.log(response);
        if (response.data.logged_in && !props.isAdminLoggedIn) {
          props.loginAdminFromComponent({ admin: { email: props.emailForAdmin, password: props.passwordForAdmin } });
          props.history.push('/logged_in_admin');
          setEmailForAdminVar(response.data.admin.email);
        } else if (!response.data.logged_in && props.isAdminLoggedIn) {
          props.logoutAdminFromComponent();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    checkLoginStatus();
  });

  const handleLogOut = () => {
    axios.delete('http://localhost:3001/logout', { withCredentials: true })
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
      setPhoto(URL.createObjectURL(img));
    }
  };

  const sendPhotoToAPI = () => {
    axios.post('http://localhost:3001/edit_admin', { admin: { photo } }, { withCredentials: true })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

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
    </div>

  );
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexForAdmins);
