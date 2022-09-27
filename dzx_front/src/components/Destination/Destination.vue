<template>
  <div class="destination">
    <div class="image">
      <img src="../../assets/aaa.png" alt="" />
    </div>
    <div class="tab">
      <div :class="checked==1 ? 'checked' : ''" @click="tocheck(1)">推荐</div>
      <div :class="checked==2 ? 'checked' : ''" @click="tocheck(2)">我的</div>
    </div>
    <div>
      <Recommmend v-if="checked==1"></Recommmend>
      <Recommmend v-if="checked==2"></Recommmend>
    </div>
  </div>
</template>

<script>
import Recommmend from './components/Recommend.vue'
export default {
  name: "Destination",
  components: {
    Recommmend
  },
  data() {
    return {
      checked:1
    };
  },
  methods:{
    tocheck(value){
      this.checked = value
    }
  }
};
</script>
<style lang="less" scoped>
.destination {
  .image {
    height: 150px;
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .tab {
    padding-left: 20px;
    background: url(../../assets/title.png) no-repeat left center;
    display: flex;
    align-items: flex-end;
    div {
      color: #aaaaaa;
      margin: 0 5px;
    }
    .checked {
      font-size: 18px;
      font-weight: 600;
      color: #2c2a2a;
    }
  }
}
</style>