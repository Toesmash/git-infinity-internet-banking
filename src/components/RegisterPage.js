import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
  return (
    <div>
      <Link to="/login" className="button button--login">Prihlásenie</Link>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
