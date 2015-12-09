const _ = require('lodash')
import { EventEmitter } from 'events'
import assign from 'object-assign'

var _memos = []
var Firebase = require("firebase")
var baseURL = 'https://vue-memo.firebaseIO.com/'
var facebookUserUid = ''
var MyMemos = ''


var firebaseStore = assign({}, EventEmitter.prototype, {

  init (uid) {

    MyMemos = new Firebase(baseURL + 'memos/' + uid)
    facebookUserUid = uid

    MyMemos.on('child_added', (snapshot) => {
      var item = snapshot.val()
      item.id = snapshot.key()
      _memos.push(item)
      firebaseStore.emit('memo-updated')
    })

    MyMemos.on('child_removed', (snapshot) => {
      console.log('deleted')
      var id = snapshot.key()
      _memos.some( (memo) => {
        if (memo.id === id) {
          _memos.$remove(memo)
          return true
        }
      })
      firebaseStore.emit('memo-updated')
    })

  }, // init

  /**
   * addMemo
   *
   * @param {Object} newMemo
   * @return
   */

  addMemo (newMemo) {
    console.log(newMemo)
    MyMemos.push(newMemo)
  },

  removeMemo (memo) {
    new Firebase(baseURL + 'memos/' + facebookUserUid + '/' + memo.id).remove()
  },

  doneEdit (memo, key) {
    MyMemos.child(memo.id).child(key).set(memo[key])
  }, // doneEdit

  getAllMemos () {
    return _memos
  },

  saveToStrage () {
    // do nothing
  },

});

export default firebaseStore;
