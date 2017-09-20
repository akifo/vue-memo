<template>
  <div id="signup">

    <el-card class="box-card">

      <div slot="header">
        <h1><i class="fa fa-check-circle-o" aria-hidden="true"></i>Sign Up</h1>
      </div>

      <el-form ref="signupForm" label-position="left" label-width="130px" :model="formLabelAlign" :rules="rules">
        <el-form-item label="Username" prop="name">
          <el-input v-model="formLabelAlign.name" placeholder="Pick a username"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="formLabelAlign.email" placeholder="例）test@gmail.com"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="formLabelAlign.password" placeholder="minimum is 8 characters"></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button type="primary" @click="submitForm">Signup with Email</el-button>
        </div>
      </el-form>

      <router-link to="/login">
        <p><i class="material-icons">keyboard_arrow_right</i>Have an account? Login.</p>
      </router-link>

      <sns-auth :isSignup="true"/>

    </el-card>

  </div>
</template>

<script>
import router from '@/router'
import store from '@/vuex'
import { mapGetters } from 'vuex'
import { auth } from '@/modules/firebase'
import { usersRef } from '@/modules/firebase'
import firebaseRejectMixin from '@/mixins/firebase-reject'
import SnsAuthComponent from '@/components/sns-auth/Index'
import { checkReservedWord, checkUsernameValidation, checkUniqueUsername } from '@/modules/form-validation'
// import { log } from '@/modules/debug'

export default {

  name: 'Signup',

  mixins: [firebaseRejectMixin],

  components: {
    'sns-auth': SnsAuthComponent
  },

  data () {
    return {
      loading: false,
      user: {},
      formLabelAlign: {
        name: '',
        email: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: 'Username can\'t be blank', trigger: 'blur' },
          { min: 3, max: 30, message: 'Length should be 3 to 30', trigger: 'blur' },
          { validator: checkUsernameValidation, message: 'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.', trigger: 'blur' },
          { validator: checkReservedWord, message: 'This word is reserved word. You can not use it.', trigger: 'blur' },
          { validator: checkUniqueUsername, message: 'Username is already taken', trigger: 'blur,change' }
        ],
        email: [
          { required: true, message: 'Email can\'t be blank', trigger: 'blur' },
          { type: 'email', message: 'Email is invalid', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Password can\'t be blank', trigger: 'blur' },
          { min: 8, max: 30, message: 'Length should be 8 to 30', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {

    ...mapGetters('agency', [
      'agencyID'
    ])

  },

  methods: {

    submitForm () {
      store.commit('loading/LOADING_START')
      this.asyncFunc()
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'New account registration is completed. Please confirm the identity confirmation e-mail.',
            type: 'success'
          })
          router.push({ path: '/required-email-verified' })
        })
        .catch(this.firebaseReject)
        .then(() => {
          store.commit('loading/LOADING_FINISH')
        })
    },

    asyncFunc: async function () {
      await this.validateForm()
      await this.createUserWithEmailAndPassword()
      await this.updateDisplayNameToAuth()
      await this.saveNewUserToDB()
      await this.sendEmailVerification()
    },

    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs['signupForm'].validate(valid => {
          if (!valid) reject('lpvue/invalid-params')
          else resolve()
        })
      })
    },

    // Create new account to "Firebase Auth" with EmailPassword
    createUserWithEmailAndPassword (email, password) {
      return new Promise((resolve, reject) => {
        auth
          .createUserWithEmailAndPassword(
            this.formLabelAlign.email,
            this.formLabelAlign.password
          )
          .then(user => {
            this.user = user
            resolve()
          })
          .catch(reject)
      })
    },

    // Register displayName to "Firebase Auth"
    updateDisplayNameToAuth () {
      return new Promise((resolve, reject) => {
        const user = auth.currentUser
        user.updateProfile({
          displayName: String(this.formLabelAlign.name).trim()
        })
        .then(resolve)
        .catch(reject)
      })
    },

    // Create new record for new user to "Firebase Realtime DB"
    saveNewUserToDB () {
      return new Promise((resolve, reject) => {
        usersRef.child(this.user.uid).set({
          displayName: String(this.formLabelAlign.name).trim(),
          email: this.user.email,
          emailVerified: false,
          level: 0,
          agencyID: this.agencyID,
          clientID: ''
        })
        .then(resolve)
        .catch(reject)
      })
    },

    // Send verify confirmation Email
    sendEmailVerification () {
      return new Promise((resolve, reject) => {
        const user = auth.currentUser
        user
          .sendEmailVerification()
          .then(resolve)
          .catch(reject)
      })
    }

  }
}
</script>
<style lang="stylus">
@import '~stylusVar'

#signup
  width: 500px
  margin: 50px auto 50px
  .box-card
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
