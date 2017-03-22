// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import 'flatpickr/dist/flatpickr.min.css'
import './styles/css.css'
import VueSuperagent from './plugins/vue-superagent'

Vue.use(VueSuperagent)

Vue.config.productionTip = false


export default function (page) {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    render: c => c(page),
  })
}

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App },
// })
