import VueRouter from 'vue-router'
import Vue from 'vue'
import Index from '../components/Index'
import Editor from '../components/Editor'
import Viewer from '../components/Viewer'

Vue.use(VueRouter)

var router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    }, {
      path: '/editor',
      name: 'newEditor',
      component: Editor
    }, {
      path: '/editor/:id',
      name: 'updateEditor',
      component: Editor
    }, {
      path: '/viewer/:id',
      name: 'viewer',
      component: Viewer
    }
  ]
})

export default router
