import React from 'react';
import { Provider } from 'react-redux';
import AppRouter from '../routers/AppRouter';

const App = (props) => (
  <Provider store={props.store}>
    <AppRouter />
  </Provider>
);

export default App;
