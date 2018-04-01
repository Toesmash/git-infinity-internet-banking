// 3RD PARTY SOFTWARE
import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

// FIREBASE
import { firebase } from './firebase/firebase';
// STORE
import configureStore from './store/configureStore';
// ACTIONS
import { login, logout } from './actions/authActions';
import { fetchUserData } from './actions/fetchActions';
// COMPONENTS
import App from './components/App';
import LoadingPage from './components/LoadingPage';
// STYLES
import './styles/styles.scss';

const reduxStore = configureStore();

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     reduxStore.dispatch(login(user.uid));
//     ReactDOM.render(<App store={reduxStore} user={user} />, document.getElementById('app'));
//   } else {
//     reduxStore.dispatch(logout());
//     ReactDOM.render(<App store={reduxStore} />, document.getElementById('app'));
//   }
// });

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    reduxStore.dispatch(login(user.uid));
    reduxStore.dispatch(fetchUserData(user.email.slice(0, 6))).then(() => {
      ReactDOM.render(<App store={reduxStore} />, document.getElementById('app'));
      // setTimeout(() => {
      //   ReactDOM.render(<App store={reduxStore} />, document.getElementById('app'));
      // }, 4000);
    });
  } else {
    reduxStore.dispatch(logout());
    ReactDOM.render(<App store={reduxStore} />, document.getElementById('app'));
  }
});
