<template>
    <div class="editor-box">
        <div class="back" v-if="customData.isNull" >请输入内容</div>
        <div class="editor" ref="editorRef" style="min-height: 30px;" :style="{ maxHeight: maxHeight, height: height }"
            id="editor" @blur="backuprange" @focus="emit('focus')" @input="handleInput" contenteditable="true">
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';

const emit = defineEmits(['focus','input'])
onMounted(() => {
    document.getElementById('editor').focus()
})
defineProps({
    maxHeight: {
        type: String
    },
    height: {
        type: String
    }
})

var currentSelection = {
    startContainer: null,
    startOffset: 0,
    endContainer: null,
    endOffset: 0
}

const customData = reactive({
    isNull:true
})

const editorRef = ref(null)

// 聚焦事件
const handleFocus = () => {
    editorRef.value.focus()
}

// 备份当前光标位置
const backuprange = () => {
    let selection = window.getSelection();
    // console.log(selection, 'selection')
    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        currentSelection = {
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            endContainer: range.endContainer,
            endOffset: range.endOffset
        };
    }
}

// 设置光标位置
const restorerange = () => {
    if (currentSelection) {
        let selection = window.getSelection();
        selection.removeAllRanges();
        let range = document.createRange();
        range.setStart(currentSelection.startContainer, currentSelection.startOffset);
        range.setEnd(currentSelection.endContainer, currentSelection.endOffset);
        // 向选区中添加一个区域
        selection.addRange(range);
    }
}

const handleInput = () => {
    var editor = document.getElementById('editor')
    if(editor.innerHTML.length == 0){
        customData.isNull = true
    } else {
        customData.isNull = false
    }
    backuprange()
    emit('input',customData.isNull)
}

// onMounted(() => {

// })

// 插入html片段
const insertHTML = (html) => {
    // 插入前先恢复上次的光标位置
    restorerange();
    document.execCommand('insertHTML', false, html);
}
// const imgClick = () => {
//     console.log(2222)
// }

// 选择插入表情/图片
const chooseEmoji = (url,type) => {
    const node = new Image();
    node.src = url;
    if(type == 'img') {
        node.style = 'width: 100%;border-radio:10px;'
    }
    if(type == 'emo') {
        node.style = 'width: 30px;height: 30px;'
    }
    // node.onclick = imgClick
    if (currentSelection.startContainer.nodeType == 3) {
        // 如果是文本节点，拆分文字
        const newNode = currentSelection.startContainer.splitText(currentSelection.startOffset);
        // 设置光标开始节点为拆分之后节点的父级节点
        currentSelection.startContainer = newNode.parentNode;
        // 在拆分后得到的节点之前插入图片
        currentSelection.startContainer.insertBefore(node, newNode);
    } else {
        // 非文本节点
        if (currentSelection.startContainer.childNodes.length) {
            // 如果光标开始节点下有子级，获取到光标位置的节点
            const beforeNode = currentSelection.startContainer.childNodes[currentSelection.startOffset];
            // 插入
            currentSelection.startContainer.insertBefore(node, beforeNode);
        } else {
            // 如果光标开始节点下没有子级，直接插入
            currentSelection.startContainer.appendChild(node);
        }
    }

    // 获取插入的节点所在父级下的位置
    const index = Array.from(currentSelection.startContainer.childNodes).indexOf(node);
    currentSelection.startOffset = index + 1;
    currentSelection.endOffset = index + 1;

    // 视图滚动带完全显示出来
    node.scrollIntoView(false)
    customData.isNull = false
}

const setImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.click()
    input.addEventListener('change', () => {
        let file = input.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (() => {
            restorerange();
            chooseEmoji(reader.result,'img')
        })
        input.remove()
    })
}

const handleSubmit = () => {
    console.log(editorRef.value.innerHTML)
    return editorRef.value.innerHTML
}

defineExpose({
    chooseEmoji,
    setImage,
    handleFocus,
    handleSubmit
})

</script>
<style lang="scss" scoped>
.editor-box {
    position: relative;

    .back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1;
        color: #ccc;
    }

    .editor {
        position: relative;
        outline: unset !important;
        overflow-y: scroll;
        overflow-x: hidden;
        z-index: 3;
        // background: #fff;
    }
}
</style>