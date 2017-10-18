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
      localModel   : new LocalModel(this.model, this.checkHeight),
      lockToBottom : false,
      error        : null,
      saving       : false,
    }
  },
  methods    : {
    // On scroll, check the position for showing / hiding the save-section
    checkHeight() {
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
  },
  mounted() {
    this.checkHeight()
    document.body.onscroll = this.checkHeight
  },
  // After save, rails updates the groups data obj. We watch for that
  // update and flow the data down to the app groups components
  computed:{
    groups(){return this.model.groups}
  },
  watch:{
    groups:function(){this.localModel = new LocalModel(this.model, this.checkHeight) }
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
    save-section(v-if="localModel.isDirty" @save="save" @cancel="cancel" :cycling="saving" save-text="Save Groups")
</template>

<!--
  **** C S S ****
-->

<style lang="scss" scoped>
  .groups           {
    .save-section   {bottom: 0; padding-bottom:5px;width:630px; }
    &.fixed         {padding-bottom:41px;
      .save-section {position: fixed; padding:10px 0 10px; border-bottom:solid 13px #0058ED; background:linear-gradient(to bottom, rgba(white, 0) 0%, rgba(white,1) 45%);}
    }
    .add-section    {border-bottom:solid 1px #D7D7D7; margin:10px 0 20px; padding:20px 0;   }
  }
</style>
