<template>
  <div class="postings web-phone">
    <div class="over_height">

    </div>
    <chart-vue @submit="handleSubmit" ></chart-vue>
  </div>
</template>
<script setup>
import chartVue from '../chart/chart.vue';

const handleSubmit = (data) => {
  
}

</script>
<style lang="scss" scoped>
.postings{
  .over_height{
    height: calc(100% - 50px);
  }
}
</style>