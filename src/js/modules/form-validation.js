import _ from 'lodash'
import store from '@/vuex'
import { usersRef, memosRef } from '@/modules/firebase'
// import { log } from '@/modules/debug'

/* reserved-words
---------------------------------------------------------------------------------------------------------- */
const RESERVED_WORDS = process.env.RESERVED_WORDS

// reserved-words check
const checkReservedWord = (rule, value, callback) => {
  const isReserved = _.includes(RESERVED_WORDS, value)
  if (isReserved) return callback(new Error('This is reserved wrod. You can not use it.'))
  return callback()
}

/* username
---------------------------------------------------------------------------------------------------------- */
const usernameTest = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

// Validation of username
const checkUsernameValidation = (rule, value, callback) => {
  if (usernameTest.test(value)) return callback()
  else if (String(value).trim() === 'localhost') return callback()
  callback(new Error('This domain is incorrect.'))
}

// Confirm Unique username
const checkUniqueUsername = (rule, value, callback) => {
  // If Display Name is not changed, return Okay.
  if (value === store.getters['account/displayName']) return callback()

  usersRef
    .orderByChild('name')
    .equalTo(value)
    .once('value')
    .then(snapshot => {
      const user = snapshot.val()
      if (!user) return callback()
      return callback(new Error('This domain is already taken.'))
    })
    .catch(() => {
      callback(new Error('Connection Error'))
    })
}

/* memo-name
---------------------------------------------------------------------------------------------------------- */
const memoNameTest = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

// Validation of memo-name
const checkMemoNameValidation = (rule, value, callback) => {
  if (memoNameTest.test(value)) return callback()
  else if (String(value).trim() === 'localhost') return callback()
  callback(new Error('Memo-name is incorrect.'))
}

// Confirm Unique memo-name
const checkUniqueMemoName = (rule, value, callback) => {
  // If Memo-name is not changed, return Okay.
  if (!!value && value === store.getters['memo/currentMemoName']) return callback()

  /* eslint-disable camelcase */
  const authorID_memoName = store.getters['account/uid'] + '_' + value

  memosRef
    .orderByChild('authorID_memoName')
    .equalTo(authorID_memoName)
    .once('value')
    .then(snapshot => {
      const memo = snapshot.val()
      if (!memo) return callback()
      return callback(new Error('This Memo-name is already taken.'))
    })
    .catch(() => {
      callback(new Error('Connection Error'))
    })
}

/* export
---------------------------------------------------------------------------------------------------------- */
export {
  checkReservedWord,
  checkUsernameValidation,
  checkUniqueUsername,
  checkMemoNameValidation,
  checkUniqueMemoName
}

