<template>
  <div class="back jc-sb ai-c">
    <span class="icon iconfont icon-arrow-left-bold" @click="router.go(-1)" ></span>
    <span>{{ title }}</span>
    <span class="right d-f ai-c" @click="rightClick()" >
      <span class="icon iconfont"  :class="[rightIcon]" ></span>
      <span>{{rightText}}</span>
    </span>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
defineProps({
  title: {
    type: String,
    default: "扫一扫",
  },
  rightText: {
    type: String,
    default: "",
  },
  rightIcon: {
      type: String,
      default: "icon-comment"
  }
});
const emit = defineEmits(['rightClick'])

const rightClick = () => {
  emit('rightClick')
}
</script>
<style lang="scss" scoped>
.back {
  height: 30px;
  .icon {
    font-size: 24px;
  }
  .right {
    min-width: 30px;
  }
}
</style>