import 'babel-polyfill'
import './../../settings'
import Vue from 'vue'
import App from './App'
import { sync } from 'vuex-router-sync'
import store from './vuex'
import router from './router'
import Firebase from './api/firebase'
import moment from 'moment'

// for debugging
if (process.env.NODE_ENV !== 'production') Vue.config.debug = true

sync(store, router)
Firebase.initFirebase()

Vue.filter('formatDate', function (value, format) {
  return moment(value).format('YYYY.MM.DD hh:mm:ss')
})

const app = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})

global._App = app
