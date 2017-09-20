<template>
  <admin-layout>

    <div class="main-contents-header">

      <div class="content-title-wrap">
        <h1>Settings</h1>
      </div>

      <el-tabs v-model="activePage" @tab-click="handleClick">
        <el-tab-pane label="Profile" name="AccountProfile"></el-tab-pane>
        <el-tab-pane label="ChangeEmail" name="ChangeEmail"></el-tab-pane>
        <el-tab-pane label="ChangePassword" name="ChangePassword"></el-tab-pane>
        <el-tab-pane label="AccountDelete" name="AccountDelete"></el-tab-pane>
      </el-tabs>

    </div>

    <router-view class="container"/>

  </admin-layout>
</template>


<script>
import AdminLayout from '@/components/common/AdminLayout'

export default {

  name: 'SettingsLayout',

  components: { AdminLayout },

  data () {
    return {
      activePage: ''
    }
  },

  watch: {
    '$route.name' (val) {
      this.activePage = val || 'AccountProfile'
    }
  },

  created () {
    this.activePage = this.activePage || this.$route.name || 'AccountProfile'
  },

  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: this.activePage })
    }
  }

}
</script>
