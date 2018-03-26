import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { history } from '../routers/AppRouter';

const NotFoundPage = () => (
  <div>
    {
      history.location.pathname === '/' ? <Redirect to="/login" /> : (<div><h2>404!</h2> <Link to="/">Go home </Link></div>)
    }
  </div>
);

export default NotFoundPage;
