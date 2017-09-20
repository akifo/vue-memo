<template>
  <div id="main-side-navi">
    <div class="main-side-navi-inner">
      <ul class="dashboad">
        <li><router-link :to="{name: 'Index'}"><i class="material-icons">dashboard</i>Dashboad</router-link></li>
      </ul>
      <hr>
      <ul>
        <li v-if="loggedIn"><router-link :to="{name: 'NewMemo'}"><i class="material-icons">edit</i>New Memo</router-link></li>
        <li v-if="loggedIn"><router-link :to="{name: 'UserIndex',  params: { username: username || displayName }}"><i class="material-icons">list</i>Memo</router-link></li>
        <li><router-link :to="{path: '/explore'}"><i class="material-icons">explore</i>Explore</router-link></li>
        <li v-if="loggedIn"><router-link :to="{path: '/settings'}"><i class="material-icons">settings</i>Settings</router-link></li>
      </ul>
      <template v-if="!loggedIn">
        <hr>
        <ul>
          <li><router-link :to="{path: '/login'}"><i class="material-icons">check_box</i>Login</router-link></li>
          <li><router-link :to="{path: '/signup'}"><i class="material-icons">verified_user</i>Signup</router-link></li>
          <li><router-link :to="{path: '/forgot-password'}"><i class="material-icons">mail_outline</i>Forgot Password</router-link></li>
        </ul>
      </template>
      <ul class="links">
        <li><a href="https://github.com/akifo/vue-memo"><i class="fa fa-github" aria-hidden="true"></i>Github</a></li>
      </ul>
    </div>
    <div class="main-side-navi-spacer"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

  name: 'SideNavi',

  props: ['username'],

  computed: {
    ...mapGetters('account', [
      'loggedIn',
      'displayName'
    ])
  }

}
</script>

<style lang="stylus">
@import '~stylusVar'

#main-side-navi
  .main-side-navi-inner
  .main-side-navi-spacer
    height: calc(100vh - 50px)
    width: 250px

  .main-side-navi-inner
    position: fixed
    z-index: 9
    top: 50px
    left: 0
    margin: 0
    padding: 0
    overflow-y: scroll
    @extend .z-depth-1
    .dashboad
      background-color: #fafafa
      padding: 10px 0
      li
        a
          &.router-link-active
            color: $font-color-black-trans
          &.router-link-exact-active
            color: $primary-color
    .links
      position: absolute
      bottom: 0
      left: 0
      width: 250px
      height: auto
      border-top: 1px solid $border-color
    ul
      margin: 0
      padding: 0
      li
        list-style: none
        margin: 0
        padding: 0
        a
          color: $font-color-black-trans
          text-decoration: none
          display: flex
          align-items: center
          margin: 0
          padding: 8px 24px
          font-size: 14px
          font-weight: 500
          cursor: pointer
          transition:
            background-color ease .1s
          i
            font-size: 1em
            padding-right: 16px
          &.router-link-active
            color: $primary-color

          &:hover
            background-color: #eeeeee
    hr
      padding: 0
      margin: 0
      height: 1px
      border-color: $border-color
      border-width: 0 0 1px 0

  .main-side-navi-spacer
    position: relative

</style>
