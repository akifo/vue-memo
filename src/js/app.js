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
    'anonymous': require('./components/anonymous.vue'),
    'facebook': require('./components/facebook.vue'),
    'loader': require('./components/loader.vue'),
  },

  data: {
    currentView: '',
    searchText: '',
    facebookUserInfo: {
      key: ''
    },
  },


})
