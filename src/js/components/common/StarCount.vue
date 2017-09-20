<template>
  <div class="star-wrap" @click="toggleStar">
    <div class="star-count-wrap">
      <transition name="slide-up">
        <div class="star-count-spacer" :key="count">
          <span class="star-count">{{count}}</span>
        </div>
      </transition>
    </div>
    <div class="star-icon-text-wrap">
      <span class="star-icon-wrap">
        <transition name="bounce" mode="out-in">
          <i v-if="checked" class="material-icons" key="star">star</i>
          <i v-else class="material-icons" key="star_border">star_border</i>
        </transition>
      </span>
      <span>Star</span>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import store from '@/vuex'
import { mapGetters } from 'vuex'
import { memosRef, usersRef } from '@/modules/firebase'
import firebaseRejectMixin from '@/mixins/firebase-reject'
// import { log } from '@/modules/debug'

export default {

  name: 'StarCount',

  mixins: [firebaseRejectMixin],

  props: {
    count: {
      type: Number,
      default: 0
    },
    mid: {
      type: String,
      defalt: '',
      required: true
    },
    stars: {
      type: Object
      // type: Object,
      // default () {
      //   return {}
      // }
    }
  },

  computed: {
    ...mapGetters('account', [
      'uid'
    ]),
    checked () {
      return this.stars && this.stars[this.uid]
    }
  },

  methods: {

    toggleStar () {
      const self = this
      ;(async function () {
        await self.userMustBeLogin()
        await self.memoPost()
        await self.userPost()
      })()
      .catch(this.firebaseReject)
    },

    userMustBeLogin () {
      return new Promise((resolve, reject) => {
        if (!this.uid) reject(new Error('You have to login!'))
        resolve()
      })
    },

    memoPost () {
      return new Promise((resolve, reject) => {
        const self = this
        memosRef
          .child(this.mid)
          .child('publicWritePermissionData')
          .transaction(function (post) {
            if (!post) {
              post = {}
              post.starCount = 0
              post.stars = {}
            }
            if (post) {
              if (post.stars && post.stars[self.uid]) {
                post.starCount--
                post.stars[self.uid] = null
              } else {
                post.starCount++
                if (!post.stars) {
                  post.stars = {}
                }
                post.stars[self.uid] = true
              }
            }
            return post
          })
          .then(result => {
            const publicWritePermissionData = result.snapshot.val()
            if (!publicWritePermissionData.stars) publicWritePermissionData.stars = null
            const memo = {
              publicWritePermissionData
            }
            store.commit('memo/updateMemo', { key: this.mid, memo })
            resolve()
          })
          .catch()
      })
    },

    userPost () {
      return new Promise((resolve, reject) => {
        usersRef
          .child(this.uid)
          .child('stars')
          .child(this.mid)
          .set(this.checked
            ? { created: firebase.database.ServerValue.TIMESTAMP }
            : null
          )
          .then(resolve)
          .catch(reject)
      })
    }

  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

.star-wrap
  width: 70px
  border: 1px solid $font-color-white-trans
  cursor: pointer
  .star-count-wrap
    border-bottom: 1px solid $font-color-white-trans
    width: 70px
    height: 20px
    text-align: center
    position: relative
    overflow: hidden
    .star-count-spacer
      position: absolute
      top: 0
      left: 0
      width: 70px
      display: inline-block
      .star-count
        position: absolute
        top: 0
        left: 50%
        transform: translateX(-50%)
  .star-icon-text-wrap
    display: block
    text-align: center
    .star-icon-wrap
      display: inline-block
      transform: translateY(1.5px)
      i
        margin-right: 0
  &:hover
    background-color: rgba($font-color-white-trans, .2)

</style>
