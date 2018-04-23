import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/authReducer';
import accReducer from '../reducers/accReducer';
import txnReducer from '../reducers/txnReducer';
import cardsReducer from '../reducers/cardsReducer';
import filterReducer from '../reducers/filterReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      accounts: accReducer,
      transactions: txnReducer,
      cards: cardsReducer,
      filter: filterReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );
  return store;
};

export default configureStore;
