<template>
  <admin-layout>

    <div class="main-contents-header">

      <div class="content-title-wrap">
        <h1>Dashboad</h1>
      </div>

      <el-tabs v-model="activePage">
        <el-tab-pane label="Latest" name="el-latest"></el-tab-pane>
        <el-tab-pane label="Trending" name="el-trending"></el-tab-pane>
      </el-tabs>

    </div>

    <component :is="activePage" class="container" />

  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/common/AdminLayout'
import TrendingComponent from '@/components/explore/Trending'
import LatestComponent from '@/components/explore/Latest'
// import { log } from '@/modules/debug'

export default {

  name: 'Index',

  components: {
    AdminLayout,
    'el-latest': LatestComponent,
    'el-trending': TrendingComponent
  },

  data () {
    return {
      activePage: ''
    }
  },

  created () {
    this.activePage = this.activePage || 'el-latest'
  }

}
</script>
