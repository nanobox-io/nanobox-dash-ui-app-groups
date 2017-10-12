require('nanobox-core-styles/scss/_base.scss')
require("script-loader!../node_modules/shadow-icons/rel/app.js")

import Vue from 'vue'
Vue.config.productionTip = false;

import Shim from './shim'
import appGroups from '../src/main.js'
window.shim = new Shim()

let callbacks = {
  updateGroups(data, cb){
    console.log( "Update the groups with the following data : " )
    console.log( data )
    setTimeout( ()=> {
      cb({})
    }, 1200 * Math.random() );
  }
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
