<template>
  <div class="mytravels">
    <van-nav-bar left-arrow @click-left="$router.go(-1)">
      <!-- <template #right>
                <van-button type="info" plain @click="sub"  size="mini" >发布</van-button>
            </template> -->
    </van-nav-bar>
    <div class="content">
      <div class="onebox" v-for="(item, index) in mytravels" :key="index" @click="routerto(item.id)" >
        <div class="head">
          <img :src="config.HTTP + item.head_img" alt="" />
          <div class="right">
            <div class="name">{{ item.nick_name }}</div>
            <div class="time">{{ item.create_time | timeChange }}</div>
          </div>
          <h3>{{item.title}}</h3>
        </div>
        <!-- <img :src="config.HTTP + item.img" alt=""> -->
      </div>
    </div>
  </div>
</template>
<script>
import { config } from "@/config/api";
import { timeChange } from "@/config/timefilter";
export default {
  name: "mytravels",
  data() {
    return {
      mytravels: [],
      config,
    };
  },
  methods: {
    getData() {
      this.$http.get("/user/travels").then((res) => {
        if (res && res.code == "200") {
          this.mytravels = res.data;
        }
      });
    },
    routerto(value){
      this.$router.push({name:'travels',params: {id:value}})
    }
  },
  created() {
    this.getData();
  },
  filters: {
    timeChange(value) {
      return timeChange(value);
    },
  },
};
</script>
<style lang="less" scoped>
.mytravels {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .content {
    flex: 1;
    overflow-y: scroll;
    .onebox {
      border-bottom: 4px #f5f3f3 solid;
      padding: 10px 0;
      .head {
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .right {
          margin-left: 10px;
          .name {
            font-size: 14px;
            color: rgb(133, 132, 132);
          }
          .time {
            padding-top: 3px;
            font-size: 12px;
            color: #c4c4c4;
          }
        }
        h3{
          flex: 1;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 15px;
          color: rgb(42, 145, 241);
        }
      }
      // img{
      //   // margin: 0 auto;
      //   max-width: 100%;
      //   max-height: 150px;
      //   display: block;
      //   background: #ccc;
      //   object-fit: cover;
      //   background-clip: padding-box;
      //   box-sizing: border-box;
      // }
    }
  }
}
</style>