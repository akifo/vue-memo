import Vue from 'vue'
import store from '@/vuex'
import { memosRef } from '@/modules/firebase'
// import { log } from '@/modules/debug'

const FETCH_COUNT_AT_ONCE = 10
const state = {
  memos: {},
  currentMemoID: '',
  currentMemoName: '',
  fetchedCountSortByCreated: 0
}

const getters = {
  memos: state => state.memos,
  currentMemoID: state => state.currentMemoID,
  currentMemoName: state => state.currentMemoName,
  currentMemo: state => {
    return state.currentMemoID
      ? state.memos[state.currentMemoID]
      : null
  }
}

const mutations = {

  setCurrentMemoId (state, id) {
    state.currentMemoID = id
  },

  setCurrentMemoName (state, memoName) {
    state.currentMemoName = memoName
  },

  updateMemo (state, { key, memo }) {
    state.memos[key] = Object.assign({}, state.memos[key], memo)
    // Object.keys(memo).forEach(prop => {
    //   Vue.set(state.memos[key], prop, memo[prop])
    // })
  },

  setMemo (state, { key, memo }) {
    Vue.set(state.memos, key, memo)
  },

  setMemos (state, { memos }) {
    Object.keys(memos).forEach(key => {
      Vue.set(state.memos, key, memos[key])
    })
  },

  deleteMemo (state, { key }) {
    Vue.delete(state.memos, key)
  },

  countUp (state) {
    state.fetchedPublicCount += FETCH_COUNT_AT_ONCE
  }

}

export const actions = {

  fetchMemo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      // required setted userID
      if (!store.getters['user/currentUserID']) reject('fetchMemo required userId')

      /* eslint-disable camelcase */
      const authorID = store.getters['user/currentUserID']
      const authorName = store.getters['user/currentUserName']
      const authorID_memoName = authorID + '_' + state.currentMemoName

      memosRef
        .orderByChild('authorID_memoName')
        .equalTo(authorID_memoName)
        .once('value')
        .then(snapshot => {
          const memosObj = snapshot.val()
          if (!memosObj) reject('This memo is no exist.')
          Object.keys(memosObj).forEach(key => {
            const memo = memosObj[key]
            memo.mid = key
            memo.author = {
              name: authorName,
              uid: authorID
            }
            commit('setMemo', { key, memo })
            commit('setCurrentMemoId', key)
          })
          resolve()
        })
        .catch(reject)
    })
  },

  fetchMemoByMid ({ commit, state, dispatch }, {
    memoID = state.currentMemoID
  }) {
    return new Promise((resolve, reject) => {
      memosRef
        .child(memoID)
        .once('value')
        .then(snapshot => {
          const memo = snapshot.val()
          const key = snapshot.key
          const authorID = memo.authorID
          memo.mid = key
          memo.author = {
            name: 'loading',
            uid: authorID
          }
          dispatch('setAuthor', { key, authorID })
          commit('setMemo', { key, memo })
          commit('setCurrentMemoId', key)
          resolve()
        })
        .catch(reject)
    })
  },

  fetchMemosByRange ({ state, commit, dispatch }, {
    orderBy = 'created',
    limit = 20
  }) {
    return new Promise((resolve, reject) => {
      memosRef
        .orderByChild(orderBy)
        .limitToLast(limit)
        .once('value')
        .then(snapshot => {
          const memosObj = snapshot.val() || {}
          const memos = {}
          Object.keys(memosObj).forEach(key => {
            memos[key] = memosObj[key]
            memos[key].mid = key
            const authorID = memos[key].authorID
            memos[key].author = {
              name: 'loading',
              uid: authorID
            }
            dispatch('setAuthor', { key, authorID })
          })
          commit('setMemos', { memos })
          resolve(memos)
        }).catch(reject)
    })
  },

  fetchMemosByEqual ({ state, commit, dispatch }, {
    orderBy = 'created',
    query = '',
    limit = 20
  }) {
    return new Promise((resolve, reject) => {
      memosRef
        .orderByChild(orderBy)
        .equalTo(query)
        .limitToLast(limit)
        .once('value')
        .then(snapshot => {
          const memosObj = snapshot.val() || {}
          const memos = {}
          Object.keys(memosObj).forEach(key => {
            memos[key] = memosObj[key]
            memos[key].mid = key
            const authorID = memos[key].authorID
            memos[key].author = {
              name: 'loading',
              uid: authorID
            }
            dispatch('setAuthor', { key, authorID })
          })
          commit('setMemos', { memos })
          resolve(memos)
        }).catch(reject)
    })
  },

  setAuthor ({ state, commit }, { key, authorID }) {
    // store.commit('user/setCurrentUserID', authorID)
    store.dispatch('user/fetchUserByUid', authorID)
      .then(user => {
        const memo = {
          author: {
            name: user.name,
            uid: authorID
          }
        }
        commit('updateMemo', { key, memo })
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
