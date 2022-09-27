<template>
  <div class="tab">
    <router-view />

    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/destination" icon="orders-o">游记</van-tabbar-item>
      <van-tabbar-item replace ></van-tabbar-item>
      <van-tabbar-item replace to="/road" icon="logistics">行程</van-tabbar-item>
      <van-tabbar-item replace to="/my" icon="user-o">我的</van-tabbar-item>
      <div class="add" @click="$router.push('/addtrip')">
        <van-icon name="add" size="38" />
      </div>
    </van-tabbar>
  </div>
</template>
<style lang="less" scoped>
.tab {
  .add {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #ccc;
  }
}
</style>