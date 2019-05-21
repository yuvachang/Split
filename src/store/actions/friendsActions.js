import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import { getCurrentUser, getDataWithRef, getUserByEmail } from './utilActions'

const firebase = getFirebase()
const firestore = getFirestore()
// const functions = firebase.functions()

// THUNK CREATORS
export const findPerson = (
  nameOrEmail,
  currentEmail,
  currFriendsArr
) => async dispatch => {
  try {
    dispatch({ type: actions.FRIENDS_LOADING })

    console.log('inside findPerson', nameOrEmail, currentEmail)

    //get own friends list
    const friendEmails = currFriendsArr.map(friend =>
      friend.email.toLowerCase()
    )

    const usersRef = await firestore
      .collection('users')
      .where('index', 'array-contains', nameOrEmail.toLowerCase())
      .get()

    const results = []

    usersRef.forEach(result => {
      let doc = result.data()
      // if search returns self or already a friend
      if (doc.email !== currentEmail && !friendEmails.includes(doc.email)) {
        results.push(doc)
      }
    })

    // directly returning search results, not saving to store
    if (results[0]) {
      dispatch({ type: actions.FRIENDS_ENDLOADING })
      return results
      // dispatch({type: actions.FRIENDS_SEARCH, payload: results})
    } else {
      // dispatch({type: actions.FRIENDS_SEARCH, payload: [{ error: 'No new people found with that name or email.' }]})
      dispatch({ type: actions.FRIENDS_ENDLOADING })
      return [{ error: 'No new people found with that name or email.' }]
    }

  } catch (error) {
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const addFriend = (email, uid) => async dispatch => {
  try {
    dispatch({ type: actions.FRIENDS_LOADING })

    // get friend reference and data
    const { userId: friendId, userData: friendData } = await getUserByEmail(
      email
    )
    const friend = await firestore.collection('users').doc(friendId)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(uid)

    // save reference to current user
    if (!userData.friends) {
      await userRef.update({
        friends: [friend],
      })
    } else {
      await userRef.update({
        friends: firestore.FieldValue.arrayUnion(friend),
      })
    }

    // add friend to redux store's friends list
    dispatch({ type: actions.FRIENDS_ADD, payload: friendData })
    dispatch({ type: actions.FRIENDS_ENDLOADING })
  } catch (error) {
    console.error(error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const fetchFriends = currentUID => async dispatch => {
  try {
    // CLOUD FUNCTION (but takes 3200ms)
    // const mapFriendsFunction = functions.httpsCallable('mapFriends')
    // const func = await mapFriendsFunction(currentUID)

    console.log('inside fetchfriends')

    // get current user reference
    const { userData } = await getCurrentUser(currentUID)

    // convert friends refs to data array
    const friends = await Promise.all(
      userData.friends.map(async friend => {
        return getDataWithRef(friend)
      })
    )

    await dispatch({ type: actions.FRIENDS_LIST, payload: friends })
  } catch (error) {
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const removeFriend = (email, currentUID) => async dispatch => {
  try {
    dispatch({ type: actions.FRIENDS_LOADING })

    console.log('inside removeFriend')

    // get friend reference
    const { userId: friendId, userData: friendData } = await getUserByEmail(
      email
    )
    const friend = await firestore.collection('users').doc(friendId)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    // remove friend from current user database
    await userRef.update({
      friends: firestore.FieldValue.arrayRemove(friend),
    })

    dispatch({ type: actions.FRIENDS_REMOVE, payload: friendData.email })
    dispatch({ type: actions.FRIENDS_ENDLOADING })
  } catch (error) {
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}
