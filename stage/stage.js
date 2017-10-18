require('nanobox-core-styles/scss/_base.scss')

import Shim from './shim'
import appGroups from '../src/main.js'
import Vue from 'vue'

Vue.config.productionTip = false;

let callbacks = {
  updateGroups(data, cb){
    console.log( "Update the groups with the following data : " )
    console.log( data )
    setTimeout( ()=> {
      // simulate saving and ids changing
      for ( let group of data ){
        group.id += "-new-id"
      }
      shim.data.groups = data
      cb({})
    }, 1200 * Math.random() );
  }
}

window.shim = new Shim()

new Vue({
  el       : '#app',
  template : '<app-groups :model="model" :callbacks="callbacks"/>',
  data     : {
    model     : shim.data,
    callbacks : callbacks
  },
  components:{ appGroups }
})
