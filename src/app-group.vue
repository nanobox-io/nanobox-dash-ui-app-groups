<script>
import {gravatar, dropdown, x, add} from 'lexi'
import {EventBus} from './event-bus'
import ghost from './ghost'

export default {
  name       : 'app-group',
  props      : ['group', 'model'],
  components : {gravatar, dropdown, x, add, ghost},
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
            //- Add an app
            dropdown(:hide-trigger="true" ref="apps-dd" :yMod="20" @change="moveApp($event, group.id)")
              .option(v-for="app in model.apps" :value="app.id" v-if="!group.apps.includes(app.id)") {{app.name}}
            add.add.action-btn.small.white.circle.blue(@click="$refs['apps-dd'].open()" v-show="Object.keys(model.apps).length > group.apps.length")

          ghost
            .app(v-for="(app,i) in group.apps" :key="model.apps[app].id")
              .name {{ model.apps[app].name }}

              //- Move app to new group
              dropdown(:hide-trigger="true" :ref="`dd${model.apps[app].id}`" @change="moveApp(model.apps[app].id, $event)")
                .option(v-for="grp in model.groups" :value="grp.id" v-bind:class="{checked:grp.id == group.id}") {{grp.name}}
              .move(@click="$refs[$event.target.dataset.dropdownId][0].open() " :data-dropdown-id="`dd${model.apps[app].id}`") move

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

          ghost
            .user(v-for="user in group.users" :key="user")
              gravatar(:email="model.users[user].email" :round="true" :size="24")
              .name {{ model.users[user].user }}
              x.x(@click="removeUser(user)" size="15" color="#4C80B0")

      .delete-section
        x(@click="deleteGroup" size="15" ) Delete Group
</template>

<!--
  ***** C S S *****
-->

<style lang="scss" scoped>
  .app-group        {background: #E0E6EA; margin-bottom:30px;
    input           {width: 100%; height:36px; font-weight: $semibold; color:#034C66; font-size:16px; padding-left:25px; margin-bottom: 10px; }
    .main           {padding:10px 25px 15px; }
    .lists          {display: flex; justify-content: space-between;}

    .list           {width:47%;display: flex; flex-direction: column;
      > .title      {border-bottom:solid 1px #CFCFCF; display: flex; justify-content: space-between; margin-bottom:10px; padding-bottom: 7px;
        > .txt      {@include caps(#1D4251, 13px);}
      }
      .name         {font-size:15px; font-style: italic; color:#034C66; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
      .app,
      .user         {height:18px; margin:0px 0 15px;}
      .app          {display: flex; align-items: baseline;
        .name       { }
        .move       {margin-left: 10px; font-size:13px; color:#11A7ED; font-style:italic; cursor: pointer; }
      }
      .user         {display: flex; align-items: center;
        .x          {margin-left:auto; padding:2px; }
      }
      .add        {margin:-1px 0 0 0; height:16px; }
      .checked    {opacity:0.5; pointer-events: none; }
    }
    .action-btn     {display: flex; align-items: center; font-size:13px; font-weight: $semibold; color: #11A7ED; font-style: italic; cursor:pointer;
      .txt          {margin-left:5px; }
      .circle       {border-radius:50%; background: white; padding:3px; display: flex; align-items: center; justify-content: center;}
      &:hover       {color: #006ACC; }
    }
    .delete-section {border-top:solid 1px #CFCFCF; display: flex; justify-content: flex-end; margin-top:20px; padding-top:15px; }
    &.unassigned    {
      input         {background:#D8DEE3; pointer-events: none; }
      .user .x,
      .users .action-btn,
      .users .user,
      .delete-section {display: none;}
      .users:after  {font-size:14px; font-style: italic; color:#658995; content:"Your whole team can access these apps"; line-height: 1.5; }
    }
  }
</style>
