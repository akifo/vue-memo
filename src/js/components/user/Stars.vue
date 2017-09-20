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

  name: 'Stars',

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
      'currentUserID',
      'currentUser'
    ]),

    ...mapGetters('memo', [
      'memos'
    ]),

    filteredMemos () {
      const self = this
      return _
        .chain(this.memos)
        .filter(memo => {
          if (!memo.publicWritePermissionData.stars) return false
          return memo.publicWritePermissionData.stars[self.currentUserID]
        })
        .sortBy(memo => {
          if (!self.currentUser || !self.currentUser.stars || !self.currentUser.stars[memo.mid]) return
          return self.currentUser.stars[memo.mid].craeted
        })
        .value()
    }

  },

  created () {
    store.commit('user/setCurrentUserName', this.username)
    store.dispatch('user/fetchUserByName', this.username)
      .then(user => {
        store.commit('user/setCurrentUserID', user.uid)
        if (!user.stars) return
        Object.keys(user.stars).forEach(memoID => {
          store.dispatch('memo/fetchMemoByMid', { memoID })
        })
      })
      .catch(this.firebaseReject)
  }

}
</script>
