/*
  Before start this patch,
  1. You should "npm install faker", and node > v7.6.x
  2. Change to below rule at "Firebase Realtime Database rules"
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
*/

const firebase = require('firebase')
const faker = require('faker')
const ENV_CONFIG = require(`../config/development.js`)
const config = ENV_CONFIG.FIREBASE_CONFIG
const firebaseApp = firebase.initializeApp(config)
const db = firebaseApp.database()

// DB Ref
const publicMemosRef = db.ref('publicMemos')
const privateMemosRef = db.ref('memos')
const usersRef = db.ref('users')

const memos = {}
const users = {}

/* starter
------------------------------------------------------------ */
;(async function () {
  await fetchAndUpdateMemos()
  await fetchAndUpdateUsers()
  await removeFirebaseDB()
  await setFirebaseDB()
})()
.then(() => {
  console.log('finished! users')
  process.exit(0)
})
.catch(err => {
  console.log(err.message)
  process.exit(1)
})

/* memos
------------------------------------------------------------ */
function fetchAndUpdateMemos () {
  return new Promise((resolve, reject) => {
    publicMemosRef
      .once('value')
      .then(snapshot => {
        const memosObj = snapshot.val()
        Object.keys(memosObj).forEach(key => {
          const memo = memosObj[key]
          memos[key] = memo
        })
      })
      .then(updateMemosAtHere)
      .then(resolve)
      .catch(reject)
  })
}

function updateMemosAtHere () {
  return new Promise((resolve, reject) => {
    Object.keys(memos).forEach(key => {
      const randomWords = faker.commerce.productName().toLowerCase().replace(/\s+/g, '-')
      memos[key].memoName = randomWords
      memos[key].authorID = memos[key].author.uid
      memos[key].publicWritePermissionData = {}
      memos[key].publicWritePermissionData.starCount = 0
      memos[key].publicWritePermissionData.stars = null
      memos[key]['authorID_memoName'] = `${memos[key].authorID}_${randomWords}`
      memos[key].author = null
    })
    resolve()
  })
}

/* uses
------------------------------------------------------------ */
function fetchAndUpdateUsers () {
  return new Promise((resolve, reject) => {
    ;(async function () {
      await fetchUsers()
      await fetchMemos()
      await updateUsersAtHere()
    })()
    .then(resolve)
    .catch(reject)
  })
}

function fetchUsers () {
  return new Promise((resolve, reject) => {
    usersRef
      .once('value')
      .then(snapshot => {
        const usersObj = snapshot.val()
        Object.keys(usersObj).forEach(key => {
          const user = usersObj[key]
          users[key] = user
        })
      })
      .then(resolve)
      .catch(reject)
  })
}

function fetchMemos () {
  return new Promise((resolve, reject) => {
    publicMemosRef
      .once('value')
      .then(snapshot => {
        const memosObj = snapshot.val()
        Object.keys(memosObj).forEach(mid => {
          if (!users[memosObj[mid].author.uid]) users[memosObj[mid].author.uid] = {}
          users[memosObj[mid].author.uid].name = String(memosObj[mid].author.name)
          if (!users[memosObj[mid].author.uid].memos) users[memosObj[mid].author.uid].memos = {}
          users[memosObj[mid].author.uid].memos[mid] = true
        })
      })
      .then(resolve)
      .catch(reject)
  })
}

function updateUsersAtHere () {
  return new Promise((resolve, reject) => {
    Object.keys(users).forEach(key => {
      if (!users[key].name) {
        const randomWords = faker.commerce.productName().toLowerCase().replace(/\s+/g, '-')
        users[key].name = randomWords
      }
      users[key].name = users[key].name.toLowerCase().replace(/\s+/g, '-')
    })
    resolve()
  })
}

/* removeDB
------------------------------------------------------------ */
function removeFirebaseDB () {
  return new Promise((resolve, reject) => {
    ;(async function () {
      await removePublicMemosRef()
      await removeMemosRef()
      await removeUsersRef()
    })()
    .then(resolve)
    .catch(reject)
  })
}

function removePublicMemosRef () {
  return new Promise((resolve, reject) => {
    publicMemosRef
      .remove()
      .then(resolve)
      .catch(reject)
  })
}

function removeMemosRef () {
  return new Promise((resolve, reject) => {
    privateMemosRef
      .remove()
      .then(resolve)
      .catch(reject)
  })
}

function removeUsersRef () {
  return new Promise((resolve, reject) => {
    usersRef
      .remove()
      .then(resolve)
      .catch(reject)
  })
}

/* setDB
------------------------------------------------------------ */
function setFirebaseDB () {
  return new Promise((resolve, reject) => {
    ;(async function () {
      await setNewMemoToDB()
      await setNewUsersToDB()
    })()
    .then(resolve)
    .catch(reject)
  })
}

function setNewMemoToDB () {
  return new Promise((resolve, reject) => {
    privateMemosRef
      .set(memos)
      .then(resolve)
      .catch(reject)
  })
}

function setNewUsersToDB () {
  return new Promise((resolve, reject) => {
    usersRef
      .set(users)
      .then(resolve)
      .catch(reject)
  })
}
