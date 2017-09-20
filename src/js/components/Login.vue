<template>
  <div id="login">

    <el-card class="box-card">

      <div slot="header">
        <h1><i class="fa fa-check-circle-o" aria-hidden="true"></i>Login</h1>
      </div>

      <el-form ref="loginForm" label-position="left" label-width="130px" :model="formLabelAlign" :rules="rules">
        <el-form-item label="Email" prop="email">
          <el-input v-model="formLabelAlign.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="formLabelAlign.password"></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button type="primary" @click="submitForm">Login with Email</el-button>
        </div>
      </el-form>

      <router-link to="/forgot-password">
        <p><i class="material-icons">keyboard_arrow_right</i>Forgot password?</p>
      </router-link>

      <router-link to="/signup">
        <p><i class="material-icons">keyboard_arrow_right</i>Create an account.</p>
      </router-link>

      <sns-auth/>

    </el-card>

  </div>
</template>

<script>
import firebase from 'firebase'
import firebaseRejectMixin from '@/mixins/firebase-reject'
import { log } from '@/modules/debug'
import SnsAuthComponent from '@/components/sns-auth/Index'

export default {

  name: 'Login',

  mixins: [firebaseRejectMixin],

  components: {
    'sns-auth': SnsAuthComponent
  },

  data () {
    return {
      formLabelAlign: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please input the email', trigger: 'blur' },
          { type: 'email', message: 'Please enter the correct e-mail address.', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input the password', trigger: 'blur' },
          { min: 8, message: 'Length should be over 8. It\'s too short.', trigger: 'blur,change' }
        ]
      }
    }
  },

  created () {
  },

  methods: {

    submitForm () {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.signInWithEmailAndPassword(this.formLabelAlign.email, this.formLabelAlign.password)
            .then(() => {
              log('logout')
              this.$router.push({ path: '/' })
            })
        } else {
          this.$notify.error({
            title: 'Error',
            message: 'Input content is incorrect'
          })
          return false
        }
      })
    },

    // login with email and password
    signInWithEmailAndPassword (email, password) {
      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(val => {
            this.$notify({
              title: 'Success',
              message: 'login success',
              type: 'success'
            })
            resolve()
          })
          .catch(this.firebaseReject)
      })
    }

  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

#login
  width: 500px
  margin: 50px auto 50px
  .el-card__header
    h1
      font-size: 1.5rem
      i
        color: $success-color
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
