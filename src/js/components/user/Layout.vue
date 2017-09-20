<template>
  <admin-layout>

    <div class="main-contents-header">

      <div class="content-title-wrap">

        <h1>Memo</h1>

        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ name: 'UserIndex', params: { username: username } }">{{username}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'MemoView', params: { username: username, memoName: memoName } }">{{memoName}}</el-breadcrumb-item>
        </el-breadcrumb>

      </div>

      <el-tabs v-model="activePage" @tab-click="handleClick">
        <el-tab-pane :label="username" name="UserIndex"></el-tab-pane>
        <el-tab-pane label="Memos" name="UserMemos"></el-tab-pane>
        <el-tab-pane label="Stars" name="UserStars"></el-tab-pane>
        <el-tab-pane v-if="memoName" label="View" name="MemoView"></el-tab-pane>
        <el-tab-pane v-if="memoName && username === displayName" label="Edit" name="MemoEdit"></el-tab-pane>
        <el-tab-pane v-if="memoName && username === displayName" label="Delete" name="MemoDelete"></el-tab-pane>
      </el-tabs>

    </div>

    <router-view class="container"/>

  </admin-layout>
</template>

<script>
import router from '@/router'
import { mapGetters } from 'vuex'
import AdminLayout from '@/components/common/AdminLayout'
// import { log } from '@/modules/debug'

export default {

  name: 'UserLayout',

  components: { AdminLayout },

  props: ['username', 'memoName'],

  computed: {
    ...mapGetters('account', [
      'displayName'
    ])
  },

  data () {
    return {
      activePage: ''
    }
  },

  watch: {
    '$route.name' (val) {
      this.activePage = val || 'UserIndex'
    }
  },

  created () {
    this.activePage = this.activePage || this.$route.name || 'UserIndex'
  },

  methods: {
    handleClick (tab, event) {
      router.push({ name: this.activePage })
    }
  }

}
</script>
