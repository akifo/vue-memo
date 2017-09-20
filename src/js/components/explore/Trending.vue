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

  name: 'Trending',

  mixins: [firebaseRejectMixin],

  components: {
    MemoList: MemoListComponent
  },

  computed: {

    ...mapGetters('memo', [
      'memos'
    ]),

    filteredMemos () {
      return _
        .chain(this.memos)
        .orderBy('starCount', 'desc')
        .value()
    }

  },

  created () {
    store.dispatch('memo/fetchMemosByRange', { orderBy: 'starCount' })
      .catch(this.firebaseReject)
  }

}
</script>

<style lang="stylus">
@import '~stylusVar'
  .item
    border-bottom: 1px solid $border-color
</style>
