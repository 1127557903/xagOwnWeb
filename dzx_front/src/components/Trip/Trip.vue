<template>
  <div class="trip">
    <div class="body">
      <baidu-map
        id="allmap"
        @ready="mapReady"
        @click="checkPoint"
        :scroll-wheel-zoom="true"
      > 
        <template v-if="!roudType || btnType">
          <bm-marker v-for="(item,index) in pointArr" @dblclick="closePoint(item)" :position="item" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :key="index">
            <bm-label :content="item.address" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: -35, height: 30}"/>
          </bm-marker>
        </template>
        <!-- <bm-driving
              v-for="(one,i) in routeLength"
              :key="i"
              :start="roureArr[i]"
              :end="roureArr[i+1]"
              :panel="false"
              ></bm-driving> -->
        <div class="pointSelection" @click="btnType=!btnType" :class="{pointSelectionChecked:btnType}">
         <van-icon name="location" size="24" :color="btnType?'#fff':'red'" />
         <p>选点</p>
        </div>
        <bm-driving
          v-if="!btnType && roudType"
          :start="start"
          :end="end"
          :waypoints="roureArr"
          :panel="false"
        ></bm-driving>
      </baidu-map>
      <!-- 底部搜索 -->
      <div class="bottom" :class="{ focus: fullSearch }">
        <div>
          <van-search
            v-model="searchAddress"
            show-action
            label="地址"
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @focus="focusSearch"
          >
            <template #action>
              <div @click="onSearch">搜索</div>
            </template>
            <template #left v-if="fullSearch">
              <van-icon @click="handleGoBack" name="arrow-left" size="24" />
            </template>
          </van-search>
        </div>
        <div class="drive" v-if="!fullSearch">
          <van-button type="info" size="large" @click="driveRoud()">路线规划</van-button>
          <div class="btn">
            <div class="reset">重置</div>
            <div class="save"  @click="save()" >保存</div>
          </div>
        </div>
        <div class="searchResult" v-else>
          <div
            class="cell"
            v-for="(item, index) in searchList"
            :key="index"
            @click="chosseAddress(item)"
          >
            <div class="position">
              <van-icon name="location-o" size="20" />
            </div>
            <div class="title">
              {{ item.title}}
              <van-tag
                plain
                type="primary"
                v-for="(one, i) in item.tags"
                :key="i"
                >
                  <span v-html="one"></span>
                </van-tag
              >
            </div>
            <div class="address">{{ item.address }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  name: "trip",
  data() {
    return {
      point: "",
      start: "",
      end: "",
      minRoute:[], //未处理最短路径
      distanceArr: [], // 距离数组
      pointArr: [], //路径点
      roureArr: [], //规划路径数组
      routeLength: [],
      map: {}, // 地图实例
      myGeo: {}, // 坐标转换实例
      searchAddress: "", //查询地址
      fullSearch: false, //查询占满
      searchList: [], //查询结果列表
      transit: {}, // 路径规划调用
      BMap: {},
      btnType: false, //选点按钮状态
      roudType: false, // 路线规划展示状态
// 最终最短路径
      distance: 0,
      id: '',
      c_id: this.c_id
    };
  },
  methods: {
    mapReady({ BMap, map }) {
      this.map = map;
      this.myGeo = new BMap.Geocoder();
      this.BMap = BMap;

      // 选择一个经纬度作为中心点
      const city = "达州";
      // const color = "#f00";
      map.centerAndZoom(city, 10);
      this.localSearch = new BMap.LocalSearch(map);
      this.localSearch.enableAutoViewport(); //允许自动调节窗体大小

      let that = this;
      // 计算路线
      var searchComplete = function (results) {
        if (that.transit.getStatus() != BMAP_STATUS_SUCCESS) {
          return;
        }
        console.log(results)
        var plan = results.getPlan(0);
        let { lat: slat, lng: slng } = results.ew.point;
        let { lat: elat, lng: elng } = results.pv.point;
        let time = plan.getDuration(true); //获取时间
        let roud = plan.getDistance(true); //获取距离
        let res = that.distanceArr.find(
          (item) =>
            item.elng == elng &&
            item.slng == slng &&
            item.elat == elat &&
            item.slat == slat
        );
        if (res) {
          return;
        }
        that.distanceArr.push({ time, roud, slat, slng, elat, elng });
      };
      this.transit = new BMap.DrivingRoute(map, {
        Render: { map: map },
        onSearchComplete: searchComplete,
      });
      this.getBoundary();
    },
    // 设置轮廓
    getBoundary() {
      const BMap = this.BMap;
      const city = "达州";
      const color = "#f00";
      let that = this;
      var bdary = new BMap.Boundary();
      bdary.get(city, function (rs) {
        //获取行政区域
        if (rs) {
          var count = rs.boundaries.length; //行政区域的点有多少个
          var plymax = -1,
            plym;
          for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
              strokeWeight: 1,
              strokeColor: color,
              fillColor: "",
              fillOpacity: 0,
            }); //建立多边形覆盖物
            that.map.addOverlay(ply); //添加覆盖物
            if (ply.getPath().length > plymax) {
              plymax = ply.getPath();
              plym = ply.getPath();
            }
          }
          // map.setViewport(12); //调整视野
        }
      });
    },

    // 路径规划
    roudPlan() {
      let that = this;
      let arr = [...this.pointArr];
      let all = [];
      const BMap = this.BMap;
      arr.forEach((item, index) => {
        arr.forEach((one, i) => {
          if (i !== index) {
            all.push([item.id, one.id]);
            let start = new BMap.Point(item.lng, item.lat);
            let end = new BMap.Point(one.lng, one.lat);
            this.transit.search(start, end);
          }
        });
      });
      let route =[]
      // Dijkstra算法
      function getMin(arr,L,distanceArr,b=[],m=0){
        if (arr.length == L){
          arr.forEach((item,index) => {
             console.log(111)
            getMindis(index)
          })
        } else {
          getMindis(0)
        }
        function getMindis(i){
          let minDistance = 0
          let Address = {}
          console.log(b,'121')
          let fliterArr = []
          let resArr = []
          if (arr.length == L){
            fliterArr = distanceArr.filter(item => item.slat == arr[i].lat && item.slng == arr[i].lng)
            resArr = distanceArr.filter(item => (item.slat != arr[i].lat || item.slng != arr[i].lng) && (item.elat != arr[i].lat || item.elng != arr[i].lng))
            console.log(fliterArr,'fliterArr')
          } else {
            fliterArr = distanceArr.filter(item => item.slat == b[b.length-1].lat && item.slng == b[b.length-1].lng)
            resArr = distanceArr.filter(item => (item.slat != b[b.length-1].lat || item.slng != b[b.length-1].lng) && (item.elat != b[b.length-1].lat || item.elng != b[b.length-1].lng))
          }
          if(fliterArr.length == 0){
            route.push([m,...b]);
            return
          }
          fliterArr.forEach(item => {
            let roud = parseFloat(item.roud.replace("公里"));
            if(roud < minDistance || minDistance==0){
              minDistance= roud
              Address = {lng:item.elng,lat:item.elat}
            }
          })
          let ar = arr.filter((one) => one.lat != Address.lat && one.lng != Address.lng);
          let minPoint = arr.find((one) => one.lat == Address.lat || one.lng == Address.lng);
          let minPoints = [...b,{...minPoint}]
          if (arr.length == L){
            minPoints.unshift({...arr[i]})
          }
          let M = m + minDistance
          getMin(ar,L,resArr,minPoints,M)
        }
      }
      let timer = setInterval(() => {
        let L = that.distanceArr.length;
        let l = that.pointArr.length;
        if (L !== l * (l - 1)) {
          return;
        }
        getMin(arr,arr.length,that.distanceArr);
        let numArr = route.map(item => {
          return item[0]
        })
        let mindis = Math.min(...numArr);
        this.distance = mindis
        let minRoute = route.find((item) => item[0] == mindis);
        this.minRoute = minRoute.filter((item,index) => index !== 0)
        clearInterval(timer);
      },1000)

      // 遍历算法（舍弃）

      // let route = [];
      // function a(arr, b = []) {
      //   if (arr.length == 0) {
      //     route.push(b);
      //   }
      //   arr.forEach((item) => {
      //     let c = [...b, item.id];
      //     let ar = arr.filter((one) => one != item);
      //     a(ar, c);
      //   });
      // }
      // a(arr);
      // let timer = setInterval(() => {
      //   let L = that.distanceArr.length;
      //   let l = that.pointArr.length;
      //   if (L !== l * (l - 1)) {
      //     return;
      //   }
      //   let oneDisArr = route.map((item) => {
      //     let disArr = [];
      //     item.forEach((one, index) => {
      //       if (index < item.length) {
      //         // console.log(one,item[index+1],all,'index')
      //         let iArr = all.find(
      //           (it) => it[0] == one && it[1] == item[index + 1]
      //         );
      //         if (iArr) {
      //           let s = that.pointArr.find((item) => item.id == iArr[0]);
      //           let e = that.pointArr.find((item) => item.id == iArr[1]);
      //           let { roud } = that.distanceArr.find(
      //             (item) =>
      //               item.slat == s.lat &&
      //               item.slng == s.lng &&
      //               item.elat == e.lat &&
      //               item.elng == e.lng
      //           );
      //           let res = parseFloat(roud.replace("公里"));
      //           disArr.push(res);
      //         }
      //       }
      //     });
      //     return disArr;
      //   });
      //   let newOneDisArr = oneDisArr.map((item) => {
      //     return item.reduce((first, one) => first + one);
      //   });
      //   this.routeLength = newOneDisArr;
      //   let mindis = Math.min(...newOneDisArr);
      //   console.log(mindis, newOneDisArr, "aaa");
      //   let minIndex = newOneDisArr.findIndex((item) => item == mindis);
      //   let minArr = route[minIndex];
      //   let roureArr = minArr.map((item) => {
      //     return arr.find((one) => item == one.id);
      //   });
      //   this.start = roureArr[0];
      //   this.end = roureArr[roureArr.length - 1];
      //   this.roureArr = roureArr.filter(
      //     (item, index) => index !== 0 && index !== roureArr.length - 1
      //   );
      //   console.log(this.roureArr);
      //   this.getBoundary();
      //   clearInterval(timer);
      // }, 1000);
    },
    // 删除选点
    closePoint(value){
      if (this.btnType) {
        return
      }
      console.log(value,'数据')
      Toast.success('删除成功')
      this.pointArr = this.pointArr.filter(item => {item.id !== value.id})
    },
    // 选择地图点
    checkPoint(e) {
      console.log(111)
      if (!this.btnType) {
        return
      }
      let {lat,lng} = e.point
      this.getPointName(lat,lng).then(res =>{
        console.log(res,'res')
        let {address} = res
        let str = new Date().getTime() + Math.round(Math.random() * (99999 + 1 - 10000));
        this.pointArr.push({
          id:str,
          lat,
          lng,
          address
        })
      })
    },
    // 获取坐标地址信息
    getPointName(lat,lng){
      return new Promise((resolve,reject)=>{
        let myGeo = this.myGeo
        const BMap = this.BMap
        myGeo.getLocation(new BMap.Point(lng,lat), function(result){     
          console.log(result,'result') 
          if (result){
            resolve(result) 
          } else {
            reject('err')
          }
        });
      })
    },
    onSearch() {
      if(!this.searchAddress){
        Toast('没有搜索内容');
        return
      }
      let that = this
      this.localSearch.setSearchCompleteCallback(function (searchResult) {
        console.log(searchResult,'结果')
        if(!searchResult.Kr) {
          return
        }
        that.searchList = [...searchResult.Kr]
      });
      this.localSearch.search(this.searchAddress);
    },
    // 聚焦事件
    focusSearch() {
      this.fullSearch = true;
    },
    // 取消搜索
    handleGoBack() {
      this.fullSearch = false;
    },
    // 选择地址
    chosseAddress(value) {
      let str = new Date().getTime() + Math.round(Math.random() * (99999 + 1 - 10000));
      let {address} = value
      this.pointArr.push({ ...value.point, id: str,address });
      this.fullSearch = false;
    },
    // 点击路径规划
    driveRoud(){
      this.btnType = false
      this.roudType = true
      this.roudPlan()
    },
    // 保存当前路径规划
    save(){
      let minRoute = [...this.minRoute]
      if(!minRoute || minRoute.length == 0){
        Dialog.alert({
          title: '提示',
          message: '没有规划后的路径需要保存！',
        }).then(() => {
        });
        return
      }
      let distance = this.distance
      let trip = minRoute
      let num = trip.length

      const data={
        distance,
        trip,
        num,
        id:this.id
      }
      let url = '/trip/saveTrip'
      let userId =  sessionStorage.getItem('dzx_user')
      if (this.id && userId == this.c_id) {
        url = '/trip/changeTrip'
      }
      this.$http.post(url,data).then(res =>{
          Dialog.alert({
              title: '提示',
              message: res.msg,
            }).then(() => {
              this.$router.go(-1)
          });
      })
    }
  },
  watch:{
    minRoute:{
      handler(newVal,oldVal){
        console.log(newVal,'数据')
        this.start = newVal[0];
        this.end = newVal[newVal.length - 1];
        this.roureArr = newVal.filter(
          (item, index) => index !== 0 && index !== newVal.length - 1
        );
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    let data = this.$route.params
    let {trip,id,arr,distance,c_id} = data
    this.id = id
    this.c_id = c_id
    if (trip && trip.length !== 0 && distance) {
      let that = this
      this.roudType = true
      this.$nextTick(() =>{
        that.minRoute = trip
        that.pointArr = trip
        this.distance = distance
      })
    }
    if(arr && arr.length !== 0) {
      this.pointArr = arr
      this.$nextTick(() => {
        this.roudType = true
        this.roudPlan()
      })
    }
  },
};
</script>
<style lang="less" scoped>
#allmap {
  height: 100vh;
  width: 100%;
  margin: 0 auto;
  position: relative;
  .pointSelection{
    position: absolute;
    top: 50%;
    left: 0;
    background: #fff;
    height: 50px;
    width: 50px;
    border-radius: 10px;
    text-align: center;
    p{
      font-size: 12px;
    }
  }
  .pointSelectionChecked{
    background: rgb(107, 185, 248);
    color: #fff;
  }
}
.trip {
  .body {
    // padding: 0 20px;
    position: relative;
    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 96%;
      margin: 0 auto;
      // height: 100px;
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.5s;
      .searchResult {
        flex: 1;
        overflow: scroll;
        .cell {
          border-bottom: 1px solid #eeeeee6e;
          position: relative;
          padding: 10px 0 10px 30px;
          .position {
            position: absolute;
            top: 50%;
            left: 10px;
            transform: translate(0, -50%);
          }
          .title {
            font-weight: 600;
            font-size: 16px;
          }
          .address {
            font-size: 12px;
            color: #ccc;
          }
          &:hover {
            background-color: rgb(245, 244, 244);
          }
        }
      }
    }
    .drive{
      .btn{
        display: flex;
        .reset{
          width: 50%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: #fff;
          color: #000;
        }
        .save{
          width: 50%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: rgb(99, 231, 94);
          color: #fff;
        }
      }
    }
  }
}
.focus {
  width: 100% !important;
  height: 100vh !important;
  border-radius: 0 !important;
  display: flex;
  flex-direction: column;
}
</style>