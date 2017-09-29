<script>
export default {
  name  : 'app-group',
  props : ['group'],
}
</script>

<!--
  **** H T M L ****
-->

<template lang="pug">
  .app-group
    .title
      input
    .list.apps()
      .app
        .title klondike-brands-site
        .move(@click="move")
      div Add an app
    .list.users
      .user jstriker
</template>

<!--
  ***** C S S *****
-->

<style lang="scss" scoped>
  .app-group { background: #E0E6EA; }
</style>
