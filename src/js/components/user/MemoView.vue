<template>
  <memo-viewer :memo="currentMemo"/>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/vuex'
import firebaseRejectMixin from '@/mixins/firebase-reject'
import StarCountComponent from '@/components/common/StarCount'
import MemoViewer from '@/components/common/MemoViewer'
// import { log } from '@/modules/debug'

export default {

  name: 'MemoView',

  mixins: [firebaseRejectMixin],

  components: {
    'star-count': StarCountComponent,
    MemoViewer
  },

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

  computed: {

    ...mapGetters('memo', [
      'currentMemo'
    ])

  },

  created () {
    store.commit('memo/setCurrentMemoName', this.memoName)
    store.dispatch('user/fetchUserByName', this.username)
      .then(user => {
        store.commit('user/setCurrentUserID', user.uid)
        store.dispatch('memo/fetchMemo')
      })
      .catch(this.firebaseReject)
  }

}
</script>
