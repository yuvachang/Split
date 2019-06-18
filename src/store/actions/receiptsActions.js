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

    // IF RECEIPT DOES NOT EXIST
    const receiptGet = await receiptRef.get()
    if (!receiptGet.exists) {
      dispatch({ type: actions.RECEIPTS_SELECT, payload: { id: 'DNE' } })
      return
    }

    // PROCEED IF RECEIPT EXISTS
    const receiptData = await getDataWithRef(receiptRef)
    const groupData = await getDataWithRef(receiptData.group)

    // const members = await Promise.all(
    //   receiptData.members.map(async memberRef => {
    //     if (memberRef.id===receiptData.payer.id) {
    //       const member = await getDataWithRef(memberRef)
    //       receiptData.payer = member
    //       return member
    //     }
    //     return await getDataWithRef(memberRef)
    //   })
    // )

    // receiptData.members = members
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

    // get selected group data
    const groupRef = await firestore.collection('groups').doc(data.groupId)
    const groupData = await getDataWithRef(groupRef)

    // create rows of items
    const rows = await createEmptyRows(data.rows)

    // create userAmounts catalogue
    const userAmounts = await createUserAmounts(
      groupData,
      data.payer.id || 123,
      data.total
    )

    // create receipt doc
    const newReceipt = {
      date: data.date,
      created: data.created,
      receiptName: data.receiptName,

      subtotal: data.subtotal,
      tip: data.tip,
      total: data.total,

      rows,
      group: groupRef,
      userAmounts,

      // isEdit: false,
    }
    const receiptRef = await firestore.collection('receipts').add(newReceipt)

    // add receipt ref to each member of group
    const batch = firestore.batch()
    groupData.members.forEach(async memberRef => {
      batch.set(
        memberRef,
        {
          receipts: firestore.FieldValue.arrayUnion(receiptRef),
        },
        { merge: true }
      )
    })
    batch.commit()

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

export const deleteReceipt = receiptId => async dispatch => {
  try {
    dispatch({ type: actions.RECEIPTS_LOADING })

    // get receipt ref and data
    const receiptRef = await firestore.collection('receipts').doc(receiptId)
    const receiptData = await getDataWithRef(receiptRef)

    // remove receipt refs from all users
    const batch = firestore.batch()
    const userRefsArr = await Promise.all(
      Object.keys(receiptData.userAmounts).map(async userId => {
        return await firestore.collection('users').doc(userId)
      })
    )
    userRefsArr.forEach(userRef => {
      batch.update(userRef, {
        receipts: firestore.FieldValue.arrayRemove(receiptRef),
      })
    })
    batch.commit()

    // delete receipt
    await receiptRef.delete()

    dispatch({ type: actions.RECEIPTS_DELETE, payload: receiptId })
    dispatch({ type: actions.RECEIPTS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: deleteReceipt => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

// lazy loading: set 'last index loaded' var
// increment with each triggered fetch

export const fetchReceipts = currentUID => async dispatch => {
  try {
    dispatch({ type: actions.RECEIPTS_LOADING })
    console.log('inside fetchReceipts')

    // get current user
    const { userData, userRef } = await getCurrentUser(currentUID)

    //check if all receipts exist, if any are undefined
    const undefinedReceipts = []
    // get data of all receipts

    const userReceipts = await Promise.all(
      userData.receipts.map(async receiptRef => {
        const receiptData = await getDataWithRef(receiptRef)
        if (!receiptData) {
          undefinedReceipts.push(receiptRef)
        }
        return receiptData
      })
    )

    if (undefinedReceipts.length) {
      //filter undefined from userReceipts
      // !!!!moved to front end list component: filter=>map
      // userReceipts.forEach((receipt, idx) => {
      //   if (!receipt) {
      //     userReceipts.splice(idx, 1)
      //   }
      // })

      // delete undefined receiptRefs from db
      const batch = firestore.batch()
      undefinedReceipts.forEach(receiptRef => {
        batch.update(userRef, {
          receipts: firestore.FieldValue.arrayRemove(receiptRef),
        })
      })
      await batch.commit()
      console.log('undefinedReceipts removed')
    }

    // console.log(userReceipts)

    dispatch({ type: actions.RECEIPTS_FETCH, payload: userReceipts })
    dispatch({ type: actions.RECEIPTS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: fetchReceipts => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const updateRow = (
  rowIdx,
  row,
  userAmounts,
  receiptId
) => async dispatch => {
  try {
    console.log(
      'inside updateRow thunk: ',
      'idx=>',
      rowIdx,
      'row=>',
      row,
      'rid=>',
      receiptId
    )

    const batch = firestore.batch()
    const receiptRef = await firestore.collection('receipts').doc(receiptId)

    // update affected row
    batch.update(receiptRef, {
      ['rows.' + rowIdx]: row,
    })

    // update receipt's date-modified
    batch.set(
      receiptRef,
      {
        updated: new Date(),
      },
      { merge: true }
    )

    // if users added to or removed from row, update userAmounts
    if (userAmounts) {
      console.log('updateRow: userAmounts updating')
      batch.update(receiptRef, {
        userAmounts,
      })
    }

    await batch.commit()
  } catch (error) {
    console.log('ERROR: updateRows => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const updateReceipt = (field, value, receiptId) => async dispatch => {
  try {
    console.log('inside updateReceipt thunk:', value)
    const batch = firestore.batch()
    const receiptRef = await firestore.collection('receipts').doc(receiptId)
    const receiptData = await getDataWithRef(receiptRef)

    if (field === 'tip' || field === 'subtotal') {
      let newTotal
      if (field === 'tip') {
        newTotal =
          (receiptData.subtotal * value) / 100 + Number(receiptData.subtotal)
      } else if (field === 'subtotal') {
        if (receiptData.tip) {
          newTotal = (receiptData.tip * value) / 100 + Number(value)
        } else {
          newTotal = value
        }
      }
      batch.update(receiptRef, {
        total: Number(newTotal),
      })
    }
    batch.update(receiptRef, {
      [field]: value,
    })

    await batch.commit()
  } catch (error) {
    console.log('ERROR: updateReceipt => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const updateUserAmounts = (usrAmts, receiptId) => async dispatch => {
  try {
    console.log('inside updateUserAmounts thunk:')

    const receiptRef = await firestore.collection('receipts').doc(receiptId)

    await receiptRef.update({
      userAmounts: usrAmts,
    })
  } catch (error) {
    console.log('ERROR: updateUserAmounts => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const updateSingleUserAmount = (
  userId,
  usrAmt,
  receiptId
) => async dispatch => {
  try {
    console.log('inside updateSingleUserAmount thunk:')

    const receiptRef = await firestore.collection('receipts').doc(receiptId)

    await receiptRef.update({
      ['userAmounts.' + userId]: usrAmt,
    })
  } catch (error) {
    console.log('ERROR: updateSingleUserAmount => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const toggleDeleteRow = (
  rowIdx,
  userAmounts,
  receiptId
) => async dispatch => {
  try {
    console.log('inside toggleDeleteRow')
    const batch = firestore.batch()

    const receiptRef = await firestore.collection('receipts').doc(receiptId)
    const receiptData = await getDataWithRef(receiptRef)

    const del = !receiptData.rows[rowIdx].deletePending
    batch.update(receiptRef, {
      ['rows.' + rowIdx + '.deletePending']: del,
    })

    batch.update(receiptRef, {
      userAmounts,
    })

    batch.commit()
  } catch (error) {
    console.log('ERROR: toggleDeleteRow => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const deleteRow = (rowIdx, receiptId) => async dispatch => {
  try {
    console.log('inside deleteRow')
    const receiptRef = await firestore.collection('receipts').doc(receiptId)

    await receiptRef.update({
      ['rows.' + rowIdx]: firestore.FieldValue.delete(),
    })
  } catch (error) {
    console.log('ERROR: deleteRow => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const addRow = (startIdx, receiptId) => async dispatch => {
  try {
    console.log('inside addRow')
    const receiptRef = await firestore.collection('receipts').doc(receiptId)
    await receiptRef.update({
      ['rows.' + startIdx]: {
        item: '',
        cost: '',
        users: [],
        deletePending: false,
        isEdit: false,
      },
    })
  } catch (error) {
    console.log('ERROR: addRow => ', error)
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
        // && source === 'Server'
        if (doc.exists) {
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
