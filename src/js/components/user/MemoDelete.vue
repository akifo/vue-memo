<template>
  <div>

    <el-card class="box-card">
      <el-form ref="deleteAccountForm" label-position="top" label-width="220px" :model="formLabelAlign" :rules="rules">
        <el-form-item prop="memoName">
          <p>Please type in the name of the Memo to confirm.</p>
          <el-input type="memoName" v-model="formLabelAlign.memoName"></el-input>
        </el-form-item>
        <div style="text-align: right;">
          <el-button type="danger" @click="submitForm1" :disabled="disabled">Delete Memo</el-button>
        </div>
      </el-form>
    </el-card>


    <el-dialog
      title="Are you ABSOLUTELY sure?"
      :visible.sync="dialogVisible"
      size="tiny">
      <span>This action <strong>CANNOT</strong> be undone. This will permanently delete the <strong>{{username}}/{{memoName}}</strong>.</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="submitForm2">Delete</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import store from '@/vuex'
import router from '@/router'
import { mapGetters } from 'vuex'
import { usersRef, memosRef } from '@/modules/firebase'
import firebaseRejectMixin from '@/mixins/firebase-reject'
// import { log } from '@/modules/debug'

export default {

  name: 'AccountDelete',

  mixins: [firebaseRejectMixin],

  props: {
    username: {
      type: String,
      default: ' '
    },
    memoName: {
      type: String,
      default: ' '
    }
  },

  data () {
    const checkSameMemoName = (rule, value, callback) => {
      if (!!value && value === store.getters['memo/currentMemoName']) return callback()
      callback(new Error('Incorrect'))
    }
    return {
      dialogVisible: false,
      formLabelAlign: {
        memoName: ''
      },
      rules: {
        memoName: [
          { required: true, message: 'Memo-name can\'t be blank', trigger: 'blur' },
          { min: 3, max: 30, message: 'Length should be 3 to 30', trigger: 'blur' },
          { validator: checkSameMemoName, message: 'Memo-name is incorrect.', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {

    ...mapGetters('memo', [
      'currentMemo',
      'currentMemoName',
      'currentMemoID'
    ]),

    ...mapGetters('user', [
      'currentUserID'
    ]),

    disabled () {
      return !!this.formLabelAlign.memoName && this.formLabelAlign.memoName === this.currentMemoName
        ? false
        : 'disabled'
    }

  },

  created () {
    store.commit('memo/setCurrentMemoName', this.memoName)
    store.dispatch('user/fetchUserByName', this.username)
      .then(user => {
        store.commit('user/setCurrentUserID', user.uid)
        store.dispatch('memo/fetchMemo')
      })
      .catch(this.firebaseReject)
  },

  methods: {

    submitForm1 () {
      const self = this

      ;(async function () {
        await self.validateForm()
      })()
      .then(() => {
        this.dialogVisible = true
      })
      .catch(this.firebaseReject)
    },

    submitForm2 () {
      const self = this
      store.commit('loading/LOADING_START')
      this.dialogVisible = false

      ;(async function () {
        await self.validateForm()
        await store.dispatch('memo/fetchMemo')
        await self.deleteMemoFromUsersDbStars()
        await self.deleteMemoFromAuthorDbMemos()
        await self.deleteMemoFromMemoDB()
      })()
      .then(() => {
        store.commit('memo/deleteMemo', { key: this.currentMemoID })
        this.$notify({
          title: 'Delete complete',
          message: 'Your Memo is deleted.',
          type: 'success'
        })
        router.push({ name: 'UserMemos', params: { username: this.username }})
      })
      .catch(this.firebaseReject)
      .then(() => {
        store.commit('loading/LOADING_FINISH')
      })
    },

    // form validation wrapped Promise
    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs['deleteAccountForm'].validate(valid => {
          if (!valid) reject('lpvue/invalid-params')
          else resolve()
        })
      })
    },

    // staredUsers Loop and Call function
    deleteMemoFromUsersDbStars () {
      return new Promise((resolve, reject) => {
        const deleteStaredUsersRequests = []
        if (this.currentMemo.publicWritePermissionData.stars) {
          Object
            .keys(this.currentMemo.publicWritePermissionData.stars)
            .forEach(uid => {
              deleteStaredUsersRequests.push(this.deleteMemoFromUserDbStars(uid))
            })
        }
        Promise
          .all(deleteStaredUsersRequests)
          .then(resolve)
          .catch(reject)
      })
    },

    // Firebase Realtime Database Remove [users/#uid/stars/$mid]
    deleteMemoFromUserDbStars (uid) {
      return new Promise((resolve, reject) => {
        const mid = this.currentMemoID
        usersRef
          .child(uid)
          .child('stars')
          .child(mid)
          .set(null)
          .then(resolve)
          .catch(reject)
      })
    },

    // Firebase Realtime Database Remove [users/$uid/memos/$mid]
    deleteMemoFromAuthorDbMemos () {
      return new Promise((resolve, reject) => {
        const uid = this.currentUserID
        const mid = this.currentMemoID
        usersRef
          .child(uid)
          .child('memos')
          .child(mid)
          .set(null)
          .then(resolve)
          .catch(reject)
      })
    },

    // Firebase Realtime Database Remove [memos/$mid]
    deleteMemoFromMemoDB () {
      return new Promise((resolve, reject) => {
        const mid = this.currentMemoID
        memosRef
          .child(mid)
          .remove()
          .then(resolve)
          .catch(reject)
      })
    }

  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

.el-form-item__content
  p
    color: $font-color-black-trans

</style>
