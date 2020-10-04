import Vue from 'vue'
import App from './App.vue'
import {Message} from "element-ui";
import ImgUpload from './packages/upload-images/index'

Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.use(ImgUpload)

new Vue({
  render: h => h(App),
}).$mount('#app')
