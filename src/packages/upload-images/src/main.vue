<template>
  <section class="img-wrap" ref="img_wrap">
    <div
        v-for="(item, index) in images" :key="index" class="img-div"
        :style="{
        width: `${size}px`, height: `${size}px`, margin: `${gutter}px`
      }"
    >
            <figure>
              <img :src="item.url" :alt="item.name">
              <div class="mask">
                <span class="el-icon-delete" @click="remove_img(index)"></span>
              </div>
            </figure>
    </div>
    <div class="upload-container"
         :style="{
              width: `${size}px`, height: `${size}px`, margin: `${gutter}px`,
              userSelect: 'none'
          }"
    >
      <label for="multiple-img">+</label>
      <input type="file" multiple="multiple" id="multiple-img" ref="file_input"
             accept="image/png, image/jpeg, image/jpg" @change="select_img"
      >
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
    gutter: { type: Number, default: 12 },
    bit_limit: { type: Number, default: 30 * 1024 * 1024 },
    beyond_message: { type: String, default: '超过了30M' }
  },
  data() {
    return {
      images: [],
      sortable: null
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
      arr.filter(item => item).map(each => {
        const reader = new FileReader()
        reader.readAsDataURL(each)
        reader.onload = () => {
          this.images.push({url: reader.result, name: each.name})
        }
      })
    },
    remove_img(index) {
      this.images.splice(index, 1)
    }
  },
  created() {},
  mounted() {
    this.sortable = new Sortable(this.$refs.img_wrap, {
      animation: 150,
      filter: '.upload-container'
    })
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
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .6);
  overflow: hidden;
}
div.img-div > figure > .mask > span{
  font-size: 18px;
  color: #cccccc;
  cursor: pointer;
}
div.img-div > figure > .mask > span:hover{
  color: orange;
}
</style>
