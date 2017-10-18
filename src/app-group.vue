<script>
import {gravatar, dropdown, x, add} from 'lexi'
import {EventBus} from './event-bus'

export default {
  name       : 'app-group',
  props      : ['group', 'model'],
  components : {gravatar, dropdown, x, add},
  data() {
    return{}
  },
  methods    : {
    // Events
    moveApp(appId, groupId) {EventBus.$emit('app.move',          appId, groupId )},
    addUser(userId)         {EventBus.$emit('group.user.add',    this.group, userId )},
    removeUser(userId)      {EventBus.$emit('group.user.remove', this.group, userId )},
    moveApp(appId, groupId) {EventBus.$emit('group.app.move',    appId, groupId ) },
    deleteGroup()           {EventBus.$emit('group.delete',      this.group.id) },
    onNameInput(val)        {EventBus.$emit('group.name.change', this.group)},
    // Name input focus
    onInputFocus() {
      if( this.$refs.nameField.value == 'New Group (click to edit)')
        this.$refs.nameField.value = ""
    }
  },
}
</script>

<!--
  **** H T M L ****
-->

<template lang="pug">
  .app-group(v-bind:class="{unassigned:group.isUnassigned}")
    .title
      input(placeholder="Group Name" v-model="group.name" @input="onNameInput" v-bind:disabled="group.isUnassigned" @focus="onInputFocus" ref="nameField")
    .main
      .lists
        //- Apps
        .list.apps
          .title
            .txt Apps
          .app(v-for="app in group.apps" )
            .name {{ model.apps[app].name }}

            //- Move app to new group
            dropdown(:hide-trigger="true" :ref="`dd${model.apps[app].id}`" @change="moveApp(model.apps[app].id, $event)")
              .option(v-for="grp in model.groups" :value="grp.id" v-bind:class="{checked:grp.id == group.id}") {{grp.name}}
            .move(@click="$refs[$event.target.dataset.dropdownId][0].open() " :data-dropdown-id="`dd${model.apps[app].id}`") move

          //- Add an app
          dropdown(:hide-trigger="true" ref="apps-dd" :yMod="20" @change="moveApp($event, group.id)")
            .option(v-for="app in model.apps" :value="app.id" v-if="!group.apps.includes(app.id)") {{app.name}}

          add.action-btn.circle.white.small.blue(@click="$refs['apps-dd'].open()" v-show="Object.keys(model.apps).length > group.apps.length") Add an app

        //- USERS
        .list.users
          .title
            .txt Users
            //- Add a users
            dropdown(:hide-trigger="true" ref="users-dd" :xMod="60" @change="addUser")
              .option(v-for="user in model.users" :value="user.user" v-bind:class="{checked:group.users.includes(user.user)}") {{user.user}}
              .option(value="add.all") Add All
            .action-btn(@click="$refs['users-dd'].open()")
              add.add.small.blue
              .txt Add a User
          .user(v-for="user in group.users" :key="user")
            gravatar(:email="model.users[user].email" :round="true" :size="35")
            .name {{ model.users[user].user }}
            x.x(@click="removeUser(user)")

      .delete-section
        x(@click="deleteGroup") Delete Group
</template>

<!--
  ***** C S S *****
-->

<style lang="scss" scoped>
  .app-group        {background: #E0E6EA; margin-bottom:40px;
    input           {width: 100%; height:36px; font-weight: $semibold; color:#034C66; font-size:16px; padding-left:25px; margin-bottom: 10px; }
    .main           {padding:25px; }
    .lists          {display: flex; justify-content: space-between;}

    .list           {width:47%;display: flex; flex-direction: column;
      > .title      {border-bottom:solid 1px #CFCFCF; display: flex; justify-content: space-between; margin-bottom:10px; padding-bottom: 7px;
        > .txt      {@include caps(#1D4251, 13px);}
      }
      .name         {font-size:17px; font-style: italic; color:#034C66}
      .app,
      .user         {height:35px; margin:0px 0 15px;}
      .app          {
        .name       {margin-top:10px; }
        .move       {font-size:13px; color:#11A7ED; font-style:italic; cursor: pointer; }
      }
      .user         {display: flex; align-items: center;
        .x          {margin-left:auto; padding:2px; }
      }
      &.apps        {
        .action-btn {margin-top:20px; }
      }
      &.users       {
        .add        {margin:-1px 0 0 0;}
      }
      .checked    {opacity:0.5; pointer-events: none; }
    }
    .action-btn     {display: flex; align-items: center; font-size:13px; font-weight: $semibold; color: #11A7ED; font-style: italic; cursor:pointer;
      .txt          {margin-left:5px; }
      .circle       {border-radius:50%; background: white; padding:3px; display: flex; align-items: center; justify-content: center;}
      &:hover       {color: #006ACC; }
    }
    .delete-section {border-top:solid 1px #CFCFCF; display: flex; justify-content: flex-end; margin-top:20px; padding-top:20px; }
    &.unassigned    {
      input         {background:#D8DEE3; pointer-events: none; }
      .user .x,
      .users .action-btn,
      .delete-section       {display: none;}
    }
  }
</style>
