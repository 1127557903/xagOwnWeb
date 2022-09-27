<template>
  <div class="showImg">
    <van-nav-bar left-arrow @click-left="$router.go(-1)"> </van-nav-bar>
    <div class="imgBox" v-for="(item, index) in imgArr" :key="index">
      <img :src="config.HTTP + item" alt="" />
    </div>
  </div>
</template>
<script>
import { config } from "../../config/api";

export default {
  name: "showImg",
  data() {
    return {
      imgArr: [],
      config,
    };
  },
  async mounted() {
    let { id } = this.$route.query;
    let res = await this.$http.get("/hotel/selectDetail", { id });
    this.imgArr = res.data.innerImgArr;
  },
};
</script>
<style lang="less" scoped>
.showImg {
  padding: 0 10px;

  .imgBox {
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>