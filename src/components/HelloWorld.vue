<template>
  <div class="hello">
    <ImgUpload :ajax_conf="{url: 'http://localhost:3000', method: 'post', headers: {'Content-type': 'application/json'}}" />
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
