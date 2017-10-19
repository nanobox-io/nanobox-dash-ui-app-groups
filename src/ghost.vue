<script type="text/babel">
export default {
  name: 'ghost',
  methods:{
    beforeLeave(el) {
      // In case this element is deriving its width from its
      // outer container, lock its width to the current width
      // before we transition it out as positioned absolute
      el.style['width'] = `${el.offsetWidth}px`
    }
  }
}
</script>

<!--
  **** H T M L ****
-->

<template lang="pug">
  transition-group.ghost(name="ghost" v-on:before-leave="beforeLeave" )
    slot
</template>

<!--
  ***** C S S *****
-->

<style lang="scss" >
  .ghost > * {
    transition:all 0.35s cubic-bezier(0.86, 0, 0.07, 1);
  }
  .ghost-enter, .ghost-leave-to {
    opacity: 0;
  }
  .ghost-leave-active {
    position: absolute;
    // min-width: 630px;
  }
</style>
