<template>
  <div id="app-header" class="appHeader navbar-fixed">
    <div class="admin-header-inner">

      <router-link to="/" class="title-wrap">
        <img src="~@/assets/logo.png" />
        <h1>Vue-memo</h1>
      </router-link>

      <div class="icon-wrap">
        <el-dropdown trigger="click" @command="handleCommand">
          <i class="material-icons">settings</i>
          <el-dropdown-menu slot="dropdown">
            <template v-if="loggedIn">
              <el-dropdown-item command="/settings/profile">Your profile</el-dropdown-item>
              <el-dropdown-item command="/settings/email">Change email</el-dropdown-item>
              <el-dropdown-item command="/settings/password">Change password</el-dropdown-item>
              <el-dropdown-item divided key="logout"><div @click="signOut">Logout</div></el-dropdown-item>
            </template>
            <template v-else>
              <el-dropdown-item command="/">TOP</el-dropdown-item>
              <el-dropdown-item command="/login">Login</el-dropdown-item>
              <el-dropdown-item command="/signup">Signup</el-dropdown-item>
              <el-dropdown-item command="/forgot-password">Forgot password</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
    <div class="admin-header-spacer" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { log } from '@/modules/debug'

export default {

  name: 'AppHeader',

  computed: {
    ...mapGetters('account', [
      'loggedIn',
      'displayName'
    ])
  },

  data () {
    return {
      name: ''
    }
  },

  methods: {

    ...mapActions('account', [
      'signIn',
      'signOut'
    ]),

    handleCommand (command) {
      if (!command) return
      this.$router.push({ path: command })
    }

  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

#app-header
  .admin-header-inner
  .admin-header-spacer
    height: 48px
    width: 100%
  .admin-header-inner
    position: fixed
    z-index: 10
    background-color: $primary-color-dark
    @extend .z-depth-6
    height: 32px
    padding: 8px 0
    display: flex
    align-items: center
    .title-wrap
      flex: 1 1 auto
      display: flex
      align-items: center
      img
        max-width: 100px
        max-height: 32px
        float: left
        padding-left: 24px
      h1
        font-size: 22px
        line-height: 1
        font-weight: 500
        float: left
        color: #fff
        padding-left: 12px
    .icon-wrap
      flex: 1 1 auto
      text-align: right
      padding-right: 24px
      font-size: 14px
      display: flex
      align-items: center
      justify-content: flex-end
      .el-dropdown
        display: flex
        align-items: center
        justify-content: flex-end
        .material-icons
          color: $font-color-white-trans
          cursor: pointer
          font-size: 24px
          &:hover
            color: $font-color-white

  .admin-header-spacer
    position: relative

.el-dropdown-menu
  .el-dropdown-menu__item
    padding: 0 20px
    color: $font-color-black-trans
  .el-dropdown-menu__item--divided:before
    margin: 0 -20px

</style>
