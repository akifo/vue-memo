<template>

  <header id="header">
    <div class="navWrapper">
      <h1>vue-memo</h1>
      <p class="searchBox">
        <input type="text" v-model="searchText">
        <i class="fa fa-search"></i>
      </p>
      <p class="loginBox" v-if="!logined">
        <button v-on:click="loginFacebook" type="button" name="button" class="waves-effect waves-light btn"><i class="fa fa-facebook-official"></i>LOGIN</button>
      </p>
      <div v-if="logined" class="facebookUserBox">
        <figure class='dropdown-button' data-activates='dropdown'>
          <img :src="profileImageURL"/>
        </figure>
        <ul id='dropdown' class='dropdown-content'>
          <li><a href="#!" v-on:click="logoutFacebook">LOGOUT</a></li>
        </ul>
      </div>
    </div>
  </header>

</template>

<script>

var Vue = require('vue')
var ref

export default {

  props : {
    searchText: {
      type: String,
      required: true,
      twoWay: false
    },
    currentView: {
      type: String,
      required: true,
      twoWay: true
    },
    facebookUserInfo: {
      type: Object,
      required: false
    }
  }, // props

  data () {
    return {
      profileImageURL: ''
    }
  },

  computed: {
    logined () {
      return this.currentView === 'facebook'
    }
  }, // computed

  ready () {

    ref = new Firebase("https://vue-memo.firebaseio.com")

    var self = this

    this.currentView = 'loader'

    ref.onAuth(function(authData) {
      if (authData) {
        console.log("Client logined.")
        self.facebookUserInfo.uid = authData.uid
        self.profileImageURL = authData.facebook.profileImageURL
        self.currentView = 'facebook'

        // ログイン後のレンダリング後にjsあてる
        Vue.nextTick( () => {
          $('.dropdown-button').dropdown()
        })

      } else {
        console.log("Client unauthenticated.")
        self.currentView = 'anonymous'
      }
    })

  }, //created

  methods: {

    loginFacebook () {

      var self = this
      self.currentView = 'loader'

      ref.authWithOAuthRedirect("facebook", (error) => {
        if (error) console.log("Login Failed!", error)
      })

    }, // logoutFacebook

    logoutFacebook () {
      self.currentView = 'loader'
      ref.unauth()
    } // logoutFacebook

  } // methods
}

</script>

<style lang="sass?outputStyle=expanded" scoped>
@import url(https://fonts.googleapis.com/css?family=Sigmar+One);
#header {
  height: 55px;
  z-index: 10;
  position: relative;

  .navWrapper {
    background-image: linear-gradient(120deg, rgb(0, 188, 212), rgb(20, 200, 252));
    display: flex;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;

    h1 {
      flex: 0 0 auto;
      color: #fff;
      font-family: 'Sigmar One', cursive;
      font-weight: normal;
      font-size: 2rem;
      line-height: 55px;
      height: 55px;
      padding: 0;
      margin: 0 1em;
    } // h1

    .searchBox {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0;
      margin: 0 0 0 .5em;
      position: relative;

      input {
        padding: .2em .5em;
        font-size: 1rem;
        color: #333;
        line-height: 1;
        border: none;
        background-color: #fff;
        max-width: 300px;
        height: 30px;
        margin: 0;
      } // input

      .fa {
        position: absolute;
        right: 5px;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
      } // .fa
    } // .searchBox

    .loginBox {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0;
      margin: 0 1em;
      button {
        background-color: #3b5998;
        .fa {
          padding: 0 8px 0 0;
        } // .fa
      } // button
    } // .loginBox

    .facebookUserBox {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0;
      margin: 0 1em;
      figure {
        margin: 0;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        overflow: hidden;
        cursor: pointer;

        img {
          height: 30px;
        } // img
      } // figure
    } // .facebookUserBox
  } // .navWrapper
} // #header
</style>
