<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'

export default {
  components: { AppHeader },
  created () {
    this.$store.dispatch('fetchMemos', {
      count: 10,
      type: 'public'
    })
  }
}
</script>

<style lang="stylus">
body
  margin: 0
  padding: 0
</style>
