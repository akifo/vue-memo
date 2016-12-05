<template>
  <div class="viewer">
    <div class="header teal lighten-5">
      <h1>{{memo.title}}</h1>
      <p>by {{memo.author.name}}</p>
      <p>{{memo.created | formatDate }}</p>
      <router-link :to="{ name: 'updateEditor', params: { id: currentMemoID }}" class="btn waves-effect waves-light green">Edit</router-link>
      <a class="btn waves-effect waves-light red" @click="deleteMemo">Delete</a>
    </div>
    <div class="container">
      <div v-html="compiledMarkdown" ></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import marked from 'marked'

const memoTemplate = {
  title: '',
  body: '',
  created: 0,
  modified: 0,
  author: {
    uid: '',
    name: ''
  }
}

export default {
  computed: {
    ...mapGetters(['currentMemo', 'currentMemoID']),
    memo: function () {
      return Object.assign({}, memoTemplate, this.currentMemo)
    },
    compiledMarkdown: function () {
      return marked(this.memo.body, { sanitize: true })
    }
  },
  created () {
    this.$store.dispatch('fetchMemo')
  },
  methods: {
    deleteMemo () {
      this.$store.dispatch('deleteMemo')
        .then(() => {
          Materialize.toast('Success Delete', 4000, 'green')
          this.$router.push('/')
        }).catch(() => {
          Materialize.toast('Error', 4000, 'red')
        })
    }
  }
}
</script>

<style lang="stylus">
.viewer
  .header
    padding: 3rem
    h1
      margin: 0 0 1rem
      font-size: 2.5rem
      color: #65656b
    p
      font-size: 1rem
      margin: 0
      padding: 0
      color: #a9a9a9
    a
      margin: 1rem 0 0
  .container
    min-width: 85%

</style>