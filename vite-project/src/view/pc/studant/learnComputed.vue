<template>
    <div>
        <h1>学习computed</h1>
        <h2>计算属性</h2>
        <div>
            <span>姓名：</span>
            <input type="text" v-model="obj.name" />
        </div>
        <div>
            <span>年龄：</span>
            <input type="text" v-model="obj.age" />
        </div>
        <button @click="setValue" >赋值修改</button>
        <p>{{allInfo}}</p>
        <p>{{allInfo2}}</p>
    </div>
</template>
<script setup lang="ts">
import { reactive, computed } from "vue";

let obj = reactive({
    name: '小红',
    age: 20
})

// computed计算属性，类似于vue2的computed
// 计算属性是基于它们的依赖进行缓存的，只有在相关依赖发生改变时它们才会重新计算
let allInfo = computed(() => {
    return `姓名：${obj.name}，年龄：${obj.age}`
})

let allInfo2 = computed({
    get() {
        return `姓名：${obj.name}，年龄：${obj.age}`
    },
    // 给计算属性赋值时进行处理
    set(value) {
        let arr = value.split('，')
        obj.name = arr[0].split('：')[1]
        obj.age = arr[1].split('：')[1]
    }
})

function setValue() {
    allInfo2.value = '姓名：小红，年龄：22'
}

</script>