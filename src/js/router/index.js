/*
| path                        | detail               |
| --------------------------- | -------------------- |
| /                           | Dashboad             |
| /$username/                 | User's Profile       |
| /$username/stars            | User's Stars         |
| /$username/memos            | User's Memos         |
| /$username/$memoname        | User's Memo View     |
| /$username/$memoname/edit   | User's Memo Edit     |
| /$username/$memoname/delete | User's Memo Delete   |
| /explore/trending           | Recently Trending    |
| /explore/latest             | Recently Posted Memo |
| /settings/profile           | User Account View    |
| /settings/email             | User Email           |
| /settings/password          | User Password        |
| /settings/delete            | User Delete          |
| /required-email-verified    | for Email Verify     |
| /login                      | Login                |
| /signup                     | Signup               |
| /forgot-password            | Forgot Password      |
| /404                        | Not Found            |
*/

/* Dependency
---------------------------------------------------------------------------------------------------------- */
import VueRouter from 'vue-router'
import Vue from 'vue'
import Vm from '@/main'
import store from '@/vuex'
// import { log } from '@/modules/debug'

/* Components
---------------------------------------------------------------------------------------------------------- */
import IndexComponent from '@/components/Index'

// Auth
import SignupComponent from '@/components/Signup'
import ForgotPasswordComponent from '@/components/ForgotPassword'
import LoginComponent from '@/components/Login'
import RequiredEmailVerifiedComponent from '@/components/RequiredEmailVerified'
import NotFoundComponent from '@/components/NotFound'

// New Memo
import NewMemoComponent from '@/components/NewMemo'

// Explore
import ExploreLayoutComponent from '@/components/explore/Layout'
import TrendingComponent from '@/components/explore/Trending'
import LatestComponent from '@/components/explore/Latest'

// Settings
import SettingsLayoutComponent from '@/components/settings/Layout'
import AccountProfileComponent from '@/components/settings/Profile'
import ChangeEmailComponent from '@/components/settings/ChangeEmail'
import ChangePasswordComponent from '@/components/settings/ChangePassword'
import AccountDeleteComponent from '@/components/settings/AccountDelete'

// User
import UserLayoutComponent from '@/components/user/Layout'
import UserIndexComponent from '@/components/user/Index'
import UserStarsComponent from '@/components/user/Stars'
import UserMemosComponent from '@/components/user/Memos'
import MemoViewComponent from '@/components/user/MemoView'
import MemoEditComponent from '@/components/user/MemoEdit'
import MemoDeleteComponent from '@/components/user/MemoDelete'

/* Settings
---------------------------------------------------------------------------------------------------------- */
Vue.use(VueRouter)

/* Before Enter Functions
---------------------------------------------------------------------------------------------------------- */
const beforeEnterCheckLoggedIn = (to, from, next) => {
  if (!store.getters['account/loggedIn']) {
    next('/login')
    throw new Error('You need to logged-in.')
  // } else if (!store.getters['account/emailVerified']) {
  //   next(false)
  //   throw new Error('You need to email verified.')
  } else {
    next()
  }
}

const beforeEnterRequiredEmailVerified = (to, from, next) => {
  if (!store.getters['account/loggedIn']) {
    next(false)
    throw new Error('You need to login.')
  } else if (store.getters['account/emailVerified']) {
    next('/')
  } else {
    next()
  }
}

const beforeEnterCheckLoggedOut = (to, from, next) => {
  if (store.getters['account/loggedIn']) {
    next(false)
    throw new Error('You are already logged-in.')
  } else {
    next()
  }
}

/* Routing
---------------------------------------------------------------------------------------------------------- */
var router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: IndexComponent,
      props: true
    },
    {
      path: '/required-email-verified',
      name: 'RequiredEmailVerified',
      component: RequiredEmailVerifiedComponent,
      beforeEnter: beforeEnterRequiredEmailVerified
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginComponent,
      beforeEnter: beforeEnterCheckLoggedOut
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignupComponent,
      beforeEnter: beforeEnterCheckLoggedOut
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPasswordComponent,
      beforeEnter: beforeEnterCheckLoggedOut
    },
    {
      path: '/404',
      name: '404',
      component: NotFoundComponent
    },
    {
      path: '/error',
      name: 'Error',
      component: NotFoundComponent
    },
    {
      path: '/new-memo',
      name: 'NewMemo',
      component: NewMemoComponent,
      beforeEnter: beforeEnterCheckLoggedIn
    },
    {
      path: '/explore',
      component: ExploreLayoutComponent,
      children: [
        {
          path: 'trending',
          name: 'Trending',
          alias: '',
          component: TrendingComponent
        },
        {
          path: 'latest',
          name: 'Latest',
          component: LatestComponent
        }
      ]
    },
    {
      path: '/settings',
      component: SettingsLayoutComponent,
      beforeEnter: beforeEnterCheckLoggedIn,
      children: [
        {
          path: 'profile',
          name: 'AccountProfile',
          alias: '',
          component: AccountProfileComponent
        },
        {
          path: 'email',
          name: 'ChangeEmail',
          component: ChangeEmailComponent
        },
        {
          path: 'password',
          name: 'ChangePassword',
          component: ChangePasswordComponent
        },
        {
          path: 'delete',
          name: 'AccountDelete',
          component: AccountDeleteComponent
        }
      ]
    },
    {
      path: '/:username',
      component: UserLayoutComponent,
      props: true,
      children: [
        {
          path: '',
          name: 'UserIndex',
          component: UserIndexComponent,
          props: true
        },
        {
          path: 'stars',
          name: 'UserStars',
          component: UserStarsComponent,
          props: true
        },
        {
          path: 'memos',
          name: 'UserMemos',
          component: UserMemosComponent,
          props: true
        },
        {
          path: ':memoName',
          name: 'MemoView',
          component: MemoViewComponent,
          props: true
        },
        {
          path: ':memoName/edit',
          name: 'MemoEdit',
          component: MemoEditComponent,
          props: true,
          beforeEnter: beforeEnterCheckLoggedIn
        },
        {
          path: ':memoName/delete',
          name: 'MemoDelete',
          component: MemoDeleteComponent,
          props: true,
          beforeEnter: beforeEnterCheckLoggedIn
        }
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFoundComponent
    }
  ]
})

/* Routing Gard
---------------------------------------------------------------------------------------------------------- */
router.beforeEach((to, from, next) => {
  if (to.name === 'Error') next()
  else if (to.name === 'NotFound') next()
  else if (to.name === '404') next()
  store
    .dispatch('account/asyncInit')
    .then(next)
    .catch(err => {
      router.push({ name: 'Error', params: { msg: err.message }})
    })
})

router.onError(err => {
  Vm.$notify({
    title: 'Error',
    message: err.message || 'Routing Error',
    type: 'error'
  })
})

export default router
