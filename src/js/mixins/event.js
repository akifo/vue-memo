var Vue = require('vue')
var autosize = require('autosize')

module.exports = {

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

  methods: {

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
