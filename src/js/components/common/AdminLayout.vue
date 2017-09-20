<template>
  <div id="admin-layout">
    <div class="admin-side-navi-wrap">
      <side-navi/>
    </div>
    <div class="admin-content-wrap">
      <slot/>
    </div>
  </div>
</template>

<script>
import SideNavi from '@/components/common/SideNavi'

export default {

  name: 'AdminLayout',

  components: {
    SideNavi
  },

  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">
@import '~stylusVar'

#admin-layout
  display: flex
  .admin-side-navi-wrap
    flex: 0 1 auto
  .admin-content-wrap
    flex: 1 1 auto
    background-color: $bg-color-4

</style>
