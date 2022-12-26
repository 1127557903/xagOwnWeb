<template>
  <div class="home">
    <div class="search_bar ai-c">
      <van-image
        fit="cover"
        round
        width="26px"
        height="26px"
        :src="userInfo.head_img?config.HTTP+userInfo.head_img:config.HTTP+'/upload/defaultimg/bea15de326726092cf24fa7e3b95eac9.png'"
        @click="customData.show = true"
      />
      <van-search style="flex: 1" placeholder="请输入搜索关键词" />
      <van-icon @click="router.push('/phone/scan')" size="26" name="scan" />
    </div>
    <div>
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>1</van-swipe-item>
        <van-swipe-item>2</van-swipe-item>
        <van-swipe-item>3</van-swipe-item>
        <van-swipe-item>4</van-swipe-item>
        </van-swipe>
    </div>
    <div class="card_list" >
        <div class="card" @click="router.push('/phone/postings')" >
            
        </div>
    </div>
    <!-- 左侧弹窗 -->
    <van-popup v-model:show="customData.show" position="left" :style="{ width: '150px',height: '100%' }" />
  </div>
</template>
<script setup >
import store from '@/store'
import config from '@/config/config'
import { reactive } from 'vue';
import { computed } from '@vue/reactivity';
import {USER_INFO} from "@/store/constants"
import { useRouter } from 'vue-router';

const router = useRouter()

const customData = reactive({
  show:false
})

const userInfo = computed(() => store.getters[USER_INFO])
</script>
<style lang="scss" scoped>
.home{
    .search_bar {
        display: flex;
        align-items: center;
        padding: 0 10px;
    }
    .card_list{
        .card{
            height: 150px;
            background: red;
        }
    }
}
.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
</style>