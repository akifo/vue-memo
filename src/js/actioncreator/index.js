import localStore from '../stores/localStore'
import firebaseStore from '../stores/firebaseStore'
var state = ''

/**
 * @param  {String} method name
 * @param  {*} argument
 * @return
 */

export default {

  setState (currentView) {
    state = currentView
  },

  exe (method, arg0, arg1, arg2) {
    switch (state) {
      case 'anonymous':
        return localStore[method](arg0,arg1,arg2)
        break;
      case 'facebook':
        return firebaseStore[method](arg0,arg1,arg2)
        break;
      default:
        console.log('error')
        break;
    }
  }

}
