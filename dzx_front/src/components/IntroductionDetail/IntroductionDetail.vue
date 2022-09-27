<template>
  <div>
      <!-- 轮播 -->
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index" style="position: relative;">
        <img v-lazy="image" style="width: 100%" />
        <div style="position: absolute; bottom: 20px;left: 20px;">
            <h2>卢沟湖5日游</h2>
            <span>人均花费：300</span>
        </div>
      </van-swipe-item>
    </van-swipe>
    <!-- 每日行程 -->
     <h3>每日行程</h3>
     <div v-for="item in 4" :key="item" style="display:flex;">
         <div style="width: 60px;text-align: right;margin-right: 10px;">day{{item}}</div>
         <div style="flex: 1;border: 1px solid #000;">
             <p>xx地方：</p>
             <p>景点介绍：达瓦达瓦大啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊达瓦达瓦达瓦</p>
             <p>酒店推荐：</p>
         </div>
     </div>
     <h3 style="text-align: center;" >参考价格</h3>
     <div style="padding: 20px;">
         <p>人均花费</p>
         <ul>
             <li>酒店：行程内酒店及酒店住宿费用</li>
             <li>门票：行程内所列景点</li>
             <li>餐饮：行程内所列食物</li>
         </ul>
     </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Lazyload } from "vant";

Vue.use(Lazyload);

export default {
  name: "IntroductionDetail",
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