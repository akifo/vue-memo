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
        <li v-for="memo in memos | filterBy searchText | orderBy 'modified' -1" transition="expand" class="memoItem collection-item">
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

import localStore from '../stores/localStore'
import firebaseStore from '../stores/firebaseStore'
import ActionCreator from '../actioncreator'
import Vue from 'vue'
import autosize from 'autosize'
import moment from 'moment'

export default {

  props: {
    searchText: {
      type: String,
      required: true,
    },
    currentView: {
      type: String,
      required: true,
    },
    facebookUserInfo: {
      type: Object,
      required: false
    }
  },

  data () {
    return {
      newMemo: {
        title: '',
        body: '',
        modified: ''
      },
      memos: [],
      beforeEditCache: '',
      editedMemo: '',
      editedKey: '',
    }
  }, // data

  watch: {
    'currentView': function (val, oldVal) {
      this.init()
    }
  }, // watch

  created () {
    this.init()
  }, // created

  methods: {

    init() {
      ActionCreator.setState(this.currentView)
      switch (this.currentView) {
        case 'anonymous':
          localStore.on('memo-updated', this.updated)
          ActionCreator.exe('getStrage')
          break;
        case 'facebook':
          firebaseStore.on('memo-updated', this.updated)
          ActionCreator.exe('init', this.facebookUserInfo.uid)
          break;
        default:
          localStore.removeListener('memo-updated', this.updated)
          firebaseStore.removeListener('memo-updated', this.updated)
          break;
      }
    },

    updated () {
      this.memos = ActionCreator.exe('getAllMemos')
      this.newMemo.title = ''
      this.newMemo.body = ''
      this.newMemo.modified = ''
    },

    addMemo () {
      var title = this.newMemo.title && this.newMemo.title.trim()
      var body = this.newMemo.body && this.newMemo.body.trim()
      if (!title || !body) return
      ActionCreator.exe('addMemo', {
        title: title,
        body: body,
        modified: moment().format('YYYY.MM.DD HH:mm')
      })
    }, // addMemo

    removeMemo (memo) {
      ActionCreator.exe('removeMemo', memo)
    }, // removeMemo

    doneEdit (memo, key) {
      if (!this.editedMemo) return
      this.editedMemo = null
      this.editedKey = null
      memo[key] = memo[key].trim()
      if (!memo[key]) this.cancelEdit(memo)
      ActionCreator.exe('doneEdit', memo , key, this.memos)
    }, // doneEdit

    editMemo (memo, key) {
      this.beforeEditCache = memo[key]
      this.editedMemo = memo
      this.editedKey = key
    }, // editMemo

    cancelEdit (memo) {
      memo[this.editedKey] = this.beforeEditCache
      this.editedMemo = null
      this.editedKey = null
    }, // cancelEdit

    editing (memo, key) {
      return memo == this.editedMemo && key == this.editedKey
    }, // editing

  }, // methods

  directives: {
		'memo-focus' (value) {
			if (!value) return
			var el = this.el
			Vue.nextTick( () => {
				el.focus()
			})
		},
    'memo-autosize': {
      bind () {
        var el = this.el
        Vue.nextTick( () => {
          autosize(el)
          $(el).addClass('autosized')
        })
      }
    }
	} // directives

}

</script>

<style lang="stylus" scoped>
#main
  display flex
  flex-wrap wrap
  min-height 100vh
  margin-bottom 0
  background-color #eee
  z-index 1

  .addBox
    padding-top 30px
    background-color #fff

    .btn
      background-color #3b5998

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
          border-bottom: 1px solid #ddd
          padding: 6px 10px
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
            white-space: pre-line
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
