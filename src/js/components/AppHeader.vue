<template>
  <header class="appHeader navbar-fixed">
    <nav>
      <div class="nav-wrapper">
        <h1 class="left"><router-link :to="{ name: 'index' }">Vue-memo</router-link></h1>
        <ul class="right">
          <li><input type="text" :value="currentUserName" @input="update" @keyup.enter="submit"></li>
          <li v-if="!user.loggedIn" @click="signIn" class="googleBtnWrap">
            <img class="normal" src="./../assets/btn_google_signin_light_normal_web@2x.png">
            <img class="focus" src="./../assets/btn_google_signin_light_focus_web@2x.png">
            <img class="pressed" src="./../assets/btn_google_signin_light_pressed_web@2x.png">
          </li>
          <li v-if="user.loggedIn"><a @click="signOut">signout</a></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: 'AppHeader',
  computed: mapGetters(['user', 'currentUserName']),
  data () {
    return {
      name: ''
    }
  },
  methods: {
    ...mapActions(['signIn', 'signOut']),
    update: _.debounce(function (e) {
      this.submit(e)
    }, 2000),
    submit: _.throttle(function (e) {
      const name = e.target.value
      this.validate(name)
        .then(() => {
          return this.$store.dispatch('setUserInfo', {
            key: 'name',
            val: name
          })
        }).then(() => {
          Materialize.toast('Updated Name', 4000, 'green')
        }).catch(err => {
          Materialize.toast('Error ' + err, 4000, 'red')
        })
    }, 800),
    validate (text) {
      return new Promise((resolve, reject) => {
        if (text.length < 3) reject('too short')
        else if (text.length > 15)reject('too long')
        else resolve()
      })
    }
  }
}
</script>

<style lang="stylus">
.appHeader
  nav
    background-color: #4fc08d
    .nav-wrapper
      h1
        margin: 0 0 0 2rem
        padding: 0
        height: 64px
        line-height: 64px
        font-size: 2rem
        a
          transition: ease .4s color
          &:hover
            color: #34495e
      ul
        margin: 0 1rem 0 0
        display: flex
        align-items: center
        li
          margin: 0 1rem
          input
            margin: 0
          &.googleBtnWrap
            position: relative
            line-height: 1
            .normal
            .focus
            .pressed
              width: 200px
              cursor: pointer
            .normal
              position: relative
            .focus
            .pressed
              position: absolute
              opacity: 0
              top: 0
              left: 0
              transition: ease .4s opacity
            &:hover .focus
              opacity: 1
            &:active .pressed
              opacity: 1

</style>
