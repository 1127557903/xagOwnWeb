<template>
  <div class="hotelDetail">
    <van-nav-bar left-arrow @click-left="$router.go(-1)"> </van-nav-bar>
    <div class="img-box">
      <div class="img-box1">
        <img
          class="img1"
          :src="details.innerImgArr ? config.HTTP + details.innerImgArr[0] : ''"
          alt=""
        />
      </div>
      <div class="inner-img-box">
        <img
          class="img2"
          :src="details.innerImgArr ? config.HTTP + details.innerImgArr[0] : ''"
          alt=""
        />
      </div>
      <div class="img-num" @click="$router.push('/showImg?id='+id)" >
        <div class="left">
          <img src="../../assets/imgs.png" alt="" />
        </div>
        <div class="num">
          {{ details.innerImgArr ? details.innerImgArr.length : 0 }}
        </div>
      </div>
    </div>
    <div class="inner-box">
      <div class="name">
        {{ details.name }}
      </div>
      <div class="label-div">
        <div class="type">{{ details.type }}</div>
        <div
          class="label-arr"
          v-for="(item, index) in details.labels"
          :key="index"
        >
          <div class="label">{{ item }}</div>
        </div>
      </div>
      <div class="year">
        <div>{{ details.start }}年营业</div>
        <div
          class="service"
          :class="item == '有收费停车场' ? 'icon-p' : 'icon-lug'"
          v-for="(item, index) in details.serviceArr"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="address">
        {{ details.address }}
      </div>

      <div class="card-box" v-if="rooms.length !== 0">
        <div class="card" v-for="item in rooms" :key="item.id">
          <div class="card-img">
            <img :src="config.HTTP + item.img" alt="" />
          </div>
          <div class="right">
            <div class="room-name">
              {{ item.name }}
            </div>
            <div class="information-box">
              <div class="breakfirst">{{ item.breakfast }}</div>
              <div class="bed">{{ item.bed }}</div>
              <div class="peopel">{{ item.people }}人入住</div>
            </div>
            <div class="cancelRule">{{ item.cancelRule }}</div>
            <div class="smoke-box">
              <div class="now">即时确认</div>
              <div :class="item.smoke == '可吸烟' ? 'smoke' : 'nosmoke'">
                {{ item.smoke }}
              </div>
              <div class="price">
                ¥<span>{{ item.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="width: 100%">
        <img style="width: 100%" src="../../assets/nodata.png" alt="" />
        <p style="text-align: center">暂无房间数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import { config } from "../../config/api";
export default {
  name: "hotelDetail",
  data() {
    return {
      id: "",
      details: {},
      rooms: [],
      config,
    };
  },
  methods: {
    async getData() {
      const params = { id: this.id };
      let res = await this.$http.get("/hotel/selectDetail", params);
      let res1 = await this.$http.get("/hotel/selectRoom", params);
      this.details = res.data;
      this.rooms = res1.data;
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
.hotelDetail {
  height: 100vh;
  overflow: scroll;
  .img-box {
    height: 150px;
    background: #f7f8fd;
    position: relative;
    .img-num {
      position: absolute;
      left: 10px;
      bottom: 10px;
      border-radius: 50px;
      background: #707070;
      display: flex;
      align-items: center;
      padding: 2px;
      .left {
        border-radius: 50%;
        background: #ffffff;
        width: 12px;
        height: 12px;
        display: flex;
        margin-left: 2px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .num {
        padding-left: 3px;
        font-size: 12px;
        color: #fff;
                margin-right: 2px;

      }
    }
    .img-box1 {
      height: 150px;
      overflow: hidden;
      border-bottom-right-radius: 30px;
    }
    .img1 {
      width: 100%;
      height: 200px;
      object-fit: cover;
      z-index: 1;
    }
    .inner-img-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-color: #f7f8fd;
      z-index: -1;
      .img2 {
        width: 100%;
        height: 200px;
        object-fit: cover;
        z-index: 999;
      }
    }
  }
  .inner-box {
    flex: 1;
    background: #f7f8fd;
    border-top-left-radius: 30px;
    padding: 20px;
    overflow-y: scroll;
    .name {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 3px;
    }
    .label-div {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 3px;

      .type {
        padding-right: 20px;
        background: url("../../assets/queen.png") no-repeat 100% 50%;
        background-size: 16px 16px;
      }

      .label-arr {
        display: flex;
        align-items: center;
        margin-left: 5px;
        .label {
          font-size: 12px;
          line-height: 16px;
          height: 14px;
          background: #cbe6f3;
          border-radius: 3px;
          padding: 1px 2px;
          margin-right: 10px;
        }
      }
    }
    .year {
      display: flex;
      font-size: 14px;
      align-items: center;
      margin-bottom: 3px;
      .service {
        display: flex;
        align-items: center;
        margin-left: 5px;
      }
    }
    .address {
      font-size: 14px;
      font-weight: 600;
      padding-left: 15px;
      background: url("../../assets/address2.png") no-repeat 0% 50%;
      background-size: 12px 12px;
    }
  }
  .card-box {
    margin-top: 20px;
    .card {
      padding: 20px;
      background: #fff;
      border-radius: 15px;
      height: 80px;
      overflow: hidden;
      display: flex;
      margin-bottom: 10px;
      .card-img {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
      .right {
        flex: 1;
        padding-left: 20px;
        font-size: 12px;
        color: rgb(71, 71, 71);
        > div {
          margin-bottom: 3px;
        }
        .room-name {
          font-size: 16px;
          font-weight: 600;
        }
        .information-box {
          display: flex;
          > div {
            padding-right: 10px;
          }
        }
        .cancelRule {
          color: #005fab;
          padding-left: 15px;
          background: url("../../assets/sure.png") no-repeat 0% 50%;
          background-size: 12px 12px;
        }
        .smoke-box {
          > div {
            display: inline-block;
            padding-right: 10px;
          }
          .now {
            color: #005fab;
            padding-left: 15px;
            background: url("../../assets/sd.png") no-repeat 0% 50%;
            background-size: 12px 12px;
          }
          .price {
            color: red;
            span {
              font-size: 16px;
              font-weight: 600;
            }
          }
          .smoke {
            padding-left: 15px;
            background: url("../../assets/smoke.png") no-repeat 0% 50%;
            background-size: 12px 12px;
          }
          .nosmoke {
            padding-left: 15px;
            background: url("../../assets/nosomke.png") no-repeat 0% 50%;
            background-size: 12px 12px;
          }
        }
      }
    }
  }
}
.icon-p {
  padding-left: 15px;

  background: url("../../assets/p.png") no-repeat 0% 50%;
  background-size: 12px 12px;
}
.icon-lug {
  padding-left: 15px;

  background: url("../../assets/luggage.png") no-repeat 0% 50%;
  background-size: 12px 12px;
}
</style>