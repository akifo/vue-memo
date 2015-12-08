<!--  facebook.vue
  ログインしている User向けの View
  firebaseを利用して、データを保存する。
-->

<script>

var Firebase = require("firebase")
var baseURL = 'https://vue-memo.firebaseIO.com/'
var MyMemos

var moment = require('moment')

export default {

  mixins: [require('./../mixins/event.js')],

  template: require('./#main.html') ,

  props: {
    searchText: {
      type: String,
      required: true,
      twoWay: false
    },
    facebookUserInfo: {
      type: Object,
      required: false
    }
  }, // props

  created () {

    var self = this

    MyMemos = new Firebase(baseURL + 'memos/' + this.facebookUserInfo.uid)

    MyMemos.on('child_added', (snapshot) => {
      var item = snapshot.val()
      item.id = snapshot.key()
      self.memos.push(item)
    })

    MyMemos.on('child_removed', (snapshot) => {
      console.log('deleted')
      var id = snapshot.key()
      self.memos.some( (memo) => {
        if (memo.id === id) {
          self.memos.$remove(memo)
          return true
        }
      })
    })

  }, // created


  methods: {

    addMemo () {
      var title = this.newMemo.title && this.newMemo.title.trim()
      var body = this.newMemo.body && this.newMemo.body.trim()
      if (!title || !body) return
      this.newMemo.modified = moment().format('YYYY.MM.DD HH:mm:ss')
      MyMemos.push(this.newMemo)
      this.newMemo.title = ''
      this.newMemo.body = ''
      this.newMemo.modified = ''
    }, // addMemo

    removeMemo (memo) {
      new Firebase(baseURL + 'memos/' + this.facebookUserInfo.uid + '/' + memo.id).remove()
    }, // removeMemo

    doneEdit (memo, key) {
      if (!this.editedMemo) return
      this.editedMemo = null
      this.editedKey = null
      memo[key] = memo[key].trim()
      if (!memo[key]) this.cancelEdit(memo)
      MyMemos.child(memo.id).child(key).set(memo[key])
    }, // doneEdit

	}, // methods

}

</script>

<style lang="stylus">
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
