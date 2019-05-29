import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import {
  getCurrentUser,
  getDataWithRef,
  createEmptyRows,
  createUserAmounts,
  getUserByEmail,
} from './utilActions'

const firebase = getFirebase()
const firestore = getFirestore()

// THUNK CREATORS

export const selectReceipt = receiptId => async dispatch => {
  try {
    console.log('inside selectReceipt')

    const receiptRef = await firestore.collection('receipts').doc(receiptId)

    // CHECK IF RECEIPT EXISTS
    const receiptGet = await receiptRef.get()
    if (!receiptGet.exists) {
      dispatch({ type: actions.RECEIPTS_SELECT, payload: { id: 'DNE' } })
      return
    }

    // PROCEED IF RECEIPT EXISTS
    const receiptData = await getDataWithRef(receiptRef)
    const groupData = await getDataWithRef(receiptData.group)
    const members = await Promise.all(
      receiptData.members.map(async memberRef => {
        return await getDataWithRef(memberRef)
      })
    )

    receiptData.members = members
    receiptData.group = groupData

    dispatch({ type: actions.RECEIPTS_SELECT, payload: receiptData })
  } catch (error) {
    console.log('ERROR: selectReceipt => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const createReceipt = data => async dispatch => {
  try {
    dispatch({ type: actions.RECEIPTS_LOADING })

    console.log('inside createReceipt', data)

    const groupRef = await firestore.collection('groups').doc(data.groupId)
    const groupData = await getDataWithRef(groupRef)

    const rows = await createEmptyRows(data.rows)

    console.log('rows', rows)
    const userAmounts = await createUserAmounts(groupData)
    console.log('userAmounts', userAmounts)
    const payer = await firestore.collection('users').doc(data.payer.id)

    const newReceipt = {
      date: data.date,
      created: data.created,
      receiptName: data.receiptName,
      rows,
      payer,
      members: groupData.members,
      group: groupRef,
      userAmounts,
      isEdit: false,
    }

    // create receipt doc
    const receiptRef = await firestore.collection('receipts').add(newReceipt)

    // append receipt to redux store
    newReceipt.id = receiptRef.id

    dispatch({ type: actions.RECEIPTS_CREATE, payload: newReceipt })
    dispatch({ type: actions.RECEIPTS_ENDLOADING })

    return newReceipt
  } catch (error) {
    console.log('ERROR: createGroup => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

// export const deleteGroup = groupId => async dispatch => {
//   try {
//     dispatch({ type: actions.RECEIPTS_LOADING })

//     const groupRef = await firestore.collection('groups').doc(groupId)
//     const groupGet = await groupRef.get()
//     const groupData = await groupGet.data()
//     const memberRefs = groupData.members

//     await memberRefs.forEach(async member => {
//       const { userRef: memberRef, userData: memberData } = await getCurrentUser(
//         member.id
//       )
//       await memberRef.update({
//         groups: memberData.groups.filter(group => group.id !== groupId),
//       })
//     })

//     await groupRef.delete()

//     dispatch({ type: actions.RECEIPTS_DELETE, payload: groupId })
//     dispatch({ type: actions.RECEIPTS_ENDLOADING })
//   } catch (error) {
//     console.log('ERROR: deleteGroup => ', error)
//     dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
//   }
// }

export const fetchReceipts = currentUID => async dispatch => {
  try {
    dispatch({ type: actions.RECEIPTS_LOADING })
    console.log('inside fetchReceipts')

    // get current user
    const { userData, userRef } = await getCurrentUser(currentUID)

    const queryRef = await firestore
      .collection('receipts')
      .where('members', 'array-contains', userRef)

    const querySnapshot = await queryRef.get()

    const userReceipts = []
    await querySnapshot.forEach(async doc => {
      const docData = await doc.data()
      docData.id = doc.id
      userReceipts.push(docData)
    })

    console.log(userReceipts)

    dispatch({ type: actions.RECEIPTS_FETCH, payload: userReceipts })
    dispatch({ type: actions.RECEIPTS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: fetchReceipts => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

let unsubscribe

export const listenReceipt = receiptId => async dispatch => {
  try {
    console.log('subscribed to receipt: ', receiptId)

    unsubscribe = await firestore
      .collection('receipts')
      .doc(receiptId)
      .onSnapshot(async function(doc) {
        const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
        if (doc.exists && source === 'Server') {
          const receiptData = await doc.data()
          receiptData.id = doc.id
          dispatch({ type: actions.RECEIPTS_UPDATE, payload: receiptData })
        }
        if (!doc.exists) {
          dispatch({ type: actions.RECEIPTS_SELECT, payload: { id: 'DNE' } })
          return
        }
      })
  } catch (error) {
    console.log('ERROR: listenReceipt => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const updateRow = (rowIdx, row, receiptId) => async dispatch => {
  try {
    console.log(
      'inside updateRow thunk: ',
      'idx',
      rowIdx,
      'row',
      row,
      'rid',
      receiptId
    )

    const receiptRef = await firestore.collection('receipts').doc(receiptId)
    await receiptRef.update({
      ['rows.' + rowIdx]: row,
    })
  } catch (error) {
    console.log('ERROR: updateRows => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const unlistenReceipt = receiptId => async dispatch => {
  try {
    //In case of the web and node.js SDK, calling onSnapshot returns a function that you need to save in a variable and call when you want to remove the listener.
    // apparently needs to be same instance of unsubscribe

    unsubscribe()

    console.log('unsubscribed from receipt: ', receiptId)
  } catch (error) {
    console.log('ERROR: listenReceipt => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}
