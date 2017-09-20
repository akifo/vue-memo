<template>
  <article class="memo-viewer" v-if="!isEmpty">
    <div class="header-main clearfix">
      <h1>{{memo.title}}</h1>
      <div class="star-count-wrap">
        <star-count
          :count="memo.publicWritePermissionData.starCount"
          :mid="memo.mid || 'new-memo'"
          :stars="memo.publicWritePermissionData.stars"/>
      </div>
    </div>
    <div class="header-aside">
      <p>
        created at {{memo.created | yyyymmddhhmmss }}
      </p>
    </div>
    <div class="container">
      <div v-html="compiledMarkdown" class="markdown-body"></div>
    </div>
  </article>
</template>

<script>
import _ from 'lodash'
import marked from 'marked'
import StarCountComponent from '@/components/common/StarCount'
// import { log } from '@/modules/debug'

export default {

  name: 'MemoViewer',

  components: {
    'star-count': StarCountComponent
  },

  props: {
    memo: {
      type: Object,
      default: {}
    }
  },

  computed: {

    isEmpty () {
      return _.isEmpty(this.memo)
    },

    compiledMarkdown () {
      if (!this.memo) return ''
      return marked(this.memo.body, { sanitize: true })
    }
  }

}
</script>

<style lang="stylus" scoped>
@import '~stylusVar'
.memo-viewer
  padding: 0
  .header-main
    padding: 1.5rem 3rem
    background-color: $primary-color-light
    h1
      margin: 0 0 1rem
      font-size: 2.5rem
      color: $font-color-white
    .star-count-wrap
      float: right
      color: $font-color-white
  .header-aside
    padding: .5rem 3rem
    background-color: $bg-color-3
    p
      color: $font-color-black
      font-size: .8rem

  .container
    padding-top: 0
    min-width: 85%
    background-color: $bg-color-4
    color: $font-color-black
    .markdown-body
      min-height: 100px
</style>
