import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'

const firebase = getFirebase()
const firestore = getFirestore()

// THUNK CREATORS

export const findFriendThunk = (email, name) => async dispatch => {
  console.log(email)
  dispatch({type: actions.FRIENDS_LOADING})
  const query = await firestore.collection('users').where('email', '==', email)
  const querySnapshot = await query.get()
  if (!querySnapshot.empty) {
    const queryDocumentSnapshot = querySnapshot.docs
    const friend = queryDocumentSnapshot[0].data()
    dispatch({ type: actions.FRIENDS_SELECT, payload: friend })
  } else {
    dispatch({ type: actions.FRIENDS_ERROR, payload: 'user not found' })
  }
  dispatch({type: actions.FRIENDS_ENDLOADING})
}

export const addFriendEmail = ({ email, uid }) => async dispatch => {
  try {
    const currentUser = await firestore
      .collection('users')
      .doc(uid)
      .get()

    // findFriend({email: 'bob@email.com', tel: null})
    // console.log('inside addfriend thunk', currentUser.data())
    // console.log('invoke findfriend', findFriend({email: 'bob@email.com'}))

    dispatch({ type: actions.FRIENDS_ADD })
  } catch (error) {
    console.error(error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}
