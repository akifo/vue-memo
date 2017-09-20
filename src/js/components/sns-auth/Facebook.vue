<template>
  <div class="facebook-btn-wrap">
    <el-button type="primary" @click="snsOAuthSignin">
      <i class="fa fa-facebook" aria-hidden="true"></i>
      <span class="btn-text">Sign in with Facebook</span>
    </el-button>
  </div>

</template>

<script>
import firebase from 'firebase'
import snsAuthMixin from './sns-auth-mixin'

export default {

  name: 'SnsAuthFacebook',

  mixins: [snsAuthMixin],

  data () {
    return {
      provider: new firebase.auth.FacebookAuthProvider()
    }
  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

.facebook-btn-wrap
  position: relative
  .el-button
    background-color: #3b5998
    border-color: #3b5998
</style>
