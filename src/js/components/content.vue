<!--  content.vue
-->

<template>

  <main id="main" class="row">

    <div class="addBox col s12 m3 z-depth-1">
      <form id="form" v-on:submit.prevent="addMemo" class="row">
        <div class="input-field col s12">
          <input id="title" type="text" v-model="newMemo.title">
          <label for="title">title</label>
        </div>
        <div class="input-field col s12">
          <textarea id="textarea" class="materialize-textarea" v-model="newMemo.body"></textarea>
          <label for="textarea">body</label>
        </div>
        <div class="input-field col s12 right-align">
          <input type="submit" class="waves-effect waves-light btn" value="Add Memo">
        </div>
      </form>
    </div>

    <div class="mainBox col s12 m9">
      <ul class="memoList collection">
        <li v-for="memo in memos | filterBy searchText" transition="expand" class="memoItem collection-item">
          <div class="memoHead" :class="{editing: editing(memo, 'title')}">
            <span class="memoTitle" @dblclick="editMemo(memo, 'title')">{{memo.title}}</span>
            <input class="edit" type="text"
              v-model="memo.title"
              v-memo-focus="editing(memo, 'title')"
              @blur="doneEdit(memo, 'title')"
              @keyup.tab="doneEdit(memo, 'title')"
              @keyup.esc="cancelEdit(memo)">
            <span class="memoRemoveBtn" @click="removeMemo(memo)"><i class="fa fa-trash"></i></span>
          </div>
          <div class="memoMain" :class="{editing: editing(memo, 'body')}">
            <span class="memoBody" @dblclick="editMemo(memo, 'body')">{{memo.body}}</span>
            <textarea class="edit"
              v-model="memo.body"
              v-memo-focus="editing(memo, 'body')"
              v-memo-autosize="editing(memo, 'body')"
              @blur="doneEdit(memo, 'body')"
              @keyup.tab="doneEdit(memo, 'body')"
              @keyup.esc="cancelEdit(memo)"
            ></textarea>
            <span class="memoModified">{{memo.modified}}</span>
          </div>
        </li>
      </ul>
    </div>


  </main>

</template>

<script>

export default {

  mixins: [require('./../mixins/event.js')],

  replace: true,

  inherit: true,

}

</script>

<style lang="stylus" scoped>
#main
  display flex
  flex-wrap wrap
  min-height 100vh
  margin-bottom 0
  background-color #eee

  .addBox
    padding-top 30px
    background-color #fff

  .mainBox
    min-height 100vh

    .memoList
      margin 20px
      padding 0
      border none

      .memoItem
        background-color: #fff
        border: 3px solid #e7ebec
        margin-bottom: 6px
        padding: 0 10px

        .memoHead
          display flex
          border-bottom: 1px solid #ddd;
          padding: 6px 10px;
          margin: 0

          .memoTitle
            flex 1 1 auto
            line-height: 1.5

          .edit
            flex 1 1 auto
            display none
            height auto
            border 1px solid #ddd
            margin 0
            paddin 0
            box-shadow none

          .memoRemoveBtn
            opacity 0
            flex 0 1 auto
            cursor pointer

            &:hover
              color #c0392b

          &.editing
            .memoTitle
              display none

            .edit
              display block

        .memoMain
          display block
          padding 6px 10px
          margin: 0

          .memoBody
            line-height: 1.5
            font-size .8rem
            color #666
            white-space: pre
            display block

          .memoModified
            display block
            text-align: right
            font-size: .7rem

          .edit
            flex 1 1 auto
            font-size .8rem
            color #666
            display block
            height 0
            border 1px solid #ddd
            margin 0
            paddin 0
            box-shadow none

            &.autosized
              display none
              height auto

          &.editing
            .memoBody
              display none

            .edit
              display block


        &:hover .memoHead .memoRemoveBtn
          opacity 1

</style>
