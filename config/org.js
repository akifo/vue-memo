const YAML = require('yamljs')

const RESERVED_WORDS = YAML.load('./config/reserved-words.yml')

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
}

const AUTH_CONFIG = {
  email: true,
  google: false,
  facebook: false,
  twitter: false,
  github: false
}

module.exports = {
  RESERVED_WORDS,
  FIREBASE_CONFIG,
  AUTH_CONFIG
}
