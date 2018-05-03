// 3RD PARTY SOFTWARE
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'normalize.css/normalize.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

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
moment.locale('sk');

// KARTY 
// 377489064356041              4485330223583045               5500529686412539
// SK0077770000009876543210     SK0077770000001234567890       SK8677770000001994664121

// DEMO
// 349732010870069            4916232116752126            5186740581160914            6011697505122397
// SKXX77770000009876543210   SKXX7777000000123456789X    SKXX77770000001234567890    SKXX77770000001234567890

// generateData('karty', 'SKXX77770000001234567890', '6011697505122397', null, 2, 'demo'); // KARTY
// generateData('sepa', 'SKXX77770000001234567890', null, null, 15, 'demo'); // SEPA
// generateData('swift', 'SKXX77770000001234567890', null, null, 15, 'demo'); // SWIFT
// generateData('acctr', 'SKXX77770000001234567890', null, 'SKXX7777000000123456789X', 2, 'demo'); // ACCTR

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
    let userID = '';
    if (user.email === 'demo@infinity.sk') {
      userID = user.email.slice(0, 4);
    } else {
      userID = user.email.slice(0, 6);
    }
    reduxStore.dispatch(login(user.uid));
    reduxStore.dispatch(fetchUserData(userID)).then(() => {
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
