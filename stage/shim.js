export default class Shim {

  constructor() {
    this.data = {
      groups : [
        this.getGroup('Dev Team', ['klondike-brands', 'canvas'], ['jstriker', 'xanthisefort'])
      ],
      apps : [
        this.getApp('klondike-brands'),
        this.getApp('canvas'),
        this.getApp('uncouth-uma'),
      ],
      users : [
        this.getUser('jstriker'),
        this.getUser('xanthisefort'),
      ],
    }
  }

  getGroup(name, id, apps, users) {
    return {
      name, id:name, apps, users
    }
  }

  getApp(appName) {
    return {
      id   : appName,
      name : appName,
    }
  }

  getUser(name) {
    return{
      id    : name,
      name  : name,
      email : 'mark@parslee.com'
    }
  }

}
