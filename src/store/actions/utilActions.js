import { getFirebase } from 'react-redux-firebase'
import { getFirestore } from 'redux-firestore'

// const firebase = getFirebase()
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
      let paid, owe

      let debt = {}

      const isPayer = payerId === member.id
      if (isPayer) {
        owe = 0
        paid = total
      } else {
        owe = total / groupData.members.length
        paid = 0

        if (!!payerId) {
          debt[payerId] = owe
        }
      }

      userAmounts[memberData.id] = {
        id: member.id,
        name: memberData.displayName,
        amount: 0,
        items: {},
        paid,
        debt,
        owe,
      }
      return
    })
  )

  return userAmounts
}

export const rdNum3 = input => Math.floor(Number(input) * 1000) / 1000
export const rdNum2 = input => Math.floor(Number(input) * 100) / 100

const calcOwes = userAmounts => {
  const userIds = Object.keys(userAmounts)

  let itemizedCosts = false
  for (let i = 0; i < userIds.length; i++) {
    if (userAmounts[userIds[i]].amount) {
      itemizedCosts = true
      break
    }
  }

  const totalPaid = userIds
    .map(uid => (userAmounts[uid].paid ? Number(userAmounts[uid].paid) : 0))
    .reduce((a, b) => a + b)

  userIds.forEach(uid => {
    const { amount, paid } = userAmounts[uid]
    userAmounts[uid].owe =
      amount > 0
        ? amount > paid
          ? amount - paid
          : 0
        : itemizedCosts
        ? 0
        : rdNum3(totalPaid / userIds.length - paid)
    // : totalPaid < receiptTotal
    // ? Number((totalPaid / userIds.length - paid).toFixed(2))
    // : Number((receiptTotal / userIds.length - paid).toFixed(2))
    if (userAmounts[uid].owe < 0) {
      userAmounts[uid].owe = 0
    }
  })

  return userAmounts
}

const calcDebts = userAmounts => {
  const payers = []
  const debtors = []
  const userIds = Object.keys(userAmounts)
  console.log('calcDebts, userAmounts:', userAmounts)

  // fill in payers && debtors
  userIds.forEach(uid => {
    userAmounts[uid].debt = {} // reset debts

    const usrAmt = { ...userAmounts[uid] }

    if (usrAmt.owe === 0 && usrAmt.paid > 0) {
      payers.push(usrAmt)
    } else {
      debtors.push(usrAmt)
    }
  })

  if (!payers.length) return userAmounts

  let usersHaveItemizedCosts = false

  for (let i = 0; i < userIds.length; i++) {
    if (userAmounts[userIds[i]].amount) {
      usersHaveItemizedCosts = true
      break
    }
  }

  const totalPaid = userIds
    .map(uid => (userAmounts[uid].paid ? Number(userAmounts[uid].paid) : 0))
    .reduce((a, b) => a + b)

  const evenAmountOwed = rdNum3(totalPaid / userIds.length)

  debtors.forEach(usrAmt => {
    const { id: uid } = usrAmt
    let userOwes = Number(usrAmt.owe)
    console.log(payers[0])
    let payerPaid = Number(payers[0].paid)
    let pid = payers[0].id
    let payerAmount = Number(payers[0].amount)
    let payerOwed = usersHaveItemizedCosts
      ? rdNum3(payerPaid - payerAmount)
      : rdNum3(payerPaid - evenAmountOwed)

    while (rdNum2(userOwes) >= rdNum2(payerOwed)) {
      userAmounts[uid].debt[pid] = payerOwed
      userOwes = rdNum3(userOwes - payerOwed)
      payers.shift()

      if (!!payers.length) {
        payerPaid = Number(payers[0].paid)
        pid = payers[0].id

        payerAmount = Number(payers[0].amount)

        payerOwed = usersHaveItemizedCosts
          ? rdNum3(payerPaid - payerAmount)
          : rdNum3(payerPaid - evenAmountOwed)
      } else break
    }

    if (
      userOwes > 0 &&
      rdNum2(userOwes) < rdNum2(payerOwed) &&
      !!payers.length
    ) {
      payers[0].paid = rdNum3(payers[0].paid - userOwes)
      userAmounts[uid].debt[pid] = userOwes

      if (payers[0].paid <= 0) {
        payers.shift()
      }
    }
  })

  return userAmounts
}

export const calcOwesAndDebts = userAmounts => calcDebts(calcOwes(userAmounts))
