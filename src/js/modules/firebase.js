import firebase from 'firebase'

const config = process.env.FIREBASE_CONFIG

const firebaseApp = firebase.initializeApp(config)
const auth = firebaseApp.auth()
const db = firebaseApp.database()

// DB Ref
const usersRef = db.ref('users')
const memosRef = db.ref('memos')

export {
  auth,
  usersRef,
  memosRef
}
