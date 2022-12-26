<template>
    <div class="tabs">
        <router-view class="view" />
        <van-tabbar class="tabbar" v-model="active" @change="onChange" >
            <van-tabbar-item icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item icon="user-o" dot>我的</van-tabbar-item>
            <van-tabbar-item icon="friends-o" badge="5">标签</van-tabbar-item>
            <van-tabbar-item icon="setting-o" badge="20">标签</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter()
const active = ref(0);
const onChange = (index) => {
    if(index == 0){
        router.push('/phone/tabs/home')
    } else if(index == 1){
        router.push('/phone/tabs/my')
    }
};
</script>
<style lang="scss" scoped>
.tabs{
    height: 100%;
    .view{
        height: calc(100% - 50px);
    }
}
</style>