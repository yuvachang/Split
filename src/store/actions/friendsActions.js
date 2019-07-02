import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import { getCurrentUser, getDataWithRef, getUserByEmail } from './utilActions'

// const firebase = getFirebase()
const firestore = getFirestore()

// THUNK CREATORS
export const findPerson = (
  nameOrEmail,
  currentEmail,
  currFriendsArr
) => async dispatch => {
  try {
    console.log('inside findPerson', nameOrEmail, currentEmail, currFriendsArr)

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
      // filter out current friends and self
      if (doc.email !== currentEmail && !friendEmails.includes(doc.email)) {
        // check if request pending HERE
        doc.id = result.id
        results.push(doc)
      }
    })

    // directly returning search results, not saving to store
    if (results[0]) {
      return results
    } else {
      return [{ id: '123', error: 'Nothing found' }]
    }
  } catch (error) {
    console.error('ERROR: findPerson => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const makeFriendRequest = (friendId, currentUID) => async dispatch => {
  try {
    // get friend reference and data
    const friendRef = await firestore.collection('users').doc(friendId)
    const friendData = await getDataWithRef(friendRef)

    // get current user reference
    const userRef = await firestore.collection('users').doc(currentUID)
    const batch = firestore.batch()

    batch.update(userRef, {
      'pending.friends.madeRequest': firestore.FieldValue.arrayUnion(friendRef),
    })

    batch.update(friendRef, {
      'pending.friends.receivedRequest': firestore.FieldValue.arrayUnion(
        userRef
      ),
    })

    batch.commit()

    dispatch({ type: actions.FRIENDS_MADE_REQUEST, payload: friendData })
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
    console.log('inside cancelOutgoingRequest', friendId)
    // get friend reference and data
    const friendRef = await firestore.collection('users').doc(friendId)
    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    const batch = firestore.batch()

    batch.update(userRef, {
      'pending.friends.madeRequest': firestore.FieldValue.arrayRemove(
        friendRef
      ),
    })

    batch.update(friendRef, {
      'pending.friends.receivedRequest': firestore.FieldValue.arrayRemove(
        userRef
      ),
    })

    await batch.commit()

    dispatch({ type: actions.FRIENDS_CANCEL_REQUEST, payload: friendId })
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
    console.log('inside confirmfriendrequest')
    // get friend reference and data
    const friendRef = await firestore.collection('users').doc(friendId)
    const friendData = await getDataWithRef(friendRef)
    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    const batch = firestore.batch()

    // confirm friend request from friend, move friend from pending to friendslist
    if (!userData.friends) {
      batch.update(userRef, {
        friends: [friendRef],
      })
    } else {
      batch.update(userRef, {
        friends: firestore.FieldValue.arrayUnion(friendRef),
        'pending.friends.receivedRequest': firestore.FieldValue.arrayRemove(
          friendRef
        ),
      })
    }

    batch.update(friendRef, {
      friends: firestore.FieldValue.arrayUnion(userRef),
      'pending.friends.confirmed': firestore.FieldValue.arrayUnion(userRef),
      'pending.friends.madeRequest': firestore.FieldValue.arrayRemove(userRef),
    })

    batch.commit()

    // add friend to redux store's friends list
    dispatch({ type: actions.FRIENDS_ADD, payload: friendData })
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
    console.log('inside rejectfriendreuqest')

    // get friend reference and data
    const friendRef = await firestore.collection('users').doc(friendId)
    const friendData = await getDataWithRef(friendRef)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    const batch = firestore.batch()

    batch.update(friendRef, {
      'pending.friends.madeRequest': firestore.FieldValue.arrayRemove(userRef),
    })

    batch.update(userRef, {
      'pending.friends.receivedRequest': firestore.FieldValue.arrayRemove(
        friendRef
      ),
    })

    batch.commit()
  } catch (error) {
    console.error('ERROR: rejectFriendRequest => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const fetchPending = currentUID => async dispatch => {
  try {
    console.log('inside fetchPending')
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

    dispatch({
      type: actions.FRIENDS_PENDING,
      payload: { confirmed, madeRequest, receivedRequest },
    })
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

    let friends = []

    if (userData.friends) {
      friends = await Promise.all(
        userData.friends.map(async friend => {
          return getDataWithRef(friend)
        })
      )
    }

    dispatch({ type: actions.FRIENDS_LIST, payload: friends })
  } catch (error) {
    console.error('ERROR: fetchFriends => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}

export const removeFriend = (email, currentUID) => async dispatch => {
  try {
    console.log('inside removeFriend')

    // get friend reference
    const { userId: friendId, userData: friendData } = await getUserByEmail(
      email
    )
    const friendRef = await firestore.collection('users').doc(friendId)

    // get current user reference
    const { userRef, userData } = await getCurrentUser(currentUID)

    const batch = firestore.batch()

    // remove friend from current user database
    batch.update(userRef, {
      friends: firestore.FieldValue.arrayRemove(friendRef),
    })

    // remove self from friend's list
    batch.update(friendRef, {
      friends: firestore.FieldValue.arrayRemove(userRef),
    })

    batch.commit()

    dispatch({ type: actions.FRIENDS_REMOVE, payload: friendData.email })
  } catch (error) {
    console.error('ERROR: removeFriend => ', error)
    dispatch({ type: actions.FRIENDS_ERROR, payload: error.message })
  }
}
