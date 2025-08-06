<!-- 学习watch -->
 <template>
    <div>
        <h1>学习watch</h1>
        <!-- 监听ref基本类型 -->
        <h2>监听ref基本类型</h2>
        <input type="text" v-model="name" />
        <!-- 监听ref对象类型 -->  
        <h2>监听ref对象类型</h2>
        <div>
            <span>姓名：</span>
            <input type="text" v-model="obj.name" />
        </div>
        <div>
            <span>年龄：</span>
            <input type="number" v-model="obj.age" />
        </div>
        <button @click="fnChange" >替换</button>
        <!-- 监听reactive -->
        <h2>监听监听reactive对象类型</h2>
        <div>
            <span>姓名：</span>
            <input type="text" v-model="obj2.name" />
        </div>
        <div>
            <span>年龄：</span>
            <input type="number" v-model="obj2.age" />
        </div>
        <button @click="fnChange2" >替换</button>
    </div>
 </template>
 <script setup lang="ts">
import { reactive, ref, watch, watchEffect } from "vue";

// ref基本类型
// ref()方法传入基本类型时，返回的对象是一个响应式对象，使用.value访问和修改属性值
let name = ref('小红')

// ref对象类型
// ref对象类型，ref()方法传入对象时，返回的对象是一个响应式对象，使用.value访问和修改属性值
let obj = ref({
    name: '小红',
    age: 20
})

// reactive对象类型
let obj2 = reactive({
    name: '小蓝',
    age: 22
})

function fnChange2() {
    // 替换对象，直接赋值
    obj2 = Object.assign( obj2, {
        name: '小明',
        age: 22
    })
}

function fnChange() {
    // 替换对象，直接赋值
    obj.value = {
        name: '小明',
        age: 22
    }
}

// watch监听ref基本类型
watch(name, (newValue, oldValue) => {
    console.log('watch监听ref基本类型', newValue, oldValue)
})

// watch监听ref对象类型
// watch监听ref对象类型，传入的第一个参数是一个函数，返回值是要监听的对象，第二个参数是回调函数
watch(obj, (newValue, oldValue) => {
    console.log('watch监听ref对象类型,非深度', newValue, oldValue)
})

// 深度监听，此时若是改变对象内属性值，newValue和oldValue都能获取到最新的值,以为是储存地址问题
watch(obj, (newValue, oldValue) => {
    console.log('watch监听ref对象类型,深度', newValue, oldValue)
}, { deep: true })

// 监听reacive对象类型默认就是深度监听
watch(obj2, (newValue, oldValue) => {
    console.log('watch监听ref对象类型,非深度', newValue, oldValue)
})

// 监听对象内属性,最好用函数式
watch(() => obj.value.name, (newValue, oldValue) => {
    console.log('watch监听对象内属性', newValue, oldValue)
})

watch(() => obj2.name, (newValue, oldValue) => {
    console.log('watch监听对象内属性12', newValue, oldValue)
})

// 监听数组类型，内部包含以上的各种类型数据
watch([() => obj2.name,() => obj.value.name], (newValue, oldValue) => {
    console.log('watch监听数组数据', newValue, oldValue)
})

// watchEffect监听ref基本类型，watchEffect会立即执行一次
// watchEffect会在依赖的值发生变化时重新执行
watchEffect(() => {
    if(obj.value.age + obj2.age > 50) {
        console.log('data大于50')
    } else {
        console.log('data小于50')
    }
})

</script>