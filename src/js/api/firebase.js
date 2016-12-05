import firebase from 'firebase'
import moment from 'moment'

// initialize Firebase
firebase.initializeApp(Env.firebase)
var auth = firebase.auth()
var database = firebase.database()

// variable
var _userInfo = {}
var _memos = {}
var _userRef = null
var _publicMemosRef = null
var _myMemosRef = null
var _fetchedPublicCount = 0
var _fetchedMyselfCount = 0

export default {

  // Sets up shortcuts to Firebase features and initiate firebase auth.
  initFirebase () {
    // Initiates Firebase auth and listen to auth state changes.
    auth.onAuthStateChanged(this.onAuthStateChanged.bind(this))
  },

  getAuth () {
    return auth.currentUser || {}
  },

  // Signs-in
  signIn () {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  },

  // Signs-out
  signOut () {
    // Sign out of Firebase.
    auth.signOut()
  },

  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  onAuthStateChanged (user) {
    if (user) { // User is signed in!
      this.fetchUserInfo(user.uid)
        .then(val => {
          _userInfo = {
            loggedIn: true,
            uid: user.uid,
            name: val.name || user.displayName,
            profilePicUrl: user.photoURL
          }
          _App.$store.dispatch('onAuthStateChanged', Object.assign({}, _userInfo))
        }).catch(() => {
          _userInfo = {
            loggedIn: true,
            uid: user.uid,
            name: user.displayName,
            profilePicUrl: user.photoURL
          }
          _App.$store.dispatch('onAuthStateChanged', Object.assign({}, _userInfo))
        })
    } else {
      _userInfo = {
        loggedIn: false,
        uid: '',
        name: 'guest',
        profilePicUrl: ''
      }
      _App.$store.dispatch('onAuthStateChanged', Object.assign({}, _userInfo))
    }
  },

  fetchUserInfo (uid) {
    return new Promise((resolve, reject) => {
      _userRef = database.ref('users')
      _userRef.child(uid).once('value')
        .then(snapshot => {
          const user = snapshot.val()
          resolve(user)
        }).catch(reject)
    })
  },

  setUserInfo (key, val) {
    return new Promise((resolve, reject) => {
      if (key && val && this.checkSignedInWithMessage()) {
        _userRef = database.ref('users').child(_userInfo.uid).child(key)
        _userRef.set(val)
          .then(() => {
            _userInfo[key] = val
            resolve()
          }).catch(reject)
      }
    })
  },

  checkSignedInWithMessage () {
    if (auth.currentUser) return true
    return false
  },

  fetchMemo (key) {
    return new Promise((resolve, reject) => {
      _publicMemosRef = database.ref('publicMemos').child(key)
      _publicMemosRef.once('value')
        .then(snapshot => {
          const memo = snapshot.val()
          _memos[key] = memo
          resolve({
            memo: Object.assign({}, memo),
            key: key
          })
        }).catch(reject)
    })
  },

  fetchMemos (count, type) {
    return new Promise((resolve, reject) => {
      if (type === 'public') {
        _fetchedPublicCount += count
        _publicMemosRef = database.ref('publicMemos')
        _publicMemosRef.orderByChild('created').limitToLast(_fetchedPublicCount).once('value')
          .then(snapshot => {
            const memo = snapshot.val() || {}
            Object.keys(memo).forEach(key => {
              _memos[key] = memo[key]
            })
            resolve(Object.assign({}, _memos))
          }).catch(reject)
      } else if (type === 'myself' && this.checkSignedInWithMessage()) {
        _fetchedMyselfCount += count
        _myMemosRef = database.ref('memos').child(_userInfo.uid)
        _myMemosRef.orderByChild('created').limitToLast(_fetchedMyselfCount).once('value')
          .then(snapshot => {
            const memo = snapshot.val() || {}
            Object.keys(memo).forEach(key => {
              _memos[key] = memo[key]
              _memos[key].author = {
                uid: _userInfo.uid,
                name: _userInfo.name
              }
            })
            resolve(Object.assign({}, _memos))
          }).catch(reject)
      } else reject('required login for myself timeline')
    })
  },

  addMemo (memo) {
    return new Promise((resolve, reject) => {
      // Check that the user entered a message and is signed in.
      if (memo && this.checkSignedInWithMessage()) {
        _myMemosRef = database.ref('memos').child(_userInfo.uid)
        var key = ''
        const now = parseInt(moment().format('x'))
        _myMemosRef.push({
          title: memo.title,
          body: memo.body,
          created: now,
          modified: now
        }).then(val => {
          key = val.key
          _publicMemosRef = database.ref('publicMemos').child(key)
          return _publicMemosRef.set({
            title: memo.title,
            body: memo.body,
            created: now,
            modified: now,
            author: {
              uid: _userInfo.uid,
              name: _userInfo.name
            }
          })
        }).then(() => {
          _memos[key] = memo
          resolve({
            memo: Object.assign({}, {
              created: now,
              modified: now,
              author: {
                uid: _userInfo.uid,
                name: _userInfo.name
              }
            }, memo),
            key: key
          })
        }).catch(reject)
      }
    })
  },

  deleteMemo (key) {
    return new Promise((resolve, reject) => {
      if (key && this.checkSignedInWithMessage()) {
        _publicMemosRef = database.ref('publicMemos').child(key)
        _publicMemosRef.remove()
          .then(() => {
            _myMemosRef = database.ref('memos').child(_userInfo.uid).child(key)
            return _myMemosRef.remove()
          }).then(() => {
            resolve(key)
            delete _memos[key]
          }).catch(reject)
      }
    })
  },

  updateMemo (key, memo) {
    return new Promise((resolve, reject) => {
      if (memo && this.checkSignedInWithMessage()) {
        _myMemosRef = database.ref('memos').child(memo.author.uid).child(key)
        const now = parseInt(moment().format('x'))
        _myMemosRef.set({
          title: memo.title,
          body: memo.body,
          created: memo.created,
          modified: now
        }).then(() => {
          _publicMemosRef = database.ref('publicMemos').child(key)
          return _publicMemosRef.set({
            title: memo.title,
            body: memo.body,
            created: memo.created,
            modified: now,
            author: {
              uid: memo.author.uid,
              name: memo.author.name
            }
          })
        }).then(() => {
          _memos[key] = memo
          resolve()
        }).catch(reject)
      }
    })
  }

}
