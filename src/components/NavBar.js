import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-center font-weight-bold mb-3">
      <Link className="mr-3" to="/logged_in">Home</Link>
      <Link to="/appointments">Apoointments</Link>
    </nav>
  </>
);

export default NavBar;
