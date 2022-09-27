<template>
  <div>
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" style="width: 100%" />
      </van-swipe-item>
    </van-swipe>
    <van-grid :column-num="3">
      <van-grid-item
        v-for="value in 3"
        :key="value"
        icon="photo-o"
        text="景区名称"
      />
    </van-grid>
    <van-grid :column-num="3" :border="false">
      <van-grid-item v-for="value in 3" :key="value" text="3000" />
    </van-grid>
    <p style="text-align: center;position: fixed;bottom: 30px;width: 100%;">查看更多>></p>
  </div>
</template>

<script>
import Vue from "vue";
import { Lazyload } from "vant";

Vue.use(Lazyload);

export default {
  name: "Intoduction",
  components: {},
  data() {
    return {
      images: [
        "https://img01.yzcdn.cn/vant/apple-1.jpg",
        "https://img01.yzcdn.cn/vant/apple-2.jpg",
      ],
    };
  },
};
</script>
