<template>
  <div>

    <el-card class="box-card">
      <el-form ref="profileUpdateForm" label-position="left" label-width="180px" :model="account" :rules="rules">
        <el-form-item label="Email" prop="email">
          <el-input v-model="account.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="Display Name" prop="displayName">
          <el-input v-model="account.displayName"></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button type="primary" @click="submitForm">Save</el-button>
        </div>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import { auth } from '@/modules/firebase'
import { usersRef } from '@/modules/firebase'
import store from '@/vuex'
import { mapGetters } from 'vuex'
import firebaseRejectMixin from '@/mixins/firebase-reject'
import { checkReservedWord, checkUsernameValidation, checkUniqueUsername } from '@/modules/form-validation'

export default {

  name: 'AccountProfile',

  mixins: [firebaseRejectMixin],

  data () {
    return {
      account: {},
      rules: {
        displayName: [
          { required: true, message: 'Username can\'t be blank', trigger: 'blur' },
          { min: 3, max: 30, message: 'Length should be 3 to 30', trigger: 'blur' },
          { validator: checkUsernameValidation, message: 'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.', trigger: 'blur' },
          { validator: checkReservedWord, message: 'This word is reserved word. You can not use it.', trigger: 'blur' },
          { validator: checkUniqueUsername, message: 'Username is already taken.', trigger: 'blur,change' }
        ]
      }
    }
  },

  computed: {
    ...mapGetters('account', [
      'uid',
      'email',
      'displayName'
    ])
  },

  created () {
    this.account = {
      email: this.email,
      displayName: this.displayName
    }
  },

  methods: {

    submitForm () {
      store.commit('loading/LOADING_START', { loadingText: 'Saving...' })
      this.asyncFunc()
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Updated account information.',
            type: 'success'
          })
          store.dispatch('account/asyncInit')
        })
        .catch(this.firebaseReject)
        .then(() => {
          store.commit('loading/LOADING_FINISH')
        })
    },

    asyncFunc: async function () {
      await this.validateForm()
      await this.updateProfileAuth()
      await this.updateProfileDB()
    },

    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs['profileUpdateForm'].validate(valid => {
          if (!valid) reject('lpvue/invalid-params')
          else resolve()
        })
      })
    },

    updateProfileAuth () {
      return new Promise((resolve, reject) => {
        const user = auth.currentUser
        user.updateProfile({
          displayName: this.account.displayName
        })
        .then(resolve)
        .catch(reject)
      })
    },

    updateProfileDB () {
      return new Promise((resolve, reject) => {
        usersRef.child(this.uid).update({
          name: this.account.displayName
          // displayName: this.account.displayName
        })
        .then(resolve)
        .catch(reject)
      })
    }
  }

}
</script>
