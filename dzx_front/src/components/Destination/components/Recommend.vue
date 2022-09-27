<template>
  <div class="recommmend">
    <div v-for="(item,index) in 6" :key="item">
      <div class="box" v-if="index === 0">
        <div class="left_box"></div>
        <div class="right_box"></div>
      </div>
      <div class="nextbox" v-else>
        <div class="left_box"></div>
        <div class="right_box"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Recommmend",
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.recommmend {
  padding: 20px;
  .box {
    display: flex;
    justify-content: space-between;
    .left_box {
      background: #000;
      height: 200px;
      width: 46%;
      border-radius: 8px;
    }
    .right_box {
      background: red;
      height: 240px;
      width: 46%;
      border-radius: 8px;
    }
  }
  .nextbox {
    display: flex;
    justify-content: space-between;
    .left_box {
      background: #000;
      height: 200px;
      width: 46%;
      border-radius: 8px;
    }
    .right_box {
      background: red;
      height: 200px;
      width: 46%;
      margin-top: 40px;
      border-radius: 8px;
    }
  }
}
</style>