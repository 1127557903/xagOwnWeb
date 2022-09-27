<template>
  <div class="destination">
    <div class="image">
      <img src="../../assets/aaa.png" alt="" />
    </div>
    <div class="tab">
      <div :class="checked==1 ? 'checked' : ''" @click="tocheck(1)">推荐</div>
      <div :class="checked==2 ? 'checked' : ''" @click="tocheck(2)">添加游记</div>
    </div>
    <div class="content">
      <Recommmend v-if="checked==1" :allTravels="allTravels" @routerto="routerto" ></Recommmend>
      <Recommmend v-if="checked==2"></Recommmend>
    </div>
    <div style="height: 50px;">
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
      checked:1,
      allTravels: []
    };
  },
  methods:{
    tocheck(value){
      if(value == 2) {
        this.$router.push('/addtravels')
        return
      }
      this.checked = value
    },
    getData(){
      this.$http.get('/travels/allTravels').then(res => {
        if(res && res.code == '200') {
          this.allTravels = res.data
          console.log(this.allTravels,'数据')
        }
      })
    },
    routerto(value){
      this.$router.push({name:'travels',params:{id:value}})
    }
  },
  mounted(){
    this.getData()
  }
};
</script>
<style lang="less" scoped>
.destination {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  .content{
    flex: 1;
    overflow: scroll;
  }
}
</style>