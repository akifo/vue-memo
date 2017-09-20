<template>
  <div class="google-btn-wrap">
    <el-button type="primary" @click="snsOAuthSignin">
      <i class="fa fa-google" aria-hidden="true"></i>
      <span class="btn-text">Sign in with Google</span>
    </el-button>
  </div>

</template>

<script>
import firebase from 'firebase'
import snsAuthMixin from './sns-auth-mixin'

export default {

  name: 'SnsAuthGoogle',

  mixins: [snsAuthMixin],

  data () {
    return {
      provider: new firebase.auth.GoogleAuthProvider()
    }
  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

.google-btn-wrap
  position: relative
  .el-button
    background-color: #4285f4
    border-color: #4285f4
</style>
