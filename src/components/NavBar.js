import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-center font-weight-bold mb-3 fixed-top">
      <Link className="mr-3 Link" id="home" to="/logged_in">Home</Link>
      <Link className="Link" id="appointmentsFetcher" to="/appointments">Appointments</Link>
    </nav>
  </>
);

export default NavBar;
