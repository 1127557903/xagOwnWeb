<template>
  <div class="delicous-detail">
    <van-nav-bar left-arrow @click-left="$router.go(-1)"> </van-nav-bar>
    <div class="inner">
      <div class="card">
        <div class="name">{{ randerData.name }}</div>
        <span class="label">{{ randerData.label }}</span>
        <div class="img-box">
          <div class="df">
            <div v-for="(item, index) in imgArr" :key="index">
              <img :src="config.HTTP + item" alt="" />
            </div>
          </div>
        </div>
        <div class="mid-box">
          <div class="time">
            {{
              randerData.isAllDay
                | timers(randerData.beginTime, randerData.endTime)
            }}
          </div>
          <div class="price">¥{{ randerData.price }}/人</div>
        </div>
        <div class="bottom-box">
          <div class="address">{{ randerData.address }}</div>
        </div>
      </div>

      <div  class="card" v-if="foods.length !== 0" style="margin-top: 20px;">
        <p class="title">推荐菜品</p>
        <div class="food-box">
          <div class="item" v-for="item in foods" :key="item.id">
            <img :src="config.HTTP + item.img" alt="">
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { config } from "../../config/api";
import moment from "moment";
export default {
  name: "delicous",
  data() {
    return {
      randerData: {},
      config,
      nowTime: "",
      foods:[]
    };
  },
  methods: {
    getData() {
      this.$http.get("/delicous/selectDetail", { id: this.id }).then((res) => {
        this.randerData = res.data;
      });
      this.$http.get("/delicous/selectFood", { id: this.id }).then((res) => {
        this.foods = res.data;
      });
    },
  },
  computed: {
    imgArr() {
      let { innerImg } = this.randerData;
      if (!innerImg) {
        return [];
      }
      return innerImg.split(",");
    },
  },
  filters: {
    timers(val, beginTime, endTime) {
      // let { beginTime,endTime } = this.randerData;
      if (!val && val !== 0) {
        return "";
      }
      if (val) {
        return "全天营业";
      } else {
        let nowTime = moment().format("HH:mm");
        console.log(nowTime, "111");
        let begin = beginTime.substring(0, 5);
        console.log(begin, "111");
        let end = endTime.substring(0, 5);
        if (
          parseInt(nowTime.replace(",")) > parseInt(begin.replace(",")) &&
          parseInt(end.replace(",")) > parseInt(nowTime.replace(","))
        ) {
          return `营业中 ${begin}-${end}`;
        } else {
          return `休息中 ${begin}营业`;
        }
      }
    },
  },
  mounted() {
    let { id } = this.$route.query;
    this.id = id;
    this.getData();
  },
};
</script>
<style lang="less" scoped>
.delicous-detail {
  height: 100vh;
  background: #eee;
  .inner {
    padding: 10px;
  }
  .card {
    border-radius: 5px;
    background: #fff;
    padding: 10px;
    > div {
      padding: 5px 0;
    }
    .name {
      font-size: 20px;
      font-weight: 600;
    }
    .label {
      background: #ffe4b0;
      color: #dfa907;
      padding: 2px;
      font-size: 12px;
      border-radius: 50px;
      border-bottom-left-radius: 0px;
      border-top-left-radius: 40px;
    }
    .img-box {
      width: 100%;
      border-radius: 5px;
      overflow-x: scroll;
      .df {
        width: max-content;
        display: flex;
        > div {
          height: 100px;
          width: 150px;
          margin-right: 10px;
          img {
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
          &:nth-last-of-type(1) {
            margin-right: 0;
          }
        }
      }
    }
    .mid-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      .time {
        font-weight: 600;
      }
    }
    .bottom-box {
      border-top: 1px solid #eee;
      font-size: 14px;
      font-weight: 600;
    }
    .title{
      font-weight: 600;
      border-left: 2px solid #000;
      font-size: 16px;
      padding-left: 10px;
    }
    .food-box{
      display: flex;
      flex-wrap: wrap;
      .item{
        width: 30%;
        margin-right: 5%;
        margin-bottom: 10px;
        &:nth-of-type(3n){
           margin-right: 0;
        }
        img{
          width: 100%;
          height: 100px;
          object-fit: cover;
        }
      }
    }
  }
}
</style>