<script>

import appGroup from './app-group'
import LocalModel from './local-model'
import {saveSection, errors, add} from 'lexi'

export default {
  name  : 'app-groups',
  props : ['model', 'callbacks'],
  components : {appGroup, saveSection, errors, add},
  data() {
    return {
      localModel   : new LocalModel(this.model),
      lockToBottom : false,
      error        : null,
      saving       : false,
    }
  },
  methods    : {
    // On scroll, check the position for showing / hiding the save-section
    onScroll() {
      let rect = this.$el.getBoundingClientRect()
      let windowHeight = window.innerHeight
      if(rect.y + rect.height - windowHeight > 0)
        this.lockToBottom = true
      else
        this.lockToBottom = false
    },
    save() {
      this.error  = null
      this.saving = true
      this.callbacks.updateGroups( this.localModel.flattenGroups(), (results)=>{
        this.saving = false
        if(results.error != null)
          this.error = results.error
      })
    },
    cancel() {
      this.localModel.reset()
    },
    refresh() {
      console.log( 'refreshi it' )
    }
  },
  mounted() {
    this.onScroll()
    document.body.onscroll = this.onScroll
  },
  // computed:{
  //   model(){return this.model},
  // },
  computed:{
    groups(){return this.model.groups}
  },
  watch:{
    groups:function(){this.localModel = new LocalModel(this.model) }
  }
}
</script>

<!--
  **** H T M L ****
-->

<template lang="pug">
  .groups(v-bind:class="{fixed:lockToBottom}")
    errors(:errors="error")
    .add-section
      add.circle(@click="localModel.createGroup()") Create a Group
    app-group(v-for="(group,i) in localModel.groups" :group="group" :model="localModel" :key="i")
    save-section(v-if="localModel.isDirty" @save="save" @cancel="cancel" :cycling="saving")
</template>

<!--
  **** C S S ****
-->

<style lang="scss" scoped>
  .groups           {
    .save-section   {bottom: 0; padding-bottom:5px;width:630px; }
    &.fixed         {padding-bottom:41px;
      .save-section {position: fixed; padding-top:20px; border-bottom:solid 4px #11A8E0; background:linear-gradient(to bottom, rgba(#E9EDF0, 0) 0%, rgba(white,0.6) 40%);}
    }
    .add-section        {border-bottom:solid 1px #D7D7D7; margin:10px 0 20px; padding:20px 0;   }
  }
</style>
