const functions = require('firebase-functions');
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
  .onCreate( (snap, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const newValue = snap.data();

      // access a particular field as you would any JS property
      const name = newValue.displayName;
      console.log('new user created. displayName: ', name)
      console.log('snap(): ', newValue)
      // perform desired operations ...
  })