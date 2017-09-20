<template>
  <div>
    <el-card class="box-card">
      <MemoList :memos="filteredMemos" />
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import store from '@/vuex'
import firebaseRejectMixin from '@/mixins/firebase-reject'
import MemoListComponent from '@/components/common/MemoList'
// import { log } from '@/modules/debug'

export default {

  name: 'Memos',

  mixins: [firebaseRejectMixin],

  props: {
    username: {
      type: String,
      default: ' '
    }
  },

  components: {
    MemoList: MemoListComponent
  },

  computed: {

    ...mapGetters('user', [
      'currentUserID'
    ]),

    ...mapGetters('memo', [
      'memos'
    ]),

    filteredMemos () {
      const self = this
      return _
        .chain(this.memos)
        .filter(memo => {
          if (memo.authorID === self.currentUserID) return true
          return false
        })
        .orderBy('created', 'desc')
        .value()
    }

  },

  created () {
    store.commit('user/setCurrentUserName', this.username)
    store.dispatch('user/fetchUserByName', this.username)
      .then(user => {
        store.commit('user/setCurrentUserID', user.uid)
        store.dispatch('memo/fetchMemosByEqual', { orderBy: 'authorID', query: user.uid, limit: 100 })
      })
      .catch(this.firebaseReject)
  }

}
</script>
