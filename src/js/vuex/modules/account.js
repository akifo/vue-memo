import Vue from 'vue'
import firebase from 'firebase'
import Vm from '@/main'
import router from '@/router'
import { auth, usersRef } from '@/modules/firebase'
// import { log } from '@/modules/debug'

/* Closure Variables
------------------------------------------------------------------------------------- */
let authAccountInfo = {} // "Firebase Auth" Data
let dbAccountInfo = {} // "Firebase Realtime Database" Data

/* Closure Functions
------------------------------------------------------------------------------------- */
// Get Data from "Firebase Auth"
const getAuthInfo = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        authAccountInfo = user
      } else {
        authAccountInfo = {}
      }
      resolve()
    })
  })
}

// Get Data from "Firebase Realtime Database"
const getDBInfo = () => {
  return new Promise((resolve, reject) => {
    if (!authAccountInfo.uid) resolve()
    usersRef
      .child(authAccountInfo.uid)
      .once('value')
      .then(snapshot => {
        dbAccountInfo = snapshot.val() || {}
      })
      .then(resolve)
      .catch(reject)
  })
}

// Update userProfile to "Firebase Realtime Database"
// const updateProfileDB = obj => {
//   return new Promise((resolve, reject) => {
//     usersRef
//       .child(authAccountInfo.uid)
//       .update(obj)
//       .then(resolve)
//       .catch(reject)
//   })
// }

/* Vuex
------------------------------------------------------------------------------------- */
const state = {
  account: {
    uid: '',
    email: '',
    displayName: ''
  }
}

const getters = {
  loggedIn: state => state.account && !!state.account.uid || false,
  uid: state => state.account && state.account.uid || '',
  email: state => state.account && state.account.email || '',
  displayName: state => state.account && state.account.displayName || ''
}

const mutations = {

  SET_ACCOUNT (state, { account }) {
    Object.keys(account).forEach(key => {
      Vue.set(state.account, key, account[key])
    })
  }

}

export const actions = {

  asyncInit: async function ({ dispatch }) {
    await getAuthInfo()
    await getDBInfo()
    await dispatch('adjustAccountInfo')
  },

  // Combine and Store the data of "Firebase Auth" and "Database"
  adjustAccountInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      const account = {
        uid: authAccountInfo.uid,
        email: authAccountInfo.email,
        displayName: dbAccountInfo.name || authAccountInfo.displayName
      }
      commit('SET_ACCOUNT', { account })
      resolve(account)
    })
  },

  signIn () {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  },

  signOut () {
    firebase
      .auth()
      .signOut()
      .then(() => {
        router.push('/login')
      })
      .catch(err => {
        Vm.$notify({
          title: 'Error',
          message: err.message || 'Signout Error',
          type: 'error'
        })
      })
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
