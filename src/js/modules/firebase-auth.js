import firebase from 'firebase'
import router from '@/router'
import { auth } from '@/modules/firebase'
import { usersRef } from '@/modules/firebase'
// import { log } from '@/modules/debug'

const asyncSignIn = async function (provider, username, isSignup) {
  await signInWithPopup(provider)

  if (isSignup) {
    await updateDisplayNameToAuth(username)
    const msg = await saveNewUserToDB(username)
    if (msg) return msg

  // If login
  } else {
    // If user try login, then there is no user at DB,
    // It's impropriety, so move to Signup View.
    await checkIfUserExists()
  }
}

const signInWithPopup = provider => {
  return new Promise((resolve, reject) => {
    firebase.auth()
      .signInWithPopup(provider)
      .then(resolve)
      .catch(reject)
  })
}

// register usernam to "Firebase Auth"
const updateDisplayNameToAuth = username => {
  return new Promise((resolve, reject) => {
    checkUserExistsDB()
      .then(result => {
        if (!result) {
          const user = auth.currentUser
          if (!user.displayName) {
            user.updateProfile({
              displayName: username
            })
            .then(resolve)
            .catch(reject)
          } else {
            resolve()
          }
        } else {
          // If registered user, don't change displayName
          resolve()
        }
      })
      .catch(reject)
  })
}

// created new user register to "Firebase Realtime DB"
const saveNewUserToDB = (username) => {
  return new Promise((resolve, reject) => {
    checkUserExistsDB()
      .then(result => {
        if (!result) {
          const user = auth.currentUser
          usersRef.child(user.uid).set({
            name: username
          })
          .then(resolve)
          .catch(reject)
        } else {
          // If registered user, don't change name
          resolve('Welcome back')
        }
      })
      .catch(reject)
  })
}

// confirm uid is registered in "Firebase Realtime DB"
const checkIfUserExists = () => {
  return new Promise((resolve, reject) => {
    checkUserExistsDB()
      .then(result => {
        if (result) {
          resolve()
        } else {
          auth.signOut()
          router.push('/signup')
          reject(new Error('You don\'t have an account.'))
        }
      })
      .catch(reject)
  })
}

// check uid and name registered in "Firebase Realtime DB"
const checkUserExistsDB = () => {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser
    usersRef.child(user.uid).once('value', snapshot => {
      const val = snapshot.val()
      if (val && val.name) resolve(true)
      resolve(false)
    })
    .catch(reject)
  })
}

export { asyncSignIn }
