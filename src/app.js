import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'normalize.css/normalize.css';

import { firebase } from './firebase/firebase';
import configureStore from './store/configureStore';
import AppRouter from './routers/AppRouter';
import { login, logout } from './actions/authActions';
import LoadingPage from './components/LoadingPage';

// styles
import './styles/styles.scss';

const reduxStore = configureStore();
let hasRendered = false;
const app = (
  <Provider store={reduxStore}>
    <AppRouter />
  </Provider>
);

const renderApp = () => {
  console.log('rendering');
  if (!hasRendered) {
    ReactDOM.render(app, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    reduxStore.dispatch(login(user.uid));
    renderApp();
  } else {
    reduxStore.dispatch(logout());
    renderApp();
  }
});
