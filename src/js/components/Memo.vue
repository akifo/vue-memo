<template>
  <li class="memo collection-item">
    <router-link :to="{ name: 'viewer', params: { id: memo.key }}">
      <h2>{{memo.title}}</h2>
      <p>{{memo.author.name}} | {{memo.created | formatDate }}</p>
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'Memo',
  props: ['memo', 'id']
}
</script>

<style lang="stylus">
.collection-item.memo
  padding: 0
  a
    display: block
    padding: 1.5rem
    &:hover
      background-color: #f9f9f9
    h2
      word-wrap: break-word
      font-size: 2rem
      margin: 0
      padding: 0
      color: #65656b
    p
      margin: 0
      padding: 0
      text-align: right
      color: #a9a9a9

</style>
