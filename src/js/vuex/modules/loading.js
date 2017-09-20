/*
  This store depends on Element.
  http://element.eleme.io/#/en-US/component/loading

  The root view is here.
  "/src/App.vue"

  You can also use component level loading without this store.
*/

const DEFAULT_MESSAGE = 'Loading...'

const state = {
  loading: false,
  loadingText: DEFAULT_MESSAGE
}

const getters = {
  loading: state => state.loading,
  loadingText: state => state.loadingText
}

const mutations = {

  LOADING_START (state, loadingText) {
    state.loading = true
    if (loadingText) state.loadingText = loadingText
  },

  LOADING_FINISH (state) {
    state.loading = false
    setTimeout(() => {
      state.loadingText = DEFAULT_MESSAGE
    }, 1000)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
