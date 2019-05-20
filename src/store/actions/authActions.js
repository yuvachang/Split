import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
// import firebase from '../../firebase/firebase';

const firebase = getFirebase()
const firestore = getFirestore()

// Instantiate google Oauth provider, give access to contacts & user profile info
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
})
googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts.readonly')
googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.profile')

// Indexing function => creates array of substrings
const indexFunc = (string) => {

  const index = []
  const stringArr = string.split('')
  let curr = ''
  stringArr.forEach(letter=> {
    curr += letter.toLowerCase()
    index.push(curr)
  })
  return index
}

// THUNK CREATORS
export const checkUserIndex = currentUserUid => async dispatch => {
  try {
    // console.log('checking user index for user', currentUserUid)
    const document = await firestore.collection('users').doc(currentUserUid)
    const documentGet = await document.get()
    const user = await documentGet.data()
    if (!user.index) {
      console.log('creating user index')
      const emailIndex = indexFunc(user.email)
      const nameIndex = indexFunc(user.displayName)
      const index = emailIndex.concat(nameIndex)
      await document.update({
        index
      })
    } 
    // else { console.log('user already indexed')}
  } catch (error) {
    console.error(error)
  }
}

export const signupThunk = userData => async dispatch => {
  try {
    dispatch({ type: actions.AUTH_START })

    // Create firebase user profile/doc with email & password
    const res = await firebase
      .auth()
      .createUserWithEmailAndPassword(userData.email, userData.password)
    
    // Retrieve created user, set first & last name and tel.
    await firestore
      .collection('users')
      .doc(res.user.uid)
      .set({
        email: userData.email,
        displayName: userData.firstName + ' ' + userData.lastName,
        tel: userData.tel,
      })

    // Send the verfication email
    const user = firebase.auth().currentUser
    await user.sendEmailVerification()

    dispatch({ type: actions.AUTH_SUCCESS })
    dispatch({ type: actions.AUTH_END })
  } catch (error) {
    console.error(error)
    dispatch({ type: actions.AUTH_FAIL, payload: error.message })
  }
}

// GOOGLE OAUTH
export const googleLoginThunk = () => async dispatch => {
  try {
    console.log('google login start')
    dispatch({ type: actions.AUTH_START, payload: {test: 'auth start'}})
    
    await firebase.auth().signInWithRedirect(googleAuthProvider)

    // dispatch({ type: actions.AUTH_SUCCESS })
    // dispatch({ type: actions.AUTH_END })
    
  } catch (error) {
    console.error(error)
    // // handle account-already-exists-with-different-credential
    // if (error.code === 'auth/account-exists-with-different-credential') {
    //   const pendingCred = error.credential
    //   const email = error.email
    //   const signInMethods = await oauthRes.fetchSignInMethodsForEmail(email)
    //   // account exists with email/password
    //   if (signInMethods[0] === 'password') {
    //     const password = await promptUserForPassword() // TODO: implement promptUserForPassword.
    //     const passwordUser = await oauthRes.signInWithEmailAndPassword(
    //       email,
    //       password
    //     )
    //     await passwordUser.linkWithCredential(pendingCred)
    //   }
    //   // account exists with external provider(s)
    //   const provider = getProviderForProviderId(methods[0])
    //   const providerSignIn = await oauthRes.signInWithPopup(provider)
    //   await providerSignIn.user.linkAndRetrieveDataWithCredential(pendingCred)

    // }

    dispatch({ type: actions.AUTH_FAIL, payload: error.message })
  }
}

//post google oauth redirect
export const getGoogleCreds = () => async dispatch => {
  try {
    console.log('inside check creds')
    const oauthRes = await firebase.auth().getRedirectResult()

    if (oauthRes.credential) {
      const token = oauthRes.credential.accessToken
      const user = oauthRes.user
      console.log(token, user)
      dispatch({ type: actions.AUTH_CREDS, payload: {token, user}})
    }
  } catch (error) {
    dispatch({ type: actions.AUTH_FAIL, payload: error.message })
  }
}

export const loginThunk = userData => async dispatch => {
  try {
    dispatch({ type: actions.AUTH_START })

    await firebase
      .auth()
      .signInWithEmailAndPassword(userData.email, userData.password)

    dispatch({ type: actions.AUTH_SUCCESS })
    dispatch({ type: actions.AUTH_END })
  } catch (error) {
    console.error(error)
    dispatch({ type: actions.AUTH_FAIL, payload: error.message })
  }
}

export const logoutThunk = () => async dispatch => {
  try {
    dispatch({ type: actions.AUTH_START })

    await firebase.auth().signOut()

    dispatch({ type: actions.AUTH_SUCCESS })
    dispatch({ type: actions.AUTH_END })
  } catch (error) {
    console.error(error)
    dispatch({ type: actions.AUTH_FAIL, payload: error.message })
  }
}
