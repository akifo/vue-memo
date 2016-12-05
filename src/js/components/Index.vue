<template>
  <div class="index container">
    <div class="filter">
      <a class="waves-effect waves-light btn" :class="{ active: currentTimeLine === 'public' }" @click="switchTimeLine('public')">Public</a>
      <a class="waves-effect waves-light btn" :class="{ active: currentTimeLine === 'myself' }" @click="switchTimeLine('myself')">Myself</a>
    </div>
    <ul class="collection">
      <memo v-for="(memo, key) in orderedMemos"
        :memo="memo">
      </memo>
    </ul>
    <div>
      <a class="waves-effect waves-light btn-large" @click="fetchMemos({count: 10, type: currentTimeLine})">fetch more memos</a>
    </div>
    <div class="fixed-action-btn">
      <router-link :to="{ name: 'newEditor' }" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Memo from './Memo.vue'
import _ from 'lodash'

export default {
  components: { Memo },
  computed: {
    ...mapGetters(['memos', 'currentUserId']),
    orderedMemos () {
      return _
        .chain(this.memos)
        .forEach((value, key, a) => {
          value.key = key
          return value
        })
        .filter(memo => {
          if (this.currentTimeLine === 'public') return true
          else if (memo.author.uid === this.currentUserId) return true
          return false
        })
        .orderBy('created', 'desc')
        .value()
    }
  },
  data () {
    return {
      currentTimeLine: 'public'
    }
  },
  methods: {
    ...mapActions(['fetchMemos']),
    switchTimeLine (val) {
      this.currentTimeLine = val
      this.$store.dispatch('fetchMemos', {
        count: 10,
        type: val
      })
    }
  }
}
</script>

<style lang="stylus">
.index
  margin: 3rem auto
  .filter
    a
      background-color: #b2dfdb
      color: #fff
      &.active
        background-color: #00695c
        color: #fff
</style>
