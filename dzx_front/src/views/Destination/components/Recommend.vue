<template>
  <div class="recommmend">
    <div class="box">
        <div
          v-for="(item, index) in allTravels" :key="index"
          :class="[index % 2 == 0 ? 'left_box' : 'right_box',index ==1?'two':'']"
          @click="routerto(item.id)"
        >
          <img :src="config.HTTP + item.img" alt="" />
          <p>{{ item.title }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import { config } from "@/config/api";
export default {
  name: "Recommmend",
  props: {
    allTravels: {
      defailt: () => [],
    },
  },
  components: {},
  data() {
    return {
      config,
    };
  },
  methods: {
    routerto(value) {
      this.$emit("routerto", value);
    },
  },
};
</script>
<style lang="less" scoped>
.recommmend {
  padding: 20px;
  .box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .left_box {
      background: #000;
      height: 200px;
      width: 46%;
      border-radius: 8px;
      position: relative;
      box-shadow: 3px 4px 8px;
    }
    .right_box {
      background: red;
      height: 200px;
      width: 46%;
      margin-top: 40px;
      border-radius: 8px;
      position: relative;
      box-shadow: 3px 4px 8px;
    }
    img {
      width: 100%;
      height: 200px;
      display: block;
      background: #ccc;
      object-fit: cover;
      background-clip: padding-box;
      box-sizing: border-box;
    }
    p {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30px;
      background: #ccc;
      opacity: 0.8;
      color: #fff;
      line-height: 30px;
      font-size: 14px;
    }
  }
  .two{
      background: red;
      height: 240px!important;
      width: 46%;
      margin: 0!important;
      border-radius: 8px;
      position: relative;
      box-shadow: 3px 4px 8px;
      img {
        height: 240px!important;
      }
    }
  // .nextbox {
  //   display: flex;
  //   justify-content: space-between;
  //   .left_box {
  //     background: #000;
  //     height: 200px;
  //     width: 46%;
  //     border-radius: 8px;
  //     position: relative;
  //     box-shadow: 3px 4px 8px;
  //   }
  //   .right_box {
  //     background: red;
  //     height: 200px;
  //     width: 46%;
  //     margin-top: 40px;
  //     border-radius: 8px;
  //     position: relative;
  //     box-shadow: 3px 4px 8px;
  //   }
  //   img{
  //     width: 100%;
  //     height: 200px;
  //     display: block;
  //     background: #ccc;
  //     object-fit: cover;
  //     background-clip: padding-box;
  //     box-sizing: border-box;
  //   }
  //   p{
  //     position: absolute;
  //     bottom: 0;
  //     left: 0;
  //     width: 100%;
  //     height: 30px;
  //     background: #ccc;
  //     opacity: .8;
  //     color: #fff;
  //     line-height: 30px;
  //     font-size: 14px;
  //   }
  // }
}
</style>