import Vue from 'vue'
import { usersRef } from '@/modules/firebase'
// import { log } from '@/modules/debug'

const state = {
  users: {},
  currentUserID: '',
  currentUserName: ''
}

const getters = {
  users: state => state.users,
  currentUserID: state => state.currentUserID,
  currentUserName: state => {
    return state.currentUserID && state.users[state.currentUserID]
      ? state.users[state.currentUserID].name
      : ''
  },
  currentUser: state => {
    return state.currentUserID
      ? state.users[state.currentUserID]
      : null
  }
}

const mutations = {

  setCurrentUserID (state, id) {
    state.currentUserID = id
  },

  setCurrentUserName (state, username) {
    state.currentUserName = username
  },

  setUser (state, { key, user }) {
    Vue.set(state.users, key, user)
  }

}

export const actions = {

  fetchUserByUid ({ commit, state, getters }, uid = state.currentUserID) {
    return new Promise((resolve, reject) => {
      if (getters.users && getters.users[uid]) return resolve(getters.users[uid])
      usersRef
        .child(uid)
        .once('value')
        .then(snapshot => {
          const user = snapshot.val()
          const key = snapshot.key
          user.uid = key
          if (!user) reject('This userID is no exist.')
          commit('setUser', { key, user })
          resolve(user)
        }).catch(reject)
    })
  },

  fetchUserByName ({ commit, state, getters }, username = state.currentUserName) {
    return new Promise((resolve, reject) => {
      // if (getters.currentUser) return resolve(getters.currentUser)
      usersRef
        .orderByChild('name')
        .equalTo(username)
        .once('value')
        .then(snapshot => {
          const usersObj = snapshot.val()
          if (!usersObj) reject('This username is no exist.')
          Object.keys(usersObj).forEach(key => {
            const user = usersObj[key]
            user.uid = key
            commit('setUser', { key, user })
            resolve(user)
          })
        }).catch(reject)
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
