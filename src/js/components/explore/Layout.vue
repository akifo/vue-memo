<template>
  <admin-layout>

    <div class="main-contents-header">

      <div class="content-title-wrap">
        <h1>Explore</h1>
      </div>

      <el-tabs v-model="activePage" @tab-click="handleClick">
        <el-tab-pane label="Trending" name="Trending"></el-tab-pane>
        <el-tab-pane label="Latest" name="Latest"></el-tab-pane>
      </el-tabs>

    </div>

    <router-view class="container"/>

  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/common/AdminLayout'

export default {

  name: 'ExploreLayout',

  components: { AdminLayout },

  data () {
    return {
      activePage: ''
    }
  },

  watch: {
    '$route.name' (val) {
      this.activePage = val || 'Trending'
    }
  },

  created () {
    this.activePage = this.activePage || this.$route.name || 'Trending'
  },

  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: this.activePage })
    }
  }

}
</script>
