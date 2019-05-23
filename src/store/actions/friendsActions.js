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
        // check if request pending HERE
        results.push(doc)
      }
    })

    // directly returning search results, not saving to store
    if (results[0]) {
      dispatch({ type: actions.FRIENDS_ENDLOADING })
      return results
    } else {
      dispatch({ type: actions.FRIENDS_ENDLOADING })
      return [{ error: 'No new people found with that name or email.' }]
    }
  } catch (error) {
    console.error('ERROR: findPerson => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const makeFriendRequest = (
  friendEmail,
  currentUID
) => async dispatch => {
  try {
    dispatch({ type: actions.FRIENDS_LOADING })

    // get friend reference and data
    const { userId: friendId, userData: friendData } = await getUserByEmail(
      friendEmail
    )
    const friendRef = await firestore.collection('users').doc(friendId)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    await userRef.update({
      'pending.friends.madeRequest': firestore.FieldValue.arrayUnion(friendRef),
    })
    await friendRef.update({
      'pending.friends.receivedRequest': firestore.FieldValue.arrayUnion(
        userRef
      ),
    })

    dispatch({ type: actions.FRIENDS_ENDLOADING })
  } catch (error) {
    console.error('ERROR: makeFriendRequest => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const cancelOutgoingRequest = (
  friendId,
  currentUID
) => async dispatch => {
  try {
    dispatch({ type: actions.FRIENDS_LOADING })

    // get friend reference and data
    const friendRef = await firestore.collection('users').doc(friendId)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    await userRef.update({
      'pending.friends.madeRequest': firestore.FieldValue.arrayRemove(
        friendRef
      ),
    })
    await friendRef.update({
      'pending.friends.receivedRequest': firestore.FieldValue.arrayRemove(
        userRef
      ),
    })

    dispatch({ type: actions.FRIENDS_ENDLOADING })
  } catch (error) {
    console.error('ERROR: cancelOutgoingRequest => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const confirmFriendRequest = (
  friendId,
  currentUID
) => async dispatch => {
  try {
    dispatch({ type: actions.FRIENDS_LOADING })

    console.log('inside confirmfriendrequest')
    // get friend reference and data
    const friendRef = await firestore.collection('users').doc(friendId)
    const friendData = await getDataWithRef(friendRef)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    // confirm friend request from friend, move friend from pending to friendslist
    if (!userData.friends) {
      await userRef.update({
        friends: [friendRef],
      })
    } else {
      await userRef.update({
        friends: firestore.FieldValue.arrayUnion(friendRef),
        'pending.friends.receivedRequest': firestore.FieldValue.arrayRemove(
          friendRef
        ),
      })
    }

    await friendRef.update({
      friends: firestore.FieldValue.arrayUnion(userRef),
      'pending.friends.confirmed': firestore.FieldValue.arrayUnion(userRef),
      'pending.friends.madeRequest': firestore.FieldValue.arrayRemove(userRef),
    })

    // add friend to redux store's friends list
    dispatch({ type: actions.FRIENDS_ADD, payload: friendData })
    dispatch({ type: actions.FRIENDS_ENDLOADING })
  } catch (error) {
    console.error('ERROR: confirmFriendRequest => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const dismissConfirm = (friendId, currentUID) => async dispatch => {
  try {
    // get friend reference and data
    const friendRef = await firestore.collection('users').doc(friendId)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    await userRef.update({
      'pending.friends.confirmed': firestore.FieldValue.arrayRemove(friendRef),
    })

    dispatch({ type: actions.FRIENDS_CLEARCONFIRM, payload: friendId })
  } catch (error) {
    console.error('ERROR: dismissConfirm => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const rejectFriendRequest = (friendId, currentUID) => async dispatch => {
  try {
    dispatch({ type: actions.FRIENDS_LOADING })

    // get friend reference and data
    const friendRef = await firestore.collection('users').doc(friendId)
    const friendData = await getDataWithRef(friendRef)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    await friendRef.update({
      'pending.friends.madeRequest': firestore.FieldValue.arrayRemove(userRef),
    })

    await userRef.update({
      'pending.friends.receivedRequest': firestore.FieldValue.arrayRemove(
        friendRef
      ),
    })

    dispatch({ type: actions.FRIENDS_ENDLOADING })
  } catch (error) {
    console.error('ERROR: rejectFriendRequest => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const fetchPending = currentUID => async dispatch => {
  try {
    dispatch({ type: actions.FRIENDS_LOADING })

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    let confirmed,
      madeRequest,
      receivedRequest = []

    if (userData.pending.friends.confirmed) {
      confirmed = await Promise.all(
        userData.pending.friends.confirmed.map(async friend => {
          return getDataWithRef(friend)
        })
      )
    }
    if (userData.pending.friends.madeRequest) {
      madeRequest = await Promise.all(
        userData.pending.friends.madeRequest.map(async request => {
          return getDataWithRef(request)
        })
      )
    }
    if (userData.pending.friends.receivedRequest) {
      receivedRequest = await Promise.all(
        userData.pending.friends.receivedRequest.map(async request => {
          return getDataWithRef(request)
        })
      )
    }

    console.log(confirmed, madeRequest, receivedRequest)

    dispatch({
      type: actions.FRIENDS_PENDING,
      payload: { confirmed, madeRequest, receivedRequest },
    })
    dispatch({ type: actions.FRIENDS_ENDLOADING })
  } catch (error) {
    console.error('ERROR: rejectFriendRequest => ', error)
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

    dispatch({ type: actions.FRIENDS_LIST, payload: friends })
  } catch (error) {
    console.error('ERROR: fetchFriends => ', error)
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
    const friendRef = await firestore.collection('users').doc(friendId)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    // remove friend from current user database
    await userRef.update({
      friends: firestore.FieldValue.arrayRemove(friendRef),
    })

    // remove self from friend's list
    await friendRef.update({
      friends: firestore.FieldValue.arrayRemove(userRef),
    })

    dispatch({ type: actions.FRIENDS_REMOVE, payload: friendData.email })
    dispatch({ type: actions.FRIENDS_ENDLOADING })
  } catch (error) {
    console.error('ERROR: removeFriend => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}
