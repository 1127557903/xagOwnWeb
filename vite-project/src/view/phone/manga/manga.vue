<template>
    <div>
        <button @click="getData" >查询</button>
    </div>
</template>
<script setup>
import { post,get } from "@/service";
import { onMounted } from "@vue/runtime-core";
import jsonData from './api.json'
const getData = () => {
    console.log(jsonData,'jsonData')
    // get('/search',{q:'妖神记'}).then(res => {
    //     console.log(res,'res')
    // })
}
</script>