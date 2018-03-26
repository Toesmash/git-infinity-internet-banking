import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import Header from '../components/Header';
import SubHeader from '../components/SubHeader';

const PrivateRoute = (props) => {
  const { isAuthenticated, component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      component={(props) => (
        isAuthenticated ? <div><Header /><SubHeader /><Component {...props} /></div> : <Redirect to="/login" />
      )}
    />
  );
};

const mapStateToProps = reduxStore => ({
  isAuthenticated: !!reduxStore.auth.uid
});

export default connect(mapStateToProps)(PrivateRoute);
