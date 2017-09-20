import Vue from 'vue'
import Vuex from 'vuex'
import accountStore from './modules/account'
import loadingStore from './modules/loading'
import memoStore from './modules/memo'
import userStore from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    account: accountStore,
    loading: loadingStore,
    memo: memoStore,
    user: userStore
  },
  strict: debug
})
