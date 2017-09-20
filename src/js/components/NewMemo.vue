<template>
  <admin-layout>

    <div class="main-contents-header">

      <div class="content-title-wrap">
        <h1>New Memo</h1>
      </div>

      <el-tabs v-model="activeView">
        <el-tab-pane label="Write" name="memo-editer"></el-tab-pane>
        <el-tab-pane label="Preview" name="memo-viewer"></el-tab-pane>
      </el-tabs>

    </div>

    <el-form ref="newMemoForm" label-position="top" label-width="130px" :model="memo" :rules="rules">
      <component :is="activeView" :memo.sync="memo" />

      <div class="container">
        <div class="editer-footer clearfix">
          <el-button type="primary" @click="submitForm">Post</el-button>
        </div>
      </div>
    </el-form>

  </admin-layout>
</template>

<script>
import firebase from 'firebase'
// import router from '@/router'
import store from '@/vuex'
import firebaseRejectMixin from '@/mixins/firebase-reject'
import AdminLayout from '@/components/common/AdminLayout'
import MemoEditer from '@/components/common/MemoEditer'
import MemoViewer from '@/components/common/MemoViewer'
import { usersRef, memosRef } from '@/modules/firebase'
import { checkReservedWord, checkMemoNameValidation, checkUniqueMemoName } from '@/modules/form-validation'
// import { log } from '@/modules/debug'

export default {

  name: 'NewMemo',

  mixins: [firebaseRejectMixin],

  props: ['memoId'],

  components: {
    AdminLayout,
    MemoEditer,
    MemoViewer
  },

  data () {
    return {
      activeView: '',
      memo: {
        memoName: '',
        title: '',
        body: ''
      },
      rules: {
        memoName: [
          { required: true, message: 'Memo-name can\'t be blank', trigger: 'blur' },
          { min: 3, max: 30, message: 'Length should be 3 to 30', trigger: 'blur' },
          { validator: checkMemoNameValidation, message: 'Memo-name may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.', trigger: 'blur' },
          { validator: checkReservedWord, message: 'This word is reserved word. You can not use it.', trigger: 'blur' },
          { validator: checkUniqueMemoName, message: 'Memo-name is already taken.', trigger: 'blur,change' }
        ],
        title: [
          { required: true, message: 'Title can\'t be blank', trigger: 'blur' },
          { min: 5, max: 120, message: 'Length should be 5 to 120', trigger: 'blur' }
        ],
        body: [
          { required: true, message: 'Body can\'t be blank', trigger: 'blur' },
          { min: 10, max: 3000, message: 'Length should be 10 to 3000', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.activeView = this.activeView || 'memo-editer'
  },

  methods: {

    submitForm () {
      store.commit('loading/LOADING_START')
      this.asyncFunc()
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Your memo is published!',
            type: 'success'
          })
        })
        .catch(this.firebaseReject)
        .then(() => {
          store.commit('loading/LOADING_FINISH')
        })
    },

    asyncFunc: async function () {
      await this.validateForm()
      await this.postNewMemo()
    },

    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs['newMemoForm'].validate(valid => {
          if (!valid) reject('lpvue/invalid-params')
          else resolve()
        })
      })
    },

    postNewMemo () {
      return new Promise((resolve, reject) => {
        const uid = store.getters['account/uid']
        memosRef.push({
          memoName: this.memo.memoName,
          title: this.memo.title,
          body: this.memo.body,
          authorID: uid,
          created: firebase.database.ServerValue.TIMESTAMP,
          modified: firebase.database.ServerValue.TIMESTAMP,
          'authorID_memoName': `${uid}_${this.memo.memoName}`,
          publicWritePermissionData: {
            starCount: 0,
            stars: null
          }
        })
        .then(val => {
          const mid = val.key
          usersRef
            .child(uid)
            .child('memos')
            .child(mid)
            .set(true)
            .then(resolve)
            .catch(reject)
        })
        .catch(reject)
      })
    }
  }

}
</script>
<style lang="stylus" scoped>
@import '~stylusVar'

.editer-footer
  margin-bottom: 20px
  .el-button
    width: 100px
    float: right

</style>