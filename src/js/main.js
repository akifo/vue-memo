import 'babel-polyfill'
import Vue from 'vue'
import Element from 'element-ui'
import App from '@/App'
import store from '@/vuex'
import router from '@/router'
import * as filters from '@/filters'
import 'font-awesome/css/font-awesome.css'
import 'github-markdown-css'
import 'element-ui/lib/theme-default/index.css'
import '@@/css/base.styl'
import '@@/css/transitions.styl'
import firebaseRejectMixin from '@/mixins/firebase-reject'

// for debugging
if (process.env.NODE_ENV !== 'production') Vue.config.debug = true

Vue.use(Element)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const Vm = new Vue({
  router,
  store,
  el: '#app',
  mixins: [firebaseRejectMixin],
  render: h => h(App)
})

export default Vm
