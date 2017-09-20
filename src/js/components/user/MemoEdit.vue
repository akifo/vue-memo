<template>
  <div class="editer">
    <el-form ref="updateMemoForm" label-position="top" :model="editableMemo" :rules="rules">
      <memo-editer :memo.sync="editableMemo" />
      <div class="editer-footer clearfix">
        <el-button type="primary" @click="submitForm">Save</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex'
import store from '@/vuex'
import MemoEditer from '@/components/common/MemoEditer'
import { memosRef } from '@/modules/firebase'
import { checkReservedWord, checkMemoNameValidation, checkUniqueMemoName } from '@/modules/form-validation'
// import { log } from '@/modules/debug'

export default {

  name: 'MemoEdit',

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

  components: {
    MemoEditer
  },

  data () {
    return {
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

  computed: {

    ...mapGetters('memo', [
      'currentMemo'
    ]),

    editableMemo () {
      if (!this.currentMemo) {
        return {
          memoName: '',
          title: '',
          body: ''
        }
      }
      return Object.assign({}, this.currentMemo)
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

    submitForm () {
      store.commit('loading/LOADING_START')
      this.asyncFunc()
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Your memo is updated!',
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
      await this.updateMemo()
    },

    validateForm () {
      return new Promise((resolve, reject) => {
        this.$refs['updateMemoForm'].validate(valid => {
          if (!valid) reject('lpvue/invalid-params')
          else resolve()
        })
      })
    },

    updateMemo () {
      return new Promise((resolve, reject) => {
        const uid = store.getters['account/uid']
        const mid = store.getters['memo/currentMemoID']
        memosRef
          .child(mid)
          .update({
            memoName: this.editableMemo.memoName,
            title: this.editableMemo.title,
            body: this.editableMemo.body,
            modified: firebase.database.ServerValue.TIMESTAMP,
            'authorID_memoName': `${uid}_${this.editableMemo.memoName}`
          })
          .then(resolve)
          .catch(reject)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~stylusVar'
.editer
  padding: 0
  .editer-footer
    margin-bottom: 20px
    .el-button
      width: 100px
      float: right

</style>
