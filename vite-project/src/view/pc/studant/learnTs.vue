<template>
    <div>

    </div>
</template>
<script setup lang="ts">
// void可以接受为空，调用者不应该根据其返回值进行操作
// 以为函数默认返回值为undefined，所以可以省略
function test(msg:string) :void {
    console.log('test')
    return
}

// viod的返回值使用会有问题
// let result = test('123')
// if(result) {
//     console.log(result) // undefined
// } else {
//     console.log('result is undefined')
// }

function test2(msg:string) :undefined {
    console.log('test')
    return
}

let result2 = test2('123')
if(result2) {
    console.log(result2,'1') // undefined
} else {
    console.log(result2,'1')
}

let obj: object
// object能存储的是非原始类型的值，不能存储原始类型的值
obj = {}
obj = []
// 以下定义会报错
// obj = 123
// obj = '123'
// obj = true
// obj = null
// obj = undefined

let obj2: Object
// Object能存储的是原始类型和非原始类型的值，所有可以调用到Object的方法，即除了null和undefined以外的所有值

// 声明对象类型
// 加上问号表示可选属性，表示该属性可以不存在
// 也可以使用 | 来表示联合类型，表示该属性可以是string或者number类型
// 也可以使用 [key: string] 来表示索引类型，表示该属性可以是任意类型的值 (key是不限定的，可以是任意字符串，value是任意类型的值)
let person: { name: string, age?: number,[key:  string]: any }
person = {
    name: '123',
    age: 123,
    city: '成都'
}

// 函数申明
// 限定参数和返回值的类型
let count: (num1: number, num2: number) => number
count = (num1, num2) => {
    return num1 + num2
}

// 数组申明,
// let arr: string[]表示数组内元素的类型是string类型
// let arr: Array<string>表示数组内元素的类型是string类型，和上面等价
let arr: string[]
arr = ['123', '456']
let arr2: Array<string>
arr2 = ['123', '456']

// tuple 元组类型(这不为关键字)，是一种特殊的数组类型，表示数组内元素的类型是string和number类型，且顺序是固定的
let arr3: [string, number]
arr3 = ['123', 123]
let arr4: [string, boolean?]
arr4 = ['123', true]
// ...表示任意多个元素
let arr5: [string, ...number[]]
arr5 = ['123', 1, 2, 3, 4, 5]

// enum 枚举类型，表示一组常量的集合，默认从0开始,能增强代码的可读性
// 数字枚举有反向映射，字符串枚举没有反向映射
enum Color {
    Red,
    Green,
    Blue
}

console.log(Color.Red) // 0
console.log(Color.Green) // 1
console.log(Color.Blue) // 2
console.log(Color[0]) // Red
console.log(Color[1]) // Green
console.log(Color[2]) // Blue
function getColor(color: Color) {
    switch (color) {
        case Color.Red:
            console.log('Red')
            break
        case Color.Green:
            console.log('Green')
            break
        case Color.Blue:
            console.log('Blue')
            break
        default:
            break
    }
}
getColor(Color.Red) // Red

// const enum Color {
//     Red,
//     Green,
//     Blue
// }
// 常量枚举在编译时会被删除，编译后的代码中不会出现const enum关键字，直接使用枚举值

// type自定义类型别名，使用type关键字来定义一个类型别名，可以是基本类型、联合类型、交叉类型、元组类型等
// 联合类型
// StringOrNumber可以是string类型或者number类型
type StringOrNumber = string | number
type Gender = '男' | '女'

function getInfo(info: StringOrNumber) {
    console.log(info)
}

getInfo('123')
getInfo(123)
// getInfo(true) // 不能传入其他类型的值
function getGender(info: StringOrNumber) {
    console.log(info)
}
getGender('男')
getGender('女')
// getGender('123') // 不能传入其他类型的值

// 交叉类型
type Address = {
    city: string
    province: string
}

type Area = {
    area: string
    height: number
}

type House = Address & Area & {
    name: string
    age: number
}
let house: House = {
    city: '成都',
    province: '四川',
    area: '天府新区',
    height: 100,
    name: '123',
    age: 123
}

// never类型，表示一个永远不会有值的类型，通常用于抛出异常或者无限循环的函数中
// type Demo = string & number // 交叉类型，表示string和number的交集，永远不会有值

function demo(): never {
    throw new Error('error')
}
function demo2(): void {
    // return null 不能返回
}

// 定义函数
type LogFunc = () => void
let demo3: LogFunc = () => {
    console.log('demo3')
    return 123 //这里不会报错，虽然为void，为了防止内嵌箭头函数返回能成立
}

// 以下操作不需要return回调，因此返回值应该为void,但简写形式下返回为一个函数值
const src = [1,2,3]
const dest = [4,5,6]
src.forEach(item => dest.push(item))
</script>