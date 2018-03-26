import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startLogin } from '../actions/authActions';
import LoginForm from './LoginForm';

const LoginPage = (props) => {
  return (
    <div>
      <Link to="/register" className="button button--login">Registrácia</Link>
      <LoginForm />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  startLogin: (email, password) => dispatch(startLogin(email, password))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
