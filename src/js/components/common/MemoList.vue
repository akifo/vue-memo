<template>
  <ul class="memo-list">
    <li class="item" v-for="memo in memos" :memo="memo" :key="memo.key" >
      <section>
          <p class="modified">{{memo.modified | formatDate}}</p>
          <h1>
            <router-link :to="{ name: 'MemoView', params: { username: memo.author.name, memoName: memo.memoName }}">
              {{memo.title}}
            </router-link>
          </h1>
          <div class="list-bottom-wrap clearfix">
            <p class="author">
              <router-link :to="{ name: 'UserIndex', params: { username: memo.author.name }}">
                <i class="material-icons">person</i>
                {{memo.author.name}}
              </router-link>
            </p>
            <div class="starCount-wrap">
              <i class="material-icons">star</i>
              <span class="starCount">{{memo.publicWritePermissionData.starCount}}</span>
            </div>
          </div>
      </section>
    </li>
  </ul>
</template>

<script>
export default {

  name: 'MemoList',

  props: ['memos']

}
</script>

<style lang="stylus">
@import '~stylusVar'
.memo-list
  .item
    border-bottom: 1px solid $border-color
    section
      padding: .7rem 0
      h1
        font-size: 1.5rem
        font-weight: 600
      .modified
        font-size: .6rem
        color: $font-color-black-trans
      .list-bottom-wrap
        .author
          display: inline-block
          font-size: .8rem
          color: $font-color-black-trans
          i
            transform: translateY(1px)
        .starCount-wrap
          float: right
          display: inline-block
          i
          .starCount
            font-size: .8rem
            color: $font-color-black-trans

  a
    color: $link-color
    &:hover
      color: darken($link-color, 10%)
      text-decoration: underline

</style>
