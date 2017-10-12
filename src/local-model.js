import _          from 'lodash'
import equal      from 'deep-equal'
import {EventBus} from './event-bus'

export default class LocalModel {

  constructor(model) {
    this.isDirty      = false
    this.originalData = model
    this.init()
    this.addListeners()
    window.model = this
  }

  init() {
    this.apps         = this.createApps()
    this.users        = this.createUsers()
    this.groups       = this.createGroups()
  }

  reset() {
    this.init()
    this.checkDataState()
  }


  // ------------------------------------ Events

  addListeners() {
    EventBus.$on('group.create'      , this.createGroup);
    EventBus.$on('group.delete'      , this.deleteGroup);
    EventBus.$on('group.app.move'    , this.moveAppToGroup);
    EventBus.$on('group.user.add'    , this.addUserToGroup);
    EventBus.$on('group.user.remove' , this.removeUserFromGroup);
    EventBus.$on('group.name.change' , this.nameChanged);
  }

  createGroup() {
    groups.push( this.newGroup() )
  }

  deleteGroup = (groupId)=> {
    this.groups.splice( _.findIndex(this.groups, {id:groupId}), 1 )
    this.checkDataState()
  }

  moveAppToGroup = (appId, groupId)=> {
    // Remove app from the group it's currently in
    for ( let group of this.groups ){
      let appIndex = group.apps.indexOf(appId)
      if(appIndex != -1)
        group.apps.splice(appIndex, 1)
    }
    // Add it to the new group
    this.getGroup(groupId).apps.push(appId)
    this.checkDataState()
  }

  addUserToGroup = (group, userId)=> {
    // If it's not the command to add all users..
    if( userId != 'add.all')
      group.users.push(userId)
    // Add all the users
    else{
      let ar = []
      for ( let key in this.users ) {
        ar.push(key)
      }
      group.users = ar
    }
    this.checkDataState()
  }

  removeUserFromGroup = (group, userId)=> {
    let userIndex = group.users.indexOf(userId)
    group.users.splice( userIndex, 1 )
    this.checkDataState()
  }

  nameChanged = (group)=> {
    if(group.name.length > 0)
      group.id = group.name.replace(/\s/g,'-').toLowerCase()
    this.checkDataState()
  }

  // ------------------------------------ Data Initialization / Translation

  // Create a hash of all the apps for easy reference
  createApps() {
    let apps = {}
    for ( let app of this.originalData.apps ){
      apps[app.id] = app
    }
    return apps
  }

  // Create a hash of all the users for easy reference
  createUsers() {
    let users = {}
    for ( let user of this.originalData.users ){
      users[user.user] = {user:user.user, email:user.email}
    }
    return users
  }

  // Create the groups, including the unassigned group
  createGroups() {
    let groups = []
    for ( let group of this.originalData.groups ){
      groups.push( this.newGroup(
        group.name, group.id, group.apps, group.users
      ))
    }
    groups.push( this.createUnassignedGroup() )
    return groups;
  }

  newGroup = (name="New Group (click to edit)", id='tempid', apps=[], users=[])=> {
    let group = {
      name       : name,
      id         : id,
      apps       : _.clone(apps),
      users      : _.clone(users),
    }
    return group;
  }

  createUnassignedGroup = ()=> {
    // get the ids for all the apps
    let allApps  = Object.keys(this.apps).slice(0)
    let allUsers = Object.keys(this.users).slice(0)

    for ( let group of this.originalData.groups ){
      for ( let appId of group.apps ){
        // Remove any app we find from the list
        allApps.splice( allApps.indexOf(appId), 1 )
      }
    }
    let group = this.newGroup('Unassigned', 'un.assigned.apps', allApps, allUsers)
    group.isUnassigned = true
    return group
  }

  // ------------------------------------ Data Transformation & Equality checking

  // Check to see of the current data state matches the original state
  checkDataState = ()=> {
    let flatGroups = this.flattenGroups()
    this.sort(this.originalData.groups)
    this.sort(flatGroups)
    this.isDirty = ! equal(this.originalData.groups, flatGroups)
    // this.isDirty = ! _.isEqual(this.originalData, this.data)
  }

  // Flatten the data into the same structure as the original data for comparison
  // and for saving
  flattenGroups() {
    let flatGroups = []
    for ( let group of this.groups ){
      if( !group.isUnassigned ){
        flatGroups.push(
          {id:group.id, name:group.name, apps:group.apps.slice(0), users:group.users.slice(0)}
        )
      }
    }
    return flatGroups
  }

  // Make sure all the arrays are in sorted order for comparison
  sort(groups) {
    for ( let group of groups ){
      group.apps.sort()
      group.users.sort()
    }
    _.sortBy(groups, ['name'])
  }

  // ------------------------------------ Helpers

  getGroup(id) {return _.find(this.groups, {id:id})}

}
