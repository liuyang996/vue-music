// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick' 
import VueLazyLoad from 'vue-lazyload'
import 'lib-flexible/flexible.js'
import store from './store'

import 'common/stylus/index.styl'

Vue.config.productionTip = false

Vue.use(VueLazyLoad,{
    loading:require('common/image/default.png')
})

FastClick.attach(document.body); 

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
