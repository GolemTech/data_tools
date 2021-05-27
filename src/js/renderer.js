var osenv = require('osenv')
Vue = require('./src/js/vue.js')
var path = osenv.path()
var user = osenv.user()

console.log({path, user});
var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
  })

