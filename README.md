## Dependencies

- Vue.js(>2.x.)
- vue-router(>2.x.)
- vuex(>2.x.)
- vuex-router-sync(>3.x.) @next
- Firebase(>3.6.x)
- marked(>0.3.x)
- webpack(>1.13.x)
- babel-core(>6.18.x)
- babel-presett-es2015
- babel-presett-stage-2

## Introduction
Vue-memo is a personal project created to deepen the understanding of Vue.js.
I will wait for Pull Request.

![App Screen Shop](https://github.com/akifo/vue-memo/raw/dev/docs/screen-shot.jpg)

## Before Start

1. Create Firebase Project
2. To enable Google Authentication Sign-In
3. Entry Environment Variables

``` bash
# create settings.js
cp settings.js.org settings.js
# paste from Firebase config
vim settings.js
```

## Development Setup

``` bash
# install deps:
npm install
# serve examples at localhost:8080:
npm run dev
# build dist files:
npm run build
```

## Deploy to Firebase

```bash
firebase login
firebase use --add
# select your project, and then...
npm run deploy
```

## Demo

[demo site](https://vue-memo.firebaseapp.com/)
