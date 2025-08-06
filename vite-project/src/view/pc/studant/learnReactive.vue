<template>
    <!-- 学习reactive -->
    <div>
        <h1>学习reactive</h1>
        <h2>对象类型</h2>
        <p>{{obj}}</p>
        <button @click="objChange">改变obj</button>
        <h2>数组类型</h2>
        <p>{{arr}}</p>
        <button @click="arr.push('小红')">改变arr</button>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, toRef } from "vue";
// reactive只能定义对象类型的响应数据
// reactive定义对象类型的响应数据
let obj = reactive({
  name: '小红',
  age: 20
})

// reactive定义数组类型的响应数据
let arr = reactive([])

// proxy 代理响应式对象

// 响应式数据需要使用 toRefs 转换成ref类型才能使用
// 这里只是用toRefs进行数据指向，不加则是重新定义普通变量，内存不一样
let { name, age } = toRefs(obj)

// 单个的响应式数据指向
let ln = toRef(obj, 'name')

function StrChange(params) {
  str.value = 'a' + str.value
}

function objChange(params) {
    Object.assign(obj, {name: '小明',age: 18})
}
</script>