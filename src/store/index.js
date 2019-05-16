// import { createStore, applyMiddleware } from 'redux'
// import thunkMiddleware from 'redux-thunk'
// // import {createLogger} from 'redux-logger'
import rootReducer from './reducers'

// import { combineReducers } from 'redux'
// import { firebaseReducer } from 'react-redux-firebase'

import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import firebase from '../firebase/firebase';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { reduxFirestore, getFirestore } from 'redux-firestore';

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users', //uses 'users' collection in firestore
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  // attachAuthIsReady: true, // attaches authisready promise to store
};

// chrome devtools redux extension:: 
const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    reduxFirestore(firebase),
    reactReduxFirebase(firebase, rrfConfig),
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
  )
);

export default store;