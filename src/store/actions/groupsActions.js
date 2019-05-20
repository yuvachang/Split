import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'

const firebase = getFirebase()
const firestore = getFirestore()

// THUNK CREATORS

export const createGroupInProgress = group => async dispatch => {
  try {

    console.log( 'inside createGroupInProgress  thunk', group)
    dispatch({ type: actions.GROUPS_CREATING, payload: group })
  } catch (error) {
    console.log('ERROR: createGroupInProgress => ', error)
    dispatch({ type: actions.GROUPS_ERROR, payload: error.message })
  }
}

export const createGroup = (email, uid) => async dispatch => {
  try {
    dispatch({ type: actions.GROUPS_LOADING })

    // get friend reference
    const friendQuery = await firestore
      .collection('users')
      .where('email', '==', email)
      .get()
    const friendId = friendQuery.docs[0].id
    const friend = await firestore.collection('users').doc(friendId)
    const friendGet = await friend.get()
    const friendData = await friendGet.data()

    // get current user reference
    const document = await firestore.collection('users').doc(uid)
    const documentGet = await document.get()
    const user = await documentGet.data()

    // save reference to current user
    if (!user.friends) {
      await document.update({
        friends: [friend],
      })
    } else {
      await document.update({
        friends: firestore.FieldValue.arrayUnion(friend),
      })
    }

    // get friend data from reference to pass to redux store
    dispatch({ type: actions.GROUPS_CREATE, payload: friendData })
    dispatch({ type: actions.GROUPS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: createGroup => ', error)
    dispatch({ type: actions.GROUPS_ERROR, payload: error.message })
  }
}

export const fetchGroups = currentUID => async dispatch => {
  try {
    dispatch({ type: actions.GROUPS_LOADING })
    // CLOUD FUNCTION (but takes 3200ms)
    // const mapFriendsFunction = functions.httpsCallable('mapFriends')
    // const func = await mapFriendsFunction(currentUID)

    // get current user
    const document = await firestore.collection('users').doc(currentUID)
    const documentGet = await document.get()
    const user = await documentGet.data()

    const results = []

    if (user.groups) {
       results = await Promise.all(
        user.groups.map(async group => {
          const groupDoc = await group.get()
          const groupData = await groupDoc.data()
          return groupData
        })
      )
    } 

    dispatch({ type: actions.GROUPS_FETCH, payload: results })
    dispatch({ type: actions.GROUPS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: fetchGroups => ', error)
    dispatch({ type: actions.GROUPS_ERROR, payload: error.message })
  }
}
