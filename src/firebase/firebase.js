import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: process.env.REACT_APP_apikey,
  authDomain: "ezsplit-1901.firebaseapp.com",
  databaseURL: "https://ezsplit-1901.firebaseio.com",
  projectId: "ezsplit-1901",
  storageBucket: "ezsplit-1901.appspot.com",
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId
};

// export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts.readonly')
// googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.profile')

firebase.initializeApp(config) 
firebase.firestore()

export default firebase





// export const auth = firebase.auth();