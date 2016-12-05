import Vue from 'vue'
import Vuex from 'vuex'
import Firebase from './../api/firebase'
// import LocalStrage from './../api/localstrage'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  user: {
    loggedIn: false,
    uid: '',
    name: '',
    profilePicUrl: ''
  },
  memos: {}
  // route: {} // vue-router has created state.route
}

const mutations = {

  onAuthStateChanged (state, { user }) {
    state.user = user
  },

  setUser (state, { key, val }) {
    Vue.set(state.user, key, val)
  },

  setMemo (state, { key, memo }) {
    Vue.set(state.memos, key, memo)
  },

  setMemos (state, { memos }) {
    state.memos = memos || {}
  },

  deleteMemo (state, { key }) {
    Vue.delete(state.memos, key)
  }

}

const actions = {

  onAuthStateChanged ({ commit }, user) {
    commit('onAuthStateChanged', { user })
  },

  signIn () {
    Firebase.signIn()
  },

  signOut () {
    Firebase.signOut()
  },

  setUserInfo ({ commit, state }, { key, val }) {
    return new Promise((resolve, reject) => {
      if (state.user.loggedIn) { // is signed in. Firebase
        Firebase.setUserInfo(key, val)
          .then(() => {
            commit('setUser', { key, val })
            resolve()
          }).catch(reject)
      } else { // is signed out. Localstrage
        reject('still dev for guest')
      }
    })
  },

  fetchMemo ({ commit, state }) {
    Firebase.fetchMemo(state.route.params.id)
      .then(obj => {
        commit('setMemo', {
          key: obj.key,
          memo: obj.memo
        })
      })
  },

  fetchMemos ({ commit }, { count, type }) {
    if (state.user.loggedIn || type === 'public') { // is signed in. Firebase
      Firebase.fetchMemos(count, type)
        .then(memos => {
          commit('setMemos', { memos })
        })
    } else { // is signed out. Localstrage
    }
  },

  addMemo ({ commit, state }, memo) {
    return new Promise((resolve, reject) => {
      if (state.user.loggedIn) { // is signed in. Firebase
        Firebase.addMemo(memo)
          .then(obj => {
            commit('setMemo', {
              key: obj.key,
              memo: obj.memo
            })
            resolve(obj.key)
          }).catch(err => {
            reject()
          })
      } else { // is signed out. Localstrage
        reject('still dev for guest')
      }
    })
  },

  deleteMemo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.user.loggedIn) { // is signed in. Firebase
        Firebase.deleteMemo(state.route.params.id)
          .then(key => {
            commit('deleteMemo', { key })
            resolve()
          }).catch(reject)
      } else { // is signed out. Localstrage
        reject('still dev for guest')
      }
    })
  },

  updateMemo ({ commit, state }, memo) {
    return new Promise((resolve, reject) => {
      if (state.user.loggedIn) { // is signed in. Firebase
        const key = state.route.params.id
        Firebase.updateMemo(key, memo)
          .then(() => {
            commit('setMemo', { key, memo })
            resolve(key)
          }).catch(reject)
      } else { // is signed out. Localstrage
        reject('still dev for guest')
      }
    })
  }

}

const getters = {
  memos: state => state.memos,
  currentMemoID: ({ route }) => route.params.id,
  currentMemo: state => {
    return state.route.params.id
      ? state.memos[state.route.params.id]
      : {}
  },
  user: state => state.user,
  currentUserName: state => state.user.name,
  currentUserId: state => state.user.uid
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug
})
