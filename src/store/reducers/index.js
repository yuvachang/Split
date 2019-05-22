import { combineReducers} from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore';



import authReducer from './authReducer'
import receiptsReducer from './receiptsReducer'
import groupsReducer from './groupsReducer'
import friendsReducer from './friendsReducer'

export default combineReducers({
  auth: authReducer,
  receipts: receiptsReducer,
  groups: groupsReducer,
  friends: friendsReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
})

