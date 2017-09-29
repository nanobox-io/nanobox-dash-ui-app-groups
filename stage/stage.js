require('nanobox-core-styles/scss/_base.scss')

import Shim from './shim'
import appGroups from '../src/main.js'
import Vue from 'vue'

Vue.config.productionTip = false;

window.shim = new Shim()

let callbacks = {

}

new Vue({
  el       : '#app',
  template : '<app-groups :model="model" :callbacks="callbacks"/>',
  data     : {
    model     : shim.data,
    callbacks : callbacks
  },
  components:{ appGroups }
})
