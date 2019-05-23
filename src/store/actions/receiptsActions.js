import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import { getCurrentUser, getDataWithRef, getUserByEmail } from './utilActions'

const firebase = getFirebase()
const firestore = getFirestore()

// THUNK CREATORS

export const createGroupInProgress = group => async dispatch => {
  try {
    console.log('inside createGroupInProgress  thunk', group)

    dispatch({ type: actions.RECEIPTS_CREATING, payload: group })
  } catch (error) {
    console.log('ERROR: createGroupInProgress => ', error)
    dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
  }
}

export const createGroup = (data, currentUID) => async dispatch => {
  try {
    dispatch({ type: actions.RECEIPTS_LOADING })

    console.log('inside CREATEGROUP', group, currentUID)
    // add 


    const createEmptyRows = rowCount => {
      let count=0
      const rows = []
      while (count < rowCount) {
        rows.push({
          rowIdx: count,
          item: '',
          cost: '',
          users: [],
          delete: false
        })
        count++
      }
      return rows
    }

    const createUserAmounts = groupId => {
      const userAmounts = {}

      const groupRef = firestore.collection('groups').doc(groupId)
      const groupData = getDataWithRef(groupRef)

      groupData.members.map( async member=> {
        const memberData = await getDataWithRef(member)
        return memberData.id
      })




      userAmounts[user.email] = {
        name: user.name,
        amount: 0,
        items: {}
      }
    }

    const newReceipt = {
      date: new Date().getTime()/1000,
      rows: await createEmptyRows(data.rows),
      payer: data.payer,
      group: data.group,
      userAmounts: await createUserAmounts(data.group.id)
    }

    // create receipt doc
    await firestore.collection('receipts').add({
      

    })

    

    // array of group members not including currentUser/creator
    const memberRefs = await Promise.all(
      group.members.map(
        async member => await firestore.collection('users').doc(member.id)
      )
    )

    // get current user
    const { userRef, userData } = await getCurrentUser(currentUID)

    // push current user into members list
    memberRefs.push(userRef)

    // newgroupref.id = uid
    const newGroupRef = await firestore.collection('groups').add({
      groupName: group.groupName,
      members: memberRefs,
      receipts: [],
    })

    // find all members of group and add the created group to their profiles
    await memberRefs.forEach(async member => {
      const { userRef: memberRef, userData: memberData } = await getCurrentUser(
        member.id
      )

      if (memberData.groups) {
        await memberRef.update({
          groups: [...memberData.groups, newGroupRef],
        })
      } else {
        await memberRef.update({
          groups: [newGroupRef],
        })
      }
    })

    // append group to redux store
    const groupData = await getDataWithRef(newGroupRef)
    dispatch({ type: actions.RECEIPTS_CREATE, payload: groupData })
    dispatch({ type: actions.RECEIPTS_ENDLOADING })
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

// export const fetchReceipts = currentUID => async dispatch => {
//   try {
//     dispatch({ type: actions.RECEIPTS_LOADING })

//     // get current user
//     const { userData: user } = await getCurrentUser(currentUID)

//     let results = []

//     if (user.receipts) {
//       results = await Promise.all(
//         user.receipts.map(async receipt => {
//           const receiptDoc = await receipt.get()
//           const receiptData = await receiptDoc.data()
//           receiptData.id = receipt.id
//           return receiptData
//         })
//       )
//     }

//     dispatch({ type: actions.RECEIPTS_FETCH, payload: results })
//     dispatch({ type: actions.RECEIPTS_ENDLOADING })
//   } catch (error) {
//     console.log('ERROR: fetchReceipts => ', error)
//     dispatch({ type: actions.RECEIPTS_ERROR, payload: error.message })
//   }
// }
