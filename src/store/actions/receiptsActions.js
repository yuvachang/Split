import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import {
  getCurrentUser,
  getDataWithRef,
  createEmptyRows,
  createUserAmounts,
  calcOwesAndDebts,
  rdNum2,
} from './utilActions'
import { promised } from 'q'

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
      data.payer.id || 0,
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

    batch.set(
      groupRef,
      {
        receipts: firestore.FieldValue.arrayUnion(receiptRef),
      },
      { merge: true }
    )

    batch.commit()

    // append receipt to redux store
    newReceipt.id = receiptRef.id
    console.log('inside createReceipt: newReceipt: ', newReceipt)

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
  } catch (error) {
    console.log('ERROR: deleteReceipt => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

// lazy loading: set 'last index loaded' var
// increment with each triggered fetch

export const fetchReceipts = currentUID => async dispatch => {
  try {
    console.log('inside fetchReceipts')

    // get current user
    const { userData, userRef } = await getCurrentUser(currentUID)

    //check if user has receipts array
    let userReceipts = []
    if (userData.receipts) {
      //check if all receipts exist, if any are undefined
      const undefinedReceipts = []

      // get data of all receipts
      userReceipts = await Promise.all(
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
    }

    dispatch({ type: actions.RECEIPTS_FETCH, payload: userReceipts })
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
    console.log('inside updateRow thunk')

    const batch = firestore.batch()
    const receiptRef = await firestore.collection('receipts').doc(receiptId)

    // update affected row
    batch.update(receiptRef, {
      ['rows.' + rowIdx]: row,
    })

    // update receipt's date-modified
    batch.set(receiptRef, { updated: new Date() }, { merge: true })

    // if users added to or removed from row, update userAmounts
    if (userAmounts) {
      // console.log('updateRow: userAmounts updating')
      const newUsrAmts = calcOwesAndDebts(userAmounts)
      batch.update(receiptRef, {
        userAmounts: newUsrAmts,
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
    console.log('inside updateReceipt thunk, value: ', value)
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

export const updateUserAmounts = (userAmounts, receiptId) => async dispatch => {
  try {
    console.log('inside updateUserAmounts thunk:', userAmounts)

    const receiptRef = await firestore.collection('receipts').doc(receiptId)
    const newUsrAmts = calcOwesAndDebts(userAmounts)
    await receiptRef.update({
      userAmounts: newUsrAmts,
    })
  } catch (error) {
    console.log('ERROR: updateUserAmounts => ', error)
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
    const newUsrAmts = calcOwesAndDebts(userAmounts)

    batch.update(receiptRef, {
      ['rows.' + rowIdx + '.deletePending']: del,
    })
    batch.update(receiptRef, {
      userAmounts: newUsrAmts,
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
    console.log('inside addRow', startIdx, receiptId)
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
    console.log('%c Subscribed to receipt: ' + receiptId, 'color: green;')

    unsubscribe = await firestore
      .collection('receipts')
      .doc(receiptId)
      .onSnapshot(async function(doc) {
        // const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
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

    console.log('%c Unsubscribed from receipt: ' + receiptId, 'color: red;')
  } catch (error) {
    console.log('ERROR: listenReceipt => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

// get user stats
export const getUserStats = UID => async dispatch => {
  try {
    const { userData } = await getCurrentUser(UID)
    const stats = {}

    let userReceipts = []

    if (userData.receipts) {
      userReceipts = await Promise.all(
        userData.receipts.map(async receiptRef => {
          const receiptData = await getDataWithRef(receiptRef)
          if (!receiptData) {
            return 0
          } else {
            return (
              receiptData.userAmounts[UID].amount ||
              receiptData.userAmounts[UID].owe ||
              0
            )
          }
        })
      )

      stats.totalSpending = rdNum2(userReceipts.reduce((a, b) => a + b))
    }

    dispatch({ type: actions.RECEIPTS_STATS, payload: stats })
  } catch (error) {
    console.error(error)
    dispatch({ type: actions.AUTH_FAIL, payload: error.message })
  }
}
