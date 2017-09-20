<template>
  <div class="memo-editer container">

    <el-popover
      ref="popoverMemoName"
      placement="top-start"
      width="200"
      trigger="hover"
      content="Memo names is short and memorable.">
    </el-popover>

    <el-form-item prop="memoName">
      <label>Memo-name<i v-popover:popoverMemoName class="fa fa-question-circle-o" aria-hidden="true"></i></label>
      <el-input v-model="memo.memoName" placeholder="Memo Name"></el-input>
    </el-form-item>

    <el-form-item prop="title">
      <label>Title</label>
      <el-input v-model="memo.title" placeholder="Memo title"></el-input>
    </el-form-item>

    <el-form-item prop="body">
      <label>Body</label>
      <el-input
        type="textarea"
        :autosize="{ minRows: 15, maxRows: 400}"
        placeholder="Memo body"
        v-model="memo.body">
      </el-input>
    </el-form-item>

  </div>
</template>

<script>
export default {

  name: 'MemoEditer',

  props: ['memo']

}
</script>

<style lang="stylus" scoped>
@import '~stylusVar'
.memo-editer

  .editer-header
    margin-bottom: 20px
    .el-button
      width: 100px

  label
    display: inline-block
    color: $font-color-black-trans
    margin-bottom: 4px
    i
      display: inline-block
      margin-left: .4em
      transform: translateY(1px)

  .el-input
    margin-bottom: 10px

</style>
