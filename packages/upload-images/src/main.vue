<template>
  <!--模拟面试，图片上传组件封装-->
  <section class="img-wrap" ref="img_wrap">
    <div
        v-for="(item, index) in images" :key="item.id" class="img-div"
        :style="{ width: `${size}px`, height: `${size}px`, margin: `${gutter}px` }"
    >
            <figure>
              <img :src="item.mUrl" :alt="item.id">
              <div class="mask">
                <span class="el-icon-delete" @click="images.splice(index, 1)"></span>
                <span class="el-icon-view" @click="img_view(index)"></span>
              </div>
            </figure>
    </div>

    <div class="upload-container"
         :style="{ width: `${size}px`, height: `${size}px`, margin: `${gutter}px`, userSelect: 'none' }"
    >
      <label for="multiple-img">+</label>
      <input type="file" multiple="multiple" id="multiple-img" ref="file_input"
             accept="image/png, image/jpeg, image/jpg" @change="select_img"
      >
    </div>

    <div class="global-mask" :class="{flex: glo_mask}" draggable="false">
      <div class="right">
        <figure>
          <img :src="mask_src" :alt="mask_alt">
        </figure>
      </div>
      <div class="left">
        <figure v-for="(item, index) in images" :key="item.id"
                :class="{active: index === active}" @click="toggle_active(index)">
          <img :src="item.mUrl" :alt="item.id">
        </figure>
      </div>
    </div>
  </section>
</template>
<script>
import Sortable from 'sortablejs'
export default {
  name: 'ImgUpload',
  components: {},
  mixin: [],
  props: {
    size: { type: Number, default: 120 },
    gutter: { type: Number, default: 8 },
    bit_limit: { type: Number, default: 30 * 1024 * 1024 },
    beyond_message: { type: String, default: '超过了30M' },
    ajax_conf: { type: Object, required: true }
  },
  data() {
    return {
      images: [],
      sortable: null,
      mask_src: '',
      mask_alt: '',
      glo_mask: false,
      active: 0
    }
  },
  watch: {},
  methods: {
    select_img() {
      const arr = [...this.$refs.file_input.files].map(item => {
        if (item.size <= this.bit_limit){
          return item
        } else {
          this.$message.error(`${item.name}${this.beyond_message}`)
          return false
        }
      })
      // Promise.all(arr.filter(item => item).map(file => this.request(file)))
      //   .then(res => {
      //     const { code, msg, data } = res
      //     if (Number(code) === -1) {
      //       this.$message.error(msg)
      //     } else {
      //       this.images.push(data)
      //       this.$message.success(`上传成功`)
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error(err.message)
      //   })
      arr.filter(item => item).map(each => {
        const reader = new FileReader()
        reader.readAsDataURL(each)
        reader.onload = () => {
          this.images.push({oUrl: reader.result, mUrl: reader.result,name: each.name})
          this.$refs.file_input.value = ''
        }
        reader.onerror = () => {
          this.$message.error(`${each.name}上传失败`)
          this.$refs.file_input.value = ''
        }
      })
    },
    request(file) {
      let { url, headers = {}, data = {} } = this.ajax_conf
      const formData = new FormData()
      formData.append('file', file)
      for(let key in data) {
        formData.append(key, data[key])
      }
      return this.$post_img.post(url, formData, { headers })
    },
    img_view(index) {
      this.glo_mask = true
      this.active = index
      const {oUrl, id} = this.images[index]
      this.mask_src = oUrl
      this.mask_alt = id
    },
    close_glo_mask(e) {
      e.stopPropagation()
      if (e.keyCode === 27) this.glo_mask = false
    },
    toggle_active(index) {
      this.active = index
      const {oUrl, id} = this.images[index]
      this.mask_src = oUrl
      this.mask_alt = id
    }
  },
  created() {},
  mounted() {
    this.sortable = new Sortable(this.$refs.img_wrap, {
      animation: 150,
      filter: '.upload-container'
    })
    window.addEventListener('keyup', this.close_glo_mask)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.close_glo_mask)
  }
}
</script>
<style scoped>
.img-wrap{
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.img-wrap > div {
  flex-grow: 0;
  flex-shrink: 0;
  margin: 12px;
  box-sizing: border-box;
}
.upload-container > label{
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  color: grey;
  font-size: 60px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
}
.upload-container > input{
  display: none;
}
div.img-div > figure{
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
}
div.img-div > figure:hover > .mask{
  display: flex;
}
div.img-div > figure > img{
  display: block;
  width: 100%;
  height: 100%;
}
div.img-div > figure > .mask{
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, .6);
  overflow: hidden;
}
div.img-div > figure > .mask > span{
  font-size: 18px;
  color: #cccccc;
  cursor: pointer;
}
div.img-div > figure > .mask > span + span{
  margin-left: 15px;
}
div.img-div > figure > .mask > span:hover{
  color: orange;
}
.global-mask{
  display: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: space-between;
  margin: 0 !important;
  background-color: rgba(0, 0, 0, .8);
}
.global-mask > .left{
  flex-shrink: 0;
  width: 17vw;
  height: 100%;
  background-color: rgba(0, 0, 0, .9);
  overflow-x: hidden;
  overflow-y: auto;
}
.global-mask > .left > figure {
  margin: 15px;
  box-sizing: border-box;
}
.global-mask > .left > figure > img{
  display: flex;
  width: 100%;
  height: 100%;
}
.global-mask > .left > figure + figure{
  margin-top: 15px;
}
.global-mask > .right{
  width: 70vw;
  height: 98vh;
  margin-left: 6.5vw;
}
.global-mask > .right > figure {
  width: 100%;
  height: 100%;
}
.global-mask > .right > figure > img {
  display: block;
  width: 100%;
  height: 100%;
}
.flex{
  display: flex !important;
}
.active{
  border: 2px solid orange;
}
</style>
