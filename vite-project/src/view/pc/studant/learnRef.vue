<template>
    <div>
        <h1>学习ref</h1>
        <h2>基本类型</h2>
        <p>{{str}}</p>
        <button @click="StrChange">改变str</button>
        <h2>对象类型</h2>
        <p>{{obj}}</p>
        <button @click="obj.name = '小明'">改变obj</button>
        <h2>数组类型</h2>
        <p>{{arr}}</p>
        <button @click="arr.push('小红')">改变arr</button>
        <h2>DOM元素</h2>
        <div ref="dom" style="width: 100px;height: 100px;background-color: red"></div>
        <button @click="domChange">改变dom</button>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
// ref定义基本类型的响应数据
let str = ref("")
// ref定义对象类型的响应数据
let obj = ref({})
// ref定义数组类型的响应数据
let arr = ref([])
// ref定义DOM元素的响应数据
let dom = ref(null)

function StrChange(params) {
  str.value = 'a' + str.value
}

// 改变dom元素的样式
// 1. 通过ref获取DOM元素
function domChange(params) {
  // dom.value.style.backgroundColor = 'blue'
  dom.value.style.width = '200px'
  dom.value.style.height = '200px'
  dom.value.style.backgroundColor = 'blue'
}

</script>