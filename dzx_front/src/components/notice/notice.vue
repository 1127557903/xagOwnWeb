<template>
  <div class="hello">
      <iframe id="frame3d" allowfullscreen="allowfullscreen" :src="config.HTTP+text" frameborder="0"></iframe>
  </div>
</template>

<script>
import {config} from '../../config/api'
export default {
  name: 'notice',
  data(){
    return{
      config,
      text:''
    }
  },
  mounted(){
    let {text} = this.$route.query
    this.text = text
    document.getElementById('frame3d').style.height = document.body.clientHeight+"px"
    document.getElementById('frame3d').style.width = document.body.clientWidth+"px"
  }
}
</script>

<style scoped lang="less">
.hello{
  height: 100vh;
}
</style>
