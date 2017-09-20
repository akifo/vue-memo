<template>
  <div id="app" v-loading="loading" :element-loading-text="loadingText">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'

export default {

  components: { AppHeader },

  computed: {
    ...mapGetters('loading', [
      'loading',
      'loadingText'
    ])
  }

}
</script>

<style lang="stylus">
body
  margin: 0
  padding: 0
</style>
