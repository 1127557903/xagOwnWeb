<template>
  <div class="addtrip">
    <van-nav-bar
      title="创建行程"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #right>
        <van-icon name="location" @click="$router.push('/trip')" size="18" />
      </template>
    </van-nav-bar>
    <h2>按路线</h2>
    <van-divider />
    <div class="inner">
      <h4>推荐景点</h4>
      <div>
        <van-row gutter="20">
          <van-col span="12" v-for="(item,i) in place" :key="item.id" @click="checkplace(i)">
            <div class="onespot">
              <div class="check"><van-icon v-if="item.checked" color="#1183fb" name="checked" size="24" /><van-icon name="circle" v-else color="#1183fb" size="24" /></div>
              <div class="image">
                <img :src="config.HTTP + item.img" alt="">
              </div>
              <div class="title">{{item.name}}</div>
              <div class="innertext">景点排名第 1 丨 {{item.days}}天</div>
              <div class="alltip">
                <span class="tip" v-for="(one,index) in item.label" :key="index">{{one}}</span>
              </div>
            </div></van-col
          >
        </van-row>
      </div>
    </div>
    <div class="bottom">
      <div class="right" @click="road" >让AI为我规划路线</div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { config } from '../../config/api'

export default {
  name: "addTrip",
  data(){
    return {
      place:[],
      config,
    }
  },
  methods: {
    onClickLeft() {
      Toast("返回");
      this.$router.go(-1)
    },
    onClickRight() {
      Toast("按钮");
    },
    // 跳转路径规划
    road(){
      let arr = this.place.filter(item => item.checked)
      console.log(arr,'arr')
      let arrs = arr.map(item => {
        let laArr = item.lng_lat.split(',')
        return {...item,lng:laArr[0],lat:laArr[1]}
      })
      console.log(arrs,'arrs')
      this.$router.push({name:'trip',params:{
        arr:arrs
      }})
    },
    // 选择地点
    checkplace(index){
      this.place[index].checked = !this.place[index].checked
    },
    getPlace(){
      this.$http.get('/trip').then(res => {
        if(res && res.code == '200') {
          this.place = res.data.map(item => {
            return {...item,checked:false}
          })
        }
      })
    }
  },
  mounted(){
    this.getPlace()
  }
};
</script>
<style lang="less" scoped>
.addtrip {
  h2 {
    padding: 10px 20px 0 20px;
  }
  .inner {
    padding: 0 20px;
    h4 {
      padding-left: 10px;
      position: relative;
    }
    h4::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      width: 5px;
      height: 12px;
      border-radius: 5px;
      background: #1989fa;
    }
    .onespot{
      position: relative;
      .check{
        position: absolute;
        top: 0;
        right: 0;
      }
      .image{
        overflow: hidden;
        border-radius: 5px;
        img{
          width: 100%;
          height: 167px;
        }
      }
      .title{
        font-size: 18px;
      }
      .innertext{
        font-size: 14px;
      }
      .alltip{
        font-size: 12px;
        color: #fff;
        .tip{
          background: #ccc;
          padding: 3px;
          border-radius: 3px;
          margin-right: 3px;
        }
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    background: #fff;
    .left {
      width: 40px;
      height: 40px;
      margin: 10px;
      border-radius: 5px;
      background: #1989fa;
    }
    .right {
      flex: 1;
      height: 40px;
      margin: 10px;
      line-height: 40px;
      border-radius: 5px;
      color: #fff;
      background: #1989fa;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>