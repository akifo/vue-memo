<template>
  <div class="github-btn-wrap">
    <el-button type="primary" @click="snsOAuthSignin">
      <i class="fa fa-github" aria-hidden="true"></i>
      <span class="btn-text">Sign in with Github</span>
    </el-button>
  </div>

</template>

<script>
import firebase from 'firebase'
import snsAuthMixin from './sns-auth-mixin'
export default {

  name: 'SnsAuthGithub',

  mixins: [snsAuthMixin],

  data () {
    return {
      provider: new firebase.auth.GithubAuthProvider()
    }
  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

.github-btn-wrap
  position: relative
  .el-button
    background-color: #333
    border-color: #333

</style>
