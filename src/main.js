import Vue from 'vue'
import App from './App.vue'
import {Message} from "element-ui";
import ImgUpload from '../packages/upload-images/index'
import axios from 'axios'

const post_img = axios.create({
  headers: { "Content-Type": "multipart/form-ddata" }
})

Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$post_img = post_img
Vue.use(ImgUpload)

new Vue({
  render: h => h(App),
}).$mount('#app')
