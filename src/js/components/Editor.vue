<template>
  <div class="editor">
    <form>
      <div class="input-field">
        <input type="text" v-model="memo.title" placeholder="title" required>
      </div>
      <div class="input-field">
        <div class="modeBtnWrap">
          <a class="waves-effect waves-light btn" :class="{ active: !previewMode }" @click="switchMode(false)">Write</a>
          <a class="waves-effect waves-light btn" :class="{ active: previewMode }" @click="switchMode(true)">Preview</a>
        </div>
        <textarea v-show="!previewMode" id="textareaBody" :value="memo.body" placeholder="markedown" @input="update" required></textarea>
        <div v-show="previewMode" v-html="compiledMarkdown" class="preview"></div>
      </div>
      <div class="right">
        <a class="grey lighten-2 waves-effect waves-light btn-large" @click="cancel">Cancel</a>
        <a v-if="$route.name === 'updateEditor'" class="waves-effect waves-light btn-large" @click="submit">Update Memo</a>
        <a v-if="$route.name === 'newEditor'" class="waves-effect waves-light btn-large" @click="submit">Add New Memo</a>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import marked from 'marked'
import _ from 'lodash'

const memoTemplate = {
  title: '',
  body: ''
}

export default {
  computed: {
    ...mapGetters(['currentMemo', 'currentMemoID']),
    compiledMarkdown: function () {
      return marked(this.memo.body, { sanitize: true })
    }
  },
  data () {
    return {
      memo: {},
      previewMode: false
    }
  },
  created () {
    this.memo = Object.assign({}, memoTemplate, this.currentMemo)
    if (this.currentMemoID) this.$store.dispatch('fetchMemo')
  },
  methods: {
    cancel () {
      this.$router.go(-1)
    },
    submit () {
      if (!this.memo.title) {
        Materialize.toast('required title', 4000, 'red')
      } else if (!this.memo.body) {
        Materialize.toast('required body', 4000, 'red')
      } else {
        var methodName = ''
        var methodComment = ''
        if (this.$route.name === 'updateEditor') [methodName, methodComment] = ['updateMemo', 'Update']
        else if (this.$route.name === 'newEditor') [methodName, methodComment] = ['addMemo', 'Add']
        this.$store.dispatch(methodName, this.memo)
          .then(key => {
            Materialize.toast('Success ' + methodComment, 4000, 'green')
            this.$router.push({ name: 'viewer', params: { id: key }})
          }).catch(err => {
            Materialize.toast('Error ' + err, 4000, 'red')
          })
      }
    },
    switchMode (state) {
      this.previewMode = state
    },
    update: _.debounce(function (e) {
      this.memo.body = e.target.value
    }, 300)
  }
}
</script>

<style lang="stylus">
.editor
  padding: 1rem
  .input-field
    .modeBtnWrap
      margin: 0
      a
        background-color: #b2dfdb
        color: #fff
        &.active
          background-color: #00695c
          color: #fff
    input
    textarea
    .preview
      box-sizing: border-box
      width: 100%
      border: 1px solid #ddd
      padding: .5em
    input
      height: auto
    textarea
      height: 400px
      height: calc(100vh - 300px)
      resize: none
    .preview
      margin-bottom: .5em
      min-height: 400px
      min-height: calc(100vh - 300px)


</style>