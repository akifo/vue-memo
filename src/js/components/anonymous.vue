<!--  anonymous.vue
  ログインしていない User向けの View
  ローカルストレージを利用して、データを保存する。
-->

<script>

var strageKey = 'vue-memo-XnmExTbucHakVEVCa87k'
var moment = require('moment')

export default {

  mixins: [require('./../mixins/event.js')],

  template: require('./#main.html') ,

  props: {
    searchText: {
      type: String,
      required: true,
      twoWay: false
    }
  },

  created () {

    this.getStrage()

  }, // created

  methods: {

    // データ取得
		getStrage () {
			var storageData = JSON.parse(localStorage.getItem(strageKey))
			if( !!storageData ) {
				if (!!storageData.memos) this.memos = storageData.memos
			} else {
        this.memos = [
          {
            title: 'title',
            body: 'body',
          }
        ]
			}
		}, // getStrage

    // データ保存
		saveToStrage () {
			var saveToStrage = {}
			if (typeof sessionStorage !== 'undefined') {
				saveToStrage.memos = this.memos
				localStorage.setItem(strageKey, JSON.stringify(saveToStrage))
			}
		}, // saveToStrage

    addMemo () {
      var title = this.newMemo.title && this.newMemo.title.trim()
      var body = this.newMemo.body && this.newMemo.body.trim()
      if (!title || !body) return
      this.memos.push({
        title: title,
        body: body,
        modified: moment().format('YYYY.MM.DD HH:mm')
      })
      this.saveToStrage()
      this.newMemo.title = ''
      this.newMemo.body = ''
    }, // addMemo

    removeMemo (memo) {
      this.memos.$remove(memo)
      this.saveToStrage()
    }, // removeMemo

    doneEdit (memo, key) {
      if (!this.editedMemo) return
      this.editedMemo = null
      this.editedKey = null
      memo[key] = memo[key].trim()
      if (!memo[key]) this.cancelEdit(memo)
      this.saveToStrage()
    }, // doneEdit

	}, // methods
}
</script>
