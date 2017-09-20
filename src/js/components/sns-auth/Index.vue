<template>

  <div class="sns-auth-box">

    <hr>

    <el-form v-if="isSignup" ref="signupOAuthForm" label-position="left" label-width="130px" :model="formLabelAlign" :rules="rules">
      <el-form-item label="Username" prop="name">
        <el-input v-model="formLabelAlign.name" placeholder="Pick a username"></el-input>
      </el-form-item>
    </el-form>

    <div class="sns-auth-wrap clearfix">
      <sns-auth-facebook class="sns-btn-wrap"/>
      <sns-auth-github class="sns-btn-wrap"/>
      <sns-auth-google class="sns-btn-wrap"/>
      <sns-auth-twitter class="sns-btn-wrap"/>
    </div>
  </div>

</template>

<script>
import { checkReservedWord, checkUsernameValidation, checkUniqueUsername } from '@/modules/form-validation'
import firebaseRejectMixin from '@/mixins/firebase-reject'
import FacebookComponent from '@/components/sns-auth/Facebook'
import GithubComponent from '@/components/sns-auth/Github'
import GoogleComponent from '@/components/sns-auth/Google'
import TwitterComponent from '@/components/sns-auth/Twitter'

export default {

  name: 'SnsAuth',

  mixins: [firebaseRejectMixin],

  components: {
    'sns-auth-facebook': FacebookComponent,
    'sns-auth-github': GithubComponent,
    'sns-auth-google': GoogleComponent,
    'sns-auth-twitter': TwitterComponent
  },

  props: {
    isSignup: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      formLabelAlign: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: 'Username can\'t be blank', trigger: 'blur' },
          { min: 3, max: 30, message: 'Length should be 3 to 30', trigger: 'blur' },
          { validator: checkUsernameValidation, message: 'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen', trigger: 'blur' },
          { validator: checkReservedWord, message: 'This word is reserved word. You can not use it.', trigger: 'blur' },
          { validator: checkUniqueUsername, message: 'Username is already taken', trigger: 'blur,change' }
        ]
      }
    }
  },

  methods: {
    // 入力内容のバリデーション（Promiseでラップしている）
    validateForm () {
      return new Promise((resolve, reject) => {
        if (!this.isSignup) resolve()
        this.$refs['signupOAuthForm'].validate(valid => {
          if (!valid) reject('lpvue/invalid-params')
          else resolve()
        })
      })
    }
  }

}
</script>

<style lang="stylus">
@import '~stylusVar'
.sns-auth-box
  hr
    margin: 2rem 0 1.5rem
    height: 1px
    border-color: $border-color
    border-width: 0 0 1px 0
  .sns-auth-wrap
    margin: 0 -5px
    .sns-btn-wrap
      display: block
      float: left
      width: calc(50% - 10px)
      margin: 5px
      .el-button
        width: 100%
        text-align: left
        cursor: pointer
        display: inline-block
        .fa
          width: 1em
          height: 1em
          font-size: 1.3em
          margin: -10px 15px -10px -15px
          padding: 7px .5em 7px .5em
          text-align: center
          display: inline-block
          transform: translateY(1px)
          border-right: 1px solid rgba(#ddd, .35)
        .btn-text
          width: calc(100% - 3.2em)
          text-align: center
          display: inline-block
          font-weight: 500
        &:hover
          opacity: .9
</style>