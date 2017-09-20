<template>
  <div class="twitter-btn-wrap">
    <el-button type="primary" @click="snsOAuthSignin">
      <i class="fa fa-twitter" aria-hidden="true"></i>
      <span class="btn-text">Sign in with twitter</span>
    </el-button>
  </div>

</template>

<script>
import firebase from 'firebase'
import snsAuthMixin from './sns-auth-mixin'
export default {

  name: 'SnsAuthTwitter',

  mixins: [snsAuthMixin],

  data () {
    return {
      provider: new firebase.auth.TwitterAuthProvider()
    }
  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

.twitter-btn-wrap
  position: relative
  .el-button
    background-color: #1da1f2
    border-color: #1da1f2
</style>
