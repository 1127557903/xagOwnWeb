<template>
  <div>
    <h4>发现好玩</h4>
    <h5>经典路线</h5>
    <van-card
      num="2"
      price="人均花费：2.00¥"
      desc="景色特点"
      title="路线详细"
      thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
      v-for="item in 5"
      :key="item"
      @click="routeto"
    >
      <!-- <template #tags>
        <van-tag plain type="danger">标签</van-tag>
        <van-tag plain type="danger">标签</van-tag>
      </template>
      <template #footer>
        <van-button size="mini">按钮</van-button>
        <van-button size="mini">按钮</van-button>
      </template> -->
    </van-card>
  </div>
</template>

<script>
import Vue from "vue";
import { Card } from "vant";

Vue.use(Card);
export default {
  name: "Introduction",
  components: {},
  data() {
    return {};
  },
  methods:{
    routeto(){
      this.$router.push('/introductionDetail')
    }
  }
};
</script>
<style lang="less" scoped>
div {
    /deep/ .van-card__price-currency{
    display: none;
}
}
h4,
h5 {
  text-align: left;
}
</style>