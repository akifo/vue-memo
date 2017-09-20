<template>
  <div id="forgot-password">

    <el-card class="box-card">

      <div slot="header">
        <h1>Reset your password</h1>
        <p class="card-desc">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>

      <el-form ref="forgotPasswordForm" label-position="left" label-width="130px" :model="formLabelAlign" :rules="rules">
        <el-form-item label="メールアドレス" prop="email">
          <el-input v-model="formLabelAlign.email" autofocus></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button type="primary" @click="submitForm">Send password reset email</el-button>
        </div>
      </el-form>

      <router-link to="/login">
        <p><i class="material-icons">keyboard_arrow_right</i>Have an account? Login.</p>
      </router-link>

      <router-link to="/signup">
        <p><i class="material-icons">keyboard_arrow_right</i>Create an account.</p>
      </router-link>

    </el-card>

  </div>
</template>

<script>
import router from '@/router'
import store from '@/vuex'
import { auth } from '@/modules/firebase'
import firebaseRejectMixin from '@/mixins/firebase-reject'
// import { log } from '@/modules/debug'

export default {

  name: 'ForgotPassword',

  mixins: [firebaseRejectMixin],

  data () {
    return {
      formLabelAlign: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please input the email', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address.', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {

    submitForm () {
      store.commit('loading/LOADING_START')
      this.asyncFunc()
        .then(() => {
          // notify of email transmission by modal
          this.$alert('Please check your e-mail, reset your password and login.', 'Password resetting Mail transmission complete.', {
            confirmButtonText: 'OK',
            callback: action => {
              router.push({ path: '/login' })
            }
          })
        })
        .catch(this.firebaseReject)
        .then(() => {
          store.commit('loading/LOADING_FINISH')
        })
    },

    asyncFunc: async function () {
      await this.validateForm()
      await this.sendPasswordResetEmail()
    },

    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs['forgotPasswordForm'].validate(valid => {
          if (!valid) reject('lpvue/invalid-params')
          else resolve()
        })
      })
    },

    // Send password reset email
    sendPasswordResetEmail () {
      return new Promise((resolve, reject) => {
        auth
          .sendPasswordResetEmail(this.formLabelAlign.email)
          .then(resolve)
          .catch(reject)
      })
    }

  }
}
</script>

<style lang="stylus">
@import '~stylusVar'

#forgot-password
  width: 500px
  margin: 100px auto 0
  .el-card__header
    h1
      font-size: 1.5rem
    .card-desc
      color: $font-color-black-trans
      margin: 10px 0 0px
      font-size: .8rem
  .el-card__body
    .el-form-item.is-required
      .el-form-item__label:before
        display: none
  a
    color: $font-color-black-trans
    text-decoration: underline
    font-size: 12px
    margin: 5px 0 0
    display: block
    &:hover
      color: $primary-color
    i
      margin-right: .2em
      transform: translateY(2px)

</style>
