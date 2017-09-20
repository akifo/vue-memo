import router from '@/router'
import store from '@/vuex'
import { asyncSignIn } from '@/modules/firebase-auth'
import firebaseRejectMixin from '@/mixins/firebase-reject'
// import { log } from '@/modules/debug'

module.exports = {

  mixins: [firebaseRejectMixin],

  methods: {

    snsOAuthSignin () {
      store.commit('loading/LOADING_START')
      this.$parent.validateForm()
        .then(this.signIn)
        .then(msg => {
          const defaultMsg =
            this.$parent.isSignup
            ? 'Created new account'
            : 'Welcome back'
          this.$notify({
            title: 'Success',
            message: msg || defaultMsg,
            type: 'success'
          })
          router.push('/')
        })
        .catch(this.firebaseReject)
        .then(() => {
          store.commit('loading/LOADING_FINISH')
        })
    },

    signIn () {
      return new Promise((resolve, reject) => {
        asyncSignIn(this.provider, this.$parent.formLabelAlign.name, this.$parent.isSignup)
          .then(msg => resolve(msg))
          .catch(reject)
      })
    }

  }

}
