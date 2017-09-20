import firebaseErrMsg from '@/modules/firebase-err-msg'
import { log } from '@/modules/debug'

module.exports = {

  methods: {
    firebaseReject (err) {
      if (err !== 'ignore') {
        log(err)
        this.$notify.error({
          title: 'Error',
          message: firebaseErrMsg[err && err.code] || firebaseErrMsg[err] || (err && err.message) || err || 'Error'
        })
      }
    }

  } // methods
}
