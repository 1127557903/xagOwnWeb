<template>
  <div class="allnotice">
    <div class="box">
      <div class="titel" @click="$router.push('/notice?text='+item.text)" v-for="item in notices" :key="item.id">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "allnotice",
  data() {
    return {
      notices: [],
    };
  },
  methods: {
    getData() {
      this.$http.get("/notice/select").then((res) => {
        if (res.code == "200") {
          this.notices = res.data;
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style lang="less" scoped>
.allnotice {
  background: #eee;
  height: 100vh;
  .box {
    padding: 10px;

    .titel {
      height: 30px;
      background: #fff;
      line-height: 30px;
      padding: 0 30px 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: url('../../assets/right.png') #fff no-repeat 98% 50%;
      background-size: 20px 20px;
      margin-bottom: 10px;
    }
  }
}
</style>