## Dependencies

- Vue.js(>2.4.x)
- vue-router(>2.7.x)
- vuex(>2.4.x)
- Firebase(>4.3.x)
- webpack(>3.5.x)

## Introduction
Vue-memo is a personal project created to deepen the understanding of Vue.js.  
I will wait for Pull Request.

![App Screen Shop](https://github.com/akifo/vue-memo/raw/next/docs/screen-shot.gif)

## Before Start

1. Create Firebase Project
2. To enable Google(Facebook, Twitter, Github, EmailPassword) Authentication Sign-In at Firebase Console
3. Entry Environment Variables

``` bash
# create settings.js
cp config/org.js config/development.js
cp config/org.js config/production.js
cp config/org.js config/test.js
# setting up configs
vim development.js
vim production.js
vim test.js
```

## Development

``` bash
# install deps:
npm install
# serve at localhost:8080:
npm run dev
# eslint
npm run lint
# test
npm test
```

## Deploy

```bash
# If you haven't firebase-tools 
npm install -g firebase-tools
```

```bash
# build to dist files:
npm run build
## firebase deploy
firebase login
firebase use --add
# select your project, and then...
firebase deploy
```

## Demo

- [demo site(prod)](https://vue-memo.firebaseapp.com/)
- [demo site(dev)](https://vue-memo-dev.firebaseapp.com/#/)

## Special Thanks!!

### [Vue.js](https://github.com/vuejs/vue)
- [Become a backer or sponsor on Patreon.](https://www.patreon.com/evanyou)
- [Become a backer or sponsor on OpenCollective.](https://opencollective.com/vuejs)

### [Webpack](https://github.com/webpack/webpack)
- [Sponsoring](https://github.com/webpack/webpack#sponsoring)

### [element](https://github.com/ElemeFE/element)
- [Become a backer or sponsor on OpenCollective.](https://opencollective.com/element)