import superagent from 'superagent'

import config from '../config'

const VueSuperagent = {}

VueSuperagent.install = function install(Vue) {
  const myVue = Vue
  myVue.prototype.$request = function request(method, url) {
    return superagent[method](config.domain + url)
      .timeout({
        response: 5000,
      })
      .on('error', () => {
        // if (err.timeout) {
        //   store.dispatch('fadeShow', {
        //     status: 'info',
        //     content: '请求超时',
        //   })
        // }
      })
  }
}

export default VueSuperagent
