export default class Shim {

  constructor() {
    this.data = {
      groups : [
        {id:"dev-team",      name : 'Dev Team',      apps : ['a','b'], users:['johnny-appleseed', 'xanthisefort']},
        {id:"critical-apps", name : 'Critical Apps', apps : ['c','d'], users:['johnny-appleseed', 'xanthisefort', 'keezubun']},
      ],
      apps : [
        { id:"a", name:'lovely-lemming'},
        { id:"b", name:'sneaky-snake'},
        { id:"c", name:'meek-mouse'},
        { id:"d", name:'daring-devonshire'},
        { id:"e", name:'lurking-lemming'},
      ],
      users : [
        {user : "johnny-appleseed", email:"contact@parslee.com"},
        {user : "xanthisefort",     email:"jackson@gmail.com"},
        {user : "keezubun",         email:"michael101@gmail.com"},
        {user : "sanderson",        email:"scott@nanobox.io"},
      ],
    }
  }

}
