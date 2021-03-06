const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.firestoretest = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data()

    // access a particular field as you would any JS property
    const name = newValue.displayName
    console.log('new user created. displayName: ', name)
    console.log('snap(): ', newValue)
    // perform desired operations ...
  })

exports.mapFriends = functions.https.onCall(async currentUID => {
  const ref = await admin
    .firestore()
    .collection('users')
    .doc(currentUID)
  const userGet = await ref.get()
  const user = await userGet.data()

  console.log(user)
  return 'this is the cloud function return value'
})

// exports.newFriendNotif = functions.firestore
//   .document('users/{userid}')
//   .onUpdate((change, context) => {
//     // Get an object representing the document
//     // e.g. {'name': 'Marie', 'age': 66}
//     const newData = change.after.data()

//     // ...or the previous value before this update
//     const oldData = change.before.data()

//     // access a particular field as you would any JS property
//     const newName = newData.name
//     const oldName = oldData.name
//   })
