<template>
    <div>
      <h2>
        <span>{{title}}</span>
        <p @click="$emit('handleRightClick')">{{rightText}}</p>
      </h2>
    </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props: {
    title: String,
    rightText: String
  }
}
</script>
<style lang="less" scoped>
h2{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: url(../assets/title.png) no-repeat left center;
    padding: 10px 0;
    padding-left: 20px;
    p{
        font-size: 12px;
        font-weight: 400;
    }
}
</style>
