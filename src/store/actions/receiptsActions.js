import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import { getCurrentUser, getDataWithRef, createEmptyRows, createUserAmounts, getUserByEmail } from './utilActions'

const firebase = getFirebase()
const firestore = getFirestore()

// THUNK CREATORS

// export const createReceiptInProgress = group => async dispatch => {
//   try {
//     console.log('inside createGroupInProgress  thunk', group)

//     dispatch({ type: actions.RECEIPTS_CREATING, payload: group })
//   } catch (error) {
//     console.log('ERROR: createGroupInProgress => ', error)
//     dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
//   }
// }

export const createReceipt = (data) => async dispatch => {
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
    }

    // create receipt doc
    const receiptRef = await firestore.collection('receipts').add(newReceipt)

    // add receipt ref to group and group members
    // or just 
    // const querySnapshot =  firebase.collection('receipts').where('members', 'array_contains', userRef)
    // const userReceipts = []  
    // await querySnapshot.forEach( async doc => {
    //   const docData = await doc.data()
    //   userReceipts.push(docData)
    // })



    console.log(receiptRef.id)

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
    console.log("inside fetchReceipts")

    // get current user
    const { userData, userRef } = await getCurrentUser(currentUID)

    const queryRef =  await firestore.collection('receipts')
      .where('members', 'array-contains', userRef)

    const userReceipts = []  

    const querySnapshot = await queryRef.get()

    await querySnapshot.forEach( async doc => {
      // const docData = await getDataWithRef(doc)
      // console.log(doc.id)
      const docData = await doc.data()
      docData.id = doc.id
      userReceipts.push(docData)
    })

    console.log(userReceipts)

    // let results = []

    // if (user.receipts) {
    //   results = await Promise.all(
    //     user.receipts.map(async receipt => {
    //       const receiptDoc = await receipt.get()
    //       const receiptData = await receiptDoc.data()
    //       receiptData.id = receipt.id
    //       return receiptData
    //     })
    //   )
    // }

    dispatch({ type: actions.RECEIPTS_FETCH, payload: userReceipts })
    dispatch({ type: actions.RECEIPTS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: fetchReceipts => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}
