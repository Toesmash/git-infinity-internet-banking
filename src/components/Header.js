import React from 'react';
import { connect } from 'react-redux';
import { startLogout } from '../actions/authActions';

const Header = (props) => {
  return (
    <header className="header">
      <h1>INFINITY<span>bank</span></h1>
      <button onClick={props.startLogout}>Logout</button>
    </header>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startLogout: () => dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(Header);