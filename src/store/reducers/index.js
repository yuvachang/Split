import { combineReducers} from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore';



import authReducer from './authReducer'
// import billsReducer from './reducers/billsReducer'
import groupsReducer from './groupsReducer'
import friendsReducer from './friendsReducer'

export default combineReducers({
  auth: authReducer,
  // bills: billsReducer,
  groups: groupsReducer,
  friends: friendsReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
})

