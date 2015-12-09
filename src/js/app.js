// ログインしている場合は firebase へ保存
// ログインしていない場合は strage へ保存

var Vue = require('vue')
Vue.config.debug = true

// transitions
Vue.transition('expand', require('./transitions/expand.js'))

var app = new Vue({

  el: '#app',

  components: {
    'vue-header': require('./components/header.vue'),
    'vue-content': require('./components/content.vue'),
    'loader': require('./components/loader.vue'),
  },

  data: {
    currentView: '',
    searchText: '',
    facebookUserInfo: {
      uid: ''
    },
  }


})
