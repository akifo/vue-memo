const _ = require('lodash')
import { EventEmitter } from 'events'
import assign from 'object-assign'

var strageKey = 'vue-memo-XnmExTbucHakVEVCa87k'
var _memos = []

var localStore = assign({}, EventEmitter.prototype, {

  /**
   * addMemo
   *
   * @param {Object} newMemo
   * @return
   */

  addMemo (newMemo) {
    _memos.push(newMemo)
    this.saveToStrage()
    this.emit('memo-updated')
  },

  removeMemo (memo) {
    _memos = _.without(_memos, memo);
    this.saveToStrage()
    this.emit('memo-updated')
  },

  doneEdit (memo, key, memos) {
    this.saveToStrage(memos)
  }, // doneEdit

  getAllMemos () {
    return _memos
  },

  saveToStrage (memos) {
    var data = {}
    if (typeof sessionStorage !== 'undefined') {
      data.memos = !memos? _memos : _.merge(_memos,memos)
      localStorage.setItem(strageKey, JSON.stringify(data))
    }
  },

  getStrage () {
    var storageData = JSON.parse(localStorage.getItem(strageKey))
    if( !!storageData ) {
      if (!!storageData.memos) _memos = storageData.memos
    } else {
      _memos = [
        {
          title: 'title',
          body: 'body',
        }
      ]
    }
    this.emit('memo-updated')
  }
});

export default localStore;
