import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { history } from '../routers/AppRouter';

const NotFoundPage = () => (
  <div className="loader--404">
    {
      history.location.pathname === '/' ? <Redirect to="/login" /> : (
        <div>
          <h1>404!</h1>
          <h2>Tadeto cesta nejde. <Link to="/">Vráť sa späť.</Link></h2>
          <img alt="endless-road" src="/images/infinity-car.gif" />
        </div>

      )
    }
  </div>
);

export default NotFoundPage;


// Tadeto cesta nevedie. Vráť sa späť. 