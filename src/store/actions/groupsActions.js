import * as actions from './actionTypes'
import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'
import { getCurrentUser, getDataWithRef, getUserByEmail } from './utilActions'
import { typeCastExpression } from '@babel/types';

const firebase = getFirebase()
const firestore = getFirestore()

// THUNK CREATORS

export const createGroupInProgress = group => async dispatch => {
  try {
    console.log('inside createGroupInProgress  thunk', group)
    dispatch({ type: actions.GROUPS_CREATING, payload: group })
  } catch (error) {
    console.log('ERROR: createGroupInProgress => ', error)
    dispatch({ type: actions.GROUPS_ERROR, payload: error.message })
  }
}

export const createGroup = (group, currentUID) => async dispatch => {
  try {
    dispatch({ type: actions.GROUPS_LOADING })

    console.log('inside CREATEGROUP', group, currentUID)
    // get myself, add to users list

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
    dispatch({ type: actions.GROUPS_CREATE, payload: groupData })
    dispatch({ type: actions.GROUPS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: createGroup => ', error)
    dispatch({ type: actions.GROUPS_ERROR, payload: error.message })
  }
}

export const deleteGroup = groupId => async dispatch => {
  try {
    dispatch({ type: actions.GROUPS_LOADING })

    const groupRef = await firestore.collection('groups').doc(groupId)
    const groupGet = await groupRef.get()
    const groupData = await groupGet.data()
    const memberRefs = groupData.members

    await memberRefs.forEach(async member => {
      const { userRef: memberRef, userData: memberData } = await getCurrentUser(
        member.id
      )
      await memberRef.update({
        groups: memberData.groups.filter(group => group.id !== groupId),
      })
    })

    await groupRef.delete()

    dispatch({ type: actions.GROUPS_DELETE, payload: groupId })
    dispatch({ type: actions.GROUPS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: deleteGroup => ', error)
    dispatch({ type: actions.GROUPS_ERROR, payload: error.message })
  }
}

export const fetchGroups = currentUID => async dispatch => {
  try {
    dispatch({ type: actions.GROUPS_LOADING })

    // get current user
    const { userData: user } = await getCurrentUser(currentUID)

    let results = []

    if (user.groups) {
      results = await Promise.all(
        user.groups.map(async group => {
          const groupDoc = await group.get()
          const groupData = await groupDoc.data()
          groupData.id = group.id
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

export const selectGroup = groupId => async dispatch => {
  try {
    dispatch({ type: actions.GROUPS_LOADING })

    const groupRef = await firestore.collection('groups').doc(groupId)

    const groupData = await getDataWithRef(groupRef)
    
    
    const groupMembers = await Promise.all(
      groupData.members.map( async memberRef=>{
        return await getDataWithRef(memberRef)
      })
    )

    groupData.members = groupMembers

    dispatch({ type: actions.GROUPS_SELECT, payload: groupData })
    dispatch({ type: actions.GROUPS_ENDLOADING })
  } catch (error) {
    console.log('ERROR: selectGroup => ', error)
    dispatch({ type: actions.GROUPS_ERROR, payload: error.message })
  }
}
