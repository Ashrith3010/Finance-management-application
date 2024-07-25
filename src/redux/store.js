// src/redux/store.js
import { createStore, combineReducers } from 'redux';
import transactionReducer from './reducers/transactionReducer';

const rootReducer = combineReducers({
  transactions: transactionReducer,
  // other reducers if any
});

const store = createStore(rootReducer);

export default store;
