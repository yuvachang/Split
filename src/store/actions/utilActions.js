import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'

const firebase = getFirebase()
const firestore = getFirestore()

//get() and refs have uid's
export const getCurrentUser = async uid => {
  const userRef = await firestore.collection('users').doc(uid)
  const userGet = await userRef.get()
  const userData = await userGet.data()
  userData.id = userRef.id
  return { userRef, userData }
}

export const getDataWithRef = async ref => {
  const get = await ref.get()
  if (!get.exists) return
  const data = await get.data()
  if (!data.id) {
    data.id = ref.id
  }
  return data
}

export const getUserByEmail = async email => {
  const querySnapshop = await firestore
    .collection('users')
    .where('email', '==', email)
    .get()
  const queryDocumentSnapshop = querySnapshop.docs[0]
  const userId = queryDocumentSnapshop.id
  const userData = await queryDocumentSnapshop.data()
  return { userId, userData }
}

// Indexing function => creates array of substrings
export const indexFunc = string => {
  const index = []
  const stringArr = string.split('')
  let curr = ''
  stringArr.forEach(letter => {
    curr += letter.toLowerCase()
    index.push(curr)
  })
  return index
}

export const createEmptyRows = rowCount => {
  let count = 0
  const rows = {}
  while (count < rowCount) {
    rows[count] = {
      item: '',
      cost: 0,
      users: [],
      deletePending: false,
    }
    count++
  }
  return rows
}

export const createUserAmounts = async (groupData, payerId, total) => {
  const userAmounts = {}

  await Promise.all(
    groupData.members.map(async member => {
      const memberData = await getDataWithRef(member)
      const paid = payerId === member.id ? total : 0

      userAmounts[memberData.id] = {
        id: member.id,
        name: memberData.displayName,
        amount: 0,
        items: {},
        isPayer: payerId === member.id,
        paid,
        debt: {},
        owe: 0,
        percentageOfTotal: 0,
      }
      return
    })
  )

  return userAmounts
}
